const markdown = require('metalsmith-markdown');
const RendererClass = new require('marked').Renderer;

module.exports = function () {
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();

        const customRenderer = new RendererClass();
        customRenderer.link = function (href, title, text) {
            href = metadata.localizedUrl(href);
            // Do not use relative URLs in markdown
            if (/^\/(?!\/)/.test(href)) {
                href = metadata.sma.website + href;
            }
            return RendererClass.prototype.link.call(this, href, title, text);
        };

        return markdown({
            renderer: customRenderer
        })(files, metalsmith, done);
    };
};
