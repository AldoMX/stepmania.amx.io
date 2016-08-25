const metalsmith = require('metalsmith');
const config = require('./config.json');

//
// External Plugins
//
const assets = require('metalsmith-assets');
const branch = require('metalsmith-branch');
const concat = require('metalsmith-concat-convention');
const frontmatter = require('metalsmith-matters');
const ignore = require('metalsmith-ignore');
const inPlace = require('metalsmith-in-place');
const layout = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const minify = {
    html: require('metalsmith-html-minifier'),
    css: require('metalsmith-clean-css'),
    js: require('metalsmith-uglify'),
    img: require('metalsmith-imagemin/lib/node6'),
};
const multiLanguage = require('metalsmith-multi-language');

//
// Internal Plugins
//
const jsCleanup = require('./plugins/js-cleanup');
const localeMetadataForLayout = require('./plugins/locale-metadata-for-layout');
const moveFileHelper = require('./plugins/move-file-helper');
const updatePathsInPages = require('./plugins/update-paths-in-pages');
const windowsPathFixer = require('./plugins/windows-path-fixer');

//
// Branches
//
const readConcatFrontmatterBranch = function () {
    return branch()
        .pattern('**/*.concat')
        .use(frontmatter());
};

//
// Build
//
metalsmith(__dirname)
    .metadata(config.metadata)
    .source(config.source)
    .destination(config.destination)
    .frontmatter(false)
    .use(ignore(config.plugins.ignore))
    .use(frontmatter())
    .use(moveFileHelper())
    .use(windowsPathFixer())
    .use(multiLanguage(config.plugins.multiLanguage))
    .use(updatePathsInPages())
    .use(markdown())
    .use(inPlace(config.plugins.inPlace))
    .use(windowsPathFixer())
    .use(localeMetadataForLayout())
    .use(layout(config.plugins.layout))
    .use(minify.html())
    .use(assets(config.plugins.assets))
    .use(windowsPathFixer())
    .use(minify.css(config.plugins.minify.css))
    .use(minify.js(config.plugins.minify.js))
    .use(minify.img(config.plugins.minify.img))
    .use(readConcatFrontmatterBranch())
    .use(concat())
    .use(jsCleanup())
    .build(function (err) {
        if (err) throw err;
    });
