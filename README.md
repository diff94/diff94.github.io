# Po-Ya Angela Wang — personal academic website

A fast, dependency-free personal site. **All content lives in plain markdown files** under `content/` — edit a file, refresh the page, done. No build step, no framework, no npm.

Want to understand *how* everything works (tangram morphing, Web Audio notes, the night sky, timelines) and learn to extend it? Read **[MANUAL.md](MANUAL.md)** — the complete builder's manual.

## ✏️ How to update content (the 95% case)

The site is multi-page: every section is its own page, and every page's content is one markdown file:

| Page | Content file |
|---|---|
| `index.html` (home) | `content/vision.md` (vision + 3 pillar cards) + hero text in the HTML |
| `about.html` | `content/about.md` |
| `research.html` | `content/research.md` |
| `publications.html` | `content/publications.md` (auto-filterable) |
| `teaching.html` | `content/teaching.md` |
| `projects.html` | `content/projects.md` |
| `life.html` | `content/life.md` (rendered as cards) |
| `news.html` | `content/news.md` (timeline; home shows the first 3 items) |

The nav bar and contact footer appear on every page automatically — they live in one place, `assets/js/main.js` (`NAV_GROUPS` and `injectChrome`). The nav is visually grouped: Home & About │ Research & Teaching (work) │ Life & "News & Contact". Publications and Projects sit *under* Research: they're not in the nav, but are linked from the Research page header, the home Explore cards, and they highlight "Research" in the nav when open. To add a whole new page, copy `teaching.html`, change its `<title>`, `data-page`, hero text, and `data-md`, then add one line to `NAV_GROUPS`.

Supported markdown: `# headings` (use `###` for in-section headings), `**bold**`, `*italic*`, `` `code` ``, `[links](https://…)`, `- lists`, `> quotes`, `---` rules, images.

### Special tricks

- **Stat chips** — a line like `:: 7+ :: years of university teaching` renders as a big-number stat card. Consecutive `::` lines form a grid.
- **Publications** — each `### Category` heading becomes a filter chip; each paragraph becomes one publication card. The first year found (e.g. `(2026)`) becomes the year badge. Keep one publication per paragraph (blank line between entries).
- **News** — write one `- **Month Year** — what happened` bullet per item; newest on top.
- **Life** — each `### 🎯 Title` + paragraph becomes one card.

Name, tagline phrases, email, and links live in `index.html` (hero + footer) and the typewriter phrases in `assets/js/main.js` (`PHRASES`). These rarely change.

## 👀 Preview locally

Browsers block `fetch()` for local files, so serve the folder:

```bash
cd AM_web
python3 -m http.server 8000
# open http://localhost:8000
```

## 🚀 Deploy to GitHub Pages (account: `diff94`)

Using the GitHub CLI (already installed & logged in). From the `AM_web` folder:

```bash
git add -A
git commit -m "Personal academic website"
gh repo create diff94.github.io --public --source=. --remote=origin --push
```

Because the repo is named `diff94.github.io`, GitHub Pages turns on **automatically** and serves it at **https://diff94.github.io/** within ~1–2 minutes. No Settings toggling needed.

To publish later edits: `git add -A && git commit -m "update" && git push`.

- **`.nojekyll`** (in this folder) disables GitHub's Jekyll processor so the raw `content/*.md` files are served as-is — without it the site's markdown may fail to load. Keep this file.
- ⚠️ **Privacy:** the PDFs here (CV with phone number, application brief, dissertation) are in `.gitignore`, so they are **not** published. To publish a CV, make a redacted copy (e.g. `cv-public.pdf`), force-add it (`git add -f cv-public.pdf`), and link it from the site.

## 🧩 The tangram & the "fantastic interactions"

- The hero tangram morphs between **a swan → a sailboat → a dinosaur → the classic square → a burst** (click it). Shapes are defined in `assets/js/main.js` (`SQUARE_RAW`, `SWAN`, `BOAT`, `DINO`) as polygon coordinates in a 16×12 viewBox — add your own configurations to the `states` array (full how-to in MANUAL.md §3).
- **Music**: each tangram piece plays its own note on a C-major pentatonic scale (hover to compose; morphing plays an arpeggio). The 🎵 button next to the tangram mutes it; the choice is remembered.
- **Sky**: light mode has drifting clouds over a pale-sky gradient; dark mode gets a canvas night sky with twinkling stars, two aurora ribbons, and occasional shooting stars (all disabled for reduced-motion users).
- **Ocean**: animated wave divider under the hero; the scroll progress bar at the very top runs blue → green → yellow.
- Palette lives in the CSS variables at the top of `assets/css/style.css` (light = daytime sky/sea, dark = night ocean).

## 🔗 Adding Spotify / Instagram

In `assets/js/main.js`, find the `Find me` block inside `injectChrome` (the footer lives there so it appears on every page) — the Spotify and Instagram links are ready inside an HTML comment. Paste your profile URLs and move them out of the comment.
