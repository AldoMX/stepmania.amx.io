module.exports = function (files) {
    return function (src, dest) {
        if (src !== dest) {
            files[dest] = files[src];
            delete files[src];
        }
    };
};
