function getBase64(file, _callback) {
	var reader = new FileReader()
	reader.readAsDataURL(file)
	reader.onload = function () {
		_callback(reader.result)
	}
	reader.onerror = function (error) {
		console.log('Error: ', error)
	}
}

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader()
		reader.onload = function (e) {
			$('#preview').css('width', '100%')
				.attr('src', e.target.result)
		}
		reader.readAsDataURL(input.files[0])
	}
}

function uploadImage(data, _callback) {
	$.post('/upload', {
		img: data
	}, function(res) {
		_callback(res)
	})
}

$('#browse').click(function() {
	$('#hidden-input').click()
})

// on file selection
$('#hidden-input').change(function() {
	readURL(this)
	// insert filename into input box
	$('#file-name').val($('#hidden-input').val())

	// if right file type
	if ($('#file-name').val().match(/[.](jpg|JPG)$/g)) {
		$('#file-group').addClass('has-success')
		$('#file-name').addClass('form-control-success')
		$('#file-group').removeClass('has-danger')
		$('#file-name').removeClass('form-control-danger')
		$('#upload').prop('disabled', false)
	} else {
		$('#file-group').addClass('has-danger')
		$('#file-name').addClass('form-control-danger')
		$('#file-group').removeClass('has-success')
		$('#file-name').removeClass('form-control-success')
		$('#upload').prop('disabled', true)
	}
})

$('#upload').click(function() {
	$('#upload').prop('disabled', true)
		.html('<i class="fa fa-spinner fa-spin"></i>')
	$('#red-trump-face').addClass('shaking')
	$('#trump-face').addClass('shaking')
		.fadeOut(5000)
	getBase64($('#hidden-input').prop('files')[0], function(base64) {
		uploadImage(base64, function(res) {
			$('#caption-box').text(res.caption)
			$('#upload').prop('disabled', false)
				.html('<i class="fa fa-upload"></i>')
			$('#red-trump-face').removeClass('shaking')
			$('#trump-face').removeClass('shaking')
				.fadeIn(500)
			$('#hidden-input').reset()
			$('#file-name').val('')
		})
	})
})
