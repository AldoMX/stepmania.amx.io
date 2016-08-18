module.exports = function () {
    return function (files, metalsmith, done) {
        for (let fileName of Object.keys(files)) {
            if (fileName.endsWith('.html') && fileName !== 'index.html') {
                let fileContents = files[fileName];
                delete files[fileName];
                fileName = fileName.replace(/([^\/]+)\.html$/, '$1/index.html');
                files[fileName] = fileContents;
            }
        }
        done();
    };
};
