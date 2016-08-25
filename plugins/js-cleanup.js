module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();

        // If there are both: a minified and a non-minified JS,
        // rename the minified JS to replace the non-minified one
        for (let filename of Object.keys(files)) {
            let matches = filename.match(/(.*\/(?![^\/]+\.min)[^\/]+)\.js$/);
            if (matches) {
                metadata.moveFile(`${matches[1]}.min.js`, filename, files);
            }
        }
        done();
    };
};
