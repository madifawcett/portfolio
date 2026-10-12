# Portfolio template

A static portfolio for GitHub Pages. No build step.

## Publish on GitHub Pages
1. Create a repository named `your-username.github.io` (or any name for a project site).
2. Upload everything in this folder to the repository root.
3. Go to Settings > Pages, set Source to "Deploy from a branch", choose `main` and `/ (root)`, then Save.
4. Your site appears at `https://your-username.github.io` within a minute or two.

## Add a project
1. Put screenshots in `projects/`. To host a small demo, add a folder like `projects/my-app/` containing an `index.html`.
2. Add an entry to the `projects` list in `data.json` (copy an existing one).
3. Commit and push. The site updates automatically.

## Add a downloadable file
1. Upload the file to `files/`.
2. Add `{ "name": "...", "path": "files/your-file.pdf", "note": "..." }` to the `files` list in `data.json`.

## Preview locally
Opening `index.html` directly will not load `data.json`. Run `python -m http.server` in this folder and visit http://localhost:8000.

## Customize
Colors and fonts are at the top of `style.css` (the `:root` variables).
