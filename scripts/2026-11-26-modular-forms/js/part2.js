/* Part 2 figures: a torus and its cubic curve; one lattice, many bases, and the
   point tau that records the basis; the classical modular forms over the half-plane. */
(function () {
  'use strict';
  const { C, theme, alpha, Fig, pointer, view, clipTo, dot, line, arrow, label, panel, Field, wheel, tessellation, tilePath, halfPlaneAxis, fmt, cfmt, $, onReady, seg, TAU } = window.MF;
  const PI = Math.PI;

  /* ---------- Figure 1: the plane rolled up along a lattice is a cubic curve ---------- */
  function figCubic() {
    const cv = $('c-cubic'); if (!cv) return;
    const slider = $('cubic-t'), out = $('cubic-read');
    let t = +slider.value, z = [[0.3, 0], [0.62, +slider.value / 2]], boxes = null;
    const w4 = new Float64Array(4), g = new Float64Array(4);
    const P = (zx, zy) => { C.wp(zx, zy, 0, t, w4); return [w4[0], w4[2]]; };
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), narrow = w < 620;
      const lw = narrow ? w : w * 0.4, lh = narrow ? h * 0.48 : h;
      // ---- the period rectangle
      const Vt = view(18, 30, lw - 36, lh - 52, -0.08, 1.08, -0.12, narrow ? Math.max(1.1, t + 0.15) : 2.3);
      label(ctx, 'the plane of z, one period rectangle', 12, 13, { size: 11.5, col: th.soft, bold: true, halo: false });
      ctx.fillStyle = alpha(th.gold, 0.1); ctx.fillRect(Vt.X(0), Vt.Y(t), Vt.s, t * Vt.s);
      ctx.strokeStyle = th.faint; ctx.lineWidth = 1.2; ctx.strokeRect(Vt.X(0), Vt.Y(t), Vt.s, t * Vt.s);
      line(ctx, Vt.X(0), Vt.Y(0), Vt.X(1), Vt.Y(0), th.blue, 3); line(ctx, Vt.X(0), Vt.Y(t / 2), Vt.X(1), Vt.Y(t / 2), th.red, 3);
      for (const [x, y] of [[0, 0], [1, 0], [0, t], [1, t]]) dot(ctx, Vt.X(x), Vt.Y(y), 3.5, th.ink);
      label(ctx, '0', Vt.X(0) - 9, Vt.Y(0) + 10, { size: 11.5, align: 'center', col: th.soft }); label(ctx, '1', Vt.X(1) + 9, Vt.Y(0) + 10, { size: 11.5, align: 'center', col: th.soft });
      label(ctx, 'τ', Vt.X(0) - 10, Vt.Y(t), { size: 13, align: 'center', col: th.soft, italic: true, serif: true });
      const sum = [((z[0][0] + z[1][0]) % 1 + 1) % 1, ((z[0][1] + z[1][1]) % t + t) % t];
      dot(ctx, Vt.X(sum[0]), Vt.Y(sum[1]), 7, th.gold, th.ink, 1.5);
      label(ctx, 'z₁ + z₂', Vt.X(sum[0]), Vt.Y(sum[1]) - 16, { size: 12, align: 'center', italic: true, serif: true });
      z.forEach((p, i) => { dot(ctx, Vt.X(p[0]), Vt.Y(p[1]), 7.5, th.ink, th.bg, 2); label(ctx, i ? 'z₂' : 'z₁', Vt.X(p[0]), Vt.Y(p[1]) + 18, { size: 12, align: 'center', italic: true, serif: true }); });
      // ---- the cubic
      const rx = narrow ? 0 : lw, ry = narrow ? lh : 0, rw = narrow ? w : w - lw, rh = narrow ? h - lh : h;
      panel(ctx, rx + 4, ry + 4, rw - 8, rh - 8, 'real points of  y² = 4x³ − g₂x − g₃');
      C.g2g3(0, t, g); const g2 = g[0], g3 = g[2];
      const e1 = P(0.5, 0)[0], e3 = P(0, t / 2)[0], e2 = -e1 - e3, R = e1 - e3;
      const xa = e3 - 0.3 * R, xb = e1 + 0.95 * R, ymax = Math.sqrt(4 * xb * xb * xb - g2 * xb - g3);
      const bx = rx + 22, bw = rw - 44, by = ry + 30, bh = rh - 48;
      const X = x => bx + bw * (x - xa) / (xb - xa), Y = y => by + bh / 2 - (bh / 2) * y / ymax;
      boxes = { Vt, t };
      ctx.save(); ctx.beginPath(); ctx.rect(rx + 6, ry + 24, rw - 12, rh - 32); ctx.clip();
      line(ctx, bx, Y(0), bx + bw, Y(0), th.rule, 1);
      const branch = (zy, col) => { ctx.beginPath(); let pen = false; for (let i = 0; i <= 600; i++) { const zx = 0.0015 + 0.997 * i / 600, p = P(zx, zy); if (Math.abs(p[1]) > 3 * ymax) { pen = false; continue; } if (pen) ctx.lineTo(X(p[0]), Y(p[1])); else { ctx.moveTo(X(p[0]), Y(p[1])); pen = true; } } ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke(); };
      branch(0, th.blue); branch(t / 2, th.red);
      const p1 = P(z[0][0], z[0][1]), p2 = P(z[1][0], z[1][1]), p3 = P(z[0][0] + z[1][0], z[0][1] + z[1][1]);
      let m = Math.abs(p2[0] - p1[0]) > 1e-7 * R ? (p2[1] - p1[1]) / (p2[0] - p1[0]) : (12 * p1[0] * p1[0] - g2) / (2 * p1[1]);
      const x3 = m * m / 4 - p1[0] - p2[0];
      line(ctx, X(xa), Y(p1[1] + m * (xa - p1[0])), X(xb), Y(p1[1] + m * (xb - p1[0])), th.ink, 1.2);
      line(ctx, X(p3[0]), Y(-p3[1]), X(p3[0]), Y(p3[1]), th.ink, 1.2, [4, 4]);
      dot(ctx, X(p3[0]), Y(-p3[1]), 5.5, th.bg, th.ink, 1.5);
      dot(ctx, X(p1[0]), Y(p1[1]), 6.5, th.ink, th.bg, 2); dot(ctx, X(p2[0]), Y(p2[1]), 6.5, th.ink, th.bg, 2);
      dot(ctx, X(p3[0]), Y(p3[1]), 7, th.gold, th.ink, 1.5);
      const lab = (s, p, dy) => label(ctx, s, X(p[0]) + 11, Y(p[1]) + dy, { size: 12, italic: true, serif: true });
      lab('P(z₁)', p1, -10); lab('P(z₂)', p2, -10); lab('P(z₁ + z₂)', p3, 12);
      ctx.restore();
      out.innerHTML = `τ = ${fmt(t, 2)}<i>i</i>. Curve: y² = 4x³ − ${fmt(g2, 2)}x ${g3 < 0 ? '+ ' + fmt(-g3, 2) : '− ' + fmt(g3, 2)}. ` +
        `The third crossing of the line, from its slope alone: x = ${fmt(x3, 4)}. From the lattice: ℘(z₁ + z₂) = ${fmt(p3[0], 4)}.` + (Math.abs(t - 1) < 0.006 ? ' <b>Square lattice: g₃ = 0.</b>' : '');
      void e2;
    });
    slider.addEventListener('input', () => { t = +slider.value; z.forEach(p => { if (p[1] !== 0) p[1] = t / 2; }); fig.dirty(); });
    pointer(fig, {
      hit: (x, y) => { if (!boxes) return null; const V = boxes.Vt; let best = null, bd = 26; z.forEach((p, i) => { const d = Math.hypot(x - V.X(p[0]), y - V.Y(p[1])); if (d < bd) { bd = d; best = i; } }); return best; },
      move: (i, x, y) => { const V = boxes.Vt; z[i][0] = Math.max(0.03, Math.min(0.97, V.ux(x))); z[i][1] = V.uy(y) > t / 4 ? t / 2 : 0; fig.dirty(); },
    });
  }

  /* ---------- Figure 2: one lattice, many bases ---------- */
  function figBasis() {
    const cv = $('c-basis'); if (!cv) return;
    const out = $('basis-read');
    let w1 = [1, 0], w2 = [2.3, 0.9], VL = null, VH = null, queue = [], timer = 0, trail = [];
    const o6 = new Float64Array(6), o2 = [0, 0];
    const tau = () => { const n = w1[0] * w1[0] + w1[1] * w1[1]; return [(w2[0] * w1[0] + w2[1] * w1[1]) / n, (w2[1] * w1[0] - w2[0] * w1[1]) / n]; };
    function apply(op) {
      trail.push(tau()); if (trail.length > 14) trail.shift();
      if (op === 'T') w2 = [w2[0] + w1[0], w2[1] + w1[1]];
      else if (op === 'Ti') w2 = [w2[0] - w1[0], w2[1] - w1[1]];
      else if (op === 'S') { const t = w1; w1 = w2; w2 = [-t[0], -t[1]]; }
    }
    function run() { if (!queue.length) { timer = 0; return; } apply(queue.shift()); read(); fig.dirty(); timer = setTimeout(run, 330); }
    function reduce() {
      if (timer) return; const t = tau(), steps = []; C.reduceTau(t[0], t[1], o6, steps);
      queue = []; for (const [g, n] of steps) { if (g === 'S') queue.push('S'); else for (let i = 0; i < Math.abs(n); i++) queue.push(n > 0 ? 'T' : 'Ti'); }
      if (queue.length > 60) queue = queue.slice(0, 60);
      run();
    }
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), narrow = w < 620, t = tau();
      const lw = narrow ? w : w * 0.44, lh = narrow ? h * 0.47 : h;
      // ---- the lattice
      VL = view(4, 24, lw - 8, lh - 28, -3.4, 3.4, -3.4, 3.4);
      label(ctx, 'the lattice, with a basis', 12, 13, { size: 11.5, col: th.soft, bold: true, halo: false });
      clipTo(ctx, VL, () => {
        ctx.beginPath(); ctx.moveTo(VL.X(0), VL.Y(0)); ctx.lineTo(VL.X(w1[0]), VL.Y(w1[1])); ctx.lineTo(VL.X(w1[0] + w2[0]), VL.Y(w1[1] + w2[1])); ctx.lineTo(VL.X(w2[0]), VL.Y(w2[1])); ctx.closePath();
        ctx.fillStyle = alpha(th.gold, 0.2); ctx.fill();
        const det = w1[0] * w2[1] - w1[1] * w2[0], B = 6;
        // enumerate lattice points inside the window by solving for the integer ranges
        const cs = [[-B, -B], [B, -B], [-B, B], [B, B]].map(c => [(c[0] * w2[1] - c[1] * w2[0]) / det, (w1[0] * c[1] - w1[1] * c[0]) / det]);
        const m0 = Math.floor(Math.min(...cs.map(c => c[0]))), m1 = Math.ceil(Math.max(...cs.map(c => c[0]))), n0 = Math.floor(Math.min(...cs.map(c => c[1]))), n1 = Math.ceil(Math.max(...cs.map(c => c[1])));
        if ((m1 - m0) * (n1 - n0) < 40000) for (let m = m0; m <= m1; m++) for (let n = n0; n <= n1; n++) { const x = m * w1[0] + n * w2[0], y = m * w1[1] + n * w2[1]; if (Math.abs(x) < 3.6 && Math.abs(y) < 3.6) dot(ctx, VL.X(x), VL.Y(y), 3.4, th.soft); }
        arrow(ctx, VL.X(0), VL.Y(0), VL.X(w1[0]), VL.Y(w1[1]), th.blue, 2.8); arrow(ctx, VL.X(0), VL.Y(0), VL.X(w2[0]), VL.Y(w2[1]), th.red, 2.8);
        dot(ctx, VL.X(0), VL.Y(0), 4, th.ink);
        label(ctx, 'ω₁', VL.X(w1[0]) + 10, VL.Y(w1[1]) + 12, { size: 13, col: th.blue, italic: true, serif: true, bold: true });
        label(ctx, 'ω₂', VL.X(w2[0]) + 10, VL.Y(w2[1]) - 10, { size: 13, col: th.red, italic: true, serif: true, bold: true });
      });
      // ---- the half-plane
      const rx = narrow ? 0 : lw, ry = narrow ? lh : 0, rw = narrow ? w : w - lw, rh = narrow ? h - lh : h;
      VH = view(rx + 8, ry + 24, rw - 16, rh - 46, -2.75, 2.75, 0, 2.9, 'bottom');
      label(ctx, 'the upper half-plane, with τ = ω₂ / ω₁', rx + 12, ry + 13, { size: 11.5, col: th.soft, bold: true, halo: false });
      clipTo(ctx, VH, () => {
        tilePath(ctx, VH, [1, 0, 0, 1], VH.y1 + 1); ctx.fillStyle = alpha(th.gold, 0.28); ctx.fill();
        tessellation(ctx, VH, alpha(th.soft, 0.55), 0.9);
        if (trail.length) { ctx.beginPath(); trail.concat([t]).forEach((p, i) => { const x = VH.X(p[0]), y = VH.Y(p[1]); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.strokeStyle = alpha(th.ink, 0.35); ctx.lineWidth = 1.2; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]); trail.forEach(p => dot(ctx, VH.X(p[0]), VH.Y(p[1]), 2.5, alpha(th.ink, 0.4))); }
      });
      halfPlaneAxis(ctx, VH);
      const tx = Math.max(VH.px + 8, Math.min(VH.px + VH.pw - 8, VH.X(t[0]))), ty = Math.max(VH.py + 8, VH.Y(t[1]));
      dot(ctx, tx, ty, 7.5, th.ink, th.bg, 2);
      label(ctx, 'τ', tx + 11, ty - 10, { size: 15, italic: true, serif: true, bold: true });
      label(ctx, 'reduced', VH.X(0), VH.Y(1.9), { size: 11, align: 'center', col: th.gold, bold: true, halo: false });
    });
    function read() {
      const t = tau(), red = Math.abs(t[0]) <= 0.5 + 1e-9 && t[0] * t[0] + t[1] * t[1] >= 1 - 1e-9;
      C.modularValue('j', t[0], t[1], o2); const j = [o2[0], o2[1]];
      C.modularValue('E4', t[0], t[1], o2); const e4 = [o2[0], o2[1]];
      // G4 of the lattice = w1^-4 * (pi^4/45) * E4(tau)
      const r = Math.hypot(w1[0], w1[1]), a = Math.atan2(w1[1], w1[0]), c = Math.pow(PI, 4) / 45 / Math.pow(r, 4), cr = c * Math.cos(-4 * a), ci = c * Math.sin(-4 * a);
      const G = [cr * e4[0] - ci * e4[1], cr * e4[1] + ci * e4[0]];
      out.innerHTML = `τ = ${cfmt(t[0], t[1], 3)} ${red ? '<span class="key k-gold">(reduced)</span>' : ''}<br>` +
        `<b>Belong to the lattice</b>, so <b>S</b> and <b>T</b> do not change them: Σ ω⁻⁴ = ${cfmt(G[0], G[1], 4)}, and <i>j</i> = ${cfmt(j[0], j[1], 2)}.<br>` +
        `<b>Belongs to the basis</b>, so it does change: E₄(τ) = ${cfmt(e4[0], e4[1], 4)}.`;
    }
    const stop = () => { queue = []; clearTimeout(timer); timer = 0; };
    $('basis-T').addEventListener('click', () => { stop(); apply('T'); read(); fig.dirty(); });
    $('basis-Ti').addEventListener('click', () => { stop(); apply('Ti'); read(); fig.dirty(); });
    $('basis-S').addEventListener('click', () => { stop(); apply('S'); read(); fig.dirty(); });
    $('basis-reduce').addEventListener('click', reduce);
    $('basis-new').addEventListener('click', () => {
      stop(); trail = [];
      // a random lattice, then a random change of basis so that it starts far from reduced
      const y = 0.9 + Math.random() * 0.9, x = Math.random() - 0.5, s = 0.8 + Math.random() * 0.5; w1 = [s, 0]; w2 = [s * x, s * y];
      const ops = ['T', 'T', 'S', 'Ti', 'T', 'S', 'T', 'Ti']; for (let i = 0; i < 5; i++) apply(ops[Math.floor(Math.random() * ops.length)]);
      trail = []; read(); fig.dirty();
    });
    pointer(fig, {
      hit: (x, y) => {
        if (!VL) return null; const t = tau();
        if (Math.hypot(x - VH.X(t[0]), y - VH.Y(t[1])) < 24) return 'tau';
        if (Math.hypot(x - VL.X(w2[0]), y - VL.Y(w2[1])) < 22) return 'w2';
        if (Math.hypot(x - VL.X(w1[0]), y - VL.Y(w1[1])) < 22) return 'w1';
        return null;
      },
      start: () => { stop(); trail = []; },
      move: (k, x, y) => {
        if (k === 'tau') { const tx = Math.max(-2.7, Math.min(2.7, VH.ux(x))), ty = Math.max(0.06, Math.min(2.85, VH.uy(y))); w2 = [tx * w1[0] - ty * w1[1], tx * w1[1] + ty * w1[0]]; }
        else {
          const p = [Math.max(-3.3, Math.min(3.3, VL.ux(x))), Math.max(-3.3, Math.min(3.3, VL.uy(y)))], a = k === 'w1' ? p : w1, b = k === 'w2' ? p : w2;
          const n = a[0] * a[0] + a[1] * a[1], im = (b[1] * a[0] - b[0] * a[1]) / n;
          if (n > 0.04 && im > 0.05) { w1 = a; w2 = b; }       // keep the pair positively oriented
        }
        read(); fig.dirty();
      },
    });
    read();
  }

  /* ---------- Figure 3: E4, E6, Delta and j over the half-plane ---------- */
  function figForms() {
    const cv = $('c-forms'); if (!cv) return;
    const out = $('forms-read'); let which = 'j', tiling = true, V = null, hover = null;
    const wt = { E4: 4, E6: 6, Delta: 12, j: 0 }, o = [0, 0];
    const fn = (u, v, res) => {
      if (v <= 0.004) { res[0] = NaN; res[1] = NaN; return; }
      C.modularValue(which, u, v, res);
      if (which !== 'j') res[2] = Math.hypot(res[0], res[1]) * Math.pow(v, wt[which] / 2) * (which === 'Delta' ? 300 : 1);
      else res[2] = Math.hypot(res[0], res[1]) / 1728;
    };
    let field;
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme();
      V = view(0, 0, w, h - 20, -1.62, 1.62, 0, 1.5, 'bottom');
      field.draw(ctx, V, which + '|' + w + '|' + h);
      clipTo(ctx, V, () => {
        if (tiling) tessellation(ctx, V, 'rgba(255,255,255,0.8)', 1);
        const mark = (x, y, s) => { dot(ctx, V.X(x), V.Y(y), 4, '#fff', th.ink, 1.5); label(ctx, s, V.X(x) + 8, V.Y(y) - 9, { size: 13, italic: true, serif: true, haloCol: 'rgba(255,255,255,0.85)' }); };
        mark(0, 1, 'i'); mark(-0.5, Math.sqrt(3) / 2, 'ρ'); mark(0.5, Math.sqrt(3) / 2, 'ρ + 1');
        if (hover) dot(ctx, V.X(hover[0]), V.Y(hover[1]), 5, null, '#fff', 2);
      });
      halfPlaneAxis(ctx, V, { half: true });
      const r = Math.min(24, w * 0.04); ctx.fillStyle = alpha(th.bg, 0.88); ctx.beginPath(); ctx.roundRect(8, 8, 2 * r + 46, 2 * r + 38, 8); ctx.fill();
      wheel(ctx, 8 + r + 23, 8 + r + 19, r);
    });
    field = new Field(fig, fn, { gain: 0.3 });
    const names = { E4: 'E₄', E6: 'E₆', Delta: 'Δ', j: 'j' };
    function read() {
      if (!hover) { out.innerHTML = 'Move over the picture to read off values.'; return; }
      C.modularValue(which, hover[0], hover[1], o);
      const big = Math.hypot(o[0], o[1]) > 1e7 || (Math.hypot(o[0], o[1]) < 1e-3 && Math.hypot(o[0], o[1]) > 0);
      const val = big ? `${o[0].toExponential(3)} ${o[1] < 0 ? '−' : '+'} ${Math.abs(o[1]).toExponential(3)}i`.replace(/-/g, '−') : cfmt(o[0], o[1], 3);
      out.innerHTML = `τ = ${cfmt(hover[0], hover[1], 3)}: &nbsp; ${names[which]}(τ) = ${val}`;
    }
    seg('forms-which', which, v => { which = v; read(); fig.dirty(); });
    $('forms-tiling').addEventListener('change', e => { tiling = e.target.checked; fig.dirty(); });
    const at = (x, y) => { if (x === null || !V || !V.has(x, y) || V.uy(y) < 0.01) hover = null; else hover = [V.ux(x), V.uy(y)]; read(); fig.dirty(); };
    pointer(fig, { hover: at, tap: at });
    read();
  }

  onReady(() => { figCubic(); figBasis(); figForms(); });
})();
