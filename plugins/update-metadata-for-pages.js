module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();

        //
        // Set Paths
        //
        for (let filename of Object.keys(files)) {
            if (!filename.startsWith('pages/')) {
                continue;
            }

            let file = files[filename];
            let matches = filename.match(/pages\/([^\/]+?)(?:_[a-z]{2})?\.([^\.]+)$/);
            if (matches === null) {
                delete files[filename];
                continue;
            }

            let [, filenameKey, ext] = matches;
            let slug = file.slug || filenameKey;
            let updatedPath = '';
            if (file.locale !== metadata.defaultLocale) {
                updatedPath += `${file.locale}/`;
            }
            if (slug !== 'index') {
                updatedPath += `${slug}/`;
            }

            file.filenameKey = filenameKey;
            file.href = `/${updatedPath}`;
            metadata.moveFile(filename, `${updatedPath}index.${ext}`, files);
        }

        //
        // Dictionary of pages
        //
        metadata.pages = {
            'es': {},
            'en': {}
        };
        for (let filename of Object.keys(files)) {
            let file = files[filename];
            if (typeof file.filenameKey === 'undefined') {
                continue;
            }

            if (typeof metadata.pages[file.filenameKey] === 'object') {
                continue;
            }

            for (let locale of Object.keys(file.altFiles)) {
                let localizedFile = file.altFiles[locale];
                if (typeof localizedFile === 'object') {
                    let localeMetadata = metadata.pages[locale];
                    localeMetadata[file.filenameKey] = localizedFile.href;
                }
            }
        }

        done();
    };
};
