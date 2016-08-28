module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();

        // If there are both: a minified and a non-minified JS,
        // replace the non-minified JS file with the minified one.
        for (let filename of Object.keys(files)) {
            let matches = filename.match(/(.*\/(?![^\/]+\.min)[^\/]+)\.js$/);
            if (matches) {
                metadata.moveFile(`${matches[1]}.min.js`, filename);
            }
        }
        done();
    };
};
