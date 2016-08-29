const moment = require('moment');

module.exports = function (metadata) {
    return function (date, locale) {
        const localeInfo = metadata.localeInfo[locale];
        return moment(date)
            .locale(localeInfo.dateLocale)
            .format(localeInfo.dateFormat)
            .replace(/\b([^0-9\s])(?=[^0-9\s]{2,})/g, letter => letter.toUpperCase());
    };
};
