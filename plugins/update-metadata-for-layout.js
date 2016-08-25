module.exports = function () {
    let locales = [
        {
            'iso': 'es',
            'name': 'Español',
            'flagIso': 'mx'
        },
        {
            'iso': 'en',
            'name': 'English',
            'flagIso': 'us'
        }
    ];

    return function (files, metalsmith, done) {
        //
        // Locale metadata
        //
        for (let filename of Object.keys(files)) {
            let file = files[filename];
            file.altLocalesMetadata = [];
            locales.forEach(locale => {
                if (typeof file.href === 'undefined') {
                    return;
                }

                if (locale.iso === file.locale) {
                    file.localeMetadata = locale;
                } else if (typeof file.altFiles[locale.iso] !== 'undefined') {
                    file.altLocalesMetadata.push(locale);
                }
            });
        }

        done();
    };
};
