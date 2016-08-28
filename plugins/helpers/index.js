const define = require('metalsmith-define');

module.exports = function (config) {
    return function () {
        return function (files, metalsmith, done) {
            const metadata = metalsmith.metadata();
            return define({
                localeInfo: config.localeInfo,
                localizedUrl: require('./localized-url')(metadata),
                moveFile: require('./move-file')(files),
                sma: require('../../config/sma')
            })(files, metalsmith, done);
        };
    };
};
