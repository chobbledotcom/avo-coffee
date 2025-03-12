# Avo Coffee Website

A minimal, responsive website for [Avo Coffee](https://avocoffee.co.uk), a family-run cafe in Haslingden, Rossendale offering freshly prepared food and great coffee.

## Website Structure

### Main Content Areas

- **Pages**: [`src/pages/`](src/pages/) - Main site pages including home, about, menu, and contact
- **Blog Posts**: [`src/blog/`](src/blog/) - Individual blog posts and news updates
- **Snippets**: [`src/snippets/`](src/snippets/) - Reusable content blocks that can be inserted into any page
- **Assets**: [`src/assets/`](src/assets/) - Images, logos, and other static files
  - **Photos**: [`src/assets/photos/`](src/assets/photos/) - Photos

### Layout & Design

- **Layouts**: [`src/_layouts/`](src/_layouts/) - Page templates and structure
- **Styling**: [`src/_scss/`](src/_scss/) - SCSS style files
- **Site Data**: [`src/_data/`](src/_data/) - Global site configuration

## Editing Content

### Site Configuration

Edit [`src/_data/site.json`](src/_data/site.json) to update:

- Site name
- Contact information
- Social media links
- Hours and address

### Homepage Content

The homepage sections can be edited in:

- [`src/snippets/home-intro.md`](src/snippets/home-intro.md) - Introduction section
- [`src/snippets/home-menu.md`](src/snippets/home-menu.md) - Featured menu items

### Blog Posts

Add new blog posts in the [`src/blog/`](src/blog/) directory with the following data at the top of the file:

```yaml
---
title: Post Title
description: Brief summary for SEO
---
```

And name the file `YYYY-MM-DD-blog-post-name.md`

## License

Licensed under the [AGPL-3.0 License](LICENSE).
