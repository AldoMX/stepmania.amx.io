const defaultsDeep = require('lodash.defaultsdeep');
const moment = require('moment');

let defaultLocale;
module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();
        defaultLocale = metadata.defaultLocale;

        //
        // Locale metadata
        //
        for (let filename of Object.keys(files)) {
            let file = files[filename];
            file.altLocales = [];
            metadata.locales.forEach(locale => {
                if (locale !== file.locale &&
                    typeof file.altFiles[locale] !== 'undefined') {
                    file.altLocales.push(locale);
                }
            });
        }

        //
        // Ids, Slugs and Dates
        //
        for (let filename of Object.keys(files)) {
            let file = files[filename];
            [, file.id] = filename.match(/([^\/]+?)(?:_[^_]{2})?(?:\.[^\.]+)?$/);
            file.slug = file.slug || file.id;
            if (typeof file.date !== 'undefined') {
                file.date = moment(file.date);
            }
        }

        //
        // Hrefs
        //
        for (let collectionId of Object.keys(metadata.collections)) {
            const collection = metadata.collections[collectionId];
            const [, collectionType] = collectionId.match(/^(.+?)(?:_[^_]+)?$/);
            switch (collectionType) {
                case 'articles':
                    updateArticleCollectionHref(collection);
                    break;

                case 'pages':
                    updatePageCollectionHref(collection);
                    break;

                default:
                    throw 'Unexpected collectionType: ' + collectionType;
            }
        }

        //
        // Dictionary of hrefs
        //
        metadata.hrefs = {};
        metadata.locales.forEach(locale => { metadata.hrefs[locale] = {}; });
        for (let collectionId of Object.keys(metadata.collections)) {
            const collection = metadata.collections[collectionId];
            const [, collectionType] = collectionId.match(/^(.+?)(?:_[^_]+)?$/);
            let idPrefix;
            switch (collectionType) {
                case 'articles':
                    idPrefix = 'article/';
                    break;

                case 'pages':
                    idPrefix = '';
                    break;

                default:
                    throw 'Unexpected collectionType: ' + collectionType;
            }
            for (const fileMetadata of collection) {
                const localeMetadata = metadata.hrefs[fileMetadata.locale];
                fileMetadata.id = `${idPrefix}${fileMetadata.id}`;
                localeMetadata[fileMetadata.id] = fileMetadata.href;
            }
        }

        //
        // Default metadata
        //
        for (let collectionId of Object.keys(metadata.collections)) {
            const collection = metadata.collections[collectionId];
            for (const fileMetadata of collection) {
                defaultsDeep(fileMetadata, collection.metadata);
            }
        }

        done();
    };
};

var updateArticleCollectionHref = function (collection) {
    for (const fileMetadata of collection) {
        const href = [''];  // for leading `/`
        if (fileMetadata.locale !== defaultLocale) {
            href.push(fileMetadata.locale);
        }
        href.push(
            'blog',
            fileMetadata.date.format('YYYY/MM'),
            fileMetadata.slug,
            ''  // for trailing `/`
        );
        fileMetadata.href = href.join('/');
    }
};

var updatePageCollectionHref = function (collection) {
    for (const fileMetadata of collection) {
        const href = [''];  // for leading `/`
        if (fileMetadata.locale !== defaultLocale) {
            href.push(fileMetadata.locale);
        }
        if (fileMetadata.slug !== 'index') {
            href.push(fileMetadata.slug);
        }
        href.push(
            ''  // for trailing `/`
        );
        fileMetadata.href = href.join('/');
    }
};
