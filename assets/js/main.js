/* ============================================================
   Po-Ya Angela Wang — personal site engine
   - multi-page: nav, footer, sky, waves injected on every page
   - tiny markdown renderer (no dependencies)
   - content loaded from content/*.md
   - tangram morphs, pentatonic sound, night sky, typewriter
   ============================================================ */

/* ----------------------- shared chrome ----------------------- */

// nav links, visually grouped: me | work | life
// (publications & projects live under Research — reachable from the Research
//  page and the home Explore cards; their pages highlight "Research" here)
const NAV_GROUPS = [
  [["index.html", "home", "Home"], ["about.html", "about", "About"]],
  [["research.html", "research", "Research"], ["teaching.html", "teaching", "Teaching"]],
  [["life.html", "life", "Life"], ["news.html", "news", "News & Contact"]],
];

function injectChrome() {
  const page = document.body.dataset.page || "home";

  const links = NAV_GROUPS.map(group => group.map(([href, id, label]) =>
    `<a href="${href}" ${id === page ? 'class="active"' : ""}>${label}</a>`).join(""))
    .join('<span class="nav-sep" aria-hidden="true"></span>');

  document.body.insertAdjacentHTML("afterbegin", `
    <div id="progress" aria-hidden="true"></div>
    <canvas id="sky" aria-hidden="true"></canvas>
    <div id="file-banner" hidden>
      Heads up: content can't load when this page is opened as a file.
      Run <code>python3 -m http.server</code> in this folder and open
      <code>http://localhost:8000</code> — or just deploy to GitHub Pages.
    </div>
    <nav id="nav">
      <a class="nav-name" href="index.html">P‑Y A W<span class="nav-dot">.</span></a>
      <div class="nav-links">${links}</div>
      <button id="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">🌗</button>
    </nav>`);

  // ocean waves right below the page's header
  const header = document.querySelector("header");
  if (header) header.insertAdjacentHTML("afterend", `
    <div class="waves" aria-hidden="true">
      <svg viewBox="0 0 2880 90" preserveAspectRatio="none">
        <path fill="var(--wave-1)" d="M0,50 C120,20 240,80 360,50 C480,20 600,80 720,50 C840,20 960,80 1080,50 C1200,20 1320,80 1440,50 C1560,20 1680,80 1800,50 C1920,20 2040,80 2160,50 C2280,20 2400,80 2520,50 C2640,20 2760,80 2880,50 L2880,90 L0,90 Z"/>
      </svg>
      <svg class="back" viewBox="0 0 2880 90" preserveAspectRatio="none">
        <path fill="var(--wave-2)" d="M0,55 C180,30 360,75 720,55 C1080,35 1260,75 1440,55 C1620,35 1800,75 2160,55 C2520,35 2700,75 2880,55 L2880,90 L0,90 Z"/>
      </svg>
    </div>`);

  document.body.insertAdjacentHTML("beforeend", `
    <footer id="contact">
      <h2><span class="sq"></span>Contact</h2>
      <div class="contact-grid">
        <div>
          <h3>Email</h3>
          <p><a href="mailto:d08142001@ntu.edu.tw">d08142001@ntu.edu.tw</a><br>
             <a href="mailto:differe94nt@gmail.com">differe94nt@gmail.com</a></p>
        </div>
        <div>
          <h3>Find me</h3>
          <p><a href="https://github.com/diff94" target="_blank" rel="noopener">GitHub</a> ·
             <a href="https://ntu-chai.github.io" target="_blank" rel="noopener">CHAI Future Lab</a>
             <!-- Paste your profile URLs into the two links below, then move them
                  outside this comment to make them visible:
             · <a href="PASTE-YOUR-SPOTIFY-URL" target="_blank" rel="noopener">Spotify</a>
             · <a href="PASTE-YOUR-INSTAGRAM-URL" target="_blank" rel="noopener">Instagram</a>
             --></p>
        </div>
        <div>
          <h3>Where</h3>
          <p>College of Liberal Arts,<br>National Taiwan University · Taipei</p>
        </div>
      </div>
      <p class="footer-note">
        "The scariest moment is always just before you start. After that, things can only get better."
        — Stephen King, <em>On Writing: A Memoir of the Craft</em>
        <span class="dino" title="My dissertation acknowledgements are a time capsule — full list sealed behind a QR code (with a dinosaur in it) until the thesis goes public in five years.">🦖</span>
      </p>
    </footer>
    <button id="to-top" aria-label="Back to top" title="Back to top">↑</button>`);
}

