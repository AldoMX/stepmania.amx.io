const metalsmith = require('metalsmith');

const assets = require('metalsmith-assets');
const branch = require('metalsmith-branch');
const concat = require('metalsmith-concat-convention');
const frontmatter = require('metalsmith-matters');
const inPlace = require('metalsmith-in-place');
const layout = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');

const html2folder = require('./plugins/html2folder');
const cleanup = require('./plugins/cleanup');

const minify = {
    html: require('metalsmith-html-minifier'),
    css: require('metalsmith-clean-css'),
    js: require('metalsmith-uglify'),
    img: require('metalsmith-imagemin/lib/node6'),
};

const config = require('./config.json');

const readConcatFrontmatter = function () {
    return branch()
        .pattern('**/*.concat')
        .use(frontmatter());
};

metalsmith(__dirname)
    .source(config.source)
    .destination(config.destination)
    .metadata(config.metadata)
    .frontmatter(false)
    .use(frontmatter())
    .use(markdown())
    .use(inPlace(config.plugins.inPlace))
    .use(layout(config.plugins.layout))
    .use(html2folder())
    .use(minify.html())
    .use(assets(config.plugins.assets))
    .use(minify.css(config.plugins.minify.css))
    .use(minify.js(config.plugins.minify.js))
    .use(minify.img(config.plugins.minify.img))
    .use(readConcatFrontmatter())
    .use(concat())
    .use(cleanup())
    .build(function (err) {
        if (err) throw err;
    });
