var express = require('express')
var compression = require('compression')
var bodyParser = require('body-parser')
var sass = require('node-sass-middleware')
var exec = require('child_process').exec
var cmd = 'sh /run.sh'

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
		exec(cmd, function(error, stdout, stderr) {
			console.log(stdout)
		})
	})
})

app.listen(process.env.PORT || 4000)