/* ----------------------- markdown ----------------------- */

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlineMd(s) {
  return s
    .replace(/`([^`]+)`/g, (_, c) => "<code>" + c + "</code>")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => {
      const ext = /^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${u}"${ext}>${t}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function mdToHtml(md) {
  const lines = md.replace(/\r/g, "").split("\n");
  const out = [];
  let para = [], list = null, stats = [];

  const flushPara = () => {
    if (para.length) { out.push("<p>" + inlineMd(para.join(" ")) + "</p>"); para = []; }
  };
  const flushList = () => {
    if (list) { out.push(`<${list.tag}>` + list.items.map(i => "<li>" + inlineMd(i) + "</li>").join("") + `</${list.tag}>`); list = null; }
  };
  const flushStats = () => {
    if (stats.length) {
      out.push('<div class="stats">' + stats.map(s =>
        `<div class="stat"><b>${inlineMd(s[0])}</b><span>${inlineMd(s[1])}</span></div>`).join("") + "</div>");
      stats = [];
    }
  };
  const flushAll = () => { flushPara(); flushList(); flushStats(); };

  for (const raw of lines) {
    const line = escapeHtml(raw);
    const t = line.trim();

    const stat = t.match(/^::\s*(.+?)\s*::\s*(.+)$/);
    if (stat) { flushPara(); flushList(); stats.push([stat[1], stat[2]]); continue; }
    flushStats();

    if (t === "") { flushAll(); continue; }

    const h = t.match(/^(#{1,4})\s+(.*)$/);
    if (h) { flushAll(); const lvl = Math.max(3, h[1].length); out.push(`<h${lvl}>` + inlineMd(h[2]) + `</h${lvl}>`); continue; }

    if (/^(-{3,}|\*{3,})$/.test(t)) { flushAll(); out.push("<hr>"); continue; }

    if (t.startsWith("&gt; ")) { flushAll(); out.push("<blockquote><p>" + inlineMd(t.slice(5)) + "</p></blockquote>"); continue; }

    const ul = t.match(/^[-*]\s+(.*)$/);
    const ol = t.match(/^\d+\.\s+(.*)$/);
    if (ul || ol) {
      flushPara();
      const tag = ul ? "ul" : "ol";
      if (!list || list.tag !== tag) { flushList(); list = { tag, items: [] }; }
      list.items.push((ul || ol)[1]);
      continue;
    }
    if (list) { list.items[list.items.length - 1] += " " + t; continue; }

    para.push(t);
  }
  flushAll();
  return out.join("\n");
}

/* ----------------------- content loading ----------------------- */

async function loadSections() {
  if (location.protocol === "file:") {
    document.getElementById("file-banner").hidden = false;
  }
  const sections = document.querySelectorAll("[data-md]");
  await Promise.all([...sections].map(async sec => {
    const body = sec.querySelector(".md-body");
    try {
      const res = await fetch(sec.dataset.md);
      if (!res.ok) throw new Error(res.status);
      body.innerHTML = mdToHtml(await res.text());
      const mode = sec.dataset.mode;
      if (mode === "pubs") enhancePubs(body);
      if (mode === "cards") enhanceCards(body);
      if (mode === "timeline") enhanceTimeline(body);
    } catch (e) {
      body.innerHTML = `<p><em>Couldn't load <code>${sec.dataset.md}</code>. If you opened this page as a local file, serve it instead: <code>python3 -m http.server</code></em></p>`;
    }
  }));
  initReveal();
}

/* ----------------------- publications ----------------------- */

