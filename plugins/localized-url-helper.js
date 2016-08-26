module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();
        metadata.localizedUrl = function (href, locale) {
            // Ignore valid URLs
            if (/^(?:\/|\w+:)/.test(href)) {
                return href;
            }
            return metadata.pages[locale][href] ||
                metadata.pages[metadata.defaultLocale][href] ||
                `/${href}/`;    // Alias not found, convert to relative URL
        };
        done();
    };
};
