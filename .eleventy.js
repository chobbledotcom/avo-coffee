module.exports = async function (eleventyConfig) {
	const fastglob = require("fast-glob");
	const fg = fastglob;
	const fs = require("fs");
	const { configureScss } = require("./_lib/scss");
	const images = fg.sync(["src/images/*.jpg"]);
	const markdownIt = require("markdown-it");
	const md = new markdownIt({ html: true });
	const path = require("path");

	const { EleventyRenderPlugin } = await import("@11ty/eleventy");
	const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

	eleventyConfig.addPlugin(EleventyRenderPlugin);

	eleventyConfig.addWatchTarget("./src/**/*");

	// Configure SCSS compilation
	configureScss(eleventyConfig);

	// Ignore SCSS partials (files starting with underscore)
	eleventyConfig.ignores.add("src/**/_*.scss");

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

	eleventyConfig.addFilter("markdownify", function (content) {
		return md.render(content || "");
	});

	eleventyConfig.addShortcode("renderSnippet", function (name) {
		const snippetPath = path.join(process.cwd(), "src/snippets", `${name}.md`);

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

	eleventyConfig.addCollection("blog", (collection) => {
		return collection.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
			return b.date - a.date;
		});
	});

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

	eleventyConfig.addCollection("images", (collection) => {
		return images.map((i) => i.split("/")[2]).reverse();
	});

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
		templateFormats: ["liquid", "md", "njk", "scss"],
		htmlTemplateEngine: "liquid",
		markdownTemplateEngine: "liquid",
	};
};