function enhancePubs(body) {
  const groups = [];
  let current = null;
  [...body.children].forEach(el => {
    if (el.tagName === "H3") {
      current = { title: el.textContent.trim(), heading: el, items: [] };
      groups.push(current);
    } else if (current && el.tagName === "P") {
      current.items.push(el);
    }
  });
  if (!groups.length) return;

  groups.forEach(g => {
    const wrap = document.createElement("div");
    wrap.className = "pub-group";
    g.heading.before(wrap);
    wrap.appendChild(g.heading);
    g.items.forEach(p => {
      const entry = document.createElement("div");
      entry.className = "pub-entry";
      const y = p.textContent.match(/\b(19|20)\d{2}\b/);
      if (y) {
        const badge = document.createElement("span");
        badge.className = "pub-year";
        badge.textContent = y[0];
        entry.appendChild(badge);
      }
      wrap.appendChild(entry);
      entry.appendChild(p);
    });
    g.wrap = wrap;
  });

  const bar = document.createElement("div");
  bar.className = "pub-toolbar";
  const input = document.createElement("input");
  input.type = "search";
  input.placeholder = "Search publications… (author, venue, keyword)";
  bar.appendChild(input);

  const cats = ["All", ...groups.map(g => g.title)];
  const chips = cats.map(c => {
    const b = document.createElement("button");
    b.className = "pub-chip" + (c === "All" ? " active" : "");
    b.textContent = c;
    bar.appendChild(b);
    return b;
  });
  body.prepend(bar);

  let activeCat = "All";
  const apply = () => {
    const q = input.value.trim().toLowerCase();
    groups.forEach(g => {
      const groupOn = activeCat === "All" || g.title === activeCat;
      let any = false;
      g.wrap.querySelectorAll(".pub-entry").forEach(e => {
        const on = groupOn && (!q || e.textContent.toLowerCase().includes(q));
        e.classList.toggle("hidden", !on);
        any = any || on;
      });
      g.wrap.classList.toggle("hidden", !any);
    });
  };
  input.addEventListener("input", apply);
  chips.forEach(chip => chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeCat = chip.textContent;
    apply();
  }));
}

/* ----------------------- cards + timeline ----------------------- */

function enhanceCards(body) {
  const grid = document.createElement("div");
  grid.className = "cards";
  let intro = [];
  let card = null;
  [...body.children].forEach(el => {
    if (el.tagName === "H3") {
      card = document.createElement("div");
      card.className = "card";
      card.appendChild(el);
      grid.appendChild(card);
    } else if (card) {
      card.appendChild(el);
    } else {
      intro.push(el);
    }
  });
  body.innerHTML = "";
  intro.forEach(el => body.appendChild(el));
  body.appendChild(grid);
}

function enhanceTimeline(body) {
  body.querySelectorAll("ul").forEach(ul => ul.classList.add("timeline"));
}

/* ----------------------- news teaser (home) ----------------------- */

async function initNewsTeaser() {
  const ul = document.getElementById("news-teaser");
  if (!ul) return;
  try {
    const md = await (await fetch("content/news.md")).text();
    const items = md.split("\n").filter(l => l.trim().startsWith("- ")).slice(0, 3);
    ul.innerHTML = items.map(l => "<li>" + inlineMd(escapeHtml(l.trim().slice(2))) + "</li>").join("");
    ul.classList.add("timeline");
  } catch (e) { /* home still works without the teaser */ }
}

/* ----------------------- tangram ----------------------- */

// ocean / sky / star palette — one hue per piece, one note per piece
const TANGRAM_COLORS = ["#56a8e8", "#1f6fa8", "#9fd0f0", "#f0a832", "#7cc26b", "#f6c445", "#14a08c"];

// classic square dissection, in an 8x8 grid (scaled + centred at render time)
const SQUARE_RAW = [
  [[0, 0], [0, 8], [4, 4]],
  [[0, 0], [8, 0], [4, 4]],
  [[4, 8], [8, 8], [8, 4]],
  [[0, 8], [2, 6], [4, 8]],
  [[4, 4], [6, 6], [6, 2]],
  [[2, 6], [4, 8], [6, 6], [4, 4]],
  [[6, 6], [8, 4], [8, 0], [6, 2]],
];

