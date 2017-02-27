var express = require('express')
var compression = require('compression')
var bodyParser = require('body-parser')
var sass = require('node-sass-middleware')
var spawn = require('child_process').spawn
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
	require('fs').writeFile('./upload/upload.jpg', base64Data, 'base64', function(err) {
		if (err) console.log(err)
		console.log('running script')
		var cmd = spawn('sh', ['/run.sh'])

		cmd.stdout.on('data', function(chunk) {
			console.log(chunk.toString())
		})

		cmd.on('close', function(code) {
			console.log(code)
			let caption = JSON.parse(fs.readFileSync('./caption.json', 'utf8')).caption
			console.log(caption)
			res.end()
		})

	})
})

app.listen(process.env.PORT || 4000)
