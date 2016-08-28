module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();
        for (let filename of Object.keys(files)) {
            let file = files[filename];
            let [,extension] = filename.match(/\.([^\.]+)$/);
            let newPath = `${file.href}index.${extension}`.substring(1);
            metadata.moveFile(filename, newPath);
        }
        done();
    };
};
