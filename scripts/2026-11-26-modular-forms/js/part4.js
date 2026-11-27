/* Part 4 figures: points of a cubic modulo p against the coefficients of a
   product; the period lattice of the weight-2 form of level 11. */
(function () {
  'use strict';
  const { C, theme, alpha, Fig, pointer, view, clipTo, dot, line, label, panel, tessellation, tilePath, geodesic, halfPlaneAxis, fmt, cfmt, minus, $, onReady, seg, TAU } = window.MF;
  const PI = Math.PI, E = [0, -1, 1, -10, -20];
  const sgn = n => minus(String(n));

  /* ---------- Figure 1: counting points, and reading coefficients ---------- */
  function figCount() {
    const cv = $('c-count'); if (!cv) return;
    const out = $('count-read'), tab = $('count-table'), sel = $('count-p');
    const primes = C.primesUpTo(400), a = C.level11(400), small = C.primesUpTo(97);
    small.forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = p; sel.appendChild(o); });
    let p = 13, d = 1; sel.value = p;
    const cache = {};
    const chi = q => (d === 1 ? 1 : (q === 2 || d % q === 0) ? null : C.legendre(d, q));
    const counted = q => { const k = d + ':' + q; if (!(k in cache)) cache[k] = d === 1 ? C.ecAp(E, q) : (chi(q) === null ? null : C.ecTwistAp(E, d, q)); return cache[k]; };
    function solutions(q) {
      if (d === 1) return C.ecPoints(E, q);
      const pts = []; if (chi(q) === null) return pts;
      for (let x = 0; x < q; x++) { const g = C.mod(4 * (((x - 1) * x - 10) * x - 20) + 1, q); for (let y = 0; y < q; y++) if (C.mod(d * y * y - g, q) === 0) pts.push([x, y]); }
      return pts;
    }
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), narrow = w < 620, lw = narrow ? w : Math.min(h, w * 0.4), lh = narrow ? h * 0.5 : h;
      // ---- grid of residues
      const pts = solutions(p), pad = 30, size = Math.min(lw - pad - 10, lh - pad - 26), gx = pad, gy = 24, cell = size / p;
      label(ctx, `solutions modulo ${p}`, 12, 12, { size: 11.5, col: th.soft, bold: true, halo: false });
      ctx.fillStyle = th.panel; ctx.fillRect(gx, gy, size, size); ctx.strokeStyle = th.rule; ctx.lineWidth = 1; ctx.strokeRect(gx + 0.5, gy + 0.5, size, size);
      if (cell > 5) { ctx.beginPath(); for (let i = 1; i < p; i++) { ctx.moveTo(gx + i * cell, gy); ctx.lineTo(gx + i * cell, gy + size); ctx.moveTo(gx, gy + i * cell); ctx.lineTo(gx + size, gy + i * cell); } ctx.strokeStyle = alpha(th.faint, 0.5); ctx.lineWidth = 0.6; ctx.stroke(); }
      for (const [x, y] of pts) dot(ctx, gx + (x + 0.5) * cell, gy + size - (y + 0.5) * cell, Math.max(1.6, Math.min(7, cell * 0.36)), th.red);
      label(ctx, 'x →', gx + size, gy + size + 12, { size: 10.5, align: 'right', col: th.soft, halo: false });
      ctx.save(); ctx.translate(gx - 12, gy); ctx.rotate(-PI / 2); label(ctx, d === 1 ? 'y →' : 'Y →', 0, 0, { size: 10.5, align: 'right', col: th.soft, halo: false }); ctx.restore();
      // ---- a_p against p, with Hasse's bound
      const rx = narrow ? 0 : lw, ry = narrow ? lh : 0, rw = narrow ? w : w - lw, rh = narrow ? h - lh : h;
      panel(ctx, rx + 4, ry + 4, rw - 8, rh - 8, 'dots: coefficient of qᵖ.  rings: p + 1 − (number of points)');
      const bx = rx + 40, bw = rw - 60, by = ry + rh / 2 + 6, amp = rh / 2 - 40, X = q => bx + bw * q / 400, Y = v => by - amp * v / 40;
      line(ctx, bx, by, bx + bw, by, th.rule, 1);
      for (const s of [1, -1]) { ctx.beginPath(); for (let q = 0; q <= 400; q += 4) { const x = X(q), y = Y(s * 2 * Math.sqrt(q)); if (q) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.strokeStyle = th.gold; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]); }
      label(ctx, '2√p', X(400) - 4, Y(40) + 12, { size: 11, align: 'right', col: th.gold, bold: true }); label(ctx, '−2√p', X(400) - 4, Y(-40) - 10, { size: 11, align: 'right', col: th.gold, bold: true });
      for (const q of primes) {
        const c = chi(q), v = c === null ? null : c * a[q], n = counted(q);
        if (v !== null) dot(ctx, X(q), Y(v), q === p ? 4.5 : 2.4, q === p ? th.red : th.blue);
        if (n !== null) dot(ctx, X(q), Y(n), q === p ? 7.5 : 4.6, null, q === p ? th.red : alpha(th.ink, 0.55), 1.1);
      }
      for (const q of [100, 200, 300, 400]) label(ctx, String(q), X(q), ry + rh - 18, { size: 10.5, align: 'center', col: th.soft, halo: false });
      for (const v of [-20, 20]) label(ctx, sgn(v), bx - 6, Y(v), { size: 10.5, align: 'right', col: th.soft, halo: false });
      label(ctx, 'prime p', bx + bw * 0.375, ry + rh - 18, { size: 10.5, align: 'center', col: th.soft, halo: false });
    });
    function table() {
      let html = '<table><tr><th class="num">p</th><th class="num">points mod p, plus one at infinity</th><th class="num">p + 1 − points</th><th class="num">' + (d === 1 ? 'coefficient of q<sup>p</sup>' : `(${d}/p) × coefficient of q<sup>p</sup>`) + '</th></tr>';
      for (const q of small) {
        const n = counted(q), c = chi(q);
        html += `<tr${q === p ? ' class="hl"' : ''}><td class="num">${q}</td>` + (n === null ? '<td class="num">—</td><td class="num">—</td><td class="num">—</td>' : `<td class="num">${q + 1 - n}</td><td class="num">${sgn(n)}</td><td class="num">${d === 1 ? sgn(a[q]) : `${sgn(c)} × ${sgn(a[q])} = ${sgn(c * a[q])}`}</td>`) + '</tr>';
      }
      tab.innerHTML = html + '</table>';
    }
    function read() {
      const n = counted(p);
      const eq = d === 1 ? 'y² + y = x³ − x² − 10x − 20' : `${sgn(d)}·Y² = 4x³ − 4x² − 40x − 79`;
      out.innerHTML = n === null ? `The prime ${p} divides ${p === 2 ? 'the 4 in the twisted equation' : 'the twisting number'}, so it is skipped.` :
        `Modulo <b>${p}</b> the equation ${eq} has ${solutions(p).length} solutions. With the point at infinity that is ${p + 1 - n}, and ${p} + 1 − ${p + 1 - n} = <b>${sgn(n)}</b>. ` +
        (d === 1 ? `The coefficient of q<sup>${p}</sup> in the product is <b>${sgn(a[p])}</b>.` : `The coefficient of q<sup>${p}</sup> is ${sgn(a[p])}, and ${sgn(d)} is ${chi(p) === 1 ? 'a square' : 'not a square'} modulo ${p}, so the twisted coefficient is <b>${sgn(chi(p) * a[p])}</b>.`);
    }
    const upd = () => { read(); table(); fig.dirty(); };
    sel.addEventListener('change', () => { p = +sel.value; upd(); });
    seg('count-d', String(d), v => { d = +v; upd(); });
    upd();
  }

  /* ---------- Figure 2: the form builds its own lattice ---------- */
  function figPeriods() {
    const cv = $('c-periods'); if (!cv) return;
    const out = $('per-read'), a = C.level11(600);
    function period(ga, c, d) { // integral of 2 pi i f dtau from (-d + i)/c to (ga + i)/c
      let re = 0, im = 0, mm = 1; const m = Math.exp(-TAU / c);
      for (let n = 1; n <= 600; n++) { mm *= m; if (mm < 1e-17) break; const w = a[n] / n * mm; re += w * (Math.cos(TAU * n * ga / c) - Math.cos(TAU * n * d / c)); im += w * (Math.sin(TAU * n * ga / c) + Math.sin(TAU * n * d / c)); }
      return [re, im];
    }
    const loops = [];
    for (const c of [11, 22, 33]) for (let d = 1; d < c; d++) { if (C.gcd(c, d) !== 1) continue; const ga = C.mod(C.xgcd(d, c)[1], c); loops.push({ g: [ga, (ga * d - 1) / c, c, d], P: period(ga, c, d) }); }
    const nz = loops.filter(l => Math.hypot(l.P[0], l.P[1]) > 1e-9).sort((u, v) => Math.hypot(u.P[0], u.P[1]) - Math.hypot(v.P[0], v.P[1]));
    let w1 = nz[0].P; if (w1[0] < 0) w1 = [-w1[0], -w1[1]];
    let w2 = null; for (const l of nz) { const cr = w1[0] * l.P[1] - w1[1] * l.P[0]; if (Math.abs(cr) > 1e-6) { w2 = cr > 0 ? l.P : [-l.P[0], -l.P[1]]; break; } }
    const det = w1[0] * w2[1] - w1[1] * w2[0];
    loops.forEach(l => { l.m = Math.round((l.P[0] * w2[1] - l.P[1] * w2[0]) / det); l.n = Math.round((w1[0] * l.P[1] - w1[1] * l.P[0]) / det); l.err = Math.hypot(l.P[0] - l.m * w1[0] - l.n * w2[0], l.P[1] - l.m * w1[1] - l.n * w2[1]); });
    const n1 = w1[0] * w1[0] + w1[1] * w1[1], tau = [(w2[0] * w1[0] + w2[1] * w1[1]) / n1, (w2[1] * w1[0] - w2[0] * w1[1]) / n1], jv = [0, 0];
    C.modularValue('j', tau[0], tau[1], jv);
    let sel = 1, VH = null, VP = null;
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), narrow = w < 620, lw = narrow ? w : w * 0.5, lh = narrow ? h * 0.46 : h, L = loops[sel];
      // ---- the half-plane with a fundamental domain for level 11
      VH = view(8, 24, lw - 16, lh - 46, -0.66, 0.66, 0, 1.12, 'bottom');
      label(ctx, 'upper half-plane: one closed loop on the level-11 surface', 12, 13, { size: 11.5, col: th.soft, bold: true, halo: false });
      clipTo(ctx, VH, () => {
        tilePath(ctx, VH, [1, 0, 0, 1], VH.y1 + 1); ctx.fillStyle = alpha(th.gold, 0.3); ctx.fill();
        for (let j = -5; j <= 5; j++) { tilePath(ctx, VH, [0, -1, 1, j], VH.y1 + 1); ctx.fillStyle = alpha(th.gold, 0.3); ctx.fill(); }
        tessellation(ctx, VH, alpha(th.soft, 0.45), 0.8);
        const p0 = [-L.g[3] / L.g[2], 1 / L.g[2]], p1 = [L.g[0] / L.g[2], 1 / L.g[2]];
        const wrap = x => x - Math.round(x), x0 = wrap(p0[0]), x1 = wrap(p1[0]);   // shown modulo whole-number shifts, which the form does not see
        ctx.beginPath(); geodesic(ctx, VH, [x0, p0[1]], [x1, p1[1]], 2, true); ctx.strokeStyle = th.red; ctx.lineWidth = 2.6; ctx.stroke();
        dot(ctx, VH.X(x0), VH.Y(p0[1]), 5, th.red, th.bg, 1.5); dot(ctx, VH.X(x1), VH.Y(p1[1]), 5, th.red, th.bg, 1.5);
        label(ctx, 'τ₀', VH.X(x0) - 4, VH.Y(p0[1]) - 14, { size: 13, align: 'center', italic: true, serif: true }); label(ctx, 'γτ₀', VH.X(x1) + 4, VH.Y(p1[1]) - 14, { size: 13, align: 'center', italic: true, serif: true });
      });
      halfPlaneAxis(ctx, VH);
      // ---- the plane of values of the integral
      const rx = narrow ? 0 : lw, ry = narrow ? lh : 0, rw = narrow ? w : w - lw, rh = narrow ? h - lh : h;
      panel(ctx, rx + 4, ry + 4, rw - 8, rh - 8, 'values of the integral of f around ' + loops.length + ' loops');
      VP = view(rx + 10, ry + 26, rw - 20, rh - 36, -4.3, 4.3, -3.4, 3.4);
      clipTo(ctx, VP, () => {
        ctx.strokeStyle = alpha(th.gold, 0.6); ctx.lineWidth = 1;
        for (let k = -8; k <= 8; k++) { // the grid of the lattice
          ctx.beginPath(); ctx.moveTo(VP.X(k * w2[0] - 9 * w1[0]), VP.Y(k * w2[1] - 9 * w1[1])); ctx.lineTo(VP.X(k * w2[0] + 9 * w1[0]), VP.Y(k * w2[1] + 9 * w1[1])); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(VP.X(k * w1[0] - 9 * w2[0]), VP.Y(k * w1[1] - 9 * w2[1])); ctx.lineTo(VP.X(k * w1[0] + 9 * w2[0]), VP.Y(k * w1[1] + 9 * w2[1])); ctx.stroke();
        }
        dot(ctx, VP.X(0), VP.Y(0), 3.5, th.ink);
        loops.forEach((l, i) => { if (i !== sel) dot(ctx, VP.X(l.P[0]), VP.Y(l.P[1]), 5, alpha(th.blue, 0.8), th.bg, 1.2); });
        line(ctx, VP.X(0), VP.Y(0), VP.X(L.P[0]), VP.Y(L.P[1]), th.red, 2); dot(ctx, VP.X(L.P[0]), VP.Y(L.P[1]), 7, th.red, th.bg, 1.8);
        label(ctx, 'ω₁', VP.X(w1[0]) + 6, VP.Y(w1[1]) + 14, { size: 13, italic: true, serif: true, col: th.gold, bold: true });
        label(ctx, 'ω₂', VP.X(w2[0]) + 8, VP.Y(w2[1]) - 12, { size: 13, italic: true, serif: true, col: th.gold, bold: true });
      });
    });
    function read() {
      const L = loops[sel], worst = Math.max(...loops.map(l => l.err));
      out.innerHTML = `Loop for γ = (${L.g.map(sgn).join(', ')}): the integral is ${cfmt(L.P[0], L.P[1], 5)} = <b>${sgn(L.m)}·ω₁ ${L.n < 0 ? '−' : '+'} ${Math.abs(L.n)}·ω₂</b>. ` +
        `All ${loops.length} values land on the lattice of ω₁ = ${fmt(w1[0], 5)} and ω₂ = ${cfmt(w2[0], w2[1], 5)}, to within ${worst.toExponential(0).replace('-', '−')}.<br>` +
        `<i>j</i> of that lattice, by the method of Part 2: <b>${fmt(jv[0], 6)}</b>. &nbsp; <i>j</i> of the curve y² + y = x³ − x² − 10x − 20, from its coefficients: −122023936/161051 = <b>${fmt(-122023936 / 161051, 6)}</b>.`;
    }
    $('per-next').addEventListener('click', () => { sel = (sel + 1) % loops.length; read(); fig.dirty(); });
    $('per-prev').addEventListener('click', () => { sel = (sel + loops.length - 1) % loops.length; read(); fig.dirty(); });
    pointer(fig, { tap: (x, y) => { if (!VP) return; let best = -1, bd = 20; loops.forEach((l, i) => { const dd = Math.hypot(x - VP.X(l.P[0]), y - VP.Y(l.P[1])); if (dd < bd) { bd = dd; best = i; } }); if (best >= 0) { sel = best; read(); fig.dirty(); } } });
    read();
  }

  onReady(() => { figCount(); figPeriods(); });
})();
