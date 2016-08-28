module.exports = function (metadata) {
    return function (href, locale) {
        // Ignore relative, absolute, and protocol-based URLs
        if (/^(?:\/|\w+:)/.test(href)) {
            return href;
        }
        return metadata.hrefs[locale][href] ||
            metadata.hrefs[metadata.defaultLocale][href] ||
            `/${href}/`;    // Alias not found, convert to relative URL
    };
};
