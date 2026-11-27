/* Part 2 figures: a torus and its cubic curve; one lattice, many bases, and the
   point tau that records the basis; the classical modular forms over the half-plane. */
(function () {
  'use strict';
  const { C, theme, alpha, Fig, pointer, view, clipTo, dot, line, arrow, label, panel, Field, colourInto, wheel, tessellation, tilePath, halfPlaneAxis, fmt, cfmt, $, onReady, seg, TAU } = window.MF;
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

  /* ---------- Figure 1, the other two views: the whole curve, not only its real points ---------- */
  function figSurface() {
    const cv = $('c-surface'); if (!cv) return;
    const out = $('surface-read'), turn = $('surface-turn'), tilt = $('surface-tilt');
    const t = 1.3, w4 = new Float64Array(4), c4 = new Uint8ClampedArray(4), o3 = [0, 0, 0];
    C.wp(0.5, 0, 0, t, w4); const e1 = w4[0]; C.wp(0, t / 2, 0, t, w4); const R = e1 - w4[0];
    const UNIT = R / 2, GAIN = 0.3, A = 96, B = 64, K = 240, RIM = 2.2, FAR = 3.5 * RIM;
    const NV = (A + 1) * (B + 1), NQ = A * B;
    const bunch = s => s - 0.8 * Math.sin(TAU * s) / TAU;   // a finer mesh near z = 0, where the function changes fastest
    const zxs = Array.from({ length: A + 1 }, (_, i) => bunch(i / A)), zys = Array.from({ length: B + 1 }, (_, j) => t * bunch(j / B));
    // two ways of putting the point z of the rectangle into space; o[3] says how far out the point is
    const place = {
      torus(zx, zy, o) { const a = TAU * zx, b = TAU * zy / t, d = 2 + 0.9 * Math.cos(b); o[0] = d * Math.cos(a); o[1] = d * Math.sin(a); o[2] = 0.9 * Math.sin(b); o[3] = 0; },
      coords(zx, zy, o) {   // (Re x, Im x, Re y), with large values pulled in so that the picture is finite
        C.wp(zx, zy, 0, t, w4); const a = w4[0] / R, b = w4[1] / R, m = Math.hypot(a, b), f = m > 1e-12 ? RIM * Math.tanh(m / RIM) / m : 1;
        o[0] = a * f; o[1] = b * f; o[2] = 1.15 * w4[2] / (2 * Math.pow(R, 1.5)) / (1 + Math.pow(m, 1.5)); o[3] = m;   // far out, y is about 2x^(3/2), so this height stays between -1.15 and 1.15
      },
    };
    const base = new Uint8ClampedArray(3 * NQ);   // the colour of each patch: the value of the Weierstrass function at its centre
    for (let i = 0; i < A; i++) for (let j = 0; j < B; j++) {
      C.wp((zxs[i] + zxs[i + 1]) / 2, (zys[j] + zys[j + 1]) / 2, 0, t, w4); colourInto(c4, 0, w4[0] / UNIT, w4[1] / UNIT, undefined, GAIN);
      base[3 * (i * B + j)] = c4[0]; base[3 * (i * B + j) + 1] = c4[1]; base[3 * (i * B + j) + 2] = c4[2];
    }
    const shapes = {};
    function shape(m) {
      if (shapes[m]) return shapes[m];
      const P = new Float64Array(3 * NV), far = new Uint8Array(NV), N = new Float64Array(3 * NQ), skip = new Uint8Array(NQ), loops = [];
      for (let i = 0; i <= A; i++) for (let j = 0; j <= B; j++) { const v = i * (B + 1) + j; place[m](zxs[i], zys[j], o3); P[3 * v] = o3[0]; P[3 * v + 1] = o3[1]; P[3 * v + 2] = o3[2]; far[v] = !(o3[3] < FAR) ? 1 : 0; }
      for (let i = 0; i < A; i++) for (let j = 0; j < B; j++) {
        const q = i * B + j, a = i * (B + 1) + j, b = a + B + 1, c = b + 1, d = a + 1;
        if (far[a] && far[b] && far[c] && far[d]) { skip[q] = 1; continue; }   // the neighbourhood of infinity is left open
        const ux = P[3 * c] - P[3 * a], uy = P[3 * c + 1] - P[3 * a + 1], uz = P[3 * c + 2] - P[3 * a + 2], vx = P[3 * d] - P[3 * b], vy = P[3 * d + 1] - P[3 * b + 1], vz = P[3 * d + 2] - P[3 * b + 2];
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, n = Math.hypot(nx, ny, nz);
        if (!(n > 0) || !isFinite(n)) { skip[q] = 1; continue; }
        N[3 * q] = nx / n; N[3 * q + 1] = ny / n; N[3 * q + 2] = nz / n;
      }
      for (const zy of [0, t / 2]) { const pts = new Float64Array(3 * (K + 1)); for (let k = 0; k <= K; k++) { place[m](bunch(k / K), zy, o3); const ok = o3[3] < FAR; pts[3 * k] = ok ? o3[0] : NaN; pts[3 * k + 1] = o3[1]; pts[3 * k + 2] = o3[2]; } loops.push(pts); }
      return (shapes[m] = { P, N, skip, loops });
    }
    let mode = 'torus', yaw = +turn.value * PI / 180, pitch = +tilt.value * PI / 180, z = [0.37, 0.41], boxes = null, field = null, grab = null;
    const SX = new Float64Array(NV), SY = new Float64Array(NV), SD = new Float64Array(NV), depth = new Float64Array(NQ + 2 * K + 2);
    const LX = new Float64Array(2 * (K + 1)), LY = new Float64Array(2 * (K + 1)), LD = new Float64Array(2 * (K + 1));
    const atInfinity = () => Math.hypot(z[0] - Math.round(z[0]), z[1] - t * Math.round(z[1] / t)) < 0.02;
    const onReal = () => z[1] === 0 || z[1] === t || z[1] === t / 2;
    function read() {
      const zs = `<i>z</i> = ${cfmt(z[0], z[1], 3)}`;
      if (atInfinity()) { out.innerHTML = `${zs}: a corner of the rectangle. Here ℘ is infinite; this is the curve’s one point at infinity.`; return; }
      C.wp(z[0], z[1], 0, t, w4);
      out.innerHTML = onReal()
        ? `${zs} gives <i>x</i> = ${fmt(w4[0], 2)}, <i>y</i> = ${fmt(w4[2], 2)}. <b>Both real:</b> this point is also in the first view.`
        : `${zs} gives <i>x</i> = ${cfmt(w4[0], w4[1], 2)}, <i>y</i> = ${cfmt(w4[2], w4[3], 2)}. <b>Complex coordinates:</b> a point of the curve that the first view cannot show.`;
    }
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), narrow = w < 620;
      const lw = narrow ? w : w * 0.33, lh = narrow ? h * 0.37 : h;
      // ---- the rectangle, coloured by the value of the function
      const s = Math.min(lw - 60, (lh - 56) / t), V = view((lw - s) / 2, 32 + (lh - 56 - s * t) / 2, s, s * t, 0, 1, 0, t);
      label(ctx, 'the rectangle, coloured by ℘(z)', 12, 13, { size: 11.5, col: th.soft, bold: true, halo: false });
      field.draw(ctx, V, Math.round(s * fig.dpr));
      line(ctx, V.X(0), V.Y(0), V.X(1), V.Y(0), th.blue, 3.5); line(ctx, V.X(0), V.Y(t), V.X(1), V.Y(t), th.blue, 3.5); line(ctx, V.X(0), V.Y(t / 2), V.X(1), V.Y(t / 2), th.red, 3.5);
      for (const [x, y] of [[0, 0], [1, 0], [0, t], [1, t]]) dot(ctx, V.X(x), V.Y(y), 4.5, th.ink, th.bg, 1.5);
      dot(ctx, V.X(z[0]), V.Y(z[1]), 7.5, th.gold, th.ink, 2);
      label(ctx, 'z', V.X(z[0]) + 12, V.Y(z[1]) - 11, { size: 13, italic: true, serif: true });
      // ---- the surface
      const rx = narrow ? 0 : lw, ry = narrow ? lh : 0, rw = narrow ? w : w - lw, rh = narrow ? h - lh : h;
      panel(ctx, rx + 4, ry + 4, rw - 8, rh - 8, mode === 'torus' ? 'the rectangle rolled up: every point of the curve' : 'the curve in its coordinates, with Im y left out');
      const ext = mode === 'torus' ? 2.9 : RIM, tall = mode === 'torus' ? 2.75 : 2.45;   // half-width, and the greatest half-height at any tilt
      const S = Math.min((rw - 40) / (2 * ext), (rh - 64) / (2 * tall)), ox = rx + rw / 2, oy = ry + rh / 2 + 10;
      boxes = { V, has: (x, y) => x > rx + 4 && x < rx + rw - 4 && y > ry + 4 && y < ry + rh - 4 };
      const sh = shape(mode), P = sh.P, N = sh.N, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const proj = (a, b, c) => { const X = a * cy - b * sy, Y = a * sy + b * cy; o3[0] = ox + S * X; o3[1] = oy - S * (c * cp + Y * sp); o3[2] = Y * cp - c * sp; };
      for (let v = 0; v < NV; v++) { proj(P[3 * v], P[3 * v + 1], P[3 * v + 2]); SX[v] = o3[0]; SY[v] = o3[1]; SD[v] = o3[2]; }
      const items = [];
      for (let q = 0; q < NQ; q++) if (!sh.skip[q]) { const i = (q / B) | 0, a = i * (B + 1) + q - i * B, b = a + B + 1; depth[q] = (SD[a] + SD[b] + SD[b + 1] + SD[a + 1]) / 4; items.push(q); }
      sh.loops.forEach((pts, l) => {
        for (let k = 0; k <= K; k++) { const m = l * (K + 1) + k; proj(pts[3 * k], pts[3 * k + 1], pts[3 * k + 2]); LX[m] = o3[0]; LY[m] = o3[1]; LD[m] = o3[2]; }
        for (let k = 0; k < K; k++) { const m = l * (K + 1) + k; if (LX[m] === LX[m] && LX[m + 1] === LX[m + 1]) { depth[NQ + l * K + k] = (LD[m] + LD[m + 1]) / 2 - 0.16; items.push(NQ + l * K + k); } }
      });
      const INF = NQ + 2 * K, ZP = INF + 1; let inf = null, zp = null;
      if (mode === 'torus') { place.torus(0, 0, o3); proj(o3[0], o3[1], o3[2]); inf = [o3[0], o3[1]]; depth[INF] = o3[2] - 0.22; items.push(INF); }
      if (!atInfinity()) { place[mode](z[0], z[1], o3); if (o3[3] < FAR) { proj(o3[0], o3[1], o3[2]); zp = [o3[0], o3[1]]; depth[ZP] = o3[2] - 0.22; items.push(ZP); } }
      items.sort((a, b) => depth[b] - depth[a]);
      ctx.save(); ctx.beginPath(); ctx.rect(rx + 6, ry + 24, rw - 12, rh - 32); ctx.clip();
      for (const q of items) {
        if (q < NQ) {
          const i = (q / B) | 0, a = i * (B + 1) + q - i * B, b = a + B + 1;
          const lit = 0.72 + 0.28 * Math.abs((N[3 * q] * sy + N[3 * q + 1] * cy) * cp - N[3 * q + 2] * sp);
          const col = `rgb(${(base[3 * q] * lit) | 0},${(base[3 * q + 1] * lit) | 0},${(base[3 * q + 2] * lit) | 0})`;
          ctx.beginPath(); ctx.moveTo(SX[a], SY[a]); ctx.lineTo(SX[b], SY[b]); ctx.lineTo(SX[b + 1], SY[b + 1]); ctx.lineTo(SX[a + 1], SY[a + 1]); ctx.closePath();
          ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 0.7; ctx.stroke();
        } else if (q < INF) { const l = q - NQ < K ? 0 : 1, m = l * (K + 1) + (q - NQ - l * K); line(ctx, LX[m], LY[m], LX[m + 1], LY[m + 1], l ? th.red : th.blue, 4); }
        else if (q === INF) dot(ctx, inf[0], inf[1], 5.5, th.ink, th.bg, 1.5);
        else dot(ctx, zp[0], zp[1], 7, th.gold, th.ink, 2);
      }
      if (zp) {   // a ring that stays visible when the point itself is behind the surface
        ctx.globalAlpha = 0.6; dot(ctx, zp[0], zp[1], 7, null, th.ink, 1.5); ctx.globalAlpha = 1;
        label(ctx, 'P(z)', zp[0] + 12, zp[1] - 11, { size: 13, italic: true, serif: true });
      }
      if (mode === 'coords') {   // which way the three plotted coordinates point
        const ax = rx + 58, ay = ry + rh - 54, Lg = 30;
        for (const [a, b, c, name] of [[1, 0, 0, 'Re x'], [0, 1, 0, 'Im x'], [0, 0, 1, 'Re y']]) {
          const X = a * cy - b * sy, Y = a * sy + b * cy, px = ax + Lg * X, py = ay - Lg * (c * cp + Y * sp);
          arrow(ctx, ax, ay, px, py, th.soft, 1.5); label(ctx, name, ax + 1.55 * (px - ax), ay + 1.55 * (py - ay), { size: 11, col: th.soft, align: 'center' });
        }
      }
      ctx.restore();
    });
    field = new Field(fig, (u, v, o) => { C.wp(u, v, 0, t, w4); o[0] = w4[0] / UNIT; o[1] = w4[1] / UNIT; }, { gain: GAIN });
    const sliders = () => { turn.value = String(Math.round(((yaw * 180 / PI) % 360 + 360) % 360)); tilt.value = String(Math.round(pitch * 180 / PI)); };
    turn.addEventListener('input', () => { yaw = +turn.value * PI / 180; fig.dirty(); });
    tilt.addEventListener('input', () => { pitch = +tilt.value * PI / 180; fig.dirty(); });
    pointer(fig, {
      hit: (x, y, type) => { if (!boxes) return null; const V = boxes.V; if (x > V.px - 14 && x < V.px + V.pw + 14 && y > V.py - 14 && y < V.py + V.ph + 14) return 'z'; return type !== 'touch' && boxes.has(x, y) ? 'turn' : null; },
      start: (k, x, y) => { grab = [x, y, yaw, pitch]; },
      move: (k, x, y) => {
        if (k === 'z') {
          const V = boxes.V; let zy = Math.max(0, Math.min(t, V.uy(y)));
          if (zy < 0.04) zy = 0; else if (zy > t - 0.04) zy = t; else if (Math.abs(zy - t / 2) < 0.04) zy = t / 2;   // the two real lines are easy to land on
          z = [Math.max(0, Math.min(1, V.ux(x))), zy]; read();
        } else { yaw = grab[2] + (x - grab[0]) * 0.012; pitch = Math.max(0, Math.min(PI / 2, grab[3] + (y - grab[1]) * 0.012)); sliders(); }
        fig.dirty();
      },
    });
    read();
    return m => { mode = m; fig.dirty(); };
  }

  /* the buttons above Figure 1: the real picture, or one of the two pictures of the whole curve */
  function cubicViews(setMode) {
    const real = $('cubic-real'), whole = $('cubic-whole'); if (!real || !whole || !setMode) return;
    const caps = ['real', 'torus', 'coords'].map(k => [k, $('cubic-cap-' + k)]);
    seg('cubic-view', 'real', v => {
      real.hidden = v !== 'real'; whole.hidden = v === 'real';
      for (const [k, el] of caps) if (el) el.hidden = k !== v;
      if (v !== 'real') setMode(v);
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

  /* ---------- Figure 3: the tiling as a map that can be slid by rigid motions ---------- */
  function figSlide() {
    const cv = $('c-slide'); if (!cv) return;
    const { mobius, gmul, RHO, RHO1 } = window.MF;
    const out = $('slide-read'), coinsBox = $('slide-coins');
    const C0 = [0, 1.38], RAD = 0.24, HAND = [0, 1.38 * Math.exp(RAD)];   // a coin in the home tile: centre, radius in the geometry, tip of its hand
    const GENS = [[0, -1, 1, 0], [1, 1, 0, 1], [1, -1, 0, 1]], ID = [1, 0, 0, 1], o6 = new Float64Array(6);
    const inv = g => [g[3], -g[1], -g[2], g[0]];
    const unit = g => { const d = Math.sqrt(Math.abs(g[0] * g[3] - g[1] * g[2])) || 1; return g.map(v => v / d); };
    const key = g => (g[2] < 0 || (g[2] === 0 && g[3] < 0)) ? `${-g[0]},${-g[1]},${-g[2]},${-g[3]}` : g.join(',');
    let M = ID, sel = null, anim = null, V = null, grab = null;   // M is the motion applied to the standard picture; sel is the tile last chosen
    // every tile M g(F) that is large enough to see and near the view
    function visible() {
      const c = mobius(inv(M), 0, 1.2); C.reduceTau(c[0], c[1], o6);
      const g0 = [o6[5], -o6[3], -o6[4], o6[2]], list = [], seenT = new Set([key(g0)]), queue = [g0], minIm = 7 / V.s;
      while (queue.length && list.length < 1500) {
        const g = queue.shift(), h = gmul(M, g); list.push({ g, h, b: mobius(h, C0[0], C0[1]) });
        for (const s of GENS) {
          const g2 = gmul(g, s), k = key(g2); if (seenT.has(k)) continue; seenT.add(k);
          const b = mobius(gmul(M, g2), C0[0], C0[1]);
          if (b[1] >= minIm && b[0] > V.x0 - 1 - 3 * b[1] && b[0] < V.x1 + 1 + 3 * b[1]) queue.push(g2);
        }
      }
      return list;
    }
    // the straight line of the geometry from p to q: an arc centred on the bottom edge, or a vertical line
    function geo(ctx, p, q, top, move) {
      const far = v => v[1] === Infinity || Math.abs(v[0]) > 1e5;
      if (!far(p) && !far(q) && Math.abs(p[0] - q[0]) > 1e-9) {
        const c = (p[0] * p[0] + p[1] * p[1] - q[0] * q[0] - q[1] * q[1]) / (2 * (p[0] - q[0])), r = Math.hypot(p[0] - c, p[1]);
        if (r * V.s < 2e5) {
          const a0 = Math.atan2(p[1], p[0] - c), a1 = Math.atan2(q[1], q[0] - c);
          if (move) ctx.moveTo(V.X(p[0]), V.Y(p[1])); ctx.arc(V.X(c), V.Y(0), r * V.s, -a0, -a1, a1 > a0); return;
        }
      }
      const pf = far(p) || (!far(q) && Math.abs(p[0]) > Math.abs(q[0]) && Math.abs(p[0] - q[0]) > 1), qf = !pf && (far(q) || Math.abs(p[0] - q[0]) > 1);
      const a = pf ? [q[0], top] : p, b = qf ? [p[0], top] : q;
      if (move) ctx.moveTo(V.X(a[0]), V.Y(a[1])); else ctx.lineTo(V.X(a[0]), V.Y(a[1])); ctx.lineTo(V.X(b[0]), V.Y(b[1]));
    }
    const size = g => mobius(gmul(M, g), C0[0], C0[1])[1] / C0[1];   // how large the map draws the coin of tile g, the first coin at the start being 1
    function read() {
      const th = theme(), name = (col, s) => `<b style="color:${col}">${s}</b>`;
      if (!sel) { out.innerHTML = `Every tile carries the same coin. Tap a tile to slide it to the top. Drawn size of the coin in the ${name(th.gold, 'gold')} tile: ${fmt(size(ID), 2)}.`; return; }
      out.innerHTML = `Drawn size of the coins: ${name(th.teal, 'chosen tile')} ${fmt(size(sel), 2)}, ${name(th.gold, 'gold tile')} ${fmt(size(ID), 2)}. In the geometry the two coins are the same size.`;
    }
    const fig = new Fig(cv, (ctx, w, h) => {
      const th = theme(), Y1 = 2.5, half = Y1 * (w - 12) / (h - 12) / 2;
      V = view(6, 6, w - 12, h - 12, -half, half, 0, Y1, 'bottom');
      const list = visible(), top = V.y1 + 1, coins = !coinsBox || coinsBox.checked, selKey = sel ? key(sel) : '';
      clipTo(ctx, V, () => {
        ctx.fillStyle = th.panel; ctx.fillRect(V.px, V.py, V.pw, V.ph);
        const corners = it => [mobius(it.h, RHO[0], RHO[1]), mobius(it.h, RHO1[0], RHO1[1]), mobius(it.h, 0, Infinity)];
        for (const it of list) {   // the two coloured tiles
          const k = key(it.g), col = k === selKey ? th.teal : k === '1,0,0,1' ? th.gold : null; if (!col) continue;
          const [a, b, c] = corners(it); ctx.beginPath(); geo(ctx, a, b, top, true); geo(ctx, b, c, top, false); geo(ctx, c, a, top, false); ctx.closePath();
          ctx.fillStyle = alpha(col, 0.3); ctx.fill();
        }
        ctx.beginPath();
        for (const it of list) { const [a, b, c] = corners(it); geo(ctx, a, b, top, true); geo(ctx, b, c, top, true); geo(ctx, c, a, top, true); }
        ctx.strokeStyle = th.soft; ctx.lineWidth = 0.9; ctx.stroke();
        if (coins) for (const it of list) {
          const r = it.b[1] * Math.sinh(RAD) * V.s; if (r < 1.2) continue;
          const k = key(it.g), col = k === selKey ? th.teal : k === '1,0,0,1' ? th.gold : null, cx = V.X(it.b[0]), cy = V.Y(it.b[1] * Math.cosh(RAD)), tip = mobius(it.h, HAND[0], HAND[1]);
          dot(ctx, cx, cy, r, col ? alpha(col, 0.85) : alpha(th.ink, 0.07), th.ink, Math.min(1.6, 0.5 + r / 20));
          if (r > 2.5) line(ctx, V.X(it.b[0]), V.Y(it.b[1]), V.X(tip[0]), V.Y(tip[1]), th.ink, Math.min(2, 0.6 + r / 16));
        }
      });
      line(ctx, V.px, V.Y(0), V.px + V.pw, V.Y(0), th.soft, 1.2);
    }, {
      tick: dt => {
        if (!anim) return false;
        anim.t = Math.min(1, anim.t + dt / anim.dur);
        const s = anim.t * anim.t * (3 - 2 * anim.t), X = anim.X, th = anim.th;
        // exp(sX): the motion a fraction s of the way along
        const cs = anim.kind > 0 ? Math.cosh(s * th) : anim.kind < 0 ? Math.cos(s * th) : 1, sn = anim.kind > 0 ? Math.sinh(s * th) / th : anim.kind < 0 ? Math.sin(s * th) / th : s;
        M = anim.t < 1 ? unit(gmul([cs + sn * X[0], sn * X[1], sn * X[2], cs + sn * X[3]], anim.from)) : anim.to;
        if (anim.t >= 1) anim = null;
        read(); fig.dirty(); return !!anim;
      },
    });
    // slide rigidly from the present position to the motion `to`, along a single one-parameter family of motions
    function slideTo(to) {
      let A = unit(gmul(to, inv(M))); if (A[0] + A[3] < 0) A = A.map(v => -v);
      const hf = (A[0] + A[3]) / 2, B = [A[0] - hf, A[1], A[2], A[3] - hf];
      let kind = 0, th = 1, X = B;
      if (hf > 1 + 1e-9) { th = Math.acosh(hf); kind = 1; X = B.map(v => v * th / Math.sinh(th)); }
      else if (hf < 1 - 1e-9) { th = Math.acos(hf); kind = -1; X = B.map(v => v * th / Math.sin(th)); }
      if (Math.hypot(B[0], B[1], B[2], B[3]) < 1e-9) { M = to; read(); fig.dirty(); return; }
      anim = { from: M, to, X, th, kind, t: 0, dur: Math.min(2.6, 1.1 + 0.35 * th) }; fig.dirty();
    }
    function choose(x, y) {
      if (!V || !V.has(x, y) || V.uy(y) < 0.01) return;
      const z = mobius(inv(M), V.ux(x), V.uy(y)); C.reduceTau(z[0], z[1], o6);
      sel = [o6[5], -o6[3], -o6[4], o6[2]].map(Math.round); if (key(sel) === '1,0,0,1') sel = null;
      slideTo(sel ? inv(sel) : ID); read();
    }
    // the motion that carries p to q along the straight line of the geometry through them, without turning
    function carry(p, q) {
      const wx = (q[0] - p[0]) / p[1], wy = q[1] / p[1], n = wx * wx + (wy + 1) * (wy + 1);
      const ur = (wx * wx + (wy - 1) * (wy + 1)) / n, ui = (wx * (wy - 1) - wx * (wy + 1)) / n;     // (w - i)/(w + i)
      const k = 1 + Math.sqrt(Math.max(0, 1 - ur * ur - ui * ui)), mr = ur / k, mi = ui / k;       // the same, for the midpoint
      const dn = (1 - mr) * (1 - mr) + mi * mi, zx = -2 * mi / dn, zy = (1 - mr * mr - mi * mi) / dn;   // i(1 + m)/(1 - m)
      const m = [p[0] + p[1] * zx, p[1] * zy], halfTurn = a => [a[0], -(a[0] * a[0] + a[1] * a[1]), 1, -a[0]];
      return unit(gmul(halfTurn(m), halfTurn(p)));
    }
    const at = (x, y) => [Math.max(V.x0, Math.min(V.x1, V.ux(x))), Math.max(0.04, Math.min(V.y1, V.uy(y)))];
    pointer(fig, {
      hit: (x, y, type) => (V && type !== 'touch' && V.has(x, y) ? 'map' : null),
      start: (k, x, y) => { grab = { x, y, z: at(x, y), moved: false }; },
      move: (k, x, y) => {
        if (!grab) return; if (Math.hypot(x - grab.x, y - grab.y) > 4) grab.moved = true;
        if (!grab.moved) return;
        const z = at(x, y); if (Math.hypot(z[0] - grab.z[0], z[1] - grab.z[1]) < 1e-6) return;
        anim = null; M = unit(gmul(carry(grab.z, z), M)); grab.z = z; read(); fig.dirty();
      },
      end: () => { if (grab && !grab.moved) choose(grab.x, grab.y); grab = null; },
      tap: choose,
    });
    $('slide-reset').addEventListener('click', () => { anim = null; M = ID; sel = null; read(); fig.dirty(); });
    if (coinsBox) coinsBox.addEventListener('change', () => fig.dirty());
    read();
  }

  /* ---------- Figure 4: E4, E6, Delta and j over the half-plane ---------- */
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

  onReady(() => { figCubic(); cubicViews(figSurface()); figBasis(); figSlide(); figForms(); });
})();
