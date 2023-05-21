const dayjs = require('dayjs');
const languageFrench = require('dayjs/locale/fr');
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const fs = require("fs");
const NOT_FOUND_PATH = "_site/404.html";

module.exports = function (eleventyConfig) {

    // Plugins
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(pluginRss, {
      posthtmlRenderOptions: {
        closingSingleTag: "default" // opt-out of <img/>-style XHTML single tags
      }
    });

    // Passtrough
    eleventyConfig.addPassthroughCopy("src/robots.txt");
    eleventyConfig.addPassthroughCopy("src/.htaccess");
    eleventyConfig.addPassthroughCopy("src/assets/fonts");
    eleventyConfig.addPassthroughCopy("src/assets/js");
    eleventyConfig.addPassthroughCopy("src/assets/lib");
    eleventyConfig.addPassthroughCopy("src/assets/final");
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("src/img");

    // Add Date filters
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    eleventyConfig.addFilter("date", (dateObj) => {
        return dayjs(dateObj).locale(languageFrench).format("D MMMM YYYY");
    });

    eleventyConfig.addFilter("sitemapDate", (dateObj) => {
        return dayjs(dateObj).toISOString();
    });

    eleventyConfig.addFilter("year", () => {
        return dayjs().format("YYYY");
    });

    // Return all the tags used in a collection
    eleventyConfig.addFilter("getAllTags", collection => {
      let tagSet = new Set();
      for(let item of collection) {
        (item.data.tags || []).forEach(tag => tagSet.add(tag));
      }
      return Array.from(tagSet);
    });

    eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
      return (tags || []).filter(tag => ["all", "posts", "pages", "members"].indexOf(tag) === -1);
    });

    /* SASS compiler */
    eleventyConfig.setBrowserSyncConfig({
		    files: './public/assets/css/**/*.css'
	  });

    // Eleventy code for 404 page
    eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware("*", (req, res) => {
          if (!fs.existsSync(NOT_FOUND_PATH)) {
            throw new Error(`Expected a \`${NOT_FOUND_PATH}\` file but could not find one. Did you create a 404.html template?`);
          }

          const content_404 = fs.readFileSync(NOT_FOUND_PATH);
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
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