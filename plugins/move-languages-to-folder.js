module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();
        for (let filename of Object.keys(files)) {
            let file = files[filename];
            let [, name, ext] = filename.match(/([^\/]+?)(?:_[a-z]{2})?\.([^\.]+)$/);
            if (typeof file.slug !== 'undefined') {
                name = file.slug;
            }

            let newFilename = '';
            if (file.locale !== metadata.defaultLocale) {
                newFilename += `${file.locale}/`;
            }
            if (name !== 'index') {
                newFilename	+= `${name}/`;
            }
            newFilename += `index.${ext}`;

            metadata.moveFile(filename, newFilename, files);
        }
        done();
    };
};
