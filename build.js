const metalsmith = require('metalsmith');

const assets = require('metalsmith-assets');
const inPlace = require('metalsmith-in-place');
const layout = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');

const html2folder = require('./metalsmith-middleware/html2folder');

const defaultMetadata = {
    'title': '',
    'apiRoot': '//api.stepmania.amx.io',
    'sma': {
        'version': 'Beta 5.9.2',
        'download': '//download.stepmania.amx.io/SMA-Beta5.9.2-20140524.7z',
        'otherDownloads': '//download.stepmania.amx.io'
    },
    'headerMenu': [
        //{ 'href': '/', 'label': 'Inicio' },
        //{ 'href': '/blog/', 'label': 'Blog' },
        { 'href': '//rhythm-amx.slack.com/', 'label': 'Slack' },
        { 'href': '//www.facebook.com/StepManiaAMX', 'label': 'Facebook' }
    ],
    'footerMenu': [
        { 'href': '/chat/', 'label': 'Chat' },
        { 'href': '//sma.uservoice.com', 'label': 'Feedback' },
        { 'href': '/report/', 'label': 'Reporte de Errores' }
    ],
    'meta': {
        'description': 'StepMania AMX (SMA) es una versión alterna, basada en StepMania 3.9, que desde sus inicios se ha enfocado en mejorar la experiencia de juego.'
    },
    'dependencies': {
        'css': [],
        'js': []
    },
    'includes': {
        'css': [],
        'js': []
    },
    'displayHero': {
        'header': false,
        'footer': false
    },
    'isChatEnabled': false,
    'isFullScreen': false,
    'showFacebookAppId': false,
    'useDefaultContainer': true,
    'useVideoBackground': false
};

const assetOptions = {
    source: './src/assets'
};

const inPlaceOptions = {
    'engine': 'ejs',
    'pattern': '**/*.ejs',
    'rename': true
};

const layoutOptions = {
    'engine': 'ejs',
    'directory': './src/layouts',
    'default': 'default.ejs',
    'pattern': '**/*.html'
};

metalsmith(__dirname)
    .source('./src/content')
    .destination('./_public')
    .metadata(defaultMetadata)
    .use(markdown())
    .use(inPlace(inPlaceOptions))
    .use(layout(layoutOptions))
    .use(html2folder())
    .use(assets(assetOptions))
    .build(function (err) {
        if (err) throw err;
    });
