# How this website works — a complete builder's manual

This document explains every technique used on the site, deeply enough that you can modify or rebuild any part of it. Read [README.md](README.md) first for the quick "how do I edit content" answers; read this when you want to understand *how the machine works*.

---

## 1. The big picture

```
AM_web/
├── index.html            ← home (hero + tangram + vision + explore + latest)
├── about.html … news.html← one thin HTML "shell" per page
├── content/*.md          ← ALL the words live here (markdown)
├── assets/css/style.css  ← every visual decision
└── assets/js/main.js     ← the engine (≈600 lines, no libraries)
```

Three design principles:

1. **No build step.** The browser gets exactly these files. Nothing to install, nothing to compile, nothing to break in five years. GitHub Pages serves it as-is.
2. **Content is data, layout is code.** Each page's HTML declares *where* content goes (`<section data-md="content/about.md">`); JavaScript fetches the markdown and renders it. You edit words without touching layout.
3. **Shared chrome is injected.** The nav bar, footer, sky canvas, and waves appear on every page but are written only once, in `injectChrome()` in `main.js`. Every page ends with `<script src="assets/js/main.js">`, so every page gets them for free.

### Page lifecycle (what happens when a page loads)

1. Browser parses the small HTML shell (hero + empty sections).
2. `main.js` runs: `injectChrome()` inserts nav/footer/canvas/waves.
3. `initTheme()` reads `localStorage` → sets `data-theme="dark"` on `<html>` if needed.
4. `loadSections()` fetches each `data-md` file, converts markdown → HTML, applies the section's "mode" (pubs / cards / timeline).
5. Feature initializers run — each checks whether its element exists on this page, so one script safely serves all pages.

---

## 2. The markdown engine (`mdToHtml`)

Rather than shipping a 40 KB library, the site has a ~70-line parser that supports exactly what the content needs. Two layers:

**Inline layer** (`inlineMd`) — regex substitutions applied to text *within* a line, in careful order: `` `code` `` first (so nothing inside code gets mangled), then images `![alt](src)`, links `[text](url)`, `**bold**`, `*italic*`. External links get `target="_blank" rel="noopener"` automatically (the regex checks for `https?:`).

**Block layer** (`mdToHtml`) — walks the file line by line, holding little buffers:

- Blank line → "flush" whatever's open (paragraph, list, stat grid).
- `### Heading` → `<h3>` (heading level = number of `#`, minimum h3 so page titles stay unique).
- `- item` → collected into a `<ul>` until a non-list line appears.
- `> quote` → blockquote. `---` → `<hr>`.
- `:: 4.85 :: label` → **stat chip**. This is a custom syntax I invented for this site: consecutive `::`-lines are collected and emitted as a `.stats` grid of big-number cards. It's just a regex: `/^::\s*(.+?)\s*::\s*(.+)$/`.
- Anything else → accumulated into a paragraph.

Everything is HTML-escaped *before* the regexes run (`escapeHtml`), so stray `<` in your markdown can't inject markup.

**The lesson:** a parser is just "read lines, keep a little state, flush on boundaries." If you ever need tables, you'd add one more branch.

---

## 3. The interactive tangram 🧩 (the crown jewel)

### 3.1 The geometry

A tangram is one square cut into **7 pieces**. All coordinates live in an SVG with `viewBox="0 0 16 12"` — an abstract 16×12 canvas; the browser scales it to any size. **y points DOWN** in SVG (y=0 is the top).