// swan, drawn directly in the 16x12 viewBox (y down)
const SWAN = [
  [[3, 10], [11, 10], [7, 6]],
  [[11, 10], [7, 6], [15, 6]],
  [[11, 10], [15, 10], [15, 6]],
  [[1, 4], [3, 6], [3, 2]],
  [[11.8, 6], [11.8, 3.2], [14.6, 6]],
  [[9, 6], [11.8, 6], [11.8, 3.2], [9, 3.2]],
  [[3, 10], [1, 8], [1, 4], [3, 6]],
];

// brontosaurus, long neck up-left (16x12 viewBox, y down)
const DINO = [
  [[2, 9], [10, 9], [6, 5]],                                // body front
  [[10, 9], [6, 5], [14, 5]],                               // body back
  [[14, 5], [10, 9], [14, 9]],                              // tail
  [[4, 3], [2, 5], [0, 3]],                                 // head
  [[3, 9], [5.8, 9], [3, 11.8]],                            // front leg
  [[10.5, 9], [13.3, 9], [13.3, 11.8], [10.5, 11.8]],       // back leg
  [[2, 9], [4, 7], [4, 3], [2, 5]],                         // neck
];

// sailboat riding two waves (16x12 viewBox, y down)
const BOAT = [
  [[8, 1], [8, 6.66], [2.34, 6.66]],
  [[8.7, 6.66], [8.7, 1], [14.36, 6.66]],
  [[1, 11.5], [6.66, 11.5], [3.83, 8.67]],
  [[4, 7.33], [6.83, 7.33], [6.83, 10.16]],
  [[9.66, 7.33], [12.49, 7.33], [9.66, 10.16]],
  [[6.83, 7.33], [9.66, 7.33], [9.66, 10.16], [6.83, 10.16]],
  [[9.5, 11.5], [13.5, 11.5], [15.5, 9.5], [11.5, 9.5]],
];

function transformConfig(cfg, s, tx, ty) {
  return cfg.map(poly => poly.map(([x, y]) => [x * s + tx, y * s + ty]));
}

const SQUARE = transformConfig(SQUARE_RAW, 1.1, 3.6, 1.6);

function centroid(poly) {
  const n = poly.length;
  return [poly.reduce((a, p) => a + p[0], 0) / n, poly.reduce((a, p) => a + p[1], 0) / n];
}

function burstConfig() {
  const cx = 8, cy = 6;
  return SQUARE.map(poly => {
    const [px, py] = centroid(poly);
    let dx = px - cx, dy = py - cy;
    const len = Math.hypot(dx, dy) || 1;
    const push = 1.2 + Math.random() * 1.6;
    dx = dx / len * push; dy = dy / len * push;
    const ang = (Math.random() * 90 - 45) * Math.PI / 180;
    const cos = Math.cos(ang), sin = Math.sin(ang);
    return poly.map(([x, y]) => {
      const rx = x - px, ry = y - py;
      return [px + rx * cos - ry * sin + dx, py + rx * sin + ry * cos + dy];
    });
  });
}

