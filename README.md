# me (Portofolio Site)
- https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll
- [Vcard Repository](https://img.shields.io/github/repo-size/codewithsadee/vcard-personal-portfolio)

## File Structure
<pre>
Root
├── example.json
├── index.html
    ── Website enterance, can be index.md as well.
├── config.yml
    ── Jekyll configuration file for execution reference
├── Gemfile
    ── For Ruby/Jekyll package management.
├── package.json
    ── For node App's management. Only for generate_manifest.js, and local dynamic server (this function is fullfilled by Jekyll).
├── generate_manifest.js
    ── Generate my gallery photo's names for JS loading. If new photos in, have to run `npm start` to regenerate *./assets/gallery-manifest.json* file.
├── package-lock.json
├── README.md
└── assets
    ├── css
        └── Important CSS scripts.
    ├── gallery
        └── Selected Photos. Due to size limitation, only a few are put here.
    ├── images
        └── Icons and images for the website.
    └── js
        └── Important CSS scripts.
</pre>

## Testing Locally
bundle exec jekyll serve