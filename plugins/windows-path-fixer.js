module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();
        for (let filename of Object.keys(files)) {
            if (filename.includes('\\')) {
                metadata.moveFile(filename, filename.replace(/\\/g, '/'), files);
            }
        }
        done();
    };
};