function initTangram() {
  const svg = document.getElementById("tangram");
  const nameEl = document.getElementById("tangram-name");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const polys = TANGRAM_COLORS.map((color, i) => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    p.setAttribute("fill", color);
    p.addEventListener("mouseenter", () => playNote(i));
    svg.appendChild(p);
    return p;
  });

  let current = burstConfig();
  const draw = cfg => {
    current = cfg;
    cfg.forEach((poly, i) =>
      polys[i].setAttribute("points", poly.map(pt => pt.join(",")).join(" ")));
  };
  draw(current);

  // frame scheduler: rAF for smoothness, with a timer safety-net so the
  // animation still completes when rAF is throttled (background tabs etc.)
  let rafId = 0, toId = 0;
  const schedule = fn => {
    let called = false;
    const once = () => { if (!called) { called = true; fn(); } };
    rafId = requestAnimationFrame(once);
    toId = setTimeout(once, 45);
  };
  const stopAnim = () => { cancelAnimationFrame(rafId); clearTimeout(toId); };

  function morphTo(target, dur = 900) {
    stopAnim();
    if (reduced) { draw(target); return; }
    const from = current.map(poly => poly.map(pt => [...pt]));
    const t0 = performance.now();
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    (function step() {
      const t = Math.min(1, (performance.now() - t0) / dur);
      const k = ease(t);
      draw(from.map((poly, i) => poly.map((pt, j) => [
        pt[0] + (target[i][j][0] - pt[0]) * k,
        pt[1] + (target[i][j][1] - pt[1]) * k,
      ])));
      if (t < 1) schedule(step);
    })();
  }

  const states = [
    { name: "a swan 🦢", get: () => SWAN },
    { name: "a sailboat ⛵", get: () => BOAT },
    { name: "a dinosaur 🦕", get: () => DINO },
    { name: "the classic square", get: () => SQUARE },
    { name: "high-entropy chaos ✨", get: burstConfig },
  ];
  let idx = 0;
  const next = () => {
    const s = states[idx % states.length];
    morphTo(s.get());
    nameEl.textContent = s.name;
    [0, 2, 4, 6].forEach((n, k) => playNote(n, k * .09, .05));
    idx++;
  };
  svg.addEventListener("click", next);
  document.getElementById("tangram-btn").addEventListener("click", next);

  setTimeout(() => {
    morphTo(SWAN);
    nameEl.textContent = states[0].name;
    idx = 1;
  }, reduced ? 0 : 450);
}

/* ----------------------- sound (Web Audio, no assets) ----------------------- */

const SCALE = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66];
let audioCtx = null;
let soundOn = localStorage.getItem("amber-sound") !== "off";

function playNote(i, delay = 0, vol = 0.07) {
  if (!soundOn) return;
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch (e) { return; }
  const t = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = SCALE[i % SCALE.length];
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + .02);
  gain.gain.exponentialRampToValueAtTime(.0001, t + 1.1);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + 1.2);
}

function initSound() {
  const btn = document.getElementById("sound-toggle");
  if (!btn) return;
  const label = () => { btn.textContent = soundOn ? "🎵 sound on" : "🔇 sound off"; };
  label();
  btn.addEventListener("click", () => {
    soundOn = !soundOn;
    localStorage.setItem("amber-sound", soundOn ? "on" : "off");
    label();
    if (soundOn) playNote(0);
  });
}

/* ----------------------- specimen figures (KTH homage) ----------------------- */

// beautified silhouettes of figures from the KTH tangram board
function initSpecimens() {
  document.querySelectorAll(".specimen").forEach((el, i) => {
    el.addEventListener("mouseenter", () => playNote(i + 1, 0, .05));
  });
}

/* ----------------------- night sky (stars, aurora, meteors) ----------------------- */

function initSky() {
  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stars = [], meteor = null, nextMeteor = 4000, raf = null;

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    stars = Array.from({ length: Math.min(180, innerWidth / 6) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * .85,
      r: Math.random() * 1.3 + .4,
      tw: Math.random() * Math.PI * 2,
      sp: .5 + Math.random() * 1.5,
    }));
  }
  addEventListener("resize", resize);
  resize();

  function aurora(t) {
    [{ hue: "79, 216, 184", base: .16, amp: 34, k: .0016, sp: .00006, a: .07 },
     { hue: "110, 193, 255", base: .24, amp: 46, k: .0011, sp: -.00004, a: .05 }]
    .forEach(rb => {
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += 16) {
        const y = canvas.height * rb.base + Math.sin(x * rb.k + t * rb.sp) * rb.amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      for (let x = canvas.width; x >= 0; x -= 16) {
        const y = canvas.height * rb.base + Math.sin(x * rb.k + t * rb.sp) * rb.amp + 110;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      const g = ctx.createLinearGradient(0, canvas.height * rb.base - 60, 0, canvas.height * rb.base + 130);
      g.addColorStop(0, `rgba(${rb.hue}, 0)`);
      g.addColorStop(.45, `rgba(${rb.hue}, ${rb.a})`);
      g.addColorStop(1, `rgba(${rb.hue}, 0)`);
      ctx.fillStyle = g;
      ctx.fill();
    });
  }

  function frame(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    aurora(t);
    ctx.fillStyle = "#ffffff";
    for (const s of stars) {
      ctx.globalAlpha = .25 + .75 * Math.abs(Math.sin(s.tw + t * .001 * s.sp));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 7);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!meteor && t > nextMeteor) {
      meteor = { x: Math.random() * canvas.width * .8 + canvas.width * .1, y: Math.random() * canvas.height * .3, vx: -5 - Math.random() * 3, vy: 2.5 + Math.random() * 1.5, life: 1 };
      nextMeteor = t + 6000 + Math.random() * 9000;
    }
    if (meteor) {
      const m = meteor;
      const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
      g.addColorStop(0, `rgba(255, 240, 200, ${.9 * m.life})`);
      g.addColorStop(1, "rgba(255, 240, 200, 0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14);
      ctx.stroke();
      m.x += m.vx; m.y += m.vy; m.life -= .016;
      if (m.life <= 0) meteor = null;
    }
    raf = requestAnimationFrame(frame);
  }

  function sync() {
    const dark = document.documentElement.dataset.theme === "dark";
    canvas.style.opacity = dark ? "1" : "0";
    if (dark && raf === null) {
      if (reduced) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        aurora(0);
        ctx.fillStyle = "#ffffff";
        stars.forEach(s => { ctx.globalAlpha = .6; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill(); });
        ctx.globalAlpha = 1;
      } else {
        raf = requestAnimationFrame(frame);
      }
    } else if (!dark && raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }
  sync();
  return sync;
}

