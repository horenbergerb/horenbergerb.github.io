/* Too Much Room — figures 1 to 3: the loop and its rectangles, the chord
   surface in three dimensions, and the map of every chord. */
(function () {
  'use strict';
  const P = window.Peg, K = window.Kit, S = K.S, TAU = P.TAU;

  function rectPath(ctx, V, q) {
    ctx.beginPath();
    q.corners.forEach((c, i) => { const X = V.X(c[0]), Y = V.Y(c[1]); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
    ctx.closePath();
  }
  function drawLoop(ctx, V, T, fill) {
    K.poly(ctx, V, S.pts(), true);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    ctx.strokeStyle = T.ink; ctx.lineWidth = 2.2; ctx.stroke();
  }
  K.drawLoop = drawLoop; K.rectPath = rectPath;

  /* ------------------------------------------------------------------ 1 */
  K.onReady(function hero() {
    const canvas = K.$('c-hero'); if (!canvas) return;
    let hot = -1, seed = 3;
    const R = 1.68;
    const fig = new K.Fig(canvas, (ctx, w, h) => {
      const T = K.theme(), loop = S.loop, V = K.view(0, 0, w, h, R);
      const rects = S.rects(), prim = S.primary;
      K.poly(ctx, V, S.pts(), true); ctx.fillStyle = T.panel; ctx.fill();
      for (const q of rects) {
        if (q === prim) continue;
        rectPath(ctx, V, q);
        ctx.strokeStyle = K.alpha(T.soft, 0.6); ctx.lineWidth = 1.1; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
      }
      if (prim) {
        rectPath(ctx, V, prim); ctx.fillStyle = K.alpha(T.gold, 0.2); ctx.fill();
        K.line(ctx, V.X(prim.a[0]), V.Y(prim.a[1]), V.X(prim.b[0]), V.Y(prim.b[1]), K.alpha(T.blue, 0.9), 1.4);
        K.line(ctx, V.X(prim.P[0]), V.Y(prim.P[1]), V.X(prim.Q[0]), V.Y(prim.Q[1]), K.alpha(T.red, 0.9), 1.4);
        rectPath(ctx, V, prim); ctx.strokeStyle = T.gold; ctx.lineWidth = 2.6; ctx.stroke();
      }
      drawLoop(ctx, V, T, null);
      if (prim) for (const c of prim.corners) K.dot(ctx, V.X(c[0]), V.Y(c[1]), 4.2, T.ink, T.panel, 1.5);
      for (let j = 0; j < loop.n; j++) {
        const th = loop.ang[j], r = loop.rad(th), cx = Math.cos(th), sy = Math.sin(th);
        if (j === hot) K.line(ctx, V.X(0.3 * cx), V.Y(0.3 * sy), V.X(1.6 * cx), V.Y(1.6 * sy), K.alpha(T.soft, 0.5), 1, [3, 4]);
        K.dot(ctx, V.X(r * cx), V.Y(r * sy), j === hot ? 8 : 6.2, T.panel, T.ink, 1.8);
      }
    });
    const handleAt = (x, y, type) => {
      const V = K.view(0, 0, fig.w, fig.h, R), loop = S.loop, lim = type === 'touch' ? 30 : 16;
      let best = null, bd = lim;
      for (let j = 0; j < loop.n; j++) {
        const p = loop.pt(loop.ang[j]), d = Math.hypot(V.X(p[0]) - x, V.Y(p[1]) - y);
        if (d < bd) { bd = d; best = j; }
      }
      return best;
    };
    K.pointer(fig, {
      hit: handleAt,
      hover: j => { const n = j === null || j === undefined ? -1 : j; if (n !== hot) { hot = n; fig.dirty(); } },
      start: j => { hot = j; },
      move: (j, x, y) => {
        const V = K.view(0, 0, fig.w, fig.h, R), th = S.loop.ang[j];
        S.loop.dragHandle(j, Math.max(0.2, V.ux(x) * Math.cos(th) + V.uy(y) * Math.sin(th)));
        S.loopChanged();
      },
      end: () => { hot = -1; fig.dirty(); }
    });
    const out = K.$('hero-count');
    const report = () => {
      const n = S.rects().length;
      if (out) out.textContent = n === 0 ? 'The search missed. Nudge the loop.' : n === 1 ? '1 rectangle found' : n + ' rectangles found';
      fig.dirty();
    };
    S.subs.push(report); report();
    const bNew = K.$('hero-new'), bReset = K.$('hero-reset'), bNext = K.$('hero-next');
    if (bNew) bNew.addEventListener('click', () => S.morphTo(P.randomLoop(seed++)));
    if (bReset) bReset.addEventListener('click', () => S.morphTo(K.DEFAULT));
    if (bNext) bNext.addEventListener('click', () => {
      const list = S.rects(); if (!list.length) return;
      S.primary = list[(list.indexOf(S.primary) + 1) % list.length]; S.notify('pick');
    });
  });

  /* ------------------------------------------------------------------ 2 */
  K.onReady(function vaughan() {
    const canvas = K.$('c-vaughan'); if (!canvas) return;
    const cam = new K.Cam(0.55, 0.6);
    let auto = !K.reduceMotion;
    const NS = 72, NU = 26, ZS = 0.7;
    let meshV = -1, verts = null, prims = [];
    let sweepV = -1, sweep = [], timer = 0;
    K.themeSubs.push(() => { meshV = -1; });

    function build() {
      const loop = S.loop, T = K.theme();
      verts = new Float64Array(3 * NS * (NU + 1));
      for (let i = 0; i < NS; i++) for (let j = 0; j <= NU; j++) {
        const s = (i * TAU) / NS, u = (j * Math.PI) / NU;
        const a = loop.pt(s), b = loop.pt(s + u), o = 3 * (i * (NU + 1) + j);
        verts[o] = (a[0] + b[0]) / 2; verts[o + 1] = (a[1] + b[1]) / 2; verts[o + 2] = ZS * Math.hypot(a[0] - b[0], a[1] - b[1]);
      }
      const base = K.mixRGB(T.panel, T.blue, 0.5);
      prims = [];
      for (let i = 0; i < NS; i++) for (let j = 0; j < NU; j++) {
        const i2 = (i + 1) % NS;
        const q = [i * (NU + 1) + j, i2 * (NU + 1) + j, i2 * (NU + 1) + j + 1, i * (NU + 1) + j + 1];
        prims.push({ q, rgb: base, area: K.quadArea(verts, q) });
      }
      meshV = loop.version;
    }
    function computeSweep() {
      const loop = S.loop, n = 46, lo = 9 * Math.PI / 180;
      sweep = [];
      for (let k = 0; k < n; k++) {
        const phi = lo + (Math.PI / 2 - lo) * (k / (n - 1));
        for (const q of P.findRects(loop, phi, 96)) sweep.push([q.m[0], q.m[1], 2 * q.r * ZS, k / (n - 1)]);
      }
      sweepV = loop.version;
    }
    function wantSweep() {
      if (sweepV === S.loop.version || timer) return;
      const v = S.loop.version;
      timer = setTimeout(() => { timer = 0; if (S.loop.version === v) computeSweep(); fig.dirty(); }, 140);
    }

    const fig = new K.Fig(canvas, (ctx, w, h) => {
      const T = K.theme(), loop = S.loop;
      if (meshV !== loop.version) build();
      wantSweep();
      cam.frame(w / 2, h * 0.72, Math.min(w / 3.7, h / 2.65));
      const tmp = [0, 0, 0];
      /* the loop on the floor */
      const pts = S.pts();
      ctx.beginPath();
      for (let i = 0; i < pts.length; i += 2) { cam.proj(pts[i], pts[i + 1], 0, tmp, 0); if (i) ctx.lineTo(tmp[0], tmp[1]); else ctx.moveTo(tmp[0], tmp[1]); }
      ctx.closePath(); ctx.fillStyle = K.alpha(T.faint, 0.35); ctx.fill();
      const rects = S.rects(), prim = S.primary;
      if (prim) {
        ctx.beginPath();
        prim.corners.forEach((c, i) => { cam.proj(c[0], c[1], 0, tmp, 0); if (i) ctx.lineTo(tmp[0], tmp[1]); else ctx.moveTo(tmp[0], tmp[1]); });
        ctx.closePath(); ctx.fillStyle = K.alpha(T.gold, 0.35); ctx.fill(); ctx.strokeStyle = T.gold; ctx.lineWidth = 2; ctx.stroke();
      }
      K.render3(ctx, cam, verts, prims, { alpha: 0.5, edge: K.alpha(T.ink, 0.09) });
      ctx.beginPath();
      for (let i = 0; i < pts.length; i += 2) { cam.proj(pts[i], pts[i + 1], 0, tmp, 0); if (i) ctx.lineTo(tmp[0], tmp[1]); else ctx.moveTo(tmp[0], tmp[1]); }
      ctx.closePath(); ctx.strokeStyle = T.ink; ctx.lineWidth = 2; ctx.stroke();
      if (sweepV === loop.version) {
        for (const d of sweep) {
          cam.proj(d[0], d[1], d[2], tmp, 0);
          K.dot(ctx, tmp[0], tmp[1], 2.9, K.mix(T.gold, T.red, d[3]));
        }
      }
      for (const q of rects) {
        const top = [0, 0, 0];
        cam.proj(q.m[0], q.m[1], 0, tmp, 0); cam.proj(q.m[0], q.m[1], 2 * q.r * ZS, top, 0);
        K.line(ctx, tmp[0], tmp[1], top[0], top[1], K.alpha(T.ink, q === prim ? 0.8 : 0.35), 1.2, [3, 3]);
        K.dot(ctx, top[0], top[1], q === prim ? 6 : 4, q === prim ? T.gold : T.panel, T.ink, 1.5);
        if (q === prim) K.dot(ctx, tmp[0], tmp[1], 2.5, T.ink);
      }
    }, { tick: dt => { if (auto) { cam.yaw += dt * 0.22; return true; } return false; } });
    K.orbit(fig, cam, () => { auto = false; });
    S.subs.push(() => fig.dirty());
  });

  /* ------------------------------------------------------------------ 3 */
  K.onReady(function torus() {
    const canvas = K.$('c-torus'); if (!canvas) return;
    const NM = 220, R = 1.7;
    const mapC = document.createElement('canvas'); mapC.width = mapC.height = NM;
    let mapKey = '', s0 = 0, t0 = 0, anim = null, pick = 0;
    K.themeSubs.push(() => { mapKey = ''; });
    { const r = S.rects()[0]; if (r) { s0 = P.mod(r.s + 0.5, TAU); t0 = P.mod(r.t - 0.35, TAU); } else { s0 = 1; t0 = 4; } }

    function boxes(w, h) {
      if (w >= 620) { const pw = (w - 14) / 2; return [{ x: 0, y: 0, w: pw, h }, { x: pw + 14, y: 0, w: pw, h }]; }
      const ph = (h - 12) / 2; return [{ x: 0, y: 0, w, h: ph }, { x: 0, y: ph + 12, w, h: ph }];
    }
    function mapBox(b) {
      const size = Math.min(b.w - 56, b.h - 66);
      return { x: b.x + (b.w - size) / 2 + 12, y: b.y + 28, size };
    }
    function buildMap() {
      const T = K.theme(), g = P.grid(S.loop, S.phi, NM);
      const col = [K.mixRGB(T.panel, T.ink, 0.3), K.mixRGB(T.panel, T.gold, 0.55), K.mixRGB(T.panel, T.teal, 0.55), K.mixRGB(T.panel, T.ink, 0.05)];
      const cx = mapC.getContext('2d'), img = cx.createImageData(NM, NM);
      for (let i = 0; i < NM; i++) for (let j = 0; j < NM; j++) {
        const k = (g.F1[i * NM + j] < 0 ? 2 : 0) + (g.F2[i * NM + j] < 0 ? 1 : 0), o = 4 * ((NM - 1 - j) * NM + i);
        img.data[o] = col[k][0]; img.data[o + 1] = col[k][1]; img.data[o + 2] = col[k][2]; img.data[o + 3] = 255;
      }
      cx.putImageData(img, 0, 0);
    }
    function solutions() {
      const out = [];
      for (const q of S.rects()) {
        out.push([q.s, q.t], [q.t, q.s]);
        if (Math.abs(S.phi - Math.PI / 2) < 1e-6) {
          const sp = P.mod(Math.atan2(q.P[1], q.P[0]), TAU), sq = P.mod(Math.atan2(q.Q[1], q.Q[0]), TAU);
          out.push([sp, sq], [sq, sp]);
        }
      }
      return out;
    }
    const adiff = (a, b) => { const d = P.mod(a - b + Math.PI, TAU) - Math.PI; return d; };
    function snap() {
      for (const [s, t] of solutions()) if (Math.hypot(adiff(s, s0), adiff(t, t0)) < 0.075) { s0 = s; t0 = t; return true; }
      return false;
    }

    const fig = new K.Fig(canvas, (ctx, w, h) => {
      const T = K.theme(), loop = S.loop, [A, B] = boxes(w, h);
      const key = loop.version + ':' + S.phi;
      if (key !== mapKey) { buildMap(); mapKey = key; }
      const k = P.chord(loop, S.phi, s0, t0), fP = loop.f(k.P[0], k.P[1]), fQ = loop.f(k.Q[0], k.Q[1]);
      const onP = Math.abs(fP) < 2.5e-3, onQ = Math.abs(fQ) < 2.5e-3, len = Math.hypot(k.v[0], k.v[1]);

      K.panel(ctx, A.x, A.y, A.w, A.h, 'ONE CHORD, AND THE SAME CHORD TURNED');
      K.clip(ctx, A, () => {
        const V = K.view(A.x, A.y + 14, A.w, A.h - 14, R);
        drawLoop(ctx, V, T, K.alpha(T.faint, 0.22));
        if (onP && onQ && len > 0.03) {
          ctx.beginPath();
          [k.a, k.P, k.b, k.Q].forEach((c, i) => { if (i) ctx.lineTo(V.X(c[0]), V.Y(c[1])); else ctx.moveTo(V.X(c[0]), V.Y(c[1])); });
          ctx.closePath(); ctx.fillStyle = K.alpha(T.gold, 0.25); ctx.fill(); ctx.strokeStyle = T.gold; ctx.lineWidth = 2.4; ctx.stroke();
        }
        K.line(ctx, V.X(k.a[0]), V.Y(k.a[1]), V.X(k.b[0]), V.Y(k.b[1]), T.blue, 2.2);
        K.line(ctx, V.X(k.P[0]), V.Y(k.P[1]), V.X(k.Q[0]), V.Y(k.Q[1]), T.red, 2.2);
        K.dot(ctx, V.X(k.m[0]), V.Y(k.m[1]), 2.6, T.ink);
        K.dot(ctx, V.X(k.P[0]), V.Y(k.P[1]), 5.5, onP ? T.red : T.panel, T.red, 2);
        K.dot(ctx, V.X(k.Q[0]), V.Y(k.Q[1]), 5.5, onQ ? T.red : T.panel, T.red, 2);
        K.dot(ctx, V.X(k.a[0]), V.Y(k.a[1]), 6.5, T.blue, T.panel, 2);
        K.dot(ctx, V.X(k.b[0]), V.Y(k.b[1]), 6.5, T.blue, T.panel, 2);
        const lab = (p, t, c) => {
          const d = Math.hypot(p[0] - k.m[0], p[1] - k.m[1]) || 1;
          K.label(ctx, t, V.X(p[0]) + 15 * (p[0] - k.m[0]) / d, V.Y(p[1]) - 15 * (p[1] - k.m[1]) / d, { italic: true, serif: true, size: 16, color: c, align: 'center', halo: T.panel });
        };
        lab(k.a, 'a', T.blue); lab(k.b, 'b', T.blue); lab(k.P, 'P', T.red); lab(k.Q, 'Q', T.red);
      });

      K.panel(ctx, B.x, B.y, B.w, B.h, 'EVERY CHORD AT ONCE');
      const M = mapBox(B);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(mapC, M.x, M.y, M.size, M.size);
      const mx = s => M.x + (s / TAU) * M.size, my = t => M.y + M.size - (t / TAU) * M.size;
      K.line(ctx, M.x, M.y + M.size, M.x + M.size, M.y, T.ink, 1.8);
      ctx.strokeStyle = T.rule; ctx.lineWidth = 1; ctx.strokeRect(M.x + 0.5, M.y + 0.5, M.size - 1, M.size - 1);
      for (const [s, t] of solutions()) K.dot(ctx, mx(s), my(t), 6.5, null, T.ink, 2.4), K.dot(ctx, mx(s), my(t), 6.5, null, T.gold, 1.4);
      K.line(ctx, mx(s0), M.y, mx(s0), M.y + M.size, K.alpha(T.ink, 0.35), 1);
      K.line(ctx, M.x, my(t0), M.x + M.size, my(t0), K.alpha(T.ink, 0.35), 1);
      K.dot(ctx, mx(s0), my(t0), 7, T.panel, T.ink, 2.2);
      K.dot(ctx, mx(s0), my(t0), 2.4, T.ink);
      K.label(ctx, 'where a sits on the loop  →', M.x + M.size / 2, M.y + M.size + 17, { align: 'center', size: 11.5, color: T.soft });
      ctx.save(); ctx.translate(M.x - 14, M.y + M.size / 2); ctx.rotate(-Math.PI / 2);
      K.label(ctx, 'where b sits on the loop  →', 0, 0, { align: 'center', size: 11.5, color: T.soft }); ctx.restore();

      const out = K.$('torus-read');
      if (out) {
        const say = (n, f) => Math.abs(f) < 2.5e-3 ? n + ' is on the loop' : n + ' is ' + Math.abs(f).toFixed(2) + (f < 0 ? ' inside' : ' outside');
        out.textContent = len < 0.03 ? 'The chord has collapsed to a point, so turning it changes nothing.'
          : onP && onQ ? 'Both ends of the turned chord are on the loop. This is a rectangle.'
            : say('P', fP) + '; ' + say('Q', fQ) + '.';
      }
    }, {
      tick: dt => {
        if (!anim) return false;
        anim.u = Math.min(1, anim.u + dt / 0.5);
        const e = anim.u * anim.u * (3 - 2 * anim.u);
        s0 = P.mod(anim.s + anim.ds * e, TAU); t0 = P.mod(anim.t + anim.dt * e, TAU);
        if (anim.u >= 1) { s0 = anim.S; t0 = anim.T; anim = null; }
        fig.needs = true; return !!anim;
      }
    });

    K.pointer(fig, {
      hit: (x, y, type) => {
        const [A, B] = boxes(fig.w, fig.h), lim = type === 'touch' ? 28 : 15;
        const V = K.view(A.x, A.y + 14, A.w, A.h - 14, R), k = P.chord(S.loop, S.phi, s0, t0);
        const da = Math.hypot(V.X(k.a[0]) - x, V.Y(k.a[1]) - y), db = Math.hypot(V.X(k.b[0]) - x, V.Y(k.b[1]) - y);
        if (Math.min(da, db) < lim) return da <= db ? 'a' : 'b';
        const M = mapBox(B), cx = M.x + (s0 / TAU) * M.size, cy = M.y + M.size - (t0 / TAU) * M.size;
        if (Math.hypot(cx - x, cy - y) < lim + 4) return 'x';
        return null;
      },
      move: (tg, x, y) => {
        const [A, B] = boxes(fig.w, fig.h); anim = null;
        if (tg === 'x') {
          const M = mapBox(B);
          s0 = Math.min(0.9999, Math.max(0, (x - M.x) / M.size)) * TAU;
          t0 = Math.min(0.9999, Math.max(0, (M.y + M.size - y) / M.size)) * TAU;
        } else {
          const V = K.view(A.x, A.y + 14, A.w, A.h - 14, R), th = P.mod(Math.atan2(V.uy(y), V.ux(x)), TAU);
          if (tg === 'a') s0 = th; else t0 = th;
        }
        snap(); fig.dirty();
      },
      tap: (x, y) => {
        const B = boxes(fig.w, fig.h)[1], M = mapBox(B);
        if (x < M.x || x > M.x + M.size || y < M.y || y > M.y + M.size) return;
        s0 = ((x - M.x) / M.size) * TAU; t0 = ((M.y + M.size - y) / M.size) * TAU;
        anim = null; snap(); fig.dirty();
      }
    });
    const jump = K.$('torus-jump');
    if (jump) jump.addEventListener('click', () => {
      const sol = solutions(); if (!sol.length) return;
      const [Sx, Tx] = sol[pick++ % sol.length];
      anim = { s: s0, t: t0, ds: adiff(Sx, s0), dt: adiff(Tx, t0), S: Sx, T: Tx, u: K.reduceMotion ? 1 : 0 };
      fig.dirty();
    });
    S.subs.push(() => fig.dirty());
  });
})();
