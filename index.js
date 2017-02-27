var express = require('express')
var compression = require('compression')
var bodyParser = require('body-parser')
var sass = require('node-sass-middleware')
var child_process = require('child_process')
//var PythonShell = require('python-shell')
var fs = require('fs')

var app = module.exports = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.use(compression())
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}))
app.use(sass({
	src: __dirname + '/scss',
	dest: __dirname + '/public/css',
	outputStyle: 'compressed',
	prefix: '/css'
}))
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.render('index')
})

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

app.post('/upload', (req, res) => {
	var base64Data = req.body.img.replace(/^data:image\/jpeg;base64,/, '')
	fs.unlinkSync('./upload/upload.jpg')
	require('fs').writeFile('./upload/upload.jpg', base64Data, 'base64', function(err) {
		if (err) throw err
		console.log('running script')
		
		let sh = child_process.spawn('sh' ['/run.sh'])
		
		sh.stdout.on('data', function(chunk) {
			console.log(chunk.toString())
		})

		sh.on('close', function(code) {
			console.log(code)

			let caption = JSON.parse(fs.readFileSync('./caption.json', 'utf8'))[0].caption
			caption = capitalizeFirstLetter(caption)
			caption += '.'

			let pythonCmd = '/root/tensorflow/bin/python3 '
			pythonCmd += '/opt/neural-networks/word-rnn-tensorflow/sample.py '
			pythonCmd += '-n=50 --prime="' + caption + '"'

			child_process.exec(pythonCmd, function(err, stdout) {
				if (err) throw err
				res.send(stdout)
			})
		})
	})
})

app.listen(process.env.PORT || 4000)
