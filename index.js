var express = require('express')
var compression = require('compression')
var bodyParser = require('body-parser')
var sass = require('node-sass-middleware')
var cmd = require('node-cmd')
var PythonShell = require('python-shell')
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

app.post('/upload', (req, res) => {
	var base64Data = req.body.img.replace(/^data:image\/jpeg;base64,/, '')
	fs.unlinkSync('./upload/upload.jpg')
	require('fs').writeFile('./upload/upload.jpg', base64Data, 'base64', function(err) {
		if (err) throw err
		console.log('running script')
		
		cmd.get('sh /run.sh', function(data) {
			console.log(data)
			let caption = JSON.parse(fs.readFileSync('./caption.json', 'utf8'))[0] + '.'
			res.send(caption)
		})

/*		cmd.stdout.on('data', function(chunk) {
			console.log(chunk.toString())
		})

		cmd.on('close', function(code) {
			console.log(code)
			let caption = 'That\'s'
			caption += JSON.parse(fs.readFileSync('./caption.json', 'utf8'))[0]
			caption += '.'

			var options = {
				mode: 'text',
				pythonPath: '/root/tensorflow/bin',
				scriptPath: '/opt/neural-networks/word-rnn-tensorflow',
				args: ['-n=100', '--prime="' + caption + '"']
			}
			
			PythonShell.run('sample.py', options, function (err, results) {
				if (err) throw err
				// results is an array consisting of messages collected during execution 
				res.send(results)
			})
		})*/

	})
})

app.listen(process.env.PORT || 4000)
