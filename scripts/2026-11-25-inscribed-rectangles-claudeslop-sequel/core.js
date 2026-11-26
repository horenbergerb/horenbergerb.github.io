/* Too Much Room — numerical core. No DOM in here, so it also runs under node
   (see _check/core-check.cjs). */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Peg = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TAU = 2 * Math.PI;
  const mod = (x, m) => ((x % m) + m) % m;

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* A loop that is star-shaped about the origin: the point at angle th sits at
     radius r(th), where r is a normalised blend of bump functions centred on
     n handles.  The blend is real-analytic and stays between the smallest and
     largest handle value, so the loop is always a smooth Jordan curve. */
  const CMIN = 0.34, CMAX = 1.5, TAB = 2048;

  class Loop {
    constructor(c) { this.version = 0; this.set(c); }

    set(c) {
      this.c = Float64Array.from(c);
      this.n = this.c.length;
      this.kappa = -Math.log(0.3) / (1 - Math.cos(TAU / this.n));
      this.ang = Float64Array.from({ length: this.n }, (_, j) => (j * TAU) / this.n);
      this.retab();
    }

    retab() {
      if (!this.tab) this.tab = new Float64Array(TAB + 1);
      for (let i = 0; i < TAB; i++) this.tab[i] = this.rad((i * TAU) / TAB);
      this.tab[TAB] = this.tab[0];
      this.version++;
    }

    rad(th) {
      let N = 0, D = 0;
      for (let j = 0; j < this.n; j++) {
        const k = Math.exp(this.kappa * (Math.cos(th - this.ang[j]) - 1));
        N += this.c[j] * k; D += k;
      }
      return N / D;
    }

    /* radius and its derivative */
    radD(th) {
      let N = 0, D = 0, Np = 0, Dp = 0;
      for (let j = 0; j < this.n; j++) {
        const d = th - this.ang[j];
        const k = Math.exp(this.kappa * (Math.cos(d) - 1));
        const kp = -this.kappa * Math.sin(d) * k;
        N += this.c[j] * k; D += k; Np += this.c[j] * kp; Dp += kp;
      }
      return [N / D, (Np * D - N * Dp) / (D * D)];
    }

    radFast(th) {
      const x = (mod(th, TAU) * TAB) / TAU;
      const i = x | 0;
      return this.tab[i] + (this.tab[i + 1] - this.tab[i]) * (x - i);
    }

    pt(th) { const r = this.rad(th); return [r * Math.cos(th), r * Math.sin(th)]; }

    /* point and velocity with respect to th */
    ptD(th) {
      const [r, rp] = this.radD(th), c = Math.cos(th), s = Math.sin(th);
      return [r * c, r * s, rp * c - r * s, rp * s + r * c];
    }

    /* negative inside the loop, positive outside, zero exactly on it */
    f(x, y) { return Math.hypot(x, y) - this.rad(Math.atan2(y, x)); }
    fFast(x, y) { return Math.sqrt(x * x + y * y) - this.radFast(Math.atan2(y, x)); }

    /* move handle j so the curve passes through radius `target` at its angle */
    dragHandle(j, target) {
      let W = 0, others = 0;
      for (let i = 0; i < this.n; i++) {
        const w = Math.exp(this.kappa * (Math.cos(this.ang[j] - this.ang[i]) - 1));
        W += w; if (i !== j) others += this.c[i] * w;
      }
      this.c[j] = Math.min(CMAX, Math.max(CMIN, target * W - others));
      this.retab();
    }

    polyline(n) {
      const out = new Float64Array(2 * n);
      for (let i = 0; i < n; i++) {
        const th = (i * TAU) / n, r = this.rad(th);
        out[2 * i] = r * Math.cos(th); out[2 * i + 1] = r * Math.sin(th);
      }
      return out;
    }
  }

  function randomLoop(seed, n) {
    const R = rng(seed); n = n || 11;
    const c = [];
    let walk = 0;
    for (let j = 0; j < n; j++) {
      walk = 0.45 * walk + (R() - 0.5) * 0.9;
      c.push(Math.min(1.46, Math.max(0.52, 1.06 + walk + (R() - 0.5) * 0.25)));
    }
    return c;
  }

  /* ---- the rectangle search ------------------------------------------------
     A chord has ends a = loop(s), b = loop(t).  Write m for its midpoint and
     v for the half-chord.  Turn v through phi about m; the turned chord has
     ends P = m + w and Q = m - w.  The four points a, P, b, Q are the corners
     of a rectangle whose diagonals cross at angle phi, and it is inscribed
     exactly when P and Q are both on the loop. */

  function chord(loop, phi, s, t) {
    const a = loop.pt(s), b = loop.pt(t);
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const vx = (a[0] - b[0]) / 2, vy = (a[1] - b[1]) / 2;
    const c = Math.cos(phi), sn = Math.sin(phi);
    const wx = c * vx - sn * vy, wy = sn * vx + c * vy;
    return { a, b, m: [mx, my], v: [vx, vy], w: [wx, wy],
      P: [mx + wx, my + wy], Q: [mx - wx, my - wy] };
  }

  function residual(loop, phi, s, t, out) {
    const k = chord(loop, phi, s, t);
    out[0] = loop.f(k.P[0], k.P[1]); out[1] = loop.f(k.Q[0], k.Q[1]);
    return out;
  }

  /* residuals on an N x N grid of (s, t), using the tabulated radius */
  function grid(loop, phi, N) {
    const F1 = new Float32Array(N * N), F2 = new Float32Array(N * N);
    const px = new Float64Array(N), py = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const th = (i * TAU) / N, r = loop.radFast(th);
      px[i] = r * Math.cos(th); py[i] = r * Math.sin(th);
    }
    const c = Math.cos(phi), sn = Math.sin(phi);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const mx = (px[i] + px[j]) / 2, my = (py[i] + py[j]) / 2;
        const vx = (px[i] - px[j]) / 2, vy = (py[i] - py[j]) / 2;
        const wx = c * vx - sn * vy, wy = sn * vx + c * vy;
        F1[i * N + j] = loop.fFast(mx + wx, my + wy);
        F2[i * N + j] = loop.fFast(mx - wx, my - wy);
      }
    }
    return { F1, F2, N };
  }

  function newton(loop, phi, s, t) {
    const F = [0, 0], A = [0, 0], B = [0, 0], h = 1e-6;
    for (let it = 0; it < 30; it++) {
      residual(loop, phi, s, t, F);
      const err = Math.hypot(F[0], F[1]);
      if (err < 1e-12) return { s, t, ok: true };
      residual(loop, phi, s + h, t, A); const a0 = [A[0], A[1]];
      residual(loop, phi, s - h, t, A);
      const j11 = (a0[0] - A[0]) / (2 * h), j21 = (a0[1] - A[1]) / (2 * h);
      residual(loop, phi, s, t + h, B); const b0 = [B[0], B[1]];
      residual(loop, phi, s, t - h, B);
      const j12 = (b0[0] - B[0]) / (2 * h), j22 = (b0[1] - B[1]) / (2 * h);
      const det = j11 * j22 - j12 * j21;
      if (Math.abs(det) < 1e-14) return { s, t, ok: false };
      let ds = -(F[0] * j22 - F[1] * j12) / det, dt = -(j11 * F[1] - j21 * F[0]) / det;
      const step = Math.hypot(ds, dt), cap = 0.15;
      if (step > cap) { ds *= cap / step; dt *= cap / step; }
      s += ds; t += dt;
    }
    residual(loop, phi, s, t, F);
    return { s, t, ok: Math.hypot(F[0], F[1]) < 1e-9 };
  }

  function describe(loop, phi, s, t) {
    const k = chord(loop, phi, s, t);
    k.s = mod(s, TAU); k.t = mod(t, TAU); k.phi = phi;
    k.r = Math.hypot(k.v[0], k.v[1]);
    k.corners = [k.a, k.P, k.b, k.Q];
    return k;
  }

  function sameRect(p, q) {
    const tol = 1e-5;
    if (Math.hypot(p.m[0] - q.m[0], p.m[1] - q.m[1]) > tol) return false;
    const d1 = Math.hypot(p.v[0] - q.v[0], p.v[1] - q.v[1]);
    const d2 = Math.hypot(p.v[0] + q.v[0], p.v[1] + q.v[1]);
    if (Math.min(d1, d2) < tol) return true;
    /* a square is found from either diagonal */
    const e1 = Math.hypot(p.v[0] - q.w[0], p.v[1] - q.w[1]);
    const e2 = Math.hypot(p.v[0] + q.w[0], p.v[1] + q.w[1]);
    return Math.abs(p.r - q.r) < tol && Math.min(e1, e2) < tol;
  }

  /* every inscribed rectangle with diagonal angle phi that the grid can see */
  function findRects(loop, phi, N, g) {
    N = N || 144; g = g || grid(loop, phi, N);
    const { F1, F2 } = g, out = [], h = TAU / N;
    for (let i = 0; i < N; i++) {
      const i2 = (i + 1) % N;
      for (let j = 0; j < N; j++) {
        const dd = Math.abs(i - j);
        if (Math.min(dd, N - dd) < 2) continue;      /* collapsed chords live here */
        const j2 = (j + 1) % N;
        const a = F1[i * N + j], b = F1[i2 * N + j], c = F1[i * N + j2], d = F1[i2 * N + j2];
        if ((a > 0) === (b > 0) && (a > 0) === (c > 0) && (a > 0) === (d > 0)) continue;
        const e = F2[i * N + j], f = F2[i2 * N + j], gg = F2[i * N + j2], k = F2[i2 * N + j2];
        if ((e > 0) === (f > 0) && (e > 0) === (gg > 0) && (e > 0) === (k > 0)) continue;
        const z = newton(loop, phi, (i + 0.5) * h, (j + 0.5) * h);
        if (!z.ok) continue;
        const R = describe(loop, phi, z.s, z.t);
        if (R.r < 0.03) continue;
        if (!out.some(q => sameRect(q, R))) out.push(R);
      }
    }
    out.sort((p, q) => q.r - p.r);
    return out;
  }

  /* follow one rectangle as phi or the loop changes */
  function track(loop, phi, prev) {
    if (!prev) return null;
    const z = newton(loop, phi, prev.s, prev.t);
    if (!z.ok) return null;
    const R = describe(loop, phi, z.s, z.t);
    if (R.r < 0.03) return null;
    if (Math.hypot(R.m[0] - prev.m[0], R.m[1] - prev.m[1]) > 0.25) return null;
    return R;
  }

  function nearest(list, prev) {
    let best = null, bd = Infinity;
    for (const R of list) {
      const d = Math.hypot(R.m[0] - prev.m[0], R.m[1] - prev.m[1]) + Math.abs(R.r - prev.r);
      if (d < bd) { bd = d; best = R; }
    }
    return best;
  }

  /* signed area of a closed polygon given as [x0,y0,x1,y1,...]; positive when
     the boundary runs counter-clockwise */
  function signedArea(p) {
    let A = 0;
    const n = p.length / 2;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      A += p[2 * i] * p[2 * j + 1] - p[2 * j] * p[2 * i + 1];
    }
    return A / 2;
  }

  return { TAU, mod, rng, Loop, randomLoop, chord, residual, grid, newton, describe,
    findRects, track, nearest, signedArea, CMIN, CMAX };
});
