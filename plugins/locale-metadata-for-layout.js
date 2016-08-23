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
        // Set paths
        for (let filename of Object.keys(files)) {
            let file = files[filename];
            file.path = filename;
        }

        for (let fileName of Object.keys(files)) {
            let file = files[fileName];
            file.altLocalesMetadata = [];
            locales.forEach(locale => {
                let localeMetadata = {
                    'iso': locale.iso,
                    'name': locale.name,
                    'flagIso': locale.flagIso,
                    'href': locale.path
                };

                if (locale.iso === file.locale) {
                    file.localeMetadata = localeMetadata;
                } else if (typeof file.altFiles[locale.iso] !== 'undefined') {
                    localeMetadata.href = `/${file.altFiles[locale.iso].path}`;
                    file.altLocalesMetadata.push(localeMetadata);
                }
            });
        }
        done();
    };
};
