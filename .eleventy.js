const dayjs = require('dayjs');
const languageFrench = require('dayjs/locale/fr');
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
    // Passtrough
    eleventyConfig.addPassthroughCopy('src/robots.txt');
    //eleventyConfig.addPassthroughCopy('src/.htaccess');
    eleventyConfig.addPassthroughCopy("src/assets/fonts");
    eleventyConfig.addPassthroughCopy("src/assets/js");
    eleventyConfig.addPassthroughCopy("src/assets/lib");

    eleventyConfig.addPassthroughCopy("src/assets/final");

    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("src/img");

    // Plugins
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(pluginRss);

    // Add Date filters
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    eleventyConfig.addFilter("date", (dateObj) => {
        return dayjs(dateObj).locale(languageFrench).format("D MMMM YYYY");
    });

    eleventyConfig.addFilter("sitemapDate", (dateObj) => {
        return dayjs(dateObj, {zone: 'utc'}).format("YYYY-MM-DD");
    });

    eleventyConfig.addFilter("year", () => {
        return dayjs().format("YYYY");
    });

    // Add Date filters v2 luxon
    // eleventyConfig.addFilter("postDate", (dateObj) => {
    //   return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    // });

    /* SASS compiler */
    eleventyConfig.setBrowserSyncConfig({
		    files: './public/assets/css/**/*.css'
	  });

    // Override Browsersync defaults (used only with --serve)
    eleventyConfig.setBrowserSyncConfig({
      callbacks: {
        ready: function(err, browserSync) {
          const content_404 = fs.readFileSync('_site/404.html');

          browserSync.addMiddleware("*", (req, res) => {
            // Provides the 404 content without redirect.
            res.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
            res.write(content_404);
            res.end();
          });
        },
      },
      ui: false,
      ghostMode: false
    });

    /* Markdown plugins */
    // https://www.11ty.dev/docs/languages/markdown/
    // --and-- https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js
    // --and-- https://github.com/planetoftheweb/seven/blob/master/.eleventy.js
    let markdownIt = require("markdown-it")
    let markdownItFootnote = require("markdown-it-footnote")
    let markdownItPrism = require('markdown-it-prism')
    let markdownItBrakSpans = require('markdown-it-bracketed-spans')
    let markdownItLinkAttrs = require('markdown-it-link-attributes')
    let markdownItOpts = {
      html: true,
      linkify: false,
      typographer: true
    }
    const markdownEngine = markdownIt(markdownItOpts)
    markdownEngine.use(markdownItFootnote)
    markdownEngine.use(markdownItPrism)
    markdownEngine.use(markdownItBrakSpans)
    markdownEngine.use(markdownItLinkAttrs, {
      pattern: /^https:/,
      attrs: {
        target: '_blank',
        rel: 'noreferrer noopener'
      }
    });

    return {
        dir: {
            input: "src",
            output: "public",
            includes: "_includes",
            layouts: "_layouts",
            data: "_data",
            },
        templateFormats: [
          'html',
          'md',
          'njk',
          '11ty.js'
          ],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        passthroughFileCopy: true,
    };
}