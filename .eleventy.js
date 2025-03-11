const path = require("path");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const fg = require("fast-glob");
const fs = require("fs");

const images = fg.sync(["src/images/*.jpg"]);

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/**/*");
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Add a date formatter filter
  eleventyConfig.addFilter("readableDate", function (dateObj) {
    if (typeof dateObj === "string") {
      dateObj = new Date(dateObj);
    }
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Set up markdown parser
  const markdownIt = require("markdown-it");
  const md = new markdownIt({
    html: true,
  });

  // Add a markdownify filter
  eleventyConfig.addFilter("markdownify", function (content) {
    return md.render(content || "");
  });

  // Add a shortcode to render snippets by name
  eleventyConfig.addShortcode("renderSnippet", function (name) {
    const snippetPath = path.join(__dirname, "src/snippets", `${name}.md`);

    try {
      const content = fs.readFileSync(snippetPath, "utf8");
      return md.render(content);
    } catch (e) {
      console.error(`Error rendering snippet ${name}: ${e.message}`);
      return `<!-- Error rendering snippet ${name} -->`;
    }
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    widths: [200, 400, 800, 1200],
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
      pictureAttributes: {},
    },
  });

  // Configure collections
  // Blog collection
  eleventyConfig.addCollection("blog", (collection) => {
    return collection.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
      return b.date - a.date; // sort by date in descending order
    });
  });

  // Snippets collection by key
  eleventyConfig.addCollection("snippetsByKey", (collection) => {
    return collection
      .getFilteredByTag("snippet")
      .reduce((snippetsObj, snippet) => {
        if (snippet.data.key) {
          snippetsObj[snippet.data.key] = snippet;
        }
        return snippetsObj;
      }, {});
  });

  // Image collection
  eleventyConfig.addCollection("images", (collection) => {
    return images.map((i) => i.split("/")[2]).reverse();
  });

  // Configure asset handling
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon/*": "/",
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    templateFormats: ["liquid", "md"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
};
