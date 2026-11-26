/* Too Much Room — figures 4 to 8: cancelling shadows, the fold, the circle that
   cannot be lifted, rounding the crease, and the Klein bottle. */
(function () {
  'use strict';
  const P = window.Peg, K = window.Kit, S = K.S, TAU = P.TAU;

  function seg(id, onPick) {
    const root = K.$(id); if (!root) return;
    const btns = Array.from(root.querySelectorAll('button'));
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(o => o.setAttribute('aria-pressed', o === b ? 'true' : 'false'));
      onPick(b.dataset.v);
    }));
  }

  /* ------------------------------------------------------------------ 4 */
  K.onReady(function shadows() {
    const canvas = K.$('c-shadow'); if (!canvas) return;
    let s0 = 0.5, t0 = 2.75, delta = 0.8, mode = 'L';
    const R = 1.7, RZ = 0.85, NE = 22;

    function boxes(w, h) {
      if (w >= 620) {
        const lw = Math.round(w * 0.38), pw = (w - lw - 24) / 2;
        return [{ x: 0, y: 0, w: lw, h }, { x: lw + 12, y: 0, w: pw, h }, { x: lw + 24 + pw, y: 0, w: pw, h }];
      }
      const lh = Math.round(h * 0.54), pw = (w - 10) / 2;
      return [{ x: 0, y: 0, w, h: lh }, { x: 0, y: lh + 10, w: pw, h: h - lh - 10 }, { x: pw + 10, y: lh + 10, w: pw, h: h - lh - 10 }];
    }
    /* the patch: two parameters in [0,1]^2 -> the point's a, b, m, v */
    function at(u, w) {
      const loop = S.loop;
      let a, b;
      if (mode === 'off') {
        const p = loop.pt(s0 + u * delta), k = 1 + w * delta * 0.5;
        a = [p[0] * k, p[1] * k]; b = loop.pt(t0);
      } else { a = loop.pt(s0 + u * delta); b = loop.pt(t0 + w * delta); }
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      let v = [(a[0] - b[0]) / 2, (a[1] - b[1]) / 2];
      if (mode === 'turn') { const c = Math.cos(S.phi), s = Math.sin(S.phi); v = [c * v[0] - s * v[1], s * v[0] + c * v[1]]; }
      return { a, b, m, v };
    }
    function outline(key) {
      const out = [];
      const add = f => { for (let i = 0; i < NE; i++) { const q = f(i / NE)[key]; out.push(q[0], q[1]); } };
      add(u => at(u, 0)); add(u => at(1, u)); add(u => at(1 - u, 1)); add(u => at(0, 1 - u));
      return out;
    }

    const fig = new K.Fig(canvas, (ctx, w, h) => {
      const T = K.theme(), loop = S.loop, [A, B, C] = boxes(w, h);
      K.panel(ctx, A.x, A.y, A.w, A.h, mode === 'off' ? 'A PATCH THAT LEAVES THE SURFACE' : 'A PATCH OF CHORDS');
      K.clip(ctx, A, () => {
        const V = K.view(A.x, A.y + 12, A.w, A.h - 12, R);
        K.drawLoop(ctx, V, T, K.alpha(T.faint, 0.22));
        const base = at(0, 0);
        K.line(ctx, V.X(base.a[0]), V.Y(base.a[1]), V.X(base.b[0]), V.Y(base.b[1]), K.alpha(T.ink, 0.35), 1.2, [4, 4]);
        if (mode === 'off') {
          K.poly(ctx, V, outline('a'), true); ctx.fillStyle = K.alpha(T.blue, 0.3); ctx.fill();
          const e1 = at(1, 0).a, e2 = at(0, 1).a;
          K.arrow(ctx, V.X(base.a[0]), V.Y(base.a[1]), V.X(e1[0]), V.Y(e1[1]), T.blue, 2.6);
          K.arrow(ctx, V.X(base.a[0]), V.Y(base.a[1]), V.X(e2[0]), V.Y(e2[1]), T.red, 2.6);
        } else {
          const arc = (from, col) => {
            const pts = [];
            for (let i = 0; i <= 24; i++) { const p = loop.pt(from + delta * i / 24); pts.push(p[0], p[1]); }
            K.poly(ctx, V, pts, false); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke();
            const n = pts.length;
            K.arrow(ctx, V.X(pts[n - 4]), V.Y(pts[n - 3]), V.X(pts[n - 2]), V.Y(pts[n - 1]), col, 5);
          };
          arc(s0, T.blue); arc(t0, T.red);
        }
        K.dot(ctx, V.X(base.a[0]), V.Y(base.a[1]), 6.5, T.blue, T.panel, 2);
        K.dot(ctx, V.X(base.b[0]), V.Y(base.b[1]), 6.5, mode === 'off' ? T.ink : T.red, T.panel, 2);
        const lab = (p, t, c) => K.label(ctx, t, V.X(p[0]) - 17 * p[0] / (Math.hypot(p[0], p[1]) || 1), V.Y(p[1]) + 17 * p[1] / (Math.hypot(p[0], p[1]) || 1), { italic: true, serif: true, size: 16, color: c, align: 'center', halo: T.panel });
        lab(base.a, 'a', T.blue); lab(base.b, 'b', mode === 'off' ? T.ink : T.red);
      });

      const areas = [];
      const plane = (box, key, title) => {
        K.panel(ctx, box.x, box.y, box.w, box.h, title);
        const pts = outline(key), area = P.signedArea(pts);
        areas.push(area);
        let cx = 0, cy = 0; for (let i = 0; i < pts.length; i += 2) { cx += pts[i]; cy += pts[i + 1]; }
        cx /= pts.length / 2; cy /= pts.length / 2;
        K.clip(ctx, box, () => {
          const V = K.view(box.x, box.y + 10, box.w, box.h - 30, RZ, cx, cy);
          if (key === 'm') { K.poly(ctx, V, S.pts(), true); ctx.strokeStyle = K.alpha(T.ink, 0.22); ctx.lineWidth = 1.5; ctx.stroke(); }
          else {
            K.line(ctx, V.X(-3), V.Y(0), V.X(3), V.Y(0), K.alpha(T.ink, 0.22), 1);
            K.line(ctx, V.X(0), V.Y(-3), V.X(0), V.Y(3), K.alpha(T.ink, 0.22), 1);
            K.dot(ctx, V.X(0), V.Y(0), 2.5, K.alpha(T.ink, 0.5));
          }
          const col = area >= 0 ? T.teal : T.gold;
          K.poly(ctx, V, pts, true); ctx.fillStyle = K.alpha(col, 0.38); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.stroke();
          const o = at(0, 0)[key], e1 = at(1, 0)[key], e2 = at(0, 1)[key];
          K.arrow(ctx, V.X(o[0]), V.Y(o[1]), V.X(e1[0]), V.Y(e1[1]), T.blue, 2.4);
          K.arrow(ctx, V.X(o[0]), V.Y(o[1]), V.X(e2[0]), V.Y(e2[1]), T.red, 2.4);
          K.dot(ctx, V.X(o[0]), V.Y(o[1]), 3, T.ink);
        });
        const col = area >= 0 ? T.teal : T.gold;
        K.label(ctx, (area >= 0 ? '↺  ' : '↻  ') + K.signed(area), box.x + box.w / 2, box.y + box.h - 16, { align: 'center', size: 14, bold: true, color: col });
      };
      plane(B, 'm', B.w < 250 ? 'MIDPOINT SHADOW' : 'SHADOW IN THE MIDPOINT PLANE');
      plane(C, 'v', C.w < 250 ? 'HALF-CHORD SHADOW' : 'SHADOW IN THE HALF-CHORD PLANE');
      const out = K.$('shadow-read');
      if (out) {
        const sum = areas[0] + areas[1];
        out.textContent = 'Midpoint shadow ' + K.signed(areas[0]) + ', half-chord shadow ' + K.signed(areas[1]) + '. Together: ' + (Math.abs(sum) < 5e-5 ? '0.0000' : K.signed(sum)) + '.';
      }
    });

    K.pointer(fig, {
      hit: (x, y, type) => {
        const A = boxes(fig.w, fig.h)[0], V = K.view(A.x, A.y + 12, A.w, A.h - 12, R), lim = type === 'touch' ? 28 : 15;
        const a = S.loop.pt(s0), b = S.loop.pt(t0);
        const da = Math.hypot(V.X(a[0]) - x, V.Y(a[1]) - y), db = Math.hypot(V.X(b[0]) - x, V.Y(b[1]) - y);
        return Math.min(da, db) < lim ? (da <= db ? 'a' : 'b') : null;
      },
      move: (tg, x, y) => {
        const A = boxes(fig.w, fig.h)[0], V = K.view(A.x, A.y + 12, A.w, A.h - 12, R);
        const th = P.mod(Math.atan2(V.uy(y), V.ux(x)), TAU);
        if (tg === 'a') s0 = th; else t0 = th;
        fig.dirty();
      }
    });
    seg('shadow-modes', v => { mode = v; fig.dirty(); });
    const size = K.$('shadow-size');
    if (size) size.addEventListener('input', () => { delta = parseFloat(size.value); fig.dirty(); });
    S.subs.push(() => fig.dirty());
  });

  /* ------------------------------------------------------------------ 5 */
  K.onReady(function fold() {
    const canvas = K.$('c-fold'); if (!canvas) return;
    let r0 = 0.95, th0 = 0.62, c = 1;
    const DR = 0.2, DT = 0.27, R = 1.6;
    function boxes(w, h) {
      if (w >= 620) { const pw = (w - 14) / 2; return [{ x: 0, y: 0, w: pw, h }, { x: pw + 14, y: 0, w: pw, h }]; }
      const ph = (h - 12) / 2; return [{ x: 0, y: 0, w, h: ph }, { x: 0, y: ph + 12, w, h: ph }];
    }
    function wedge(ctx, V, ra, rb, ta, tb) {
      ctx.beginPath();
      const n = 28;
      for (let i = 0; i <= n; i++) { const t = ta + (tb - ta) * i / n, X = V.X(rb * Math.cos(t)), Y = V.Y(rb * Math.sin(t)); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
      for (let i = n; i >= 0; i--) { const t = ta + (tb - ta) * i / n; ctx.lineTo(V.X(ra * Math.cos(t)), V.Y(ra * Math.sin(t))); }
      ctx.closePath();
    }
    function grid(ctx, V, T) {
      for (const r of [0.5, 1, 1.5]) { ctx.beginPath(); ctx.arc(V.X(0), V.Y(0), r * V.s, 0, TAU); ctx.strokeStyle = K.alpha(T.ink, 0.13); ctx.lineWidth = 1; ctx.stroke(); }
      for (let k = 0; k < 12; k++) { const t = k * TAU / 12; K.line(ctx, V.X(0), V.Y(0), V.X(2.4 * Math.cos(t)), V.Y(2.4 * Math.sin(t)), K.alpha(T.ink, 0.1), 1); }
    }
    const fig = new K.Fig(canvas, (ctx, w, h) => {
      const T = K.theme(), [A, B] = boxes(w, h);
      const before = 4 * r0 * DR * DT, after = before * 2 * c * c;
      K.panel(ctx, A.x, A.y, A.w, A.h, 'HALF-CHORD PLANE, BEFORE THE FOLD');
      K.clip(ctx, A, () => {
        const V = K.view(A.x, A.y + 12, A.w, A.h - 34, R);
        grid(ctx, V, T);
        wedge(ctx, V, r0 - DR, r0 + DR, th0 + Math.PI - DT, th0 + Math.PI + DT);
        ctx.fillStyle = K.alpha(T.blue, 0.2); ctx.fill(); ctx.strokeStyle = T.blue; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
        wedge(ctx, V, r0 - DR, r0 + DR, th0 - DT, th0 + DT);
        ctx.fillStyle = K.alpha(T.blue, 0.45); ctx.fill(); ctx.strokeStyle = T.blue; ctx.lineWidth = 1.8; ctx.stroke();
        const vx = r0 * Math.cos(th0), vy = r0 * Math.sin(th0);
        K.line(ctx, V.X(-vx), V.Y(-vy), V.X(vx), V.Y(vy), K.alpha(T.ink, 0.3), 1, [3, 3]);
        K.dot(ctx, V.X(-vx), V.Y(-vy), 4.5, T.panel, T.blue, 2);
        K.dot(ctx, V.X(vx), V.Y(vy), 6.5, T.blue, T.panel, 2);
        K.label(ctx, 'v', V.X(vx * 1.42), V.Y(vy * 1.42), { italic: true, serif: true, size: 17, color: T.blue, align: 'center', halo: T.panel });
        K.label(ctx, '−v', V.X(-vx * 1.42), V.Y(-vy * 1.42), { italic: true, serif: true, size: 17, color: T.blue, align: 'center', halo: T.panel });
      });
      K.label(ctx, 'each wedge has area ' + before.toFixed(3), A.x + A.w / 2, A.y + A.h - 16, { align: 'center', size: 13.5, bold: true, color: T.blue });

      K.panel(ctx, B.x, B.y, B.w, B.h, 'AFTER THE FOLD');
      K.clip(ctx, B, () => {
        const V = K.view(B.x, B.y + 12, B.w, B.h - 34, R);
        grid(ctx, V, T);
        wedge(ctx, V, c * (r0 - DR), c * (r0 + DR), 2 * th0 - 2 * DT, 2 * th0 + 2 * DT);
        ctx.fillStyle = K.alpha(T.red, 0.42); ctx.fill(); ctx.strokeStyle = T.red; ctx.lineWidth = 1.8; ctx.stroke();
        const gx = c * r0 * Math.cos(2 * th0), gy = c * r0 * Math.sin(2 * th0);
        K.dot(ctx, V.X(gx), V.Y(gy), 6, T.red, T.panel, 2);
      });
      const ok = Math.abs(2 * c * c - 1) < 0.006;
      K.label(ctx, 'both land here: area ' + after.toFixed(3) + '  (×' + (2 * c * c).toFixed(2) + ')', B.x + B.w / 2, B.y + B.h - 16, { align: 'center', size: 13.5, bold: true, color: ok ? T.teal : T.red });
      const out = K.$('fold-read');
      if (out) out.textContent = 'Lengths × ' + c.toFixed(3) + ', angles × 2: every area × ' + (2 * c * c).toFixed(2) + (ok ? '. Areas are kept.' : '.');
    });
    K.pointer(fig, {
      hit: (x, y, type) => {
        const A = boxes(fig.w, fig.h)[0], V = K.view(A.x, A.y + 12, A.w, A.h - 34, R);
        return Math.hypot(V.X(r0 * Math.cos(th0)) - x, V.Y(r0 * Math.sin(th0)) - y) < (type === 'touch' ? 30 : 18) ? 'v' : null;
      },
      move: (tg, x, y) => {
        const A = boxes(fig.w, fig.h)[0], V = K.view(A.x, A.y + 12, A.w, A.h - 34, R);
        const ux = V.ux(x), uy = V.uy(y);
        r0 = Math.min(1.3, Math.max(0.4, Math.hypot(ux, uy))); th0 = Math.atan2(uy, ux);
        fig.dirty();
      }
    });
    const sl = K.$('fold-c'), sn = K.$('fold-snap');
    if (sl) sl.addEventListener('input', () => { c = parseFloat(sl.value); fig.dirty(); });
    if (sn) sn.addEventListener('click', () => { c = Math.SQRT1_2; if (sl) sl.value = c.toFixed(3); fig.dirty(); });
  });

  /* ------------------------------------------------------------------ 6 */
  K.onReady(function cylinder() {
    const canvas = K.$('c-cyl'); if (!canvas) return;
    const N = 2400, H = 0.02, TMAX = 5.5;
    const force = {
      pend: (x, t) => -Math.sin(x),
      wave: (x, t) => -0.7 * Math.sin(x - 0.9 * t) - 0.5 * Math.sin(2 * x + 0.5 * t)
    };
    let preset = 'pend', time = 1.6, lift = 0, playing = false, cur = -1;
    const X = new Float64Array(N), Pm = new Float64Array(N);
    function reset() { for (let i = 0; i < N; i++) { X[i] = -Math.PI + (i * TAU) / N; Pm[i] = 0; } cur = 0; }
    function advance(to) {
      if (cur < 0 || to < cur - 1e-9) reset();
      const f = force[preset];
      while (cur < to - 1e-9) {
        const h = Math.min(H, to - cur), t = cur;
        for (let i = 0; i < N; i++) {
          const x = X[i], p = Pm[i];
          const k1x = p, k1p = f(x, t);
          const k2x = p + h / 2 * k1p, k2p = f(x + h / 2 * k1x, t + h / 2);
          const k3x = p + h / 2 * k2p, k3p = f(x + h / 2 * k2x, t + h / 2);
          const k4x = p + h * k3p, k4p = f(x + h * k3x, t + h);
          X[i] = x + h / 6 * (k1x + 2 * k2x + 2 * k3x + k4x); Pm[i] = p + h / 6 * (k1p + 2 * k2p + 2 * k3p + k4p);
        }
        cur += h;
      }
    }
    /* cut the lifted curve where it crosses the original circle */
    function lobes() {
      const xe = i => X[i % N] + TAU * Math.floor(i / N), qe = i => Pm[i % N] + lift;
      let big = 0; for (let i = 0; i < N; i++) big = Math.max(big, Math.abs(qe(i)));
      if (big < 1e-7) return { list: [], cross: [], same: true };
      const cuts = [];
      for (let i = 0; i < N; i++) if ((qe(i) >= 0) !== (qe(i + 1) >= 0)) cuts.push(i);
      const cx = i => { const a = qe(i), b = qe(i + 1); return xe(i) + (xe(i + 1) - xe(i)) * (a / (a - b)); };
      const list = [];
      if (!cuts.length) {
        const pts = []; let area = 0;
        for (let i = 0; i <= N; i++) { pts.push(xe(i), qe(i)); if (i) area += 0.5 * (qe(i) + qe(i - 1)) * (xe(i) - xe(i - 1)); }
        pts.push(xe(N), 0, xe(0), 0);
        list.push({ pts, area });
        return { list, cross: [] };
      }
      for (let k = 0; k < cuts.length; k++) {
        const i0 = cuts[k], i1 = k + 1 < cuts.length ? cuts[k + 1] : cuts[0] + N;
        const pts = [cx(i0), 0]; let area = 0, px = pts[0], pq = 0;
        for (let i = i0 + 1; i <= i1; i++) { const x = xe(i), q = qe(i); area += 0.5 * (q + pq) * (x - px); pts.push(x, q); px = x; pq = q; }
        const xend = cx(i1); area += 0.5 * pq * (xend - px); pts.push(xend, 0);
        list.push({ pts, area });
      }
      return { list, cross: cuts.map(cx) };
    }

    const fig = new K.Fig(canvas, (ctx, w, h) => {
      const T = K.theme();
      advance(time);
      K.panel(ctx, 0, 0, w, h, 'STATES OF A BEAD ON A RING');
      const L = 44, Rt = 16, Tp = 30, Bt = 30, W = w - L - Rt, Hh = h - Tp - Bt;
      const PLO = -2.5, PHI = 3.5, sy = Hh / (PHI - PLO);
      const xp = x => L + ((x + Math.PI) / TAU) * W, yp = p => Tp + (PHI - p) * sy;
      for (let p = -2; p <= 3; p++) if (p) { K.line(ctx, L, yp(p), L + W, yp(p), K.alpha(T.ink, 0.08), 1); K.label(ctx, (p > 0 ? '+' : '−') + Math.abs(p), L - 8, yp(p), { align: 'right', size: 11, color: T.soft }); }
      K.label(ctx, '0', L - 8, yp(0), { align: 'right', size: 11, color: T.soft });
      ctx.save(); ctx.translate(13, Tp + Hh / 2); ctx.rotate(-Math.PI / 2);
      K.label(ctx, 'momentum', 0, 0, { align: 'center', size: 11.5, color: T.soft }); ctx.restore();
      K.label(ctx, W < 480 ? 'position round the ring (the two edges are one line)' : 'position around the ring; the left and right edges are the same line', L + W / 2, Tp + Hh + 16, { align: 'center', size: 11.5, color: T.soft });
      const res = lobes();
      ctx.save(); ctx.beginPath(); ctx.rect(L, Tp, W, Hh); ctx.clip();
      for (let k = -3; k <= 3; k++) {
        const off = k * TAU;
        for (const lb of res.list) {
          let lo = Infinity, hi = -Infinity;
          for (let i = 0; i < lb.pts.length; i += 2) { lo = Math.min(lo, lb.pts[i]); hi = Math.max(hi, lb.pts[i]); }
          if (hi + off < -Math.PI || lo + off > Math.PI) continue;
          ctx.beginPath();
          for (let i = 0; i < lb.pts.length; i += 2) { const Xp = xp(lb.pts[i] + off), Yp = yp(lb.pts[i + 1]); if (i) ctx.lineTo(Xp, Yp); else ctx.moveTo(Xp, Yp); }
          ctx.closePath(); ctx.fillStyle = K.alpha(lb.area >= 0 ? T.teal : T.gold, 0.32); ctx.fill();
        }
      }
      K.line(ctx, L, yp(0), L + W, yp(0), T.blue, 2.4, [7, 5]);
      for (let k = -3; k <= 3; k++) {
        const off = k * TAU;
        ctx.beginPath();
        let pen = false;
        for (let i = 0; i <= N; i++) {
          const x = X[i % N] + (i === N ? TAU : 0) + off;
          if (x < -Math.PI - 0.4 || x > Math.PI + 0.4) { pen = false; continue; }
          const Xp = xp(x), Yp = yp(Pm[i % N] + lift);
          if (pen) ctx.lineTo(Xp, Yp); else { ctx.moveTo(Xp, Yp); pen = true; }
        }
        ctx.strokeStyle = T.ink; ctx.lineWidth = 2; ctx.stroke();
        for (const c of res.cross) { const x = c + off; if (x >= -Math.PI && x <= Math.PI) K.dot(ctx, xp(x), yp(0), 4.6, T.panel, T.ink, 2); }
      }
      ctx.restore();
      ctx.strokeStyle = T.rule; ctx.lineWidth = 1; ctx.strokeRect(L + 0.5, Tp + 0.5, W - 1, Hh - 1);
      K.line(ctx, L, Tp, L, Tp + Hh, T.soft, 1.5); K.line(ctx, L + W, Tp, L + W, Tp + Hh, T.soft, 1.5);
      const out = K.$('cyl-read');
      if (out) {
        if (res.same) out.textContent = 'Nothing has moved yet: the curve is the circle of rest states.';
        else {
          let up = 0, dn = 0; for (const lb of res.list) { if (lb.area >= 0) up += lb.area; else dn += lb.area; }
          const net = up + dn, n = res.cross.length;
          out.textContent = 'Swept above the circle ' + K.signed(up, 2) + ', below ' + K.signed(dn, 2) + ', net ' + (Math.abs(net) < 0.005 ? '0.00' : K.signed(net, 2)) + '. The curve meets the circle at ' + (n === 0 ? 'no points' : n + ' points') + '.';
        }
      }
    }, {
      tick: dt => {
        if (!playing) return false;
        time = Math.min(TMAX, time + dt * 0.9);
        const sl = K.$('cyl-t'); if (sl) sl.value = time.toFixed(2);
        if (time >= TMAX) { playing = false; const b = K.$('cyl-play'); if (b) b.textContent = 'Play'; }
        fig.needs = true; return playing;
      }
    });
    const st = K.$('cyl-t'), sl = K.$('cyl-lift'), bp = K.$('cyl-play');
    if (st) st.addEventListener('input', () => { time = parseFloat(st.value); playing = false; if (bp) bp.textContent = 'Play'; fig.dirty(); });
    if (sl) sl.addEventListener('input', () => { lift = parseFloat(sl.value); fig.dirty(); });
    if (bp) bp.addEventListener('click', () => {
      playing = !playing;
      if (playing && time >= TMAX - 1e-6) time = 0;
      bp.textContent = playing ? 'Pause' : 'Play'; fig.dirty();
    });
    seg('cyl-presets', v => { preset = v; cur = -1; fig.dirty(); });
  });

  /* ------------------------------------------------------------------ 7 */
  K.onReady(function surgery() {
    const canvas = K.$('c-cut'); if (!canvas) return;
    let rho = 0;
    function boxes(w, h) {
      if (w >= 620) { const pw = (w - 14) / 2; return [{ x: 0, y: 0, w: pw, h }, { x: pw + 14, y: 0, w: pw, h }]; }
      const ph = (h - 12) / 2; return [{ x: 0, y: 0, w, h: ph }, { x: 0, y: ph + 12, w, h: ph }];
    }
    /* one strand: in along the horizontal arm, round the corner, out along the vertical arm.
       Returns points with a blend value 0 (first sheet) to 1 (second sheet). */
    function strand(sign) {
      const r = 0.72 * rho, E = 1.5, out = [];
      const push = (x, y, t) => out.push([sign * x, sign * y, t]);
      for (let i = 0; i <= 20; i++) push(E + (r - E) * i / 20, 0, 0);
      if (r > 1e-4) for (let i = 1; i <= 40; i++) { const a = -Math.PI / 2 - (Math.PI / 2) * i / 40; push(r + r * Math.cos(a), r + r * Math.sin(a), i / 40); }
      for (let i = 0; i <= 20; i++) push(0, r + (E - r) * i / 20, 1);
      return out;
    }
    const foldPt = p => { const r = Math.hypot(p[0], p[1]) / Math.SQRT2, a = 2 * Math.atan2(p[1], p[0]); return [r * Math.cos(a), r * Math.sin(a), p[2]]; };
    function drawStrand(ctx, V, T, pts, lw) {
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        K.line(ctx, V.X(a[0]), V.Y(a[1]), V.X(b[0]), V.Y(b[1]), K.mix(T.blue, T.red, (a[2] + b[2]) / 2), lw);
      }
    }
    const fig = new K.Fig(canvas, (ctx, w, h) => {
      const T = K.theme(), [A, B] = boxes(w, h);
      const s1 = strand(1), s2 = strand(-1);
      K.panel(ctx, A.x, A.y, A.w, A.h, 'A SLICE ACROSS THE SEAM, BEFORE THE FOLD');
      K.clip(ctx, A, () => {
        const V = K.view(A.x, A.y + 14, A.w, A.h - 14, 1.75);
        if (rho > 0.01) { K.line(ctx, V.X(-1.5), V.Y(0), V.X(1.5), V.Y(0), K.alpha(T.ink, 0.14), 1.5, [4, 4]); K.line(ctx, V.X(0), V.Y(-1.5), V.X(0), V.Y(1.5), K.alpha(T.ink, 0.14), 1.5, [4, 4]); }
        drawStrand(ctx, V, T, s1, 3.4); drawStrand(ctx, V, T, s2, 3.4);
        K.dot(ctx, V.X(0), V.Y(0), 5, T.panel, T.ink, 1.8);
        K.dot(ctx, V.X(1.05), V.Y(0), 5.5, T.ink, T.panel, 1.6); K.dot(ctx, V.X(-1.05), V.Y(0), 5.5, T.ink, T.panel, 1.6);
        K.label(ctx, 'first sheet', V.X(1.5), V.Y(0) + 16, { align: 'right', size: 12, color: T.blue, halo: T.panel });
        K.label(ctx, 'turned sheet', V.X(0) + 9, V.Y(1.5) + 4, { size: 12, color: T.red, halo: T.panel });
        K.label(ctx, 'seam', V.X(0) + 10, V.Y(0) + 30, { size: 12, color: T.soft, halo: T.panel });
        K.label(ctx, 'a chord', V.X(1.05), V.Y(0) - 15, { align: 'center', size: 11.5, color: T.soft, halo: T.panel });
        K.label(ctx, 'same chord, reversed', V.X(-1.05) + 8, V.Y(0) - 15, { align: 'center', size: 11.5, color: T.soft, halo: T.panel });
      });
      K.panel(ctx, B.x, B.y, B.w, B.h, 'THE SAME SLICE, AFTER THE FOLD');
      K.clip(ctx, B, () => {
        const V = K.view(B.x, B.y + 14, B.w, B.h - 14, 1.25);
        drawStrand(ctx, V, T, s1.map(foldPt), 3.4);
        K.dot(ctx, V.X(0), V.Y(0), 5, T.panel, T.ink, 1.8);
        K.dot(ctx, V.X(1.05 / Math.SQRT2), V.Y(0), 5.5, T.ink, T.panel, 1.6);
        K.label(ctx, 'first band', V.X(1.06), V.Y(0) + 16, { align: 'right', size: 12, color: T.blue, halo: T.panel });
        K.label(ctx, 'turned band', V.X(-1.06), V.Y(0) + 16, { size: 12, color: T.red, halo: T.panel });
        K.label(ctx, rho > 0.01 ? 'the bad point is no longer on the surface' : 'both bands end here, at a point where the fold is not smooth', V.X(0), V.Y(0) - (rho > 0.01 ? -34 : 20), { align: 'center', size: 11.5, color: T.soft, halo: T.panel });
      });
    });
    const sl = K.$('cut-rho');
    if (sl) sl.addEventListener('input', () => { rho = parseFloat(sl.value); fig.dirty(); });
  });

  /* ------------------------------------------------------------------ 8 */
  K.onReady(function klein() {
    const canvas = K.$('c-klein'); if (!canvas) return;
    const cam = new K.Cam(0.9, 0.62);
    let auto = !K.reduceMotion, cut = 0.74, key = '', verts = null, prims = [];
    const NU = 76, NV = 30, R0 = 2.5, AMP = 0.86;
    K.themeSubs.push(() => { key = ''; });
    function build() {
      const T = K.theme(), nu = Math.max(2, Math.round(NU * cut)), umax = TAU * cut;
      verts = new Float64Array(3 * (nu + 1) * NV); prims = [];
      for (let i = 0; i <= nu; i++) for (let j = 0; j < NV; j++) {
        const u = umax * i / nu, v = TAU * j / NV, o = 3 * (i * NV + j);
        const a = AMP * (Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v));
        verts[o] = (R0 + a) * Math.cos(u); verts[o + 1] = (R0 + a) * Math.sin(u);
        verts[o + 2] = AMP * (Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v));
      }
      const jq = Math.round(NV / 4);
      for (let i = 0; i < nu; i++) for (let j = 0; j < NV; j++) {
        const j2 = (j + 1) % NV, q = [i * NV + j, (i + 1) * NV + j, (i + 1) * NV + j2, i * NV + j2];
        const t = (Math.cos(TAU * (j + 0.5) / NV) + 1) / 2;
        prims.push({ q, rgb: K.mixRGB(T.red, T.blue, t), area: K.quadArea(verts, q) });
        if (j === 0) prims.push({ l: [i * NV, (i + 1) * NV], color: T.gold, lw: 3.6 });
        if (cut < 0.995 && (i === 0 || i === nu - 1)) { const r = i === 0 ? 0 : nu; prims.push({ l: [r * NV + j, r * NV + j2], color: T.ink, lw: 2.2 }); }
        if (j === jq || j === NV - jq) prims.push({ l: [i * NV + j, (i + 1) * NV + j], color: T.ink, lw: 1.6 });
      }
      key = cut + '';
    }
    const fig = new K.Fig(canvas, (ctx, w, h) => {
      const T = K.theme();
      if (key !== cut + '') build();
      cam.frame(w / 2, h * 0.52, Math.min(w / 8.2, h / 6.5));
      K.render3(ctx, cam, verts, prims, { alpha: 0.94, edge: K.alpha(T.ink, 0.12) });
      /* ghost of the circle where the two sheets cross, so it can be found when it is hidden inside */
      const tmp = [0, 0, 0], n = 90;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const u = TAU * cut * i / n;
        cam.proj(R0 * Math.cos(u), R0 * Math.sin(u), 0, tmp, 0);
        if (i) ctx.lineTo(tmp[0], tmp[1]); else ctx.moveTo(tmp[0], tmp[1]);
      }
      ctx.strokeStyle = K.alpha(T.gold, 0.75); ctx.lineWidth = 2; ctx.setLineDash([2, 5]); ctx.stroke(); ctx.setLineDash([]);
    }, { tick: dt => { if (auto) { cam.yaw += dt * 0.25; return true; } return false; } });
    K.orbit(fig, cam, () => { auto = false; });
    const sl = K.$('klein-cut');
    if (sl) sl.addEventListener('input', () => { cut = parseFloat(sl.value); fig.dirty(); });
  });
})();
