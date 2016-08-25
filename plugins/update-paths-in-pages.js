module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();
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
            let newFilename = '';
            if (file.locale !== metadata.defaultLocale) {
                newFilename += `${file.locale}/`;
            }
            if (slug !== 'index') {
                newFilename	+= `${slug}/`;
            }
            newFilename += `index.${ext}`;

            file.filenameKey = filenameKey;
            metadata.moveFile(filename, newFilename, files);
        }
        done();
    };
};
