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

## 🚀 Update and publish the website

This repository is already connected to GitHub Pages. You do **not** need to create the repository again. Pushing a commit to the `main` branch updates the live website.

| Item | Value |
|---|---|
| Local folder | `/Users/amberber/Githubs/AM_web` |
| GitHub repository | [github.com/diff94/diff94.github.io](https://github.com/diff94/diff94.github.io) |
| Git remote | `origin` |
| Publishing branch | `main` |
| Live website | [https://diff94.github.io/](https://diff94.github.io/) |
| Live teaching page | [https://diff94.github.io/teaching.html](https://diff94.github.io/teaching.html) |

### Quick routine: update the teaching page

The commands below are ready to copy and paste. Pull before you begin editing so your local copy is up to date.

1. Open **Terminal**, enter the website folder, and check its state:

   ```bash
   cd /Users/amberber/Githubs/AM_web
   git status
   ```

   If `git status` says `working tree clean`, copy and run:

   ```bash
   git pull --ff-only origin main
   ```

   If `git status` lists edits that you still need, do not pull yet. Follow [Pull is blocked by local changes](#pull-is-blocked-by-local-changes) first.

2. Edit `content/teaching.md` in your editor and save it.

3. Preview the website. In Terminal, run:

   ```bash
   cd /Users/amberber/Githubs/AM_web
   python3 -m http.server 8000
   ```

   Keep that Terminal window open, then visit [http://localhost:8000/teaching.html](http://localhost:8000/teaching.html). Use a second Terminal window for the Git commands below. When you finish previewing, return to the server window and press **Control+C** to stop it.

4. Review the change, stage only the teaching file, commit it, and push it:

   ```bash
   cd /Users/amberber/Githubs/AM_web
   git status
   git diff
   git add content/teaching.md
   git diff --staged
   git commit -m "Update teaching page"
   git push origin main
   ```

5. Wait a minute or two, then open [https://diff94.github.io/teaching.html](https://diff94.github.io/teaching.html) and refresh the page. If the old version is cached, hard-refresh with **Command+Shift+R** on macOS.

### Detailed routine for any website update

#### 1. Go to the correct folder

Every Git command in this guide should be run from the website folder:

```bash
cd /Users/amberber/Githubs/AM_web
pwd
```

The `pwd` output should be:

```text
/Users/amberber/Githubs/AM_web
```

#### 2. Check for unfinished work

```bash
git status
```

- `working tree clean` means there are no local edits, so it is safe to pull.
- `Changes not staged for commit` means files have been edited but not staged.
- `Changes to be committed` means files are staged for the next commit.
- `Untracked files` means new files exist locally but Git is not tracking them yet.

Do not pull automatically if you see unfinished work that you need to preserve. Commit it first or use the stash instructions below.

#### 3. Pull the latest website from GitHub

When the working tree is clean, run:

```bash
git pull --ff-only origin main
```

This downloads new commits from GitHub. The `--ff-only` option prevents Git from silently creating a merge commit. If Git cannot update cleanly, it stops and leaves you in control.

If the output says `Already up to date.`, your local copy already matches GitHub.

#### 4. Edit the appropriate content file

For most changes, edit the matching file under `content/`:

| Live page | File to edit |
|---|---|
| Home | `content/vision.md` |
| About | `content/about.md` |
| Research | `content/research.md` |
| Publications | `content/publications.md` |
| Teaching | `content/teaching.md` |
| Projects | `content/projects.md` |
| Life | `content/life.md` |
| News | `content/news.md` |

Save the file after editing. For page-specific behavior, layout, or hero text, see the complete content map earlier in this README and [MANUAL.md](MANUAL.md).

#### 5. Preview locally

Start the local server in one Terminal window:

```bash
cd /Users/amberber/Githubs/AM_web
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000), navigate to the page you changed, and check desktop and narrow window sizes. Press **Control+C** in the server window when finished.

#### 6. Review exactly what changed

```bash
cd /Users/amberber/Githubs/AM_web
git status
git diff
```

`git status` lists changed files. `git diff` displays the unstaged line-by-line edits. Make sure the list contains only files you intended to change and that no private information appears in the diff.

#### 7. Stage only the intended files

For a teaching-page update:

```bash
git add content/teaching.md
```

Other common examples:

```bash
git add content/about.md
```

```bash
git add content/research.md content/publications.md
```

```bash
git add README.md
```

Use the filenames shown by `git status`. This guide intentionally does not use `git add -A` by default because that can stage unrelated edits or newly created private files.

Review the staged version that will enter the commit:

```bash
git diff --staged
git status
```

#### 8. Commit the update

A commit saves a named snapshot in the local Git history. Use a short message that describes the update.

Teaching page:

```bash
git commit -m "Update teaching page"
```

About page:

```bash
git commit -m "Update about page"
```

Research and publications:

```bash
git commit -m "Update research and publications"
```

README instructions:

```bash
git commit -m "Improve website update instructions"
```

Confirm the commit and check whether anything remains uncommitted:

```bash
git log -1 --oneline
git status
```

#### 9. Push the commit to GitHub

```bash
git push origin main
```

`git push` uploads local commits to the `main` branch on GitHub. GitHub Pages then publishes the updated static files automatically.

#### 10. Confirm the live website

1. Open the [GitHub repository](https://github.com/diff94/diff94.github.io) and confirm that your newest commit appears.
2. If deployment is still running, check the repository's [Actions page](https://github.com/diff94/diff94.github.io/actions).
3. Open the [live website](https://diff94.github.io/) or the [teaching page](https://diff94.github.io/teaching.html).
4. Hard-refresh with **Command+Shift+R** if you still see the old content.

### One-time setup checks

Run these commands if you are using a new computer or want to confirm the Git setup:

```bash
git --version
cd /Users/amberber/Githubs/AM_web
git branch --show-current
git remote -v
```

Expected results:

- `git --version` prints an installed Git version.
- `git branch --show-current` prints `main`.
- `git remote -v` shows `https://github.com/diff94/diff94.github.io.git` for `origin`.

If the repository has not yet been downloaded onto a new computer, choose a parent folder and clone it:

```bash
cd /Users/amberber/Githubs
git clone https://github.com/diff94/diff94.github.io.git AM_web
cd /Users/amberber/Githubs/AM_web
git status
```

Do not run `git clone` inside an existing `AM_web` folder.

### What the Git commands mean

| Command | Purpose |
|---|---|
| `git status` | Shows the branch and all staged, unstaged, and untracked files. |
| `git pull --ff-only origin main` | Downloads the latest `main` commits without creating an automatic merge commit. |
| `git diff` | Shows edits that have not been staged. |
| `git add <file>` | Selects a specific file for the next commit. |
| `git diff --staged` | Shows exactly what the next commit will contain. |
| `git commit -m "message"` | Saves the staged changes in local Git history. |
| `git push origin main` | Uploads local commits to GitHub and triggers publication. |

### Troubleshooting

#### Git says there is nothing to commit

Run:

```bash
git status
```

If it says `working tree clean`, either the file was not saved, the wrong folder was edited, or the same content was already committed. Confirm the editor saved the file under `/Users/amberber/Githubs/AM_web`.

#### A file was staged accidentally

Replace `path/to/file` with the filename shown by `git status`:

```bash
git restore --staged path/to/file
git status
```

This removes the file from the next commit but **keeps its local edits**.

#### Pull is blocked by local changes

The simplest option is to finish, review, and commit the local work before pulling. If the work is not ready for a commit, temporarily store both tracked and untracked changes:

```bash
cd /Users/amberber/Githubs/AM_web
git status
git stash push -u -m "Temporary website edits"
git pull --ff-only origin main
git stash pop
git status
```

`git stash pop` reapplies the saved edits. If Git reports a conflict, do not push or use a destructive reset command. Open each file marked `both modified`, resolve the conflict markers, preview the result, then stage and commit the resolved files.

#### Push is rejected because GitHub has newer commits

First make sure your local edits are committed and `git status` is clean. Then replay your commit on top of the latest GitHub version and push again:

```bash
cd /Users/amberber/Githubs/AM_web
git status
git pull --rebase origin main
git push origin main
```

If the rebase reports conflicts, stop and inspect the conflicted files. Do not keep pushing until every conflict has been resolved and the site has been previewed.

#### GitHub authentication fails

GitHub does not accept an account password for Git operations over HTTPS. If GitHub CLI is installed, check and refresh the login:

```bash
gh auth status
gh auth login
gh auth setup-git
```

Follow the browser prompts, then retry:

```bash
git push origin main
```

#### The push worked but the live page has not changed

1. Confirm the commit is visible in the [GitHub repository](https://github.com/diff94/diff94.github.io).
2. Check the [Actions page](https://github.com/diff94/diff94.github.io/actions) for a running or failed deployment.
3. Wait a minute or two, then hard-refresh with **Command+Shift+R**.
4. Confirm that you edited the content file used by that page.

### Important publishing safety notes

- Keep **`.nojekyll`** in this folder. It disables GitHub's Jekyll processor so the raw `content/*.md` files remain available to the site's JavaScript.
- Files ignored by `.gitignore` are intentionally excluded from Git and GitHub Pages. Do not force-add a private CV, phone number, application brief, dissertation, credentials, or other sensitive material.
- To publish a PDF, first create a deliberately public, redacted copy and inspect it for private information. Then place and link only that public copy.
- Always inspect both `git status` and `git diff --staged` before committing.
- This README teaches the commands; creating it does not itself pull, commit, push, or publish anything.

## 🧩 The tangram & the "fantastic interactions"

- The hero tangram morphs between **a swan → a sailboat → a dinosaur → the classic square → a burst** (click it). Shapes are defined in `assets/js/main.js` (`SQUARE_RAW`, `SWAN`, `BOAT`, `DINO`) as polygon coordinates in a 16×12 viewBox — add your own configurations to the `states` array (full how-to in MANUAL.md §3).
- **Music**: each tangram piece plays its own note on a C-major pentatonic scale (hover to compose; morphing plays an arpeggio). The 🎵 button next to the tangram mutes it; the choice is remembered.
- **Sky**: light mode has drifting clouds over a pale-sky gradient; dark mode gets a canvas night sky with twinkling stars, two aurora ribbons, and occasional shooting stars (all disabled for reduced-motion users).
- **Ocean**: animated wave divider under the hero; the scroll progress bar at the very top runs blue → green → yellow.
- Palette lives in the CSS variables at the top of `assets/css/style.css` (light = daytime sky/sea, dark = night ocean).

## 🔗 Adding Spotify / Instagram

In `assets/js/main.js`, find the `Find me` block inside `injectChrome` (the footer lives there so it appears on every page) — the Spotify and Instagram links are ready inside an HTML comment. Paste your profile URLs and move them out of the comment.
