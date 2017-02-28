var express = require('express')
var compression = require('compression')
var bodyParser = require('body-parser')
var sass = require('node-sass-middleware')
var child_process = require('child_process')
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
	let base64Data = req.body.img.replace(/^data:image\/jpeg;base64,/, '')

	fs.writeFile('./upload/upload.jpg', base64Data, 'base64', (err) => {
		if (err) throw err
		console.log('Running script...')

		child_process.execFileSync('bash', ['/run.sh'])

		console.log('Done. Getting caption...')

		let caption = JSON.parse(fs.readFileSync('./caption.json', 'utf8'))[0].caption
		caption = capitalizeFirstLetter(caption)
		caption += '.'

		let pythonCmd = '/root/tensorflow/bin/python3 '
		pythonCmd += '/opt/neural-networks/word-rnn-tensorflow/sample.py '
		pythonCmd += '--save_dir="/opt/neural-networks/word-rnn-tensorflow/save" '
		pythonCmd += '-n=50 '
		pythonCmd += '--prime="' + caption + '"'

		child_process.exec(pythonCmd, (err, caption) => {
			if (err) throw err
			let cleanedCaption = caption.replace(/(^[^\.]+\.\s)([^\.]+\.\s)(.+)/g, (match, p1, p2, p3) => p1 + p3)
				.replace(/[^\.]+$/g, '')
			res.send(cleanedCaption)
		})
	})
})

app.listen(process.env.PORT || 4000)
