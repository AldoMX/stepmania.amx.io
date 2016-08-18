const metalsmith = require('metalsmith');

const assets = require('metalsmith-assets');
const inPlace = require('metalsmith-in-place');
const layout = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');

const html2folder = require('./metalsmith-middleware/html2folder');
const cleanup = require('./metalsmith-middleware/cleanup');

const minify = {
    html: require('metalsmith-html-minifier'),
    css: require('metalsmith-clean-css'),
    js: require('metalsmith-uglify'),
    img: require('metalsmith-imagemin/lib/node6'),
};

const config = require('./config.json');

metalsmith(__dirname)
    .source(config.source)
    .destination(config.destination)
    .metadata(config.metadata)
    .use(markdown())
    .use(inPlace(config.plugins.inPlace))
    .use(layout(config.plugins.layout))
    .use(html2folder())
    .use(minify.html())
    .use(assets(config.plugins.assets))
    .use(minify.css(config.plugins.minify.css))
    .use(minify.js(config.plugins.minify.js))
    .use(minify.img(config.plugins.minify.img))
    .use(cleanup())
    .build(function (err) {
        if (err) throw err;
    });
