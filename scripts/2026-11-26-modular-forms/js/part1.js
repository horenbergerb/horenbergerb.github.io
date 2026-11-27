/* Part 1 figures: arcs on the circle and the lemniscate; the lemniscate sine in
   the complex plane; the pendulum and its two periods. */
(function () {
  'use strict';
  const { C, theme, alpha, Fig, pointer, view, clipTo, dot, line, label, panel, Field, wheel, fmt, $, onReady, seg, TAU } = window.MF;
  const W = C.VARPI, PI = Math.PI, o2 = [0, 0];
  const sl = s => C.sl(s, 0, o2)[0];
  const quarter = s => { const m = ((s / W) % 2 + 2) % 2; return (m <= 0.5 || m >= 1.5) ? 1 : -1; };   // sign of sl'(s)
  const dsl = s => quarter(s) * Math.sqrt(Math.max(0, 1 - Math.pow(sl(s), 4)));
  function lemPt(s) { const r = sl(s), th = quarter(s) * 0.5 * Math.acos(Math.min(1, r * r)); return [r * Math.cos(th), r * Math.sin(th)]; }

  /* ---------- Figure 1: the same game on two curves ---------- */
  function figArcs() {
    const cv = $('c-arcs'); if (!cv) return;
    const slider = $('arcs-s'), dblBox = $('arcs-dbl'), out = $('arcs-read');
    let s = +slider.value, dbl = dblBox.checked, lemV = null;
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), narrow = w < 620;
      const gh = narrow ? h * 0.26 : h * 0.34, top = h - gh;
      const cw = narrow ? w * 0.36 : w * 0.3;
      // circle
      const Vc = view(6, 22, cw - 12, top - 30, -1.25, 1.25, -1.25, 1.25);
      label(ctx, 'circle', 12, 12, { size: 11.5, col: th.soft, bold: true, halo: false });
      ctx.beginPath(); ctx.arc(Vc.X(0), Vc.Y(0), Vc.s, 0, TAU); ctx.strokeStyle = th.faint; ctx.lineWidth = 1.5; ctx.stroke();
      line(ctx, Vc.X(-1.2), Vc.Y(0), Vc.X(1.2), Vc.Y(0), th.rule, 1);
      const sc = s % TAU;
      ctx.beginPath(); ctx.arc(Vc.X(0), Vc.Y(0), Vc.s, 0, -sc, true); ctx.strokeStyle = th.blue; ctx.lineWidth = 3.5; ctx.stroke();
      const cx = Math.cos(s), cy = Math.sin(s);
      line(ctx, Vc.X(cx), Vc.Y(cy), Vc.X(cx), Vc.Y(0), th.ink, 2);
      if (dbl) { ctx.beginPath(); ctx.arc(Vc.X(0), Vc.Y(0), Vc.s + 6, 0, -((2 * s) % TAU), true); ctx.strokeStyle = alpha(th.gold, 0.8); ctx.lineWidth = 2; ctx.stroke(); dot(ctx, Vc.X(Math.cos(2 * s)), Vc.Y(Math.sin(2 * s)), 5, th.gold, th.ink, 1); }
      dot(ctx, Vc.X(cx), Vc.Y(cy), 6, th.blue, th.bg, 2);
      label(ctx, 'sin s', Vc.X(cx) + (cx > 0 ? -8 : 8), Vc.Y(cy / 2), { size: 12, align: cx > 0 ? 'right' : 'left', italic: true, serif: true });
      // lemniscate
      const Vl = view(cw + 6, 22, w - cw - 12, top - 30, -1.12, 1.12, -0.5, 0.5); lemV = Vl;
      label(ctx, 'lemniscate', cw + 12, 12, { size: 11.5, col: th.soft, bold: true, halo: false });
      ctx.beginPath(); for (let i = 0; i <= 400; i++) { const p = lemPt(2 * W * i / 400); if (i) ctx.lineTo(Vl.X(p[0]), Vl.Y(p[1])); else ctx.moveTo(Vl.X(p[0]), Vl.Y(p[1])); }
      ctx.strokeStyle = th.faint; ctx.lineWidth = 1.5; ctx.stroke();
      const trace = (upto, col, lw, off) => { const m = upto % (2 * W), n = Math.max(2, Math.ceil(m * 60)); ctx.beginPath(); for (let i = 0; i <= n; i++) { const p = lemPt(m * i / n); const x = Vl.X(p[0]), y = Vl.Y(p[1]) - off; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); };
      if (dbl) trace(2 * s, alpha(th.gold, 0.8), 7, 0);
      trace(s, th.red, 3.5, 0);
      const p = lemPt(s);
      line(ctx, Vl.X(0), Vl.Y(0), Vl.X(p[0]), Vl.Y(p[1]), th.ink, 2);
      dot(ctx, Vl.X(0), Vl.Y(0), 3, th.ink);
      if (dbl) { const q = lemPt(2 * s); dot(ctx, Vl.X(q[0]), Vl.Y(q[1]), 5, th.gold, th.ink, 1); }
      dot(ctx, Vl.X(p[0]), Vl.Y(p[1]), 6.5, th.red, th.bg, 2);
      label(ctx, 'sl s', Vl.X(p[0] / 2), Vl.Y(p[1] / 2) - 11, { size: 12, align: 'center', italic: true, serif: true });
      // graphs
      const gx0 = 34, gx1 = w - 14, gy = top + gh / 2, amp = gh / 2 - 16, smax = 2 * TAU, X = t => gx0 + (gx1 - gx0) * t / smax;
      line(ctx, gx0, gy, gx1, gy, th.rule, 1); line(ctx, gx0, gy - amp - 4, gx0, gy + amp + 4, th.rule, 1);
      const curve = (f, col) => { ctx.beginPath(); for (let i = 0; i <= 500; i++) { const t = smax * i / 500, x = X(t), y = gy - amp * f(t); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); };
      curve(Math.sin, th.blue); curve(sl, th.red);
      for (const [t, name, col] of [[TAU, '2π', th.blue], [2 * W, '2ϖ', th.red], [2 * TAU, '4π', th.blue], [4 * W, '4ϖ', th.red]]) { line(ctx, X(t), gy - 5, X(t), gy + 5, col, 1.5); label(ctx, name, X(t), gy + 15, { size: 11, align: 'center', col }); }
      line(ctx, X(s), gy - amp - 6, X(s), gy + amp + 6, th.ink, 1, [3, 3]);
      dot(ctx, X(s), gy - amp * Math.sin(s), 4.5, th.blue, th.bg, 1.5); dot(ctx, X(s), gy - amp * sl(s), 4.5, th.red, th.bg, 1.5);
      label(ctx, 'arc length s', gx1, gy + amp + 8, { size: 11, align: 'right', col: th.soft, halo: false });
      label(ctx, '1', gx0 - 6, gy - amp, { size: 10.5, align: 'right', col: th.soft, halo: false }); label(ctx, '−1', gx0 - 6, gy + amp, { size: 10.5, align: 'right', col: th.soft, halo: false });
    });
    function read() {
      const r = sl(s), r2 = 2 * r * dsl(s) / (1 + Math.pow(r, 4)), x = Math.sin(s);
      out.innerHTML = `<b>s = ${fmt(s, 3)}</b>. Circle: sin s = ${fmt(x, 4)}, and 2·sin s·cos s = ${fmt(2 * x * Math.cos(s), 4)} = sin 2s. ` +
        `Lemniscate: sl s = ${fmt(r, 4)}, and Fagnano’s expression gives ${fmt(r2, 4)}; measuring the doubled arc directly gives sl 2s = ${fmt(sl(2 * s), 4)}.`;
    }
    slider.addEventListener('input', () => { s = +slider.value; read(); fig.dirty(); });
    dblBox.addEventListener('change', () => { dbl = dblBox.checked; fig.dirty(); });
    pointer(fig, {
      hit: (x, y) => { if (!lemV) return null; const p = lemPt(s); return Math.hypot(x - lemV.X(p[0]), y - lemV.Y(p[1])) < 22 ? 'pt' : null; },
      move: (_, x, y) => {
        let best = s, bd = 1e9;                      // nearest point of the curve, searched near the current s so the two branches at the crossing do not swap
        for (let i = -60; i <= 60; i++) { const t = Math.min(2 * TAU, Math.max(0, s + i * 0.008)), p = lemPt(t), d = Math.hypot(x - lemV.X(p[0]), y - lemV.Y(p[1])); if (d < bd) { bd = d; best = t; } }
        s = best; slider.value = s; read(); fig.dirty();
      },
    });
    read();
  }

  /* ---------- Figure 2: sin and sl over the complex plane ---------- */
  function figPlane() {
    const cv = $('c-plane'); if (!cv) return;
    const out = $('plane-read'); let mode = 'sl', n = 3, u0 = 0.8, cells = true, V = null;
    const fn = (u, v, o) => {
      if (mode === 'sl') C.sl(u, v, o);
      else { o[0] = Math.sin(u) * Math.cosh(v); o[1] = Math.cos(u) * Math.sinh(v); }
    };
    let field;
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme();
      V = view(0, 0, w, h, -3.5, 3.5, -3.45, 3.45);
      field.draw(ctx, V, mode + '|' + w + '|' + h);
      clipTo(ctx, V, () => {
        // axes
        line(ctx, V.X(V.x0), V.Y(0), V.X(V.x1), V.Y(0), 'rgba(0,0,0,0.45)', 1); line(ctx, V.X(0), V.Y(V.y0), V.X(0), V.Y(V.y1), 'rgba(0,0,0,0.45)', 1);
        const P = mode === 'sl' ? 2 * W : TAU;
        if (cells) {
          ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.6;
          if (mode === 'sl') {
            for (let k = -6; k <= 6; k++) { // the true period lattice: diamonds with corners at the common zeros
              ctx.beginPath(); ctx.moveTo(V.X(V.x0), V.Y(V.x0 - P * k)); ctx.lineTo(V.X(V.x1), V.Y(V.x1 - P * k)); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(V.X(V.x0), V.Y(-V.x0 + P * k)); ctx.lineTo(V.X(V.x1), V.Y(-V.x1 + P * k)); ctx.stroke();
            }
            ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1.2;
            ctx.strokeRect(V.X(-W), V.Y(W), P * V.s, P * V.s); ctx.setLineDash([]);
          } else for (let k = -4; k <= 4; k++) { ctx.beginPath(); ctx.moveTo(V.X(PI + P * k), V.Y(V.y0)); ctx.lineTo(V.X(PI + P * k), V.Y(V.y1)); ctx.stroke(); }
        }
        // division points: solutions z of f(n z) = f(u0)
        if (n > 1) {
          const half = (n - 1) / 2;
          for (let a = -half; a <= half; a++) for (let b = (mode === 'sl' ? -half : 0); b <= (mode === 'sl' ? half : 0); b++) {
            const x = (u0 + P * a) / n, y = P * b / n;
            if (b === 0) dot(ctx, V.X(x), V.Y(y), 6, th.gold, th.ink, 1.5); else dot(ctx, V.X(x), V.Y(y), 5.5, '#fff', th.ink, 1.5);
          }
        }
        // the target u0
        ctx.save(); ctx.translate(V.X(u0), V.Y(0)); ctx.rotate(PI / 4); ctx.fillStyle = th.ink; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.fillRect(-5.5, -5.5, 11, 11); ctx.strokeRect(-5.5, -5.5, 11, 11); ctx.restore();
        label(ctx, 'u', V.X(u0), V.Y(0) + 19, { size: 13, align: 'center', italic: true, serif: true, haloCol: 'rgba(255,255,255,0.85)' });
      });
      // legend
      const r = Math.min(26, w * 0.045); ctx.fillStyle = alpha(th.bg, 0.88); ctx.beginPath(); ctx.roundRect(8, 8, 2 * r + 46, 2 * r + 38, 8); ctx.fill();
      wheel(ctx, 8 + r + 23, 8 + r + 19, r);
    });
    field = new Field(fig, fn, { gain: 0.5 });
    function read() {
      const name = mode === 'sl' ? 'sl' : 'sin', c = mode === 'sl' ? sl(u0) : Math.sin(u0);
      if (n === 1) { out.innerHTML = `Drag the diamond <i>u</i> along the real axis. Choose a number of parts to see every point <i>z</i> with ${name}(<i>n z</i>) = ${name}(<i>u</i>).`; return; }
      const tot = mode === 'sl' ? n * n : n;
      out.innerHTML = `${name}(<i>u</i>) = ${fmt(c, 4)}. The equation ${name}(${n}<i>z</i>) = ${name}(<i>u</i>) has <b>${tot}</b> solutions that are not repeats of one another: ` +
        (mode === 'sl' ? `<span class="key k-gold">${n} on the real axis</span> and ${n * n - n} off it.` : `<span class="key k-gold">all ${n} on the real axis</span>.`);
    }
    seg('plane-mode', mode, v => { mode = v; read(); fig.dirty(); });
    seg('plane-n', String(n), v => { n = +v; read(); fig.dirty(); });
    $('plane-cells').addEventListener('change', e => { cells = e.target.checked; fig.dirty(); });
    pointer(fig, {
      hit: (x, y) => V && Math.hypot(x - V.X(u0), y - V.Y(0)) < 24 ? 'u' : null,
      move: (_, x) => { u0 = Math.max(V.x0 + 0.1, Math.min(V.x1 - 0.1, V.ux(x))); read(); fig.dirty(); },
    });
    read();
  }

  /* ---------- Figure 3: the pendulum, and the same pendulum with gravity reversed ---------- */
  function figPendulum() {
    const cv = $('c-pend'); if (!cv) return;
    const slider = $('pend-a'), out = $('pend-read'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let a0 = +slider.value * PI / 180, th1, th2, t = 0, k, K, Kp, running = !still, tab1, tab2;
    const NT = 1200;
    /* one full period of theta'' = sg * sin(theta), released at rest from a0, sampled at NT points (classical RK4) */
    function table(sg, period) {
      const tab = new Float64Array(NT + 1), sub = 6, h = period / (NT * sub); let th = a0, w = 0;
      for (let i = 0; i <= NT; i++) {
        tab[i] = th;
        for (let j = 0; j < sub; j++) {
          const a1 = sg * Math.sin(th), b1 = w, a2 = sg * Math.sin(th + 0.5 * h * b1), b2 = w + 0.5 * h * a1;
          const a3 = sg * Math.sin(th + 0.5 * h * b2), b3 = w + 0.5 * h * a2, a4 = sg * Math.sin(th + h * b3), b4 = w + h * a3;
          th += h * (b1 + 2 * b2 + 2 * b3 + b4) / 6; w += h * (a1 + 2 * a2 + 2 * a3 + a4) / 6;
        }
      }
      return tab;
    }
    const lookup = (tab, period) => { const u = (t % period) / period * NT, i = Math.floor(u), f = u - i; return tab[i] * (1 - f) + tab[Math.min(NT, i + 1)] * f; };
    function reset() {
      t = 0; k = Math.sin(a0 / 2); K = C.ellipK(k); Kp = C.ellipK(Math.sqrt(1 - k * k));
      tab1 = table(-1, 4 * K); tab2 = table(1, 4 * Kp); th1 = th2 = a0; read();
    }
    function step(dt) { t += dt; th1 = lookup(tab1, 4 * K); th2 = lookup(tab2, 4 * Kp); }
    const fig = new Fig(cv, (ctx, w, h) => {
      const T = theme(), narrow = w < 620;
      const lw = narrow ? w : w * 0.46, lh = narrow ? h * 0.44 : h;
      // --- the two pendulums
      const L = Math.min(lw, lh) * (narrow ? 0.33 : 0.36), px = lw / 2, py = lh / 2 + (narrow ? 16 : 2);
      const arc = (from, to, col) => { ctx.beginPath(); ctx.arc(px, py, L, PI / 2 - from, PI / 2 - to, from < to); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke(); };
      arc(-a0, a0, alpha(T.blue, 0.22)); arc(a0, TAU - a0, alpha(T.red, 0.2));
      const bob = (th, col, r) => { const x = px + L * Math.sin(th), y = py + L * Math.cos(th); line(ctx, px, py, x, y, col, 2.5); dot(ctx, x, y, r, col, T.bg, 2); };
      bob(th2, alpha(T.red, 0.9), 9); bob(th1, T.blue, 11);
      dot(ctx, px, py, 3.5, T.ink);
      label(ctx, 'gravity down: swings through the bottom', 12, 14, { size: 11.5, col: T.blue, bold: true, halo: false });
      label(ctx, 'gravity up: the same release, over the top', 12, 31, { size: 11.5, col: T.red, bold: true, halo: false });
      // arrows for gravity
      line(ctx, lw - 26, lh - 54, lw - 26, lh - 22, T.blue, 2); ctx.beginPath(); ctx.moveTo(lw - 26, lh - 16); ctx.lineTo(lw - 31, lh - 25); ctx.lineTo(lw - 21, lh - 25); ctx.closePath(); ctx.fillStyle = T.blue; ctx.fill();
      line(ctx, lw - 44, lh - 48, lw - 44, lh - 16, T.red, 2); ctx.beginPath(); ctx.moveTo(lw - 44, lh - 54); ctx.lineTo(lw - 49, lh - 45); ctx.lineTo(lw - 39, lh - 45); ctx.closePath(); ctx.fillStyle = T.red; ctx.fill();
      // --- the period rectangle of the bob's height
      const rx = narrow ? 0 : lw, ry = narrow ? lh : 0, rw = narrow ? w : w - lw, rh = narrow ? h - lh : h;
      panel(ctx, rx + 4, ry + 4, rw - 8, rh - 8, narrow ? 'period rectangle of the bob’s height' : 'period rectangle of the bob’s height, in the plane of complex time');
      const bx = rx + 54, by = ry + rh - 42, availW = rw - 84, availH = rh - 88;
      const sc = Math.min(availW / (2 * 3.2), availH / (2 * 3.2));   // fits K, K' up to 3.2
      const rwid = 2 * K * sc, rhei = 2 * Kp * sc, clipW = Math.min(rwid, availW + 8), clipH = Math.min(rhei, availH + 8);
      ctx.save(); ctx.beginPath(); ctx.rect(bx - 2, by - availH - 12, availW + 14, availH + 14); ctx.clip();
      ctx.fillStyle = alpha(T.gold, 0.16); ctx.fillRect(bx, by - rhei, rwid, rhei);
      ctx.strokeStyle = T.gold; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by - rhei, rwid, rhei);
      // faint repeats
      ctx.strokeStyle = alpha(T.gold, 0.35); ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) if (i + j) { const x = bx + i * rwid, y = by - (j + 1) * rhei; if (x < bx + availW + 20 && y + rhei > by - availH - 20) ctx.strokeRect(x, y, rwid, rhei); }
      ctx.restore();
      line(ctx, bx, by, bx + clipW, by, T.blue, 3.5); line(ctx, bx, by, bx, by - clipH, T.red, 3.5);
      const fx = (t % (2 * K)) / (2 * K) * rwid, fy = (t % (2 * Kp)) / (2 * Kp) * rhei;
      if (fx <= clipW) dot(ctx, bx + fx, by, 5.5, T.blue, T.bg, 1.5); if (fy <= clipH) dot(ctx, bx, by - fy, 5.5, T.red, T.bg, 1.5);
      label(ctx, `2K = ${fmt(2 * K, 3)}`, bx + Math.min(clipW, availW) / 2, by + 15, { size: 12, align: 'center', col: T.blue, bold: true, halo: false });
      ctx.save(); ctx.translate(bx - 14, by - Math.min(clipH, availH) / 2); ctx.rotate(-PI / 2); label(ctx, `2K′ = ${fmt(2 * Kp, 3)}`, 0, 0, { size: 12, align: 'center', col: T.red, bold: true, halo: false }); ctx.restore();
      label(ctx, 'real time →', bx + availW + 8, by + 15, { size: 10.5, align: 'right', col: T.soft, halo: false });
      label(ctx, 'imaginary time ↑', bx + 6, by - availH - 2, { size: 10.5, col: T.soft, halo: false });
      if (Math.abs(K - Kp) < 0.02) label(ctx, 'a square: the lemniscate’s shape', bx + rwid + 10, by - rhei / 2, { size: 11.5, col: T.gold, bold: true });
    }, { tick: dt => { if (running) { step(dt * 1.4); return true; } return false; } });
    function read() {
      out.innerHTML = `Released at <b>${Math.round(a0 * 180 / PI)}°</b>: <i>k</i> = sin(${fmt(a0 * 90 / PI, 1)}°) = ${fmt(k, 4)}. ` +
        `<span class="key k-blue">Swing period 4K = ${fmt(4 * K, 4)}</span> (a small swing takes 2π = 6.2832). ` +
        `<span class="key k-red">Reversed-gravity period 4K′ = ${fmt(4 * Kp, 4)}</span>. Ratio K′/K = ${fmt(Kp / K, 4)}.`;
    }
    slider.addEventListener('input', () => { a0 = +slider.value * PI / 180; reset(); fig.dirty(); });
    const btn = $('pend-run'); if (btn) btn.addEventListener('click', () => { running = !running; btn.textContent = running ? 'Pause' : 'Run'; fig.dirty(); });
    if (btn && still) btn.textContent = 'Run';
    reset();
  }

  onReady(() => { figArcs(); figPlane(); figPendulum(); });
})();
