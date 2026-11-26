/* Too Much Room — drawing kit shared by every figure: theme colours, a canvas
   wrapper that only repaints when needed, pointer handling, 2-D views, a tiny
   depth-sorted 3-D renderer, and the state the figures share. */
(function () {
  'use strict';
  const P = window.Peg, TAU = P.TAU;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- theme ---- */
  let T = null;
  const rgb = hex => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const alpha = (hex, a) => { const c = rgb(hex); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
  const mixRGB = (h1, h2, t) => { const a = rgb(h1), b = rgb(h2); return [0, 1, 2].map(i => Math.round(a[i] + (b[i] - a[i]) * t)); };
  const mix = (h1, h2, t) => { const c = mixRGB(h1, h2, t); return `rgb(${c[0]},${c[1]},${c[2]})`; };
  function theme() {
    if (T) return T;
    const cs = getComputedStyle(document.documentElement);
    T = {};
    for (const k of ['bg', 'panel', 'ink', 'soft', 'faint', 'rule', 'blue', 'red', 'teal', 'gold'])
      T[k] = cs.getPropertyValue('--' + k).trim();
    return T;
  }
  const figs = [];
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    T = null; themeSubs.forEach(f => f()); figs.forEach(f => f.dirty());
  });
  const themeSubs = [];
  document.addEventListener('visibilitychange', () => { if (!document.hidden) figs.forEach(f => f.dirty()); });
  window.addEventListener('pageshow', () => figs.forEach(f => f.dirty()));

  const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif';

  /* ---- which figures are on screen.  Checked from scroll position rather than an
     IntersectionObserver, whose callbacks stall when the page is not being painted. ---- */
  function seen(f) {
    const r = f.c.getBoundingClientRect();
    return r.width > 0 && r.bottom > -150 && r.top < window.innerHeight + 150;
  }
  function checkVisible() {
    for (const f of figs) {
      const v = seen(f);
      /* repaint on every entry: some browsers drop the pixels of off-screen canvases */
      if (v && !f.visible) { f.visible = true; f.dirty(); } else f.visible = v;
    }
  }
  window.addEventListener('scroll', checkVisible, { passive: true });
  window.addEventListener('resize', () => { figs.forEach(f => f.resize()); checkVisible(); });
  window.addEventListener('load', checkVisible);

  /* ---- canvas wrapper ---- */
  class Fig {
    constructor(canvas, draw, opts) {
      this.c = canvas; this.ctx = canvas.getContext('2d'); this.drawFn = draw; this.opts = opts || {};
      this.w = 0; this.h = 0; this.dpr = 1; this.visible = false; this.needs = true; this.raf = 0; this.last = 0;
      new ResizeObserver(() => this.resize()).observe(canvas);
      canvas.addEventListener('contextrestored', () => this.dirty());
      figs.push(this);
      this.resize();
    }
    resize() {
      const w = this.c.clientWidth, h = this.c.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      this.visible = seen(this);
      if (w === this.w && h === this.h && dpr === this.dpr) { this.kick(); return; }
      this.dpr = dpr; this.w = w; this.h = h;
      this.c.width = Math.round(w * this.dpr); this.c.height = Math.round(h * this.dpr);
      this.dirty();
    }
    dirty() { this.needs = true; this.kick(); }
    kick() { if (!this.raf && this.visible && this.w) this.raf = requestAnimationFrame(t => this.frame(t)); }
    frame(t) {
      this.raf = 0;
      const dt = this.last ? Math.min(0.05, (t - this.last) / 1000) : 0;
      this.last = t;
      const more = this.opts.tick ? !!this.opts.tick(dt) : false;
      if (this.needs || more) {
        this.needs = false;
        const ctx = this.ctx;
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        ctx.clearRect(0, 0, this.w, this.h);
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        this.drawFn(ctx, this.w, this.h, this);
      }
      if (more && this.visible) this.kick(); else this.last = 0;
    }
  }

  /* ---- pointer handling: drag things that hit() returns, tap elsewhere ---- */
  function pointer(fig, h) {
    const c = fig.c;
    let drag = null, down = null;
    const pos = e => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    c.addEventListener('pointerdown', e => {
      if (e.button) return;
      const [x, y] = pos(e);
      down = [x, y, false];
      const tgt = h.hit ? h.hit(x, y, e.pointerType) : null;
      if (tgt !== null && tgt !== undefined) {
        drag = tgt;
        try { c.setPointerCapture(e.pointerId); } catch (_) {}
        if (h.start) h.start(drag, x, y);
        c.style.cursor = 'grabbing';
        if (e.pointerType === 'mouse') e.preventDefault();
      }
    });
    c.addEventListener('pointermove', e => {
      const [x, y] = pos(e);
      if (down && Math.hypot(x - down[0], y - down[1]) > 6) down[2] = true;
      if (drag !== null) { if (h.move) h.move(drag, x, y, down); }
      else if (e.pointerType === 'mouse' && h.hit) {
        const t = h.hit(x, y, 'mouse');
        c.style.cursor = (t !== null && t !== undefined) ? 'grab' : (h.tap ? 'crosshair' : '');
        if (h.hover) h.hover(t);
      }
    });
    const up = e => {
      const [x, y] = pos(e);
      if (drag !== null) { if (h.end) h.end(drag); drag = null; c.style.cursor = ''; }
      else if (down && !down[2] && h.tap && e.type === 'pointerup') h.tap(x, y);
      down = null;
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('pointerleave', () => { if (drag === null && h.hover) h.hover(null); });
    if (!h.scrolls) {
      /* a touch that starts on something draggable must not scroll the page */
      c.addEventListener('touchstart', e => {
        const t = e.touches[0], r = c.getBoundingClientRect();
        const tgt = h.hit ? h.hit(t.clientX - r.left, t.clientY - r.top, 'touch') : null;
        if (tgt !== null && tgt !== undefined) e.preventDefault();
      }, { passive: false });
    } else c.style.touchAction = 'pan-y';
  }

  /* ---- 2-D view: maths coordinates inside a pixel box ---- */
  function view(x, y, w, h, R, cx, cy) {
    cx = cx || 0; cy = cy || 0;
    const s = Math.min(w, h) / (2 * R);
    const ox = x + w / 2 - s * cx, oy = y + h / 2 + s * cy;
    return { s, x, y, w, h, X: u => ox + s * u, Y: v => oy - s * v, ux: px => (px - ox) / s, uy: py => (oy - py) / s };
  }
  function poly(ctx, V, pts, close) {
    ctx.beginPath();
    for (let i = 0; i < pts.length; i += 2) {
      const X = V.X(pts[i]), Y = V.Y(pts[i + 1]);
      if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
    }
    if (close) ctx.closePath();
  }
  function dot(ctx, x, y, r, fill, stroke, lw) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.5; ctx.stroke(); }
  }
  function line(ctx, x0, y0, x1, y1, color, lw, dash) {
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
    ctx.strokeStyle = color; ctx.lineWidth = lw || 1; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
  }
  function arrow(ctx, x0, y0, x1, y1, color, lw) {
    const d = Math.hypot(x1 - x0, y1 - y0);
    if (d < 1) return;
    const ux = (x1 - x0) / d, uy = (y1 - y0) / d, hl = Math.min(9, d * 0.45), hw = hl * 0.5;
    line(ctx, x0, y0, x1 - ux * hl * 0.6, y1 - uy * hl * 0.6, color, lw || 2);
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - ux * hl - uy * hw, y1 - uy * hl + ux * hw);
    ctx.lineTo(x1 - ux * hl + uy * hw, y1 - uy * hl - ux * hw);
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  }
  function label(ctx, text, x, y, o) {
    o = o || {};
    ctx.font = (o.italic ? 'italic ' : '') + (o.bold ? '600 ' : '') + (o.size || 12.5) + 'px ' + (o.serif ? SERIF : SANS);
    ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle';
    if (o.halo) { ctx.lineWidth = 3.5; ctx.strokeStyle = o.halo; ctx.strokeText(text, x, y); }
    ctx.fillStyle = o.color || theme().ink; ctx.fillText(text, x, y);
  }
  /* a rounded panel with a small title; returns the inner drawing box */
  function panel(ctx, x, y, w, h, title, o) {
    const Th = theme(); o = o || {};
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, 10); else ctx.rect(x + 0.5, y + 0.5, w - 1, h - 1);
    ctx.fillStyle = o.fill || Th.panel; ctx.fill();
    ctx.strokeStyle = Th.rule; ctx.lineWidth = 1; ctx.stroke();
    if (title) label(ctx, title, x + 12, y + 16, { size: 11.5, color: Th.soft, bold: true });
    return { x, y, w, h };
  }
  function clip(ctx, b, fn) {
    ctx.save(); ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2, 9); else ctx.rect(b.x, b.y, b.w, b.h);
    ctx.clip(); fn(); ctx.restore();
  }

  /* ---- 3-D: orthographic camera, painter's algorithm ---- */
  class Cam {
    constructor(yaw, pitch) { this.yaw = yaw; this.pitch = pitch; this.s = 100; this.cx = 0; this.cy = 0; }
    frame(cx, cy, s) { this.cx = cx; this.cy = cy; this.s = s; this.cyaw = Math.cos(this.yaw); this.syaw = Math.sin(this.yaw); this.cp = Math.cos(this.pitch); this.sp = Math.sin(this.pitch); }
    /* returns screen x, screen y, depth (larger = nearer the viewer) */
    proj(x, y, z, out, o) {
      const x1 = x * this.cyaw - y * this.syaw, y1 = x * this.syaw + y * this.cyaw;
      out[o] = this.cx + this.s * x1;
      out[o + 1] = this.cy - this.s * (z * this.cp + y1 * this.sp);
      out[o + 2] = -y1 * this.cp + z * this.sp;
    }
  }
  /* verts: Float64Array xyz.  prims: {q:[i,j,k,l], rgb:[r,g,b]} or {l:[i,j], color, lw}.
     Quads are shaded by how squarely they face the viewer. */
  function render3(ctx, cam, verts, prims, o) {
    o = o || {};
    const n = verts.length / 3, S = render3.buf && render3.buf.length >= 3 * n ? render3.buf : (render3.buf = new Float64Array(3 * n));
    for (let i = 0; i < n; i++) cam.proj(verts[3 * i], verts[3 * i + 1], verts[3 * i + 2], S, 3 * i);
    for (const p of prims) {
      if (p.q) p.d = (S[3 * p.q[0] + 2] + S[3 * p.q[1] + 2] + S[3 * p.q[2] + 2] + S[3 * p.q[3] + 2]) / 4;
      else p.d = (S[3 * p.l[0] + 2] + S[3 * p.l[1] + 2]) / 2 + 0.02;
    }
    prims.sort((a, b) => a.d - b.d);
    const a = o.alpha === undefined ? 1 : o.alpha, edge = o.edge || null;
    for (const p of prims) {
      if (p.q) {
        const [i, j, k, l] = p.q;
        /* screen-space area relative to true area tells us the facing */
        const ax = S[3 * k] - S[3 * i], ay = S[3 * k + 1] - S[3 * i + 1], bx = S[3 * l] - S[3 * j], by = S[3 * l + 1] - S[3 * j + 1];
        const facing = Math.min(1, Math.abs(ax * by - ay * bx) / (2 * cam.s * cam.s * (p.area || 1e-9)));
        const sh = 0.62 + 0.38 * facing;
        ctx.beginPath();
        ctx.moveTo(S[3 * i], S[3 * i + 1]); ctx.lineTo(S[3 * j], S[3 * j + 1]);
        ctx.lineTo(S[3 * k], S[3 * k + 1]); ctx.lineTo(S[3 * l], S[3 * l + 1]); ctx.closePath();
        ctx.fillStyle = `rgba(${Math.round(p.rgb[0] * sh)},${Math.round(p.rgb[1] * sh)},${Math.round(p.rgb[2] * sh)},${a})`;
        ctx.fill();
        if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = 0.6; ctx.stroke(); }
      } else {
        ctx.beginPath(); ctx.moveTo(S[3 * p.l[0]], S[3 * p.l[0] + 1]); ctx.lineTo(S[3 * p.l[1]], S[3 * p.l[1] + 1]);
        ctx.strokeStyle = p.color; ctx.lineWidth = p.lw || 2; ctx.stroke();
      }
    }
    return S;
  }
  function quadArea(v, q) {
    const g = (i, c) => v[3 * i + c];
    const ax = g(q[2], 0) - g(q[0], 0), ay = g(q[2], 1) - g(q[0], 1), az = g(q[2], 2) - g(q[0], 2);
    const bx = g(q[3], 0) - g(q[1], 0), by = g(q[3], 1) - g(q[1], 1), bz = g(q[3], 2) - g(q[1], 2);
    return Math.hypot(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx) / 2;
  }
  /* drag to turn a camera; on touch only sideways drags turn it, so the page still scrolls */
  function orbit(fig, cam, onUse) {
    let px = 0, py = 0;
    pointer(fig, {
      scrolls: true,
      hit: () => 'orbit',
      start: (t, x, y) => { px = x; py = y; if (onUse) onUse(); },
      move: (t, x, y) => {
        cam.yaw += (x - px) * 0.01;
        cam.pitch = Math.max(0.08, Math.min(1.45, cam.pitch + (y - py) * 0.008));
        px = x; py = y; fig.dirty();
      }
    });
  }

  /* ---- shared state: one loop and one rectangle shape for the whole page ---- */
  const DEFAULT = [1.3, 0.9, 1.44, 1.19, 0.68, 1.04, 1.48, 0.98, 0.76, 1.25, 0.96];
  const S = {
    loop: new P.Loop(DEFAULT), phi: 2 * Math.atan(0.5), subs: [], primary: null,
    _key: '', _rects: [], _pts: null, _ptsV: -1,
    rects() {
      const key = this.loop.version + ':' + this.phi;
      if (key !== this._key) {
        this._key = key;
        let list = P.findRects(this.loop, this.phi, 144);
        if (!list.length) list = P.findRects(this.loop, this.phi, 320);
        let prim = null;
        if (this.primary) {
          const t = P.track(this.loop, this.phi, this.primary);
          if (t) prim = list.find(q => Math.hypot(q.m[0] - t.m[0], q.m[1] - t.m[1]) < 1e-4 && Math.abs(q.r - t.r) < 1e-4) || null;
          if (!prim && list.length) prim = P.nearest(list, this.primary);
        }
        this._rects = list; this.primary = prim || list[0] || null;
      }
      return this._rects;
    },
    pts() {
      if (this._ptsV !== this.loop.version) { this._pts = this.loop.polyline(360); this._ptsV = this.loop.version; }
      return this._pts;
    },
    notify(what) { this.subs.forEach(f => f(what)); },
    setPhi(phi) { this.phi = phi; this.notify('phi'); },
    loopChanged() { this.notify('loop'); },
    morphTo(c) {
      const from = Array.from(this.loop.c), t0 = performance.now(), dur = reduceMotion ? 1 : 650, self = this;
      (function step(now) {
        const u = Math.min(1, (now - t0) / dur), e = u * u * (3 - 2 * u);
        self.loop.set(from.map((v, i) => v + (c[i] - v) * e));
        self.loopChanged();
        if (u < 1) requestAnimationFrame(step);
      })(t0);
    }
  };

  const ratioOf = phi => 1 / Math.tan(phi / 2);
  const fmtShape = phi => {
    const k = ratioOf(phi);
    return (Math.abs(k - 1) < 0.004 ? 'a square' : k.toFixed(2) + ' : 1') + ', diagonals crossing at ' + (phi * 180 / Math.PI).toFixed(1) + '°';
  };
  /* every shape slider on the page drives the same angle */
  function shapeSliders() {
    const all = Array.from(document.querySelectorAll('input[data-shape]'));
    const outs = Array.from(document.querySelectorAll('[data-shape-out]'));
    const sync = () => {
      const deg = (S.phi * 180 / Math.PI).toFixed(1);
      all.forEach(el => { if (document.activeElement !== el) el.value = deg; el.setAttribute('aria-valuetext', fmtShape(S.phi)); });
      outs.forEach(o => { o.textContent = fmtShape(S.phi); });
    };
    all.forEach(el => el.addEventListener('input', () => S.setPhi(Math.min(Math.PI / 2, parseFloat(el.value) * Math.PI / 180))));
    S.subs.push(w => { if (w === 'phi') sync(); });
    sync();
  }

  function onReady(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  const $ = id => document.getElementById(id);
  const signed = (x, d) => (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(d === undefined ? 4 : d);

  window.Kit = { TAU, reduceMotion, theme, themeSubs, alpha, mix, mixRGB, rgb, SANS, SERIF, Fig, pointer, view, poly, dot, line, arrow,
    label, panel, clip, Cam, render3, quadArea, orbit, S, DEFAULT, ratioOf, fmtShape, shapeSliders, onReady, $, signed, figs };
})();
