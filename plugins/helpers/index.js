const define = require('metalsmith-define');

module.exports = function (config) {
    return function () {
        return function (files, metalsmith, done) {
            const metadata = metalsmith.metadata();
            return define({
                formatDate: require('./format-date')(metadata),
                localeInfo: config.localeInfo,
                localizedUrl: require('./localized-url')(metadata),
                moveFile: require('./move-file')(files),
                sma: require('../../config/sma')
            })(files, metalsmith, done);
        };
    };
};
