# Avo Coffee Website - Development Guide

## Build Commands
- Build site: `bin/build` or `yarn eleventy`
- Start dev server: `bin/serve`
- Compile SCSS only: `sass --update src/_scss:_site/css --style compressed`

## Project Structure
- `src/`: Source files (Markdown, templates, SCSS)
  - `src/_layouts/`: Page layouts
  - `src/_scss/`: SCSS stylesheets
  - `src/pages/`: Main website pages
  - `src/blog/`: Individual blog post pages
  - `src/snippets/`: Editable content blocks used across the site
  - `src/assets/`: Images and other assets
- `_site/`: Generated site (do not edit directly)
- `bin/`: Build scripts

## Content Organization
- Pages are stored in `src/pages/` with proper permalinks 
- Homepage sections are editable as Markdown files in `src/snippets/`:
  - `home-hero.md`: The main hero intro text
  - `home-intro.md`: Welcome section content and intro text
  - `home-menu.md`: Featured menu items list
- Each snippet is tagged with `snippet` and has a unique `key` identifier
- Snippets are automatically available in templates via the `collections.snippetsByKey` collection
- Blog posts are in `src/blog/` directory

## Code Style
- HTML: Use semantic elements, NO CSS CLASSES whenever possible - style elements directly
- CSS: Use SCSS with nesting, variables for colors/spacing
- Markdown: Use for content pages, keep formatting simple
- Templates: Use Liquid (htmlTemplateEngine and markdownTemplateEngine)
- Images: Use the built-in image plugin for optimization

## Page Structure
- Pages use a shared configuration via pages.json
- Each page should include in frontmatter:
  - `title`: Page title
  - `description`: Brief summary for SEO
  - `permalink`: URL path (e.g., `/about/`)

## Blog Structure
- Blog posts use Eleventy collections (`collections.blog`)
- Posts are sorted by date in descending order
- Each post should include in frontmatter:
  - `layout: blog-post.html`
  - `title`: Post title
  - `description`: Brief summary
  - `date`: Post date (YYYY-MM-DD format)
  - `tags: blog`
  - `permalink`: Custom URL path

## Guidelines
- No JavaScript (per README: "No JS, minimal CSS, responsive, light theme")
- Colors: #fdf8d8 (background), #283a06 (font), #c63c20 (secondary)
- Project uses Eleventy (11ty) as the static site generator
- Keep accessibility in mind - use semantic HTML and sufficient contrast
- VERY IMPORTANT: Avoid CSS classes - style elements directly per README
- Site navigation uses separate pages, not anchor links