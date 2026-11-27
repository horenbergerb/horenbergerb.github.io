/* Part 5 figures: three periods are too many; the period matrix of a curve of
   genus two; Fourier indices as binary quadratic forms, counted in E8. */
(function () {
  'use strict';
  const { C, theme, alpha, Fig, pointer, view, clipTo, dot, line, label, panel, tessellation, tilePath, halfPlaneAxis, fmt, big, minus, $, onReady, seg, TAU } = window.MF;
  const PI = Math.PI, sgn = n => minus(String(n));

  /* ---------- Figure 1: whole-number combinations of two, three or four periods ---------- */
  function figDense() {
    const cv = $('c-dense'); if (!cv) return;
    const slider = $('dense-n'), out = $('dense-read');
    const w1 = [1, 0], w2 = [0.37, 0.93], mix = (a, b) => [a * w1[0] + b * w2[0], a * w1[1] + b * w2[1]];
    const W = [w1, w2, mix(Math.SQRT2 - 1, (Math.sqrt(5) - 1) / 2), mix(Math.sqrt(3) - 1, PI - 3)];
    let k = 3, N = +slider.value, best = 0, count = 0;
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), V = view(0, 0, w, h, -3.2, 3.2, -2.2, 2.2), n = k === 4 ? Math.min(N, 7) : N;
      ctx.fillStyle = th.panel; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = alpha(th.blue, k === 2 ? 0.95 : 0.75); best = Infinity; count = 0;
      const sz = k === 2 ? 5 : (2 * n + 1) ** k > 20000 ? 2 : 3, r3 = k >= 3 ? n : 0, r4 = k === 4 ? n : 0;
      for (let a = -n; a <= n; a++) for (let b = -n; b <= n; b++) for (let c = -r3; c <= r3; c++) for (let d = -r4; d <= r4; d++) {
        const x = a * W[0][0] + b * W[1][0] + c * W[2][0] + d * W[3][0], y = a * W[0][1] + b * W[1][1] + c * W[2][1] + d * W[3][1];
        count++; if (a || b || c || d) best = Math.min(best, Math.hypot(x, y));
        if (x > V.x0 && x < V.x1 && y > V.y0 && y < V.y1) ctx.fillRect(V.X(x) - sz / 2, V.Y(y) - sz / 2, sz, sz);
      }
      const cols = [th.ink, th.red, th.gold, th.teal];
      for (let i = 0; i < k; i++) { line(ctx, V.X(0), V.Y(0), V.X(W[i][0]), V.Y(W[i][1]), cols[i], 2.5); dot(ctx, V.X(W[i][0]), V.Y(W[i][1]), 4.5, cols[i], th.bg, 1.5); }
      dot(ctx, V.X(0), V.Y(0), 4, th.ink, th.bg, 1.5);
      read();
    });
    function read() {
      const n = k === 4 ? Math.min(N, 7) : N;
      out.innerHTML = `<b>${k} periods</b>, coefficients from −${n} to ${n}: ${big(count)} combinations. The shortest one that is not zero has length <b>${best < 0.001 ? best.toExponential(2).replace('-', '−') : fmt(best, 4)}</b>.` +
        (k === 2 ? ' It will not get shorter however far you go.' : ' Raise the range and it keeps shrinking.');
    }
    slider.addEventListener('input', () => { N = +slider.value; fig.dirty(); });
    seg('dense-k', String(k), v => { k = +v; fig.dirty(); });
  }

  /* ---------- Figure 2: six branch points, four loops, one symmetric matrix ---------- */
  function figGenus2() {
    const cv = $('c-g2'); if (!cv) return;
    const out = $('g2-read');
    let e = [-3.3, -2.1, -0.7, 0.5, 1.8, 3.2], V = null;
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), y0 = h * 0.52;
      V = view(10, 0, w - 20, h, -4.6, 4.6, -1, 1); const X = V.X, s = V.s;
      // the real points of y^2 = f(x): ovals over the gaps where f > 0
      const f = x => e.reduce((p, r) => p * (x - r), 1);
      let fmax = 0; for (const [u, v] of [[e[1], e[2]], [e[3], e[4]]]) for (let i = 1; i < 40; i++) fmax = Math.max(fmax, Math.sqrt(Math.max(0, f(u + (v - u) * i / 40))));
      const ys = Math.min(h * 0.3, 70) / (fmax || 1);
      ctx.strokeStyle = alpha(th.soft, 0.55); ctx.lineWidth = 1.4;
      const oval = (u, v, open) => { for (const sg of [1, -1]) { ctx.beginPath(); for (let i = 0; i <= 80; i++) { const x = u + (v - u) * i / 80, yy = sg * Math.sqrt(Math.max(0, f(x))) * ys, py = y0 - Math.max(-h, Math.min(h, yy)); if (i) ctx.lineTo(X(x), py); else ctx.moveTo(X(x), py); } ctx.stroke(); } void open; };
      oval(e[1], e[2]); oval(e[3], e[4]); oval(e[5], e[5] + 1.2); oval(e[0] - 1.2, e[0]);
      line(ctx, X(-4.6), y0, X(4.6), y0, th.rule, 1);
      // cuts
      for (const i of [0, 2, 4]) line(ctx, X(e[i]), y0, X(e[i + 1]), y0, th.ink, 4.5);
      // a-loops round the first two cuts
      const loop = (u, v, col, ry, name, dy) => {
        const cx = (X(u) + X(v)) / 2, rx = (X(v) - X(u)) / 2 + 13;
        ctx.strokeStyle = col; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.ellipse(cx, y0, rx, ry, 0, PI, TAU); ctx.stroke();
        ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.ellipse(cx, y0, rx, ry, 0, 0, PI); ctx.stroke(); ctx.setLineDash([]);
        label(ctx, name, cx, y0 - ry - dy, { size: 13.5, align: 'center', col, bold: true, italic: true, serif: true });
      };
      loop(e[0], e[1], th.blue, 20, 'a₁', 11); loop(e[2], e[3], th.blue, 20, 'a₂', 11);
      loop(e[3], e[4], th.red, Math.min(h * 0.2, 46), 'b₂', 11); loop(e[1], e[4], th.red, Math.min(h * 0.36, 92), 'b₁', 11);
      e.forEach((r, i) => { dot(ctx, X(r), y0, 7, th.gold, th.ink, 1.5); label(ctx, 'e' + '₁₂₃₄₅₆'[i], X(r), y0 + 20, { size: 12, align: 'center', italic: true, serif: true }); });
      void s;
    });
    function read() {
      const { A, B, Y } = C.genus2Periods(e), det = Y[0][0] * Y[1][1] - Y[0][1] * Y[1][0];
      const row = (name, v, im) => `<tr><td>${name}</td><td class="num">${fmt(v[0], 5)}${im ? ' <i>i</i>' : ''}</td><td class="num">${fmt(v[1], 5)}${im ? ' <i>i</i>' : ''}</td></tr>`;
      out.innerHTML =
        `<div class="table-wrap" style="max-height:none"><table><tr><th>loop</th><th class="num">∮ dx / y</th><th class="num">∮ x dx / y</th></tr>` +
        row('<span class="key k-blue">a₁</span>', A[0], true) + row('<span class="key k-blue">a₂</span>', A[1], true) + row('<span class="key k-red">b₁</span>', B[0], false) + row('<span class="key k-red">b₂</span>', B[1], false) + `</table></div>` +
        `<p class="readout">After rescaling the two integrands so that the a-loops give 1, 0 and 0, 1, the b-loops give &nbsp; <b>Ω = <i>i</i> × ( ${fmt(Y[0][0], 5)}, ${fmt(Y[0][1], 5)} ; ${fmt(Y[1][0], 5)}, ${fmt(Y[1][1], 5)} )</b>.<br>` +
        `The two off-diagonal entries come from different integrals: ${Y[0][1].toFixed(9)} and ${Y[1][0].toFixed(9)}. Top-left entry ${fmt(Y[0][0], 4)} &gt; 0 and determinant ${fmt(det, 4)} &gt; 0, so the imaginary part is positive definite.</p>`;
    }
    pointer(fig, {
      hit: (x, y) => { if (!V) return null; let best = null, bd = 24; e.forEach((r, i) => { const d = Math.hypot(x - V.X(r), y - fig.h * 0.52); if (d < bd) { bd = d; best = i; } }); return best; },
      move: (i, x) => { const lo = i ? e[i - 1] + 0.22 : -4.3, hi = i < 5 ? e[i + 1] - 0.22 : 4.3; e[i] = Math.max(lo, Math.min(hi, V.ux(x))); read(); fig.dirty(); },
    });
    read();
  }

  /* ---------- Figure 3: an index is a quadratic form; reduce it; count it in E8 ---------- */
  function figIndex() {
    const cv = $('c-index'); if (!cv) return;
    const out = $('index-read'), ins = ['index-a', 'index-b', 'index-c'].map($);
    let T = [3, 3, 1], vecs = null, V = null;
    const valid = t => t.every(Number.isInteger) && t[0] > 0 && 4 * t[0] * t[2] - t[1] * t[1] > 0 && Math.abs(t[0]) < 1e6 && Math.abs(t[2]) < 1e6;
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme();
      V = view(8, 8, w - 16, h - 30, -1.75, 1.75, 0, 1.75, 'bottom');
      clipTo(ctx, V, () => {
        tilePath(ctx, V, [1, 0, 0, 1], V.y1 + 1); ctx.fillStyle = alpha(th.gold, 0.28); ctx.fill();
        tessellation(ctx, V, alpha(th.soft, 0.5), 0.85);
        if (!valid(T)) return;
        const R = C.bqfReduce(T), path = [T].concat(R.steps.map(s => s[2])).map(C.bqfPoint);
        // show everything modulo whole-number shifts where that keeps the picture in view
        ctx.beginPath(); path.forEach((p, i) => { const x = V.X(p[0]), y = V.Y(Math.min(p[1], 40)); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
        ctx.strokeStyle = alpha(th.red, 0.8); ctx.lineWidth = 1.6; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
        path.forEach((p, i) => dot(ctx, V.X(p[0]), V.Y(p[1]), i === 0 ? 6.5 : i === path.length - 1 ? 6.5 : 3.5, i === path.length - 1 ? th.gold : th.red, th.bg, 1.5));
        const p0 = path[0], p1 = path[path.length - 1];
        const cl = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
        label(ctx, `[${T.map(sgn).join(', ')}]`, cl(V.X(p0[0]), V.px + 50, V.px + V.pw - 50), cl(V.Y(p0[1]) - 16, V.py + 12, V.py + V.ph - 8), { size: 12.5, align: 'center', bold: true, col: th.red });
        if (path.length > 1) label(ctx, `[${R.form.map(sgn).join(', ')}]`, V.X(p1[0]), cl(V.Y(p1[1]) - 16, V.py + 12, V.py + V.ph - 8), { size: 12.5, align: 'center', bold: true, col: th.gold });
      });
      halfPlaneAxis(ctx, V);
    });
    function read() {
      if (!valid(T)) { out.innerHTML = 'Enter whole numbers with <i>a</i> &gt; 0 and 4<i>ac</i> − <i>b</i>² &gt; 0, so that the form is positive for every (<i>x</i>, <i>y</i>) other than (0, 0).'; return; }
      const R = C.bqfReduce(T), D = C.disc(T), U = R.U;
      const count = t => (t[0] <= 3 && t[2] <= 3) ? C.e8PairCount(vecs = vecs || C.e8Vectors(6), t[0], t[1], t[2]) : null;
      const c0 = count(T), c1 = count(R.form), ef = Math.round(C.siegelE4(R.form[0], R.form[1], R.form[2]));
      let s = `<b>[${T.map(sgn).join(', ')}]</b> means ${T[0] === 1 ? '' : T[0]}<i>x</i>² ${T[1] < 0 ? '−' : '+'} ${Math.abs(T[1]) === 1 ? '' : Math.abs(T[1])}<i>xy</i> + ${T[2] === 1 ? '' : T[2]}<i>y</i>², discriminant <i>b</i>² − 4<i>ac</i> = ${sgn(D)}. `;
      s += R.steps.length ? `Reduced form: <b class="key k-gold">[${R.form.map(sgn).join(', ')}]</b>, reached by substituting <i>x</i> → ${lin(U[0])}, <i>y</i> → ${lin(U[1])}.` : 'It is already reduced.';
      s += '<br>Pairs of vectors in E₈ with these lengths and this inner product: ';
      if (c0 !== null) s += `<b>${big(c0)}</b> for the form as entered` + (R.steps.length ? (c1 !== null ? `, <b>${big(c1)}</b> for the reduced form.` : '.') : '.');
      else if (c1 !== null) s += `<b>${big(c1)}</b> for the reduced form (the form as entered needs vectors too long to list here).`;
      else s += 'the vectors needed are too long to list here.';
      s += ` The Eisenstein series formula gives <b>${big(ef)}</b>.`;
      out.innerHTML = s;
    }
    const lin = r => { const t = []; if (r[0]) t.push((r[0] === 1 ? '' : r[0] === -1 ? '−' : sgn(r[0])) + '<i>x</i>'); if (r[1]) t.push((r[1] > 0 ? (t.length ? '+ ' : '') : '− ') + (Math.abs(r[1]) === 1 ? '' : Math.abs(r[1])) + '<i>y</i>'); return t.join(' ') || '0'; };
    const set = t => { T = t; ins.forEach((el, i) => { el.value = t[i]; }); read(); fig.dirty(); };
    ins.forEach((el, i) => el.addEventListener('input', () => { T = T.slice(); T[i] = Number(el.value); read(); fig.dirty(); }));
    document.querySelectorAll('[data-form]').forEach(b => b.addEventListener('click', () => set(b.dataset.form.split(',').map(Number))));
    set(T);
  }

  onReady(() => { figDense(); figGenus2(); figIndex(); });
})();
