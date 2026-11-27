/* Part 6 figures: points on the genus-2 curve of conductor 277; how one class of
   quadratic forms splits at level N; the published twist calculation, replayed. */
(function () {
  'use strict';
  const { C, theme, alpha, Fig, pointer, view, clipTo, dot, line, label, panel, tessellation, tilePath, halfPlaneAxis, fmt, big, minus, $, onReady, seg, TAU } = window.MF;
  const PI = Math.PI, sgn = n => minus(String(n));
  const F277 = [0, -1, -1], H277 = [1, 1, 1, 1];           // y^2 + (x^3+x^2+x+1) y = -x^2 - x
  const PUBLISHED = { 2: [-2, 4], 3: [-1, 1], 5: [-1, -2], 7: [1, null], 11: [-2, null] };

  /* ---------- Figure 1: a curve of genus 2 and its two counts ---------- */
  function figCurve() {
    const cv = $('c-277'); if (!cv) return;
    const out = $('c277-read'), tab = $('c277-table'), sel = $('c277-p');
    const tablePrimes = C.primesUpTo(43), plotPrimes = C.primesUpTo(300).filter(p => p !== 277);
    tablePrimes.forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = p; sel.appendChild(o); });
    let p = 7; sel.value = p; const full = {}, a1 = {};
    const ev = (c, x, q) => { let v = 0; for (let i = c.length - 1; i >= 0; i--) v = C.mod(v * x + c[i], q); return v; };
    const count1 = q => { if (a1[q] === undefined) { let n = 2; for (let x = 0; x < q; x++) { const fv = ev(F277, x, q), hv = ev(H277, x, q); for (let y = 0; y < q; y++) if (C.mod(y * y + hv * y - fv, q) === 0) n++; } a1[q] = q + 1 - n; } return a1[q]; };
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), narrow = w < 620, lw = narrow ? w : Math.min(h, w * 0.4), lh = narrow ? h * 0.5 : h;
      const pad = 30, size = Math.min(lw - pad - 10, lh - pad - 26), gx = pad, gy = 24, cell = size / p;
      label(ctx, `solutions modulo ${p}`, 12, 12, { size: 11.5, col: th.soft, bold: true, halo: false });
      ctx.fillStyle = th.panel; ctx.fillRect(gx, gy, size, size); ctx.strokeStyle = th.rule; ctx.lineWidth = 1; ctx.strokeRect(gx + 0.5, gy + 0.5, size, size);
      if (cell > 5) { ctx.beginPath(); for (let i = 1; i < p; i++) { ctx.moveTo(gx + i * cell, gy); ctx.lineTo(gx + i * cell, gy + size); ctx.moveTo(gx, gy + i * cell); ctx.lineTo(gx + size, gy + i * cell); } ctx.strokeStyle = alpha(th.faint, 0.5); ctx.lineWidth = 0.6; ctx.stroke(); }
      for (let x = 0; x < p; x++) { const fv = ev(F277, x, p), hv = ev(H277, x, p); for (let y = 0; y < p; y++) if (C.mod(y * y + hv * y - fv, p) === 0) dot(ctx, gx + (x + 0.5) * cell, gy + size - (y + 0.5) * cell, Math.max(1.6, Math.min(7, cell * 0.36)), th.red); }
      label(ctx, 'x →', gx + size, gy + size + 12, { size: 10.5, align: 'right', col: th.soft, halo: false });
      const rx = narrow ? 0 : lw, ry = narrow ? lh : 0, rw = narrow ? w : w - lw, rh = narrow ? h - lh : h;
      panel(ctx, rx + 4, ry + 4, rw - 8, rh - 8, 'p + 1 − (number of points), for each prime p');
      const bx = rx + 40, bw = rw - 60, by = ry + rh / 2 + 6, amp = rh / 2 - 40, X = q => bx + bw * q / 300, Y = v => by - amp * v / 70;
      line(ctx, bx, by, bx + bw, by, th.rule, 1);
      for (const s of [1, -1]) { ctx.beginPath(); for (let q = 0; q <= 300; q += 3) { const x = X(q), y = Y(s * 4 * Math.sqrt(q)); if (q) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.strokeStyle = th.gold; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]); }
      label(ctx, '4√p', X(300) - 4, Y(69) + 12, { size: 11, align: 'right', col: th.gold, bold: true }); label(ctx, '−4√p', X(300) - 4, Y(-69) - 10, { size: 11, align: 'right', col: th.gold, bold: true });
      for (const q of plotPrimes) dot(ctx, X(q), Y(count1(q)), q === p ? 5 : 2.6, q === p ? th.red : th.blue);
      for (const q of [100, 200, 300]) label(ctx, String(q), X(q), ry + rh - 18, { size: 10.5, align: 'center', col: th.soft, halo: false });
      label(ctx, 'prime p', bx + bw * 0.5, ry + rh - 18, { size: 10.5, align: 'center', col: th.soft, halo: false });
    });
    const poly = (a, b, q) => { const t = (c, s) => c === 0 ? '' : ` ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${s}`; return `1${t(-a, 'T')}${t(b, 'T²')}${t(-q * a, 'T³')} + ${q * q}T⁴`; };
    function table() {
      let html = '<table><tr><th class="num">p</th><th class="num">points over 𝔽<sub>p</sub></th><th class="num">points over 𝔽<sub>p²</sub></th><th class="num">a<sub>p</sub></th><th class="num">b<sub>p</sub></th><th>factor for this prime</th><th>published for the form</th></tr>';
      for (const q of tablePrimes) {
        const r = full[q], pub = PUBLISHED[q];
        html += `<tr${q === p ? ' class="hl"' : ''}><td class="num">${q}</td>` + (r ? `<td class="num">${r.n1}</td><td class="num">${r.n2}</td><td class="num">${sgn(r.a)}</td><td class="num">${sgn(r.b)}</td><td>${poly(r.a, r.b, q)}</td>` : '<td class="num">…</td><td class="num">…</td><td class="num">…</td><td class="num">…</td><td>…</td>') +
          `<td class="${pub && r ? (pub[0] === r.a && (pub[1] === null || pub[1] === r.b) ? 'yes' : 'no') : ''}">${pub ? `a = ${sgn(pub[0])}` + (pub[1] !== null ? `, b = ${sgn(pub[1])}` : '') : ''}</td></tr>`;
      }
      tab.innerHTML = html + '</table>';
    }
    function read() {
      const r = full[p];
      out.innerHTML = r ? `Modulo <b>${p}</b>: ${r.n1} points with coordinates in the integers mod ${p}, and ${r.n2} with coordinates in the field of ${p * p} elements (both counts include two points at infinity). ` +
        `So a = ${p} + 1 − ${r.n1} = <b>${sgn(r.a)}</b> and b = (a² − (${p * p} + 1 − ${r.n2})) / 2 = <b>${sgn(r.b)}</b>.` : `Counting points modulo ${p} …`;
    }
    const upd = () => { read(); table(); fig.dirty(); };
    sel.addEventListener('change', () => { p = +sel.value; upd(); });
    let i = 0;
    (function next() { if (i >= tablePrimes.length) return; const q = tablePrimes[i++], [n1, n2] = C.genus2Counts(F277, H277, q), a = q + 1 - n1; full[q] = { n1, n2, a, b: (a * a - (q * q + 1 - n2)) / 2 }; upd(); setTimeout(next, 10); })();
    upd();
  }

  /* ---------- Figure 2: one class at level 1, several at level N ---------- */
  function figRoots() {
    const cv = $('c-roots'); if (!cv) return;
    const out = $('roots-read'), ins = ['roots-a', 'roots-b', 'roots-c'].map($), selN = $('roots-N');
    let T = [1, 0, 18], N = 11, data = null; const plCache = {};
    const valid = t => t.every(Number.isInteger) && t[0] > 0 && 4 * t[0] * t[2] - t[1] * t[1] > 0 && t[0] < 1e5 && t[2] < 1e5;
    function compute() {
      if (!valid(T)) { data = null; return; }
      const R = C.bqfReduce(T).form, pts = plCache[N] = plCache[N] || C.projectiveLine(N), autos = C.bqfAutos(R);
      const key = P => C.projKey(P[0], P[1], N), isRoot = P => C.mod(R[0] * P[0] * P[0] + R[1] * P[0] * P[1] + R[2] * P[1] * P[1], N) === 0;
      const orbit = new Map(), classes = [];
      pts.forEach(P => {
        if (!isRoot(P) || orbit.has(key(P))) return;
        const id = classes.length; classes.push({ P, size: 0 });
        for (const A of autos) { const k = C.projKey(A[0][0] * P[0] + A[0][1] * P[1], A[1][0] * P[0] + A[1][1] * P[1], N); if (!orbit.has(k)) { orbit.set(k, id); classes[id].size++; } }
      });
      classes.forEach(c => { const U = C.liftToSL2(c.P[0], c.P[1], N); c.form = C.bqfAct(R, U); const k = Math.floor((c.form[0] - c.form[1]) / (2 * c.form[0])); c.form = [c.form[0], c.form[1] + 2 * c.form[0] * k, c.form[0] * k * k + c.form[1] * k + c.form[2]]; });
      data = { R, pts, orbit, classes, key, autos: autos.length };
    }
    const cols = th => [th.red, th.blue, th.teal, th.violet, th.gold, th.ink];
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(); if (!data) return;
      const { pts, orbit, key } = data, n = pts.length, cx = w / 2, cy = h / 2 + 4, R0 = Math.min(w * 0.42, h * 0.4), small = n > 40;
      label(ctx, `the ${n} points of the projective line modulo ${N}`, 12, 13, { size: 11.5, col: th.soft, bold: true, halo: false });
      ctx.beginPath(); ctx.ellipse(cx, cy, R0 * (w > h * 1.6 ? 1.9 : 1), R0, 0, 0, TAU); ctx.strokeStyle = th.rule; ctx.lineWidth = 1.2; ctx.stroke();
      pts.forEach((P, i) => {
        const a = -PI / 2 + TAU * i / n, x = cx + R0 * (w > h * 1.6 ? 1.9 : 1) * Math.cos(a), y = cy + R0 * Math.sin(a), id = orbit.get(key(P));
        if (id === undefined) dot(ctx, x, y, small ? 2 : 5, th.bg, th.faint, 1.2);
        else { dot(ctx, x, y, small ? 6 : 9, cols(th)[id % 6], th.ink, 1.3); }
        if (!small || id !== undefined) label(ctx, `(${P[0]} : ${P[1]})`, x + (Math.cos(a) * (small ? 16 : 20)), y + Math.sin(a) * (small ? 16 : 20), { size: small ? 11 : 11.5, align: Math.cos(a) > 0.3 ? 'left' : Math.cos(a) < -0.3 ? 'right' : 'center', col: id === undefined ? th.soft : th.ink, bold: id !== undefined });
      });
      label(ctx, `${data.classes.length}`, cx, cy - 8, { size: 34, align: 'center', bold: true, col: th.ink, halo: false });
      label(ctx, data.classes.length === 1 ? 'class at this level' : 'classes at this level', cx, cy + 20, { size: 12, align: 'center', col: th.soft, halo: false });
    });
    function read() {
      if (!data) { out.innerHTML = 'Enter whole numbers with <i>a</i> &gt; 0 and 4<i>ac</i> − <i>b</i>² &gt; 0.'; return; }
      const { R, classes } = data, D = C.disc(R), names = ['red', 'blue', 'teal', 'violet', 'gold', 'ink'];
      let s = `Reduced form <b>[${R.map(sgn).join(', ')}]</b>, discriminant ${sgn(D)}. A point (<i>x</i> : <i>y</i>) is filled in when ${R[0] === 1 ? '' : R[0]}<i>x</i>² ${R[1] === 0 ? '' : (R[1] < 0 ? '− ' : '+ ') + (Math.abs(R[1]) === 1 ? '' : Math.abs(R[1])) + '<i>xy</i> '}+ ${R[2] === 1 ? '' : R[2]}<i>y</i>² is divisible by ${N}. `;
      if (!classes.length) s += `None is, so <b>no index of level ${N} lies in this class</b>.`;
      else {
        s += `Each filled point gives an index with first entry divisible by ${N}` + (data.autos > 2 ? ', and points of one colour are exchanged by the symmetries of the form, so they give the same class' : '') + ':<br>';
        s += classes.slice(0, 8).map((c, i) => `<span class="key k-${names[i % 6] === 'ink' ? 'gold' : names[i % 6]}">●</span> (${c.P[0]} : ${c.P[1]}) → <b>[${c.form.map(n => big(n)).join(', ')}]</b>`).join(' &nbsp; ') + (classes.length > 8 ? ' …' : '') +
          `<br>All of these reduce to [${R.map(sgn).join(', ')}] when every substitution is allowed. At level ${N} they are ${classes.length === 1 ? 'one class' : classes.length + ' different classes, which can carry different coefficients'}.`;
      }
      out.innerHTML = s;
    }
    const upd = () => { compute(); read(); fig.dirty(); };
    ins.forEach((el, i) => el.addEventListener('input', () => { T = T.slice(); T[i] = Number(el.value); upd(); }));
    selN.addEventListener('change', () => { N = +selN.value; upd(); });
    document.querySelectorAll('[data-rform]').forEach(b => b.addEventListener('click', () => { T = b.dataset.rform.split(',').map(Number); ins.forEach((el, i) => { el.value = T[i]; }); upd(); }));
    selN.value = N; upd();
  }

  /* ---------- Figure 3: the twist calculation of Johnson-Leung and Roberts, step by step ---------- */
  function figTwist() {
    const cv = $('c-twist'); if (!cv) return;
    const out = $('twist-read');
    const p = 3, k = 20, S = [81, 44, 6];
    const TABLE = { '1,0,18': 2256995864880n, '2,0,9': -4329978670800n };   // coefficients of the weight-20 form, from the published tables
    // substitute x -> x - (t/p) y, y -> p y
    const sub = t => [S[0], -2 * S[0] * t / p + S[1] * p, S[0] * t * t / (p * p) - S[1] * t + S[2] * p * p];
    const chi = n => C.legendre(n, p);
    const rows = [1, 2].map(t => { const F = sub(t), R = C.bqfReduce(F); return { t, F, R, val: TABLE[R.form.join(',')] }; });
    let V = null;
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), cols = [th.blue, th.red];
      V = view(8, 8, w - 16, h - 30, -1.2, 1.2, 0, 3.3, 'bottom');
      // the upper part of the picture is compressed: plot height on a square-root scale so that both the starting points (very low) and the end points (high) are visible
      const Yq = y => V.py + V.ph - V.ph * Math.sqrt(Math.min(y, 4.4) / 4.4), X = x => V.px + V.pw * (x + 0.8) / 1.6, wrap = q => [q[0] - Math.round(q[0]), q[1]];
      clipTo(ctx, V, () => {
        ctx.fillStyle = alpha(th.gold, 0.25); ctx.beginPath(); ctx.moveTo(X(-0.5), Yq(4.4));
        for (let i = 0; i <= 40; i++) { const a = PI * 2 / 3 - (PI / 3) * i / 40; ctx.lineTo(X(Math.cos(a)), Yq(Math.sin(a))); }
        ctx.lineTo(X(0.5), Yq(4.4)); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = alpha(th.soft, 0.5); ctx.lineWidth = 1;
        for (const x of [-0.5, 0.5]) { ctx.beginPath(); ctx.moveTo(X(x), Yq(Math.sqrt(3) / 2)); ctx.lineTo(X(x), Yq(4.4)); ctx.stroke(); }
        for (const c of [-1, 0, 1]) { ctx.beginPath(); for (let i = 0; i <= 80; i++) { const a = PI * i / 80, x = X(c + Math.cos(a)), y = Yq(Math.sin(a)); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.stroke(); }
        rows.forEach((r, i) => {
          const path = [r.F].concat(r.R.steps.filter(s => s[0] === 'S' || s === r.R.steps[r.R.steps.length - 1]).map(s => s[2])).map(C.bqfPoint).map(wrap);
          ctx.beginPath(); path.forEach((q, j) => { if (j) ctx.lineTo(X(q[0]), Yq(q[1])); else ctx.moveTo(X(q[0]), Yq(q[1])); });
          ctx.strokeStyle = alpha(cols[i], 0.7); ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
          path.forEach((q, j) => dot(ctx, X(q[0]), Yq(q[1]), j === 0 || j === path.length - 1 ? 6 : 3.2, cols[i], th.bg, 1.5));
          const a = path[0], b = path[path.length - 1];
          const edge = X(a[0]) > V.px + V.pw * 0.7; label(ctx, `[${r.F.join(', ')}]`, X(a[0]) + (i || edge ? -10 : 10), Yq(a[1]) - 13, { size: 12, align: i || edge ? 'right' : 'left', bold: true, col: cols[i] });
          label(ctx, `[${r.R.form.join(', ')}]`, X(b[0]) + 11, Yq(b[1]), { size: 12, bold: true, col: cols[i] });
        });
      });
      line(ctx, V.px, Yq(0), V.px + V.pw, Yq(0), th.soft, 1.2);
      for (const x of [-0.5, 0, 0.5]) label(ctx, sgn(x).replace('0.5', '½'), X(x), Yq(0) + 13, { size: 11, align: 'center', col: th.soft, halo: false });
    });
    const gcdB = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; };
    const sum = rows.reduce((s, r) => s + BigInt(chi(r.t)) * r.val, 0n), lead = chi(S[1]), den = 3n ** BigInt(k - 1), num = BigInt(lead) * sum, g = gcdB(num, den);
    const U = r => `<i>x</i> → ${lin(r.R.U[0])}, <i>y</i> → ${lin(r.R.U[1])}`;
    const lin = r => { const t = []; if (r[0]) t.push((r[0] === 1 ? '' : r[0] === -1 ? '−' : sgn(r[0])) + '<i>x</i>'); if (r[1]) t.push((r[1] > 0 ? (t.length ? '+ ' : '') : '− ') + (Math.abs(r[1]) === 1 ? '' : Math.abs(r[1])) + '<i>y</i>'); return t.join(' ') || '0'; };
    out.innerHTML = `<ol>
      <li><b>The index wanted.</b> The twisted form has level 3⁴ = 81. Ask for its coefficient at <b>[81, 44, 6]</b>. The first entry is divisible by 81 and the middle entry is not divisible by 3, which is the first of the theorem’s five cases.</li>
      <li><b>Shift.</b> For <i>t</i> = 1, 2 substitute <i>x</i> → <i>x</i> − (<i>t</i>/3)<i>y</i>, <i>y</i> → 3<i>y</i> in 81<i>x</i>² + 44<i>xy</i> + 6<i>y</i>². Result: <span class="key k-blue">[${rows[0].F.join(', ')}]</span> and <span class="key k-red">[${rows[1].F.join(', ')}]</span>, both whole-number forms.</li>
      <li><b>Reduce.</b> The original form has level 1, so any substitution of determinant 1 is allowed. <span class="key k-blue">[${rows[0].F.join(', ')}] → [${rows[0].R.form.join(', ')}]</span> by ${U(rows[0])}. <span class="key k-red">[${rows[1].F.join(', ')}] → [${rows[1].R.form.join(', ')}]</span> by ${U(rows[1])}.</li>
      <li><b>Look up.</b> In the table of the weight-20 form: a[${rows[0].R.form.join(', ')}] = ${big(rows[0].val)} and a[${rows[1].R.form.join(', ')}] = ${big(rows[1].val)}.</li>
      <li><b>Combine with signs.</b> χ(1) = ${sgn(chi(1))} and χ(2) = ${sgn(chi(2))}, so the sum is ${big(rows[0].val)} − (${big(rows[1].val)}) = ${big(sum)}. The factor in front is 3<sup>1−20</sup> · χ(44) = ${sgn(lead)}/3<sup>19</sup>.</li>
      <li><b>Result.</b> ${big(num)} / 3<sup>19</sup> = <b>${big(num / g)} / ${big(den / g)}</b> ≈ ${fmt(Number(num) / Number(den), 3)}. It is not zero, so the twisted form is not zero.</li></ol>`;
    void pointer; void tessellation; void tilePath; void halfPlaneAxis; void panel; void seg;
  }

  onReady(() => { figCurve(); figRoots(); figTwist(); });
})();
