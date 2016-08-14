document.addEventListener && document.addEventListener('DOMContentLoaded', function () {
	var $ = function (id) { return document.getElementById(id); };
	var form = $('slack_invite'),
		input_email = $('email');

	function hasErrors() {
		var error = [];

		if (!input_email.value)
			error.push("Por favor introduce tu dirección de correo electrónico");

		if (error.length) {
			alert(error.join("\n"));
			return true;
		}

		return false;
	}

	function ajaxSubmit(event_submit) {
		var formdata = new FormData();
		formdata.append("email", input_email.value);

		var xhr = new XMLHttpRequest();
		xhr.open("POST", event_submit.target.action, true);

		xhr.onload = function (event) {
			if (this.status == 200) {
				alert(this.response);
			} else {
				alert('Error HTTP ' + this.status + ' al recibir tu solicitud.\n---\n' + this.response);
			}
		};

		xhr.send(formdata);
	}

	form.addEventListener('submit', function (event) {
		if (!hasErrors()) {
			ajaxSubmit(event);
		}

		event.preventDefault();
	});
});
