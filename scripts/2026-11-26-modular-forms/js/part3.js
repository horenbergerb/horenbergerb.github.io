/* Part 3 figures: counting sums of squares; heat on a ring computed two ways;
   Ramanujan's tau; the sublattices of prime index. */
(function () {
  'use strict';
  const { C, theme, alpha, Fig, pointer, view, clipTo, dot, line, label, panel, fmt, big, $, onReady, seg, TAU } = window.MF;
  const PI = Math.PI;

  /* ---------- Figure 1: how many ways is n a sum of k squares? ---------- */
  function figSquares() {
    const cv = $('c-squares'); if (!cv) return;
    const slider = $('sq-n'), out = $('sq-read'), NMAX = 150;
    let k = 4, n = +slider.value;
    const r = { 2: C.sumsOfSquares(2, NMAX), 4: C.sumsOfSquares(4, NMAX), 8: C.sumsOfSquares(8, NMAX) };
    const formula = (kk, m) => {
      const ds = C.divisors(m);
      if (kk === 2) return 4 * ds.reduce((s, d) => s + (d % 4 === 1 ? 1 : d % 4 === 3 ? -1 : 0), 0);
      if (kk === 4) return 8 * ds.reduce((s, d) => s + (d % 4 ? d : 0), 0);
      return 16 * ds.reduce((s, d) => s + ((m + d) % 2 ? -1 : 1) * d * d * d, 0);
    };
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), narrow = w < 620;
      // ---- left: the circle of radius sqrt(n) in the square grid (the case k = 2 can be drawn)
      const lw = narrow ? w : Math.min(h, w * 0.36), lh = narrow ? h * 0.46 : h;
      const R = Math.sqrt(n), B = Math.max(4.6, R + 1.6), V = view(8, 24, lw - 16, lh - 32, -B, B, -B, B);
      label(ctx, 'two squares: grid points on the circle x² + y² = ' + n, 12, 13, { size: 11.5, col: th.soft, bold: true, halo: false });
      clipTo(ctx, V, () => {
        const m = Math.ceil(B); let cnt = 0;
        if (V.s > 7) for (let x = -m; x <= m; x++) for (let y = -m; y <= m; y++) dot(ctx, V.X(x), V.Y(y), Math.min(2.2, V.s * 0.09), th.faint);
        ctx.beginPath(); ctx.arc(V.X(0), V.Y(0), R * V.s, 0, TAU); ctx.strokeStyle = th.blue; ctx.lineWidth = 1.8; ctx.stroke();
        for (let x = -m; x <= m; x++) for (let y = -m; y <= m; y++) if (x * x + y * y === n) { dot(ctx, V.X(x), V.Y(y), 5.5, th.red, th.bg, 1.5); cnt++; }
        label(ctx, cnt ? cnt + ' points' : 'no points', V.X(0), V.Y(0), { size: 13, align: 'center', bold: true, col: cnt ? th.red : th.soft });
      });
      // ---- right: counted against predicted, for every m up to NMAX
      const rx = narrow ? 0 : lw, ry = narrow ? lh : 0, rw = narrow ? w : w - lw, rh = narrow ? h - lh : h;
      panel(ctx, rx + 4, ry + 4, rw - 8, rh - 8, `${k} squares: bars are counted, rings are the divisor formula` + (k > 2 ? `, both divided by m${k === 8 ? '³' : ''}` : ''));
      const bx = rx + 30, bw = rw - 48, by = ry + rh - 30, bh = rh - 68;
      const norm = m => (k === 2 ? 1 : k === 4 ? m : m * m * m);
      let vmax = 0; for (let m = 1; m <= NMAX; m++) vmax = Math.max(vmax, r[k][m] / norm(m));
      line(ctx, bx, by, bx + bw, by, th.rule, 1);
      const bwid = bw / NMAX;
      for (let m = 1; m <= NMAX; m++) {
        const v = r[k][m] / norm(m), f = formula(k, m) / norm(m), x = bx + (m - 0.5) * bwid, hh = bh * v / vmax;
        ctx.fillStyle = m === n ? th.red : alpha(th.blue, 0.7); ctx.fillRect(x - bwid * 0.36, by - hh, bwid * 0.72, hh);
        if (bwid > 3.4 || m === n) dot(ctx, x, by - bh * f / vmax, m === n ? 4.5 : Math.min(2.6, bwid * 0.42), null, m === n ? th.ink : alpha(th.ink, 0.75), m === n ? 1.6 : 1);
      }
      for (let m = 25; m <= NMAX; m += 25) label(ctx, String(m), bx + (m - 0.5) * bwid, by + 12, { size: 10.5, align: 'center', col: th.soft, halo: false });
      label(ctx, 'm →', bx + bw, by + 12, { size: 10.5, align: 'right', col: th.soft, halo: false });
    });
    function read() {
      const ds = C.divisors(n), cnt = r[k][n];
      let how;
      if (k === 2) { const d1 = ds.filter(d => d % 4 === 1), d3 = ds.filter(d => d % 4 === 3); how = `divisors of the form 4j+1: {${d1.join(', ')}}; of the form 4j+3: {${d3.join(', ') || ' '}}. Formula: 4 × (${d1.length} − ${d3.length}) = <b>${4 * (d1.length - d3.length)}</b>.`; }
      else if (k === 4) { const dd = ds.filter(d => d % 4); how = `divisors not divisible by 4: {${dd.join(', ')}}, sum ${dd.reduce((s, d) => s + d, 0)}. Formula: 8 × ${dd.reduce((s, d) => s + d, 0)} = <b>${big(formula(4, n))}</b>.`; }
      else how = `cubes of the divisors with signs (−1)<sup>n+d</sup>: ${ds.map(d => ((n + d) % 2 ? '−' : '+') + d + '³').join(' ').replace(/^\+/, '')} = ${big(formula(8, n) / 16)}. Formula: 16 × ${big(formula(8, n) / 16)} = <b>${big(formula(8, n))}</b>.`;
      out.innerHTML = `<b>n = ${n}</b>. Counted directly: ${n} is a sum of ${k} squares in <b>${big(cnt)}</b> ways (order and signs count). ` + how.charAt(0).toUpperCase() + how.slice(1);
    }
    slider.addEventListener('input', () => { n = +slider.value; read(); fig.dirty(); });
    seg('sq-k', String(k), v => { k = +v; read(); fig.dirty(); });
    read();
  }

  /* ---------- Figure 2: heat on a ring, by images and by modes ---------- */
  function figHeat() {
    const cv = $('c-heat'); if (!cv) return;
    const slider = $('heat-t'), out = $('heat-read');
    const tOf = v => Math.pow(10, -3 + 2.6 * v);            // slider 0..1 -> t from 0.001 to 0.4
    let t = tOf(+slider.value);
    const images = (x, N) => { let s = 0; for (let n = -N; n <= N; n++) s += Math.exp(-(x - n) * (x - n) / (4 * t)); return s / Math.sqrt(4 * PI * t); };
    const modes = (x, N) => { let s = 1; for (let k = 1; k <= N; k++) s += 2 * Math.exp(-4 * PI * PI * k * k * t) * Math.cos(TAU * k * x); return s; };
    const need = f => { const exact = f(0, 60); for (let N = 0; N < 60; N++) if (Math.abs(f(0, N) - exact) < 1e-6 * exact) return N; return 60; };
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), narrow = w < 620, ymax = Math.max(1.6, images(0, 8) * 1.08);
      const draw = (px, py, pw, ph, title, col, total, terms) => {
        panel(ctx, px + 4, py + 4, pw - 8, ph - 8, title);
        const bx = px + 30, bw = pw - 48, by = py + ph - 30, bh = ph - 66, X = x => bx + bw * (x + 0.5), Y = y => by - bh * Math.max(-0.25, Math.min(1.1, y / ymax));
        ctx.save(); ctx.beginPath(); ctx.rect(bx - 2, py + 24, bw + 4, ph - 44); ctx.clip();
        line(ctx, bx, by, bx + bw, by, th.rule, 1);
        const plot = (f, c, lw) => { ctx.beginPath(); for (let i = 0; i <= 240; i++) { const x = -0.5 + i / 240; if (i) ctx.lineTo(X(x), Y(f(x))); else ctx.moveTo(X(x), Y(f(x))); } ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.stroke(); };
        terms.forEach(f => plot(f, alpha(col, 0.38), 1.2));
        plot(total, col, 2.8);
        ctx.restore();
        label(ctx, '−½', bx, by + 12, { size: 10.5, align: 'center', col: th.soft, halo: false }); label(ctx, '0', X(0), by + 12, { size: 10.5, align: 'center', col: th.soft, halo: false }); label(ctx, '½', bx + bw, by + 12, { size: 10.5, align: 'center', col: th.soft, halo: false });
        label(ctx, 'position around the ring', bx + bw / 2, by + 24, { size: 10.5, align: 'center', col: th.soft, halo: false });
      };
      const g = n => x => Math.exp(-(x - n) * (x - n) / (4 * t)) / Math.sqrt(4 * PI * t);
      const md = k => x => (k ? 2 : 1) * Math.exp(-4 * PI * PI * k * k * t) * Math.cos(TAU * k * x);
      const pw = narrow ? w : w / 2, ph = narrow ? h / 2 : h;
      draw(0, 0, pw, ph, 'heat spreading on a line, wrapped around', th.blue, x => images(x, 8), [-2, -1, 0, 1, 2].map(g));
      draw(narrow ? 0 : pw, narrow ? ph : 0, pw, ph, 'standing waves on the ring, each decaying', th.red, x => modes(x, 40), [0, 1, 2, 3, 4, 5].map(md));
    });
    function read() {
      const a = need(images), b = need(modes), s = 4 * PI * t;
      out.innerHTML = `Time <b>t = ${t < 0.01 ? t.toFixed(4) : t.toFixed(3)}</b>. Temperature at the starting point: ${fmt(images(0, 30), 6)} by images, ${fmt(modes(0, 60), 6)} by modes. ` +
        `For six-digit accuracy the <span class="key k-blue">images need ${2 * a + 1} term${a ? 's' : ''}</span> and the <span class="key k-red">modes need ${b + 1}</span>. ` +
        `In the notation of the text, s = 4πt = ${fmt(s, 3)}.`;
    }
    slider.addEventListener('input', () => { t = tOf(+slider.value); read(); fig.dirty(); });
    read();
  }

  /* ---------- Figure 3: Ramanujan's tau ---------- */
  function figTau() {
    const cv = $('c-tau'); if (!cv) return;
    const out = $('tau-read'), mI = $('tau-m'), nI = $('tau-n'), NT = 3000;
    let tau = null, primes = null, m = +mI.value, n = +nI.value;
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme();
      if (!tau) { label(ctx, 'computing τ(n) for n ≤ 3000 …', w / 2, h / 2, { align: 'center', col: th.soft }); return; }
      const hw = Math.min(150, w * 0.22), bx = 44, bw = w - bx - hw - 26, by = h / 2, amp = h / 2 - 30;
      const X = p => bx + bw * Math.sqrt(p / NT), Y = v => by - amp * v;
      line(ctx, bx, Y(1), bx + bw, Y(1), th.red, 1.2, [5, 4]); line(ctx, bx, Y(-1), bx + bw, Y(-1), th.red, 1.2, [5, 4]); line(ctx, bx, Y(0), bx + bw, Y(0), th.rule, 1);
      label(ctx, '+1', bx - 6, Y(1), { size: 11, align: 'right', col: th.red, halo: false }); label(ctx, '−1', bx - 6, Y(-1), { size: 11, align: 'right', col: th.red, halo: false }); label(ctx, '0', bx - 6, Y(0), { size: 11, align: 'right', col: th.soft, halo: false });
      label(ctx, 'τ(p) / 2p^(11/2)  for each prime p', bx, 12, { size: 11.5, col: th.soft, bold: true, halo: false });
      const bins = new Array(20).fill(0);
      for (const p of primes) { const v = Number(tau[p]) / (2 * Math.pow(p, 5.5)); dot(ctx, X(p), Y(v), p < 100 ? 3 : 2.2, alpha(th.blue, 0.75)); bins[Math.min(19, Math.floor((v + 1) * 10))]++; }
      for (const p of [2, 10, 100, 500, 1000, 2000, 3000]) { line(ctx, X(p), h - 22, X(p), h - 18, th.soft, 1); label(ctx, String(p), X(p), h - 9, { size: 10.5, align: 'center', col: th.soft, halo: false }); }
      label(ctx, 'prime p', bx + bw / 2, h - 9, { size: 10.5, align: 'center', col: th.soft, halo: false });
      // histogram against the semicircle (2/pi) sqrt(1 - v^2)
      const hx = w - hw - 6, bmax = Math.max(...bins), sc = (hw - 14) / (bmax * 1.08);
      for (let i = 0; i < 20; i++) { const y0 = Y(-1 + (i + 1) / 10), y1 = Y(-1 + i / 10); ctx.fillStyle = alpha(th.blue, 0.4); ctx.fillRect(hx, y0 + 0.5, bins[i] * sc, y1 - y0 - 1); }
      ctx.beginPath(); for (let i = 0; i <= 100; i++) { const v = -1 + i / 50, d = (2 / PI) * Math.sqrt(Math.max(0, 1 - v * v)) * primes.length / 10; if (i) ctx.lineTo(hx + d * sc, Y(v)); else ctx.moveTo(hx + d * sc, Y(v)); } ctx.strokeStyle = th.gold; ctx.lineWidth = 2; ctx.stroke();
      label(ctx, 'how often', hx, 12, { size: 11.5, col: th.soft, bold: true, halo: false });
    });
    function read() {
      if (!tau) return;
      const g = C.gcd(m, n), tm = tau[m], tn = tau[n], tmn = tau[m * n], prod = tm * tn;
      let s = `τ(${m}) = ${big(tm)}, &nbsp; τ(${n}) = ${big(tn)}, &nbsp; product = <b>${big(prod)}</b>.<br>τ(${m}·${n}) = τ(${m * n}) = <b>${big(tmn)}</b>. `;
      if (g === 1) s += `<span class="key k-teal">${m} and ${n} share no factor, and the two agree.</span>`;
      else {
        s += `<span class="key k-red">${m} and ${n} share the factor ${g}, and the two differ.</span>`;
        if (m === n && C.isPrime(m)) s += ` The difference is τ(${m})² − τ(${m}²) = ${big(prod - tmn)} = ${m}¹¹.`;
      }
      out.innerHTML = s;
    }
    const upd = () => { m = Math.max(1, Math.min(54, Math.round(+mI.value) || 1)); n = Math.max(1, Math.min(54, Math.round(+nI.value) || 1)); read(); };
    mI.addEventListener('input', upd); nI.addEventListener('input', upd);
    setTimeout(() => { tau = C.ramanujanTau(NT); primes = C.primesUpTo(NT); read(); fig.dirty(); }, 30);
  }

  /* ---------- Figure 4: the sublattices of index p ---------- */
  function figSub() {
    const cv = $('c-sub'); if (!cv) return;
    const out = $('sub-read'); let p = 3, sel = 0, cells = [];
    const w1 = [1, 0], w2 = [0.28, 0.94];
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), pts = C.projectiveLine(p), n = pts.length;
      const cols = w < 620 ? (n <= 4 ? 2 : n <= 6 ? 3 : 4) : (n <= 4 ? n : n <= 6 ? 6 : 8), rows = Math.ceil(n / cols), cw = w / cols, ch = h / rows;
      cells = [];
      pts.forEach((P, i) => {
        const cx = (i % cols) * cw, cy = Math.floor(i / cols) * ch, sq = Math.min(cw - 14, ch - 34), V = view(cx + (cw - sq) / 2, cy + 26 + (ch - 30 - sq) / 2, sq, sq, -3.1, 3.1, -3.1, 3.1);
        cells.push([cx, cy, cw, ch]);
        ctx.fillStyle = i === sel ? alpha(th.gold, 0.16) : th.panel; ctx.strokeStyle = th.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(V.px - 3, cy + 3, sq + 6, ch - 6, 8); ctx.fill(); ctx.stroke();
        label(ctx, `(${P[0]} : ${P[1]})`, cx + cw / 2, cy + 13, { size: 12, align: 'center', bold: i === sel, col: i === sel ? th.ink : th.soft, halo: false });
        // basis of the sublattice: the direction P and p times the other basis vector
        const u = [P[0], P[1]], v = P[0] % p !== 0 ? [0, p] : [p, 0];
        const pt = (a, b) => [a * w1[0] + b * w2[0], a * w1[1] + b * w2[1]];
        clipTo(ctx, V, () => {
          const A = pt(u[0], u[1]), B = pt(v[0], v[1]);
          ctx.beginPath(); ctx.moveTo(V.X(0), V.Y(0)); ctx.lineTo(V.X(A[0]), V.Y(A[1])); ctx.lineTo(V.X(A[0] + B[0]), V.Y(A[1] + B[1])); ctx.lineTo(V.X(B[0]), V.Y(B[1])); ctx.closePath(); ctx.fillStyle = alpha(th.gold, 0.3); ctx.fill();
          for (let a = -9; a <= 9; a++) for (let b = -5; b <= 5; b++) {
            const q = pt(a, b); if (Math.abs(q[0]) > 3.3 || Math.abs(q[1]) > 3.3) continue;
            const inSub = C.mod(a * P[1] - b * P[0], p) === 0;
            dot(ctx, V.X(q[0]), V.Y(q[1]), inSub ? Math.min(4.2, V.s * 0.2) : Math.min(1.8, V.s * 0.09), inSub ? th.blue : th.faint);
          }
          dot(ctx, V.X(0), V.Y(0), Math.min(4.2, V.s * 0.2), th.ink);
        });
      });
    });
    function read() {
      const P = C.projectiveLine(p)[sel] || [1, 0];
      out.innerHTML = `Index <b>${p}</b>: there are exactly <b>${p + 1}</b> sublattices that keep one point in every ${p}. Highlighted: the one containing the direction (${P[0]}, ${P[1]}), ` +
        `that is, the points <i>a</i>ω₁ + <i>b</i>ω₂ with ${P[0] === 0 ? '<i>a</i>' : P[1] === 0 ? '<i>b</i>' : (P[1] === 1 ? '' : P[1]) + '<i>a</i> − <i>b</i>'} divisible by ${p}.`;
    }
    seg('sub-p', String(p), v => { p = +v; sel = 0; read(); fig.dirty(); });
    const pick = (x, y) => { if (x === null) return; cells.forEach((c, i) => { if (x >= c[0] && x < c[0] + c[2] && y >= c[1] && y < c[1] + c[3] && sel !== i) { sel = i; read(); fig.dirty(); } }); };
    pointer(fig, { hover: pick, tap: pick });
    read();
  }

  onReady(() => { figSquares(); figHeat(); figTau(); figSub(); });
})();
