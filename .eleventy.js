const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
    // Passtrough
    eleventyConfig.addPassthroughCopy('robots.txt')
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("src/images");

    // Plugins
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // Add Date filters
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    eleventyConfig.addFilter("date", (dateObj) => {
        return dayjs(dateObj).format("D MMMM YYYY");
    });

    eleventyConfig.addFilter("sitemapDate", (dateObj) => {
        return dayjs(dateObj).toISOString();
    });

    eleventyConfig.addFilter("year", () => {
        return dayjs().format("YYYY");
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