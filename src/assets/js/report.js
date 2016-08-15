document.addEventListener && document.addEventListener('DOMContentLoaded', function () {
    var $ = function (id) { return document.getElementById(id); };
    var form = $('upload_report'),
        input_crashinfo = $('file_crashinfo'),
        input_log = $('file_log'),
        input_feedback = $('text_feedback'),
        $modal_enviando = jQuery('#modal_enviando'),
        $barra_progreso = $modal_enviando.find('.progress-bar'),
        $barra_progreso_texto = $barra_progreso.find('.sr-only'),
        content_crashinfo, content_log, content_feedback,
        content_zip;

    function checkFiles() {
        var error = [];

        if (!input_crashinfo.files.length)
            error.push('Por favor agrega el archivo crashinfo.txt');

        if (!input_log.files.length)
            error.push('Por favor agrega el archivo log.txt');

        if (error.length) {
            alert(error.join('\n'));
            return false;
        }

        return true;
    }

    function readFiles(event_submit) {
        var reader = new FileReader();
        reader.onload = function (event) {
            content_crashinfo = event.target.result;
            reader.onload = function (event) {
                content_log = event.target.result;
                content_feedback = input_feedback.value;
                zipFiles(event_submit);
            };
            reader.readAsText(input_log.files[0]);
        };
        reader.readAsText(input_crashinfo.files[0]);
    }

    function uploadStarted() {
        $modal_enviando.modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    function uploadUpdate(percent) {
        percent = percent.toFixed(2);
        $barra_progreso.css('width', percent + '%').attr('aria-valuenow', percent);
        $barra_progreso_texto.text(percent + '% completado');
    }

    function uploadFinished(status_code, response) {
        $modal_enviando.modal('hide');
        if (status_code == 200)
            alert(response);
        else
            alert('Error HTTP ' + status_code + ' al recibir tu reporte.\n---\n' + response);
    }

    function uploadZip(event_submit) {
        var formdata = new FormData();
        formdata.append('report', content_zip);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', event_submit.target.action, true);

        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable)
                uploadUpdate((event.loaded / event.total) * 100);
        };

        xhr.onload = function () {
            content_zip = undefined;
            uploadFinished(this.status, this.response);
        };

        xhr.send(formdata);
        uploadStarted();
    }

    function zipFiles(event) {
        var zip = new JSZip();
        zip.file('crashinfo.txt', content_crashinfo);
        zip.file('log.txt', content_log);
        if (content_feedback != '')
            zip.file('feedback.txt', content_feedback);

        content_zip = zip.generate({
            compression: 'DEFLATE',
            type: 'blob'
        });
        content_crashinfo = undefined;
        content_log = undefined;
        content_feedback = undefined;

        uploadZip(event);
    }

    form.addEventListener('submit', function (event) {
        if (!checkFiles()) {
            event.preventDefault();
            return;
        }
        readFiles(event);
        event.preventDefault();
    });
});
