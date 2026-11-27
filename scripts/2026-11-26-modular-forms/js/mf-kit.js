/* Modular forms series: what every figure shares.  Typesetting, theme colours,
   a canvas wrapper that repaints only when needed, pointer handling, plane and
   half-plane views, domain colouring, the modular tessellation, and the timeline
   strip at the head of each post. */
(function () {
  'use strict';
  const C = window.MFC, TAU = 2 * Math.PI;

  /* ---- mathematics: kramdown leaves \( \) and \[ \] in the text; hand them to the KaTeX
     that the site's head loads ---- */
  /* Each post asks the site's MathJax to skip its automatic pass.  If the site's KaTeX did not
     load, hand the formulas back to MathJax, waiting for it if it is still on its way. */
  function mathjaxInstead(root, tries) {
    const hub = window.MathJax && window.MathJax.Hub;
    if (hub) hub.Queue(['Typeset', hub, root]);
    else if (tries < 20) setTimeout(() => mathjaxInstead(root, tries + 1), 500);
  }
  function typeset() {
    const root = document.querySelector('.post-content');
    if (!root) return;
    if (!window.katex) { mathjaxInstead(root, 0); return; }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = []; let n;
    while ((n = walker.nextNode())) {
      if (n.nodeValue.indexOf('\\(') < 0 && n.nodeValue.indexOf('\\[') < 0) continue;
      if (n.parentNode.closest('script, style, textarea, pre, code')) continue;
      nodes.push(n);
    }
    const re = /\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;
    nodes.forEach(node => {
      const text = node.nodeValue, frag = document.createDocumentFragment(); let last = 0, m;
      re.lastIndex = 0;
      while ((m = re.exec(text))) {
        const display = m[2] !== undefined, el = document.createElement(display ? 'div' : 'span');
        if (display) el.className = 'eq';
        try { window.katex.render(display ? m[2] : m[1], el, { displayMode: display, throwOnError: false }); } catch (e) { continue; }
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        frag.appendChild(el); last = m.index + m[0].length;
      }
      if (!last) return;
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  /* ---- theme ---- */
  let T = null;
  function theme() {
    if (T) return T;
    const cs = getComputedStyle(document.documentElement); T = {};
    for (const k of ['bg', 'panel', 'ink', 'soft', 'faint', 'rule', 'blue', 'red', 'teal', 'gold', 'violet']) T[k] = cs.getPropertyValue('--' + k).trim();
    return T;
  }
  const rgb = hex => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const alpha = (hex, a) => { const c = rgb(hex); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
  const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';

  /* ---- canvas wrapper ---- */
  const figs = [];
  function seen(f) { const r = f.c.getBoundingClientRect(); return r.width > 0 && r.bottom > -200 && r.top < window.innerHeight + 200; }
  function checkVisible() { for (const f of figs) { const v = seen(f); if (v && !f.visible) { f.visible = true; f.dirty(); } else f.visible = v; } }
  window.addEventListener('scroll', checkVisible, { passive: true });
  window.addEventListener('resize', () => { figs.forEach(f => f.resize()); checkVisible(); });
  window.addEventListener('load', checkVisible);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) figs.forEach(f => f.dirty()); });
  window.addEventListener('pageshow', () => figs.forEach(f => f.dirty()));

  class Fig {
    constructor(canvas, draw, opts) {
      if (typeof canvas === 'string') canvas = document.getElementById(canvas);
      this.c = canvas; this.ctx = canvas.getContext('2d'); this.drawFn = draw; this.opts = opts || {};
      this.w = 0; this.h = 0; this.dpr = 1; this.visible = false; this.needs = true; this.raf = 0; this.last = 0;
      new ResizeObserver(() => this.resize()).observe(canvas);
      figs.push(this); this.resize();
    }
    resize() {
      const w = this.c.clientWidth, h = this.c.clientHeight; if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      this.visible = seen(this);
      if (w === this.w && h === this.h && dpr === this.dpr) { this.kick(); return; }
      this.dpr = dpr; this.w = w; this.h = h;
      this.c.width = Math.round(w * dpr); this.c.height = Math.round(h * dpr);
      this.dirty();
    }
    dirty() { this.needs = true; this.kick(); }
    kick() { if (!this.raf && this.visible && this.w) this.raf = requestAnimationFrame(t => this.frame(t)); }
    frame(t) {
      this.raf = 0;
      const dt = this.last ? Math.min(0.05, (t - this.last) / 1000) : 0; this.last = t;
      const more = this.opts.tick ? !!this.opts.tick(dt) : false;
      if (this.needs || more) {
        this.needs = false; const ctx = this.ctx;
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); ctx.clearRect(0, 0, this.w, this.h);
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        this.drawFn(ctx, this.w, this.h, this);
      }
      if (more && this.visible) this.kick(); else this.last = 0;
    }
  }

  /* ---- pointer handling: drag whatever hit() returns, tap elsewhere ---- */
  function pointer(fig, h) {
    const c = fig.c; let drag = null, down = null;
    const pos = e => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    c.addEventListener('pointerdown', e => {
      if (e.button) return; const [x, y] = pos(e); down = [x, y, false];
      const tgt = h.hit ? h.hit(x, y, e.pointerType) : null;
      if (tgt !== null && tgt !== undefined) {
        drag = tgt; try { c.setPointerCapture(e.pointerId); } catch (_) { /* older browsers */ }
        if (h.start) h.start(drag, x, y); if (h.move) h.move(drag, x, y);
        c.style.cursor = 'grabbing'; if (e.pointerType === 'mouse') e.preventDefault();
      }
    });
    c.addEventListener('pointermove', e => {
      const [x, y] = pos(e);
      if (down && Math.hypot(x - down[0], y - down[1]) > 6) down[2] = true;
      if (drag !== null) { if (h.move) h.move(drag, x, y); }
      else if (e.pointerType === 'mouse') {
        const t = h.hit ? h.hit(x, y, 'mouse') : null;
        c.style.cursor = (t !== null && t !== undefined) ? 'grab' : '';
        if (h.hover) h.hover(x, y);
      }
    });
    const up = e => {
      const [x, y] = pos(e);
      if (drag !== null) { if (h.end) h.end(drag); drag = null; c.style.cursor = ''; }
      else if (down && !down[2] && h.tap && e.type === 'pointerup') h.tap(x, y);
      down = null;
    };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
    c.addEventListener('pointerleave', () => { if (drag === null && h.hover) h.hover(null, null); });
    c.addEventListener('touchstart', e => {
      const t = e.touches[0], r = c.getBoundingClientRect();
      const tgt = h.hit ? h.hit(t.clientX - r.left, t.clientY - r.top, 'touch') : null;
      if (tgt !== null && tgt !== undefined) e.preventDefault();
    }, { passive: false });
  }

  /* ---- a view: the maths rectangle [x0,x1] x [y0,y1] fitted into a pixel box, same scale both ways ---- */
  function view(px, py, pw, ph, x0, x1, y0, y1, anchor) {
    const s = Math.min(pw / (x1 - x0), ph / (y1 - y0));
    const cx = (x0 + x1) / 2, ox = px + pw / 2 - s * cx;
    // anchor 'bottom' keeps y0 on the bottom edge of the box (used for the half-plane)
    const oy = anchor === 'bottom' ? py + ph + s * y0 : py + ph / 2 + s * (y0 + y1) / 2;
    const V = { s, px, py, pw, ph, X: u => ox + s * u, Y: v => oy - s * v, ux: p => (p - ox) / s, uy: p => (oy - p) / s };
    V.x0 = V.ux(px); V.x1 = V.ux(px + pw); V.y0 = V.uy(py + ph); V.y1 = V.uy(py);
    V.has = (x, y) => x >= px && x <= px + pw && y >= py && y <= py + ph;
    return V;
  }
  function clipTo(ctx, V, fn) { ctx.save(); ctx.beginPath(); ctx.rect(V.px, V.py, V.pw, V.ph); ctx.clip(); fn(); ctx.restore(); }

  /* ---- small drawing helpers ---- */
  function dot(ctx, x, y, r, fill, stroke, lw) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.5; ctx.stroke(); } }
  function line(ctx, x0, y0, x1, y1, col, lw, dash) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.strokeStyle = col; ctx.lineWidth = lw || 1; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]); }
  function arrow(ctx, x0, y0, x1, y1, col, lw) {
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0), hd = Math.min(11, L * 0.4);
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw || 2;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - Math.cos(a) * hd * 0.7, y1 - Math.sin(a) * hd * 0.7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - hd * Math.cos(a - 0.4), y1 - hd * Math.sin(a - 0.4)); ctx.lineTo(x1 - hd * Math.cos(a + 0.4), y1 - hd * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
  }
  /* text with a halo of the background colour so it stays legible over lines */
  function label(ctx, s, x, y, o) {
    o = o || {}; const th = theme();
    ctx.font = (o.italic ? 'italic ' : '') + (o.bold ? '600 ' : '') + (o.size || 13) + 'px ' + (o.serif ? SERIF : SANS);
    ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle';
    if (o.halo !== false) { ctx.lineWidth = o.haloW || 3.5; ctx.strokeStyle = o.haloCol || th.bg; ctx.strokeText(s, x, y); }
    ctx.fillStyle = o.col || th.ink; ctx.fillText(s, x, y);
  }
  function panel(ctx, x, y, w, h, title) {
    const th = theme();
    ctx.fillStyle = th.panel; ctx.strokeStyle = th.rule; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, 9); ctx.fill(); ctx.stroke();
    if (title) label(ctx, title, x + 12, y + 16, { size: 11.5, col: th.soft, halo: false, bold: true });
  }

  /* ---- domain colouring ----
     colour = direction of the complex value (red positive, cyan negative), light = large, dark = small,
     with a step in brightness each time the size doubles. */
  function colourInto(d, i, re, im, mag, gain) {
    const m = mag === undefined ? Math.hypot(re, im) : mag;
    if (!(m === m) || !isFinite(re) || !isFinite(im)) { d[i] = d[i + 1] = d[i + 2] = 245; d[i + 3] = 255; return; }
    const h = Math.atan2(im, re), lg = Math.log2(m + 1e-300);
    let r = 0.54 + 0.42 * Math.cos(h), g = 0.54 + 0.42 * Math.cos(h - TAU / 3), b = 0.54 + 0.42 * Math.cos(h + TAU / 3);
    const t = Math.tanh(lg * gain), fr = lg - Math.floor(lg), step = 0.9 + 0.1 * fr;
    if (t < 0) { const k = (1 + 0.88 * t) * step; r *= k; g *= k; b *= k; }
    else { const k = 0.85 * t; r = (r + (1 - r) * k) * step; g = (g + (1 - g) * k) * step; b = (b + (1 - b) * k) * step; }
    d[i] = 255 * r; d[i + 1] = 255 * g; d[i + 2] = 255 * b; d[i + 3] = 255;
  }
  class Field {
    /* fn(u, v, out): complex value at the maths point (u, v); may set out[2] to the size to shade by */
    constructor(fig, fn, opts) { this.fig = fig; this.fn = fn; this.opts = opts || {}; this.key = null; this.cv = document.createElement('canvas'); this.fine = false; this.timer = 0; }
    render(V, cell) {
      const cols = Math.max(2, Math.round(V.pw / cell)), rows = Math.max(2, Math.round(V.ph / cell));
      this.cv.width = cols; this.cv.height = rows;
      const g = this.cv.getContext('2d'), img = g.createImageData(cols, rows), d = img.data, out = new Float64Array(3), gain = this.opts.gain || 0.35;
      for (let r = 0; r < rows; r++) {
        const v = V.uy(V.py + (r + 0.5) * V.ph / rows);
        for (let c = 0; c < cols; c++) {
          const u = V.ux(V.px + (c + 0.5) * V.pw / cols); out[2] = NaN;
          this.fn(u, v, out);
          colourInto(d, 4 * (r * cols + c), out[0], out[1], out[2] === out[2] ? out[2] : undefined, gain);
        }
      }
      g.putImageData(img, 0, 0);
    }
    draw(ctx, V, key) {
      if (key !== this.key) {
        this.key = key; this.fine = false; this.render(V, this.opts.coarse || 4);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => { if (this.key !== key) return; this.render(V, Math.max(1, 1.5 / this.fig.dpr)); this.fine = true; this.fig.dirty(); }, this.opts.delay || 140);
      }
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(this.cv, V.px, V.py, V.pw, V.ph);
    }
  }
  /* a small colour wheel explaining the colouring */
  function wheel(ctx, cx, cy, r) {
    const th = theme();
    for (let i = 0; i < 72; i++) {
      const a0 = i / 72 * TAU, a1 = (i + 1.2) / 72 * TAU, h = (a0 + a1) / 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, -a1, -a0); ctx.closePath();
      ctx.fillStyle = `rgb(${255 * (0.54 + 0.42 * Math.cos(h)) | 0},${255 * (0.54 + 0.42 * Math.cos(h - TAU / 3)) | 0},${255 * (0.54 + 0.42 * Math.cos(h + TAU / 3)) | 0})`; ctx.fill();
    }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, 'rgba(0,0,0,0.85)'); g.addColorStop(0.5, 'rgba(0,0,0,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0.7)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = th.faint; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
    const o = { size: 10.5, align: 'center', col: th.ink };
    label(ctx, '+1', cx + r + 11, cy, o); label(ctx, '−1', cx - r - 11, cy, o); label(ctx, 'i', cx, cy - r - 8, o); label(ctx, '−i', cx, cy + r + 9, o);
  }

  /* ---- the modular group's tiling of the upper half-plane ---- */
  const RHO = [-0.5, Math.sqrt(3) / 2], RHO1 = [0.5, Math.sqrt(3) / 2];
  function mobius(g, x, y) { // g = [a,b,c,d]; returns [x', y'] (y' = Infinity for the point at infinity)
    const [a, b, c, d] = g;
    if (y === Infinity) return c === 0 ? [0, Infinity] : [a / c, 0];
    const dr = c * x + d, di = c * y, n = dr * dr + di * di;
    if (n < 1e-300) return [0, Infinity];
    return [((a * x + b) * dr + a * y * di) / n, (a * y * dr - (a * x + b) * di) / n];
  }
  const gmul = (g, h) => [g[0] * h[0] + g[1] * h[2], g[0] * h[1] + g[1] * h[3], g[2] * h[0] + g[3] * h[2], g[2] * h[1] + g[3] * h[3]];
  const gkey = g => (g[2] < 0 || (g[2] === 0 && g[3] < 0)) ? `${-g[0]},${-g[1]},${-g[2]},${-g[3]}` : g.join(',');
  /* every tile gamma(F) that is at least minIm tall and meets [xmin, xmax] */
  function tiles(xmin, xmax, minIm) {
    const out = [], seenT = new Set(), queue = [];
    for (let n = Math.floor(xmin) - 1; n <= Math.ceil(xmax) + 1; n++) { const g = [1, n, 0, 1]; seenT.add(gkey(g)); queue.push(g); }
    const gens = [[0, -1, 1, 0], [1, 1, 0, 1], [1, -1, 0, 1]];
    while (queue.length && out.length < 6000) {
      const g = queue.shift(); out.push(g);
      for (const s of gens) {
        const h = gmul(g, s), k = gkey(h); if (seenT.has(k)) continue;
        const im = 1 / (h[2] * h[2] + h[3] * h[3]); if (im < minIm) continue;
        const re = (h[0] * h[2] + h[1] * h[3]) * im; if (re < xmin - 1.2 || re > xmax + 1.2) continue;
        seenT.add(k); queue.push(h);
      }
    }
    return out;
  }
  /* trace the geodesic from p to q (points of the half-plane, or cusps with y = 0 or Infinity) */
  function geodesic(ctx, V, p, q, top, move) {
    const vert = p[1] === Infinity || q[1] === Infinity || Math.abs(p[0] - q[0]) < 1e-12;
    if (vert) {
      const x = p[1] === Infinity ? q[0] : p[0], ya = p[1] === Infinity ? top : p[1], yb = q[1] === Infinity ? top : q[1];
      if (move) ctx.moveTo(V.X(x), V.Y(ya)); else ctx.lineTo(V.X(x), V.Y(ya)); ctx.lineTo(V.X(x), V.Y(yb)); return;
    }
    const c = (p[0] * p[0] + p[1] * p[1] - q[0] * q[0] - q[1] * q[1]) / (2 * (p[0] - q[0])), r = Math.hypot(p[0] - c, p[1]);
    const a0 = Math.atan2(p[1], p[0] - c), a1 = Math.atan2(q[1], q[0] - c), n = Math.max(3, Math.min(40, Math.ceil(Math.abs(a1 - a0) * r * V.s / 5)));
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n, x = V.X(c + r * Math.cos(a)), y = V.Y(r * Math.sin(a)); if (i === 0 && move) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
  }
  function tilePath(ctx, V, g, top) {
    const a = mobius(g, RHO[0], RHO[1]), b = mobius(g, RHO1[0], RHO1[1]), c = mobius(g, 0, Infinity);
    ctx.beginPath(); geodesic(ctx, V, a, b, top, true); geodesic(ctx, V, b, c, top, false); geodesic(ctx, V, c, a, top, false); ctx.closePath();
  }
  /* draw the whole tessellation in the view; returns nothing */
  const tessCache = new Map();
  function tessellation(ctx, V, col, lw) {
    const key = [V.x0.toFixed(3), V.x1.toFixed(3), V.s.toFixed(2)].join('|');
    let list = tessCache.get(key);
    if (!list) { list = tiles(V.x0, V.x1, 2.2 / V.s); if (tessCache.size > 12) tessCache.clear(); tessCache.set(key, list); }
    const top = V.y1 + 1;
    ctx.beginPath();
    for (const g of list) {
      const a = mobius(g, RHO[0], RHO[1]), b = mobius(g, RHO1[0], RHO1[1]), c = mobius(g, 0, Infinity);
      geodesic(ctx, V, a, b, top, true); geodesic(ctx, V, a, c, top, true); geodesic(ctx, V, b, c, top, true);
    }
    ctx.strokeStyle = col; ctx.lineWidth = lw || 0.8; ctx.stroke();
  }
  /* axis of the half-plane with ticks at the integers */
  function halfPlaneAxis(ctx, V, opts) {
    const th = theme(); opts = opts || {};
    line(ctx, V.px, V.Y(0), V.px + V.pw, V.Y(0), th.soft, 1.2);
    for (let n = Math.ceil(V.x0); n <= Math.floor(V.x1); n++) {
      line(ctx, V.X(n), V.Y(0), V.X(n), V.Y(0) + 4, th.soft, 1);
      label(ctx, String(n).replace('-', '−'), V.X(n), V.Y(0) + 13, { size: 11, align: 'center', col: th.soft, halo: false });
    }
    for (let n = Math.ceil(V.x0 - 0.5); n + 0.5 <= V.x1; n++) { line(ctx, V.X(n + 0.5), V.Y(0), V.X(n + 0.5), V.Y(0) + 3, th.soft, 1); if (opts.half || V.x1 - V.x0 < 2.2) label(ctx, (n < 0 ? '−' : '') + (Math.abs(2 * n + 1) === 1 ? '' : Math.abs(2 * n + 1)) + '½'.replace('½', Math.abs(2 * n + 1) === 1 ? '½' : '/2'), V.X(n + 0.5), V.Y(0) + 13, { size: 11, align: 'center', col: th.soft, halo: false }); }
  }

  /* ---- formatting ---- */
  const minus = s => s.replace(/-/g, '−');
  const fmt = (x, d) => minus((Math.abs(x) < 0.5 * Math.pow(10, -(d === undefined ? 3 : d)) ? 0 : x).toFixed(d === undefined ? 3 : d));
  function cfmt(re, im, d) { const a = fmt(re, d), b = fmt(Math.abs(im), d); return a + (im < 0 ? ' − ' : ' + ') + b + 'i'; }
  const big = n => minus(String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  const $ = id => document.getElementById(id);
  function onReady(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  /* a group of buttons acting as a selector: <div class="seg" id=...><button data-v=...> */
  function seg(id, value, cb) {
    const el = $(id); if (!el) return () => value;
    const set = v => { value = v; el.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === String(v)))); };
    el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; set(b.dataset.v); cb(b.dataset.v); });
    set(value); return () => value;
  }

  /* ---- the timeline at the head of each post ---- */
  const EVENTS = [
    [1718, 'Fagnano doubles the lemniscate arc', 1], [1751, 'Euler’s addition theorem', 1], [1797, 'Gauss inverts the integral', 1], [1799, 'Gauss and the AGM', 1], [1827, 'Abel and Jacobi publish', 1],
    [1829, 'Jacobi’s Fundamenta Nova', 2], [1847, 'Eisenstein’s lattice sums', 2], [1862, 'Weierstrass’s ℘', 2], [1877, 'Dedekind’s invariant', 2], [1879, 'Klein’s tessellations', 2], [1882, 'Poincaré: hyperbolic geometry', 2],
    [1829, 'Jacobi: four squares', 3], [1859, 'Riemann uses θ for ζ', 3], [1916, 'Ramanujan’s τ(n)', 3], [1917, 'Mordell proves multiplicativity', 3], [1937, 'Hecke operators', 3],
    [1936, 'Hasse’s bound', 4], [1954, 'Eichler: X₀(11)', 4], [1955, 'Taniyama’s question', 4], [1967, 'Weil: conductor = level', 4], [1995, 'Wiles and Taylor', 4], [2001, 'Modularity theorem complete', 4],
    [1826, 'Abel’s theorem', 5], [1832, 'Jacobi’s inversion problem', 5], [1847, 'Göpel solves genus 2', 5], [1857, 'Riemann’s period matrix', 5], [1935, 'Siegel: quadratic forms', 5], [1939, 'Siegel modular forms', 5],
    [1978, 'Saito–Kurokawa lifts', 6], [1980, 'Yoshida’s conjecture', 6], [2007, 'Roberts–Schmidt newforms', 6], [2014, 'Brumer–Kramer conjecture', 6], [2017, 'Johnson-Leung–Roberts twists', 6], [2019, 'Conductor 277 proved', 6], [2025, 'A positive proportion', 6],
  ];
  function timeline() {
    document.querySelectorAll('.mf-timeline').forEach(host => {
      const part = +host.dataset.part, th = theme(), NS = 'http://www.w3.org/2000/svg';
      const W = 1000, x0 = 30, x1 = 970, t0 = 1700, t1 = 2030, X = t => x0 + (x1 - x0) * (t - t0) / (t1 - t0);
      const mine = EVENTS.filter(e => e[2] === part);
      // each label goes on the first row where it does not run into an earlier one
      const rows = [], place = mine.map(e => {
        const cx = X(e[0]), right = cx > 700, wd = 7.4 * (e[1].length + 5) + 8, a = right ? cx - 5 - wd : cx + 5, b = a + wd;
        let row = 0; while (rows[row] && rows[row].some(iv => a < iv[1] + 10 && b > iv[0] - 10)) row++;
        (rows[row] = rows[row] || []).push([a, b]);
        return { cx, right, row };
      });
      const y = 16 + rows.length * 21 + 8, H = y + 32;
      const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'Timeline from 1700 to 2030. This part covers: ' + mine.map(e => e[0] + ' ' + e[1]).join('; '));
      const el = (tag, at, txt) => { const n = document.createElementNS(NS, tag); for (const k in at) n.setAttribute(k, at[k]); if (txt) n.textContent = txt; svg.appendChild(n); return n; };
      el('line', { x1: x0, x2: x1, y1: y, y2: y, stroke: th.faint, 'stroke-width': 1.5 });
      for (let t = 1700; t <= 2000; t += 50) { el('line', { x1: X(t), x2: X(t), y1: y - 4, y2: y + 4, stroke: th.faint, 'stroke-width': 1.5 }); el('text', { x: X(t), y: y + 22, 'text-anchor': 'middle', 'font-size': 14, fill: th.soft, 'font-family': SANS }, String(t)); }
      const lo = Math.min(...mine.map(e => e[0])), hi = Math.max(...mine.map(e => e[0]));
      el('rect', { x: X(lo) - 6, y: y - 3, width: X(hi) - X(lo) + 12, height: 6, rx: 3, fill: th.gold, opacity: 0.55 });
      for (const e of EVENTS) if (e[2] !== part) el('circle', { cx: X(e[0]), cy: y, r: 3, fill: th.faint });
      mine.forEach((e, i) => {
        const { cx, right, row } = place[i], ty = 16 + row * 21;
        el('line', { x1: cx, x2: cx, y1: ty + 5, y2: y - 5, stroke: th.rule, 'stroke-width': 1 });
        el('circle', { cx, cy: y, r: 5, fill: th.gold, stroke: th.ink, 'stroke-width': 1 });
        const tx = el('text', { x: right ? cx - 5 : cx + 5, y: ty, 'text-anchor': right ? 'end' : 'start', 'font-size': 14.5, fill: th.ink, 'font-family': SANS });
        const bb = document.createElementNS(NS, 'tspan'); bb.setAttribute('font-weight', 600); bb.textContent = e[0] + ' '; tx.appendChild(bb);
        tx.appendChild(document.createTextNode(e[1]));
      });
      host.appendChild(svg);
      // on a phone the strip scrolls sideways: open it at this part's stretch of years
      const over = host.scrollWidth - host.clientWidth;
      if (over > 0) host.scrollLeft = Math.max(0, Math.min(over, (X(lo) + X(hi)) / 2 / W * host.scrollWidth - host.clientWidth / 2));
    });
  }

  onReady(() => { typeset(); timeline(); });

  window.MF = { C, theme, alpha, rgb, SANS, SERIF, Fig, pointer, view, clipTo, dot, line, arrow, label, panel, Field, colourInto, wheel,
    mobius, gmul, tiles, geodesic, tilePath, tessellation, halfPlaneAxis, RHO, RHO1, fmt, cfmt, big, minus, $, onReady, seg, TAU };
})();
