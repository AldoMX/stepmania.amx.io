module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();
        metadata.moveFile = function (files, src, dest) {
            if (src !== dest) {
                files[dest] = files[src];
                delete files[src];
            }
        };
        done();
    };
};