Cutting an 8×8 square gives the piece inventory (units where the square's side = 8):

| # | Piece            | Right-angle legs | Hypotenuse / sides |
|---|------------------|------------------|--------------------|
| 0 | Large triangle A | 5.66 (=4√2)      | 8                  |
| 1 | Large triangle B | 5.66             | 8                  |
| 2 | Medium triangle  | 4                | 5.66               |
| 3 | Small triangle A | 2.83 (=2√2)      | 4                  |
| 4 | Small triangle B | 2.83             | 4                  |
| 5 | Square           | side 2.83        | —                  |
| 6 | Parallelogram    | sides 4 & 2.83   | 45° angles         |

Every figure (swan, boat, dinosaur…) is just an array of 7 polygons **in this same order**, e.g. in `main.js`:

```js
const SWAN = [
  [[3,10],[11,10],[7,6]],   // piece 0: large tri (body front)
  [[11,10],[7,6],[15,6]],   // piece 1: large tri (body back)
  ...                        // 7 entries total
];
```

### 3.2 How the morphing works

CSS can't animate polygon points, so we interpolate them ourselves:

```js
// simplified from morphTo()
const from = currentPoints;               // snapshot
const t0 = performance.now();
function frame(now) {
  const t = Math.min(1, (now - t0) / 900);      // 0 → 1 over 900 ms
  const k = ease(t);                             // cubic ease-in-out
  // every vertex slides a fraction k of the way to its target
  draw(from.map((poly, i) => poly.map((pt, j) => [
    pt[0] + (target[i][j][0] - pt[0]) * k,
    pt[1] + (target[i][j][1] - pt[1]) * k,
  ])));
  if (t < 1) requestAnimationFrame(frame);       // ~60 fps
}
```

Key ideas:

- **`requestAnimationFrame`** asks the browser "call me before the next repaint" — smooth and battery-friendly.
- **Easing**: raw `t` looks robotic. `ease(t) = t<.5 ? 4t³ : 1-(-2t+2)³/2` starts slow, speeds up, lands softly.
- **Vertex correspondence**: piece *i*, vertex *j* in one figure maps to piece *i*, vertex *j* in the next. That's why every config keeps the same piece order and triangles always have 3 points, quads 4. Rotation "emerges" from vertices traveling to their new spots — you never compute a rotation matrix for the morph.
- The "chaos" config is *generated*: take the square, push each piece away from the center, rotate it a random ±45° around its own centroid (`burstConfig()` — that one *does* use a rotation: `x' = x·cosθ − y·sinθ`, `y' = x·sinθ + y·cosθ`).

### 3.3 Designing a NEW figure (dinosaur, fencer, unicorn — yes, all possible!)

Anything you can silhouette with 2 big triangles, 1 medium, 2 small, 1 square, 1 parallelogram is fair game. The method I use — and used for the dinosaur that's now live on the site:

1. **Find or sketch a tangram solution.** Search "tangram dinosaur solution" for reference images, or sketch your own: silhouette first, then ask "which piece plays which body part?" Big triangles = torso masses. Parallelogram = necks, tails, slanted limbs (it's the only piece that "leans"). Medium triangle = haunches, sails, skirts. Small triangles = heads, feet, hands. Square = hips, heads, joints.
2. **Work on graph paper** (or squared notebook). Draw a 16×12 grid, y downward. Keep edges at 0°, 45°, or 90° — tangram pieces only look right at those angles.
3. **Write coordinates piece by piece, checking sizes** with Pythagoras: a large triangle's legs must be ≈5.66 apart (e.g. from (2,9) to (6,5) is √(4²+4²)=5.66 ✓). The dinosaur in `main.js` annotates every piece — copy its style.
4. **Check for overlaps**: two pieces may share an edge but not area. Easiest check: shade each piece on the graph paper.
5. **Small gaps are fine** — even good. Real tangram art often "explodes" pieces by 0.2–0.5 units for legibility (the boat's waves float apart deliberately).
6. **Add it to the code**: define `const UNICORN = [...7 polygons...]`, then add one line to `states` in `initTangram()`:
   ```js
   { name: "a unicorn 🦄", get: () => UNICORN },
   ```
   Done — it joins the click cycle, morphing included, no other changes.

**Worked example — the dinosaur (🦕 now the 3rd click):** body = the two large triangles forming a wide low mass, tail = medium triangle squaring off the rear, neck = parallelogram climbing up the body's front slope (its 45° lean is exactly the neck angle), head = small triangle at the top, front leg = the other small triangle pointing down, back leg = the square. Look at `DINO` in `main.js` with graph paper and you can trace every choice.

A **fencer** hint for when you try: lunging figure = large triangle as the lunging front leg, large triangle as torso leaning forward, parallelogram as the extended sword arm, square as head, medium as back leg, smalls as foot + guard hand.

### 3.4 Interactivity wiring

- The SVG has 7 `<polygon>` elements created in JS; each gets `mouseenter` → play its note, and the whole SVG gets `click` → morph to the next state.
- The caption ("Now showing: a swan 🦢") is one `<strong id="tangram-name">` updated in the same click handler.
- `prefers-reduced-motion` users get instant jumps instead of animation (`matchMedia("(prefers-reduced-motion: reduce)")`) — always offer this.

---

## 4. The sounds 🎵 (Web Audio API)

No audio files anywhere. The browser can *synthesize* sound:

```js
audioCtx = new AudioContext();          // the audio engine
const osc  = audioCtx.createOscillator(); // generates a waveform
const gain = audioCtx.createGain();       // controls volume over time
osc.type = "sine";                        // soft, flute-like (try "triangle"!)
osc.frequency.value = 523.25;             // pitch in Hz (C5)
osc.connect(gain).connect(audioCtx.destination);
```

The three musical decisions that make it pleasant instead of annoying:

1. **Scale choice.** The 7 pieces map to `SCALE = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66]` — C-D-E-G-A over two octaves, a **pentatonic-flavored major set**. Pentatonic scales have no dissonant intervals, so *any* hover order sounds melodic. That's the same trick wind chimes use.
2. **The envelope.** A raw oscillator clicks when it starts and stops. Instead we shape volume: silent → full in 20 ms (`linearRampToValueAtTime`), then decay to nothing over ~1.1 s (`exponentialRampToValueAtTime` — exponential decay is what plucked strings do naturally, so it reads as "a note", not "a beep").
3. **The arpeggio.** On every morph, pieces 0-2-4-6 play with 90 ms stagger: `[0,2,4,6].forEach((n,k) => playNote(n, k*0.09))` — delay is passed into the scheduler (`audioCtx.currentTime + delay`), which is sample-accurate, far better than `setTimeout`.

**Autoplay policy:** browsers refuse to make sound before the user's first click/tap (good!). That's why the initial swan assembly is silent, and why `playNote` calls `audioCtx.resume()` — the context may start "suspended". The 🎵 toggle just flips a boolean and remembers it in `localStorage("amber-sound")`.

Change the instrument: `osc.type = "triangle"` (warmer), `"square"` (chiptune), `"sawtooth"` (brassy). Change the mood: lower every frequency one octave (divide by 2).

---

## 5. The night sky ✨ (canvas animation)

One full-screen `<canvas id="sky">` sits behind everything (`position: fixed; z-index: 0`; all content is `z-index: 1`). It's transparent in light mode (`opacity: 0` + CSS transition) and fades in for dark mode. Every frame (`requestAnimationFrame` loop):

- **Stars** — ~180 objects `{x, y, r, tw, sp}` made once per resize. Twinkle is `alpha = .25 + .75·|sin(tw + t·0.001·sp)|` — each star has a random phase `tw` and speed `sp`, so they shimmer independently. Drawing: `ctx.arc` + `ctx.globalAlpha`.
- **Aurora** — two ribbons. Each is a *filled path*: trace a sine wave across the screen (`y = base + sin(x·k + t·speed)·amplitude`), come back 110 px lower, close the shape, fill with a vertical gradient that's transparent → green/blue at 5–7% opacity → transparent. Two ribbons drifting at different speeds & directions create the organic weave.
- **Shooting stars** — every 6–15 s spawn `{x, y, vx, vy, life}`; draw a line from the head backward along its velocity with a gradient tail; move it; fade `life` toward 0.

Performance guardrails: the loop only runs in dark mode (`sync()` starts/stops it on theme change); star count scales with viewport width; reduced-motion users get a single static starfield drawing.

---

## 6. The ocean waves 🌊 (infinite scroll loop)

An SVG under each header contains a wave `path` whose bumps **repeat every 720 units**, drawn twice over (total width 2880 in the `viewBox`). The SVG is styled `width: 200%` and CSS animates it left:

```css
@keyframes waveShift { to { transform: translateX(-25%); } }
```

−25% of a 200%-wide element = exactly 720 units = one full bump period, so when the animation loops back to 0, the pixels are identical — a **seamless infinite scroll**. The second, back layer runs slower (26 s vs 16 s) and in `reverse`, which makes the two layers slide against each other like real water. This period-matching trick works for any repeating background: clouds, marquees, conveyor belts.

---

## 7. The timeline (News) 📍

There is no timeline "component" — it's a plain markdown list restyled. In `content/news.md` every item is `- **May 2026** — thing that happened`. The page's section says `data-mode="timeline"`, which makes JS add one class: `<ul class="timeline">`. All the drawing is CSS:

```css
.timeline { position: relative; list-style: none; }
.timeline::before {            /* the vertical rail */
  content: ""; position: absolute;
  left: 7px; top: 6px; bottom: 6px; width: 2px;
  background: var(--line);
}
.timeline li { position: relative; padding-left: 32px; }
.timeline li::before {         /* one diamond per entry */
  content: ""; position: absolute; left: 0; top: 7px;
  width: 12px; height: 12px;
  transform: rotate(45deg);    /* square → diamond */
  background: var(--accent-2);
}
.timeline li:nth-child(4n+2)::before { background: var(--accent); } /* rotating colors */
```

The techniques worth stealing: **`::before`/`::after` pseudo-elements** give you two free drawing surfaces per element (rail + diamonds cost zero HTML); **`nth-child(4n+…)`** cycles the four accent colors forever; the home page teaser reuses the same CSS by fetching `news.md`, slicing the first 3 lines, and adding the same class.

---

## 8. The publications filter 🔎

The markdown stays innocent — `### Category` headings and one paragraph per paper. At load, `enhancePubs()` **rebuilds the DOM**: it walks the rendered children, groups each `<h3>` with its following `<p>`s into a `.pub-group`, wraps each paper in a `.pub-entry` card, and pulls the first 4-digit year (`/\b(19|20)\d{2}\b/`) into a corner badge.

Then it builds the toolbar (search input + one chip per category) and wires a single `apply()` function: an entry is visible iff its group matches the active chip AND its text contains the search string (`textContent.toLowerCase().includes(q)`). Hiding = toggling a `.hidden` class; a group with zero visible entries hides its heading too. No indexes, no virtual DOM — 19 papers don't need them. The "Life" cards and stat chips follow the same philosophy: *markdown stays simple, JS upgrades it, CSS makes it pretty.*

---

## 9. Smaller techniques, quickly

- **Typewriter** — one function with `setTimeout`: type forward (62 ms/char), pause 2.4 s, delete (34 ms/char), next phrase. The blinking caret is CSS: `animation: blink 1s steps(1) infinite`. Phrases live in `PHRASES` at the top of `main.js`.
- **Dark mode** — every color on the site is a CSS variable in `:root`; `[data-theme="dark"]` redefines the same variables. The button toggles one attribute on `<html>`; `localStorage` remembers; first visit follows `prefers-color-scheme`.
- **Scroll-reveal** — elements start `.reveal { opacity: 0; transform: translateY(18px) }`. A checker measures `getBoundingClientRect().top < innerHeight*.94` and adds `.in` (which transitions to visible), then removes the element from its list — each reveals once.
- **Scroll progress bar** — `width = scrollY / (scrollHeight − innerHeight) × 100%` on a fixed 3 px gradient div.
- **Explore-card icons** — hand-written SVG polygons (beautified versions of the actual KTH tangram board figures). Each is ~1 line: `<svg viewBox="0 0 32 32"><polygon points="6,24 6,12 11,17 16,9 21,17 26,12 26,24"/></svg>` is the crown. Design your own on a 32×32 grid the same graph-paper way as tangram figures.
- **Clouds** — three blurred white pills (`filter: blur(18px); border-radius: 999px`) drifting across the hero with long `animation-duration`s; hidden in dark mode.
- **Nav grouping** — the nav is generated from `NAV_GROUPS` (an array of arrays); groups are joined with a 1 px `.nav-sep` divider. Publications/Projects pages set `data-page="research"` so the nav highlights their parent.

---

## 10. Recipes (fast reference)

| I want to… | Do this |
|---|---|
| Add a tangram figure | §3.3 — new `const FIGURE = [...]` + one line in `states` |
| Change piece colors | `TANGRAM_COLORS` in `main.js` |
| Change the notes / instrument | `SCALE` array / `osc.type` in `playNote` |
| Change typewriter phrases | `PHRASES` in `main.js` |
| Change any color | CSS variables at the top of `style.css` (both themes) |
| Add a news item | One `- **Month Year** —` line at the top of `content/news.md` |
| Add a publication | One paragraph under a `###` category in `content/publications.md` |
| Add a Life card | `### 🎯 Title` + paragraph in `content/life.md` |
| Add a stat chip | `:: number :: label` line in any md file |
| Add a whole page | Copy `teaching.html`, edit title/`data-page`/hero/`data-md`, add to `NAV_GROUPS` |
| Change the footer quote | `injectChrome()` in `main.js` (search "scariest") |

---

*Everything here is view-source-able. The best way to learn: open DevTools (⌥⌘I), change a number, watch what happens. The scariest moment is always just before you start.* 🦕
