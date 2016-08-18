module.exports = function () {
    return function (files, metalsmith, done) {
        // Cleanup paths because... Windows :(
        for (let fileName of Object.keys(files)) {
            if (fileName.includes('\\')) {
                let nonWindowsFileName = fileName.replace('\\', '/');
                files[nonWindowsFileName] = files[fileName];
                delete files[fileName];
            }
        }

        // If there are both: a minified and a non-minified JS,
        // rename the minified JS to replace the non-minified one
        for (let fileName of Object.keys(files)) {
            let matches = fileName.match(/(.*\/(?![^\/]+\.min)[^\/]+)\.js$/);
            if (matches) {
                let minifiedFileName = matches[1] + '.min.js';
                files[fileName] = files[minifiedFileName];
                delete files[minifiedFileName];
            }
        }
        done();
    };
};
