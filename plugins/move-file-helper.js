module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();
        metadata.moveFile = function (src, dest, files) {
            if (src !== dest) {
                files[dest] = files[src];
                delete files[src];
            }
        };
        done();
    };
};
