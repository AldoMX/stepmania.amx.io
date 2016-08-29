module.exports = function (metadata) {
    return function (href, locale) {
        // Ignore anchors, relative, and absolute URLs
        if (/^(?:#|\/|\w+:)/.test(href)) {
            return href;
        }
        // Check for `href_locale` when locale is missing
        if (typeof locale !== 'string') {
            [,href,locale] = href.match(/(.*?)(?:_[^_]{2})?$/);
        }

        return metadata.hrefs[locale] && metadata.hrefs[locale][href] ||
            metadata.hrefs[metadata.defaultLocale][href] ||
            `/${href}/`;    // Alias not found, convert to relative URL
    };
};