/* ----------------------- scroll progress ----------------------- */

function initProgress() {
  const bar = document.getElementById("progress");
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? Math.min(100, scrollY / max * 100) : 0) + "%";
  };
  addEventListener("scroll", update, { passive: true });
  setInterval(update, 400);
  update();
}

/* ----------------------- typewriter ----------------------- */

const PHRASES = [
  "a computational linguist",
  "a psycholinguist of humans & machines",
  "an MLLM-agent choreographer",
  "an AI × language-pedagogy designer",
  "a design-thinking coach",
  "a fencer, dancer & aurora chaser",
];

function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let pi = 0, ci = PHRASES[0].length, deleting = true;
  (function tick() {
    const phrase = PHRASES[pi % PHRASES.length];
    el.textContent = phrase.slice(0, ci);
    let delay = deleting ? 34 : 62;
    if (deleting) {
      ci--;
      if (ci < 0) { deleting = false; pi++; ci = 0; delay = 350; }
    } else {
      ci++;
      if (ci > phrase.length) { deleting = true; ci = phrase.length; delay = 2400; }
    }
    setTimeout(tick, delay);
  })();
}

/* ----------------------- theme, reveal, to-top ----------------------- */

function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("amber-theme");
  if (saved) document.documentElement.dataset.theme = saved;
  else if (matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.dataset.theme = "dark";
  btn.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = cur;
    localStorage.setItem("amber-theme", cur);
  });
}

function initReveal() {
  let els = [...document.querySelectorAll(".md-body > *, .contact-grid > div, .explore-card, #news-teaser li")];
  els.forEach(el => el.classList.add("reveal"));
  const check = () => {
    els = els.filter(el => {
      if (el.getBoundingClientRect().top < innerHeight * .94) {
        el.classList.add("in");
        return false;
      }
      return true;
    });
    if (!els.length) removeEventListener("scroll", check);
  };
  addEventListener("scroll", check, { passive: true });
  const timer = setInterval(() => { // fallback for environments with unreliable scroll events
    check();
    if (!els.length) clearInterval(timer);
  }, 250);
  check();
}

function initToTop() {
  const btn = document.getElementById("to-top");
  addEventListener("scroll", () => btn.classList.toggle("show", scrollY > 600), { passive: true });
  btn.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
}

/* ----------------------- go ----------------------- */

injectChrome();
initTheme();
const syncSky = initSky();
document.getElementById("theme-toggle").addEventListener("click", syncSky);
initSound();
initProgress();
initToTop();
if (document.getElementById("tangram")) initTangram();
if (document.getElementById("typewriter")) initTypewriter();
initSpecimens();
initNewsTeaser();
loadSections();
