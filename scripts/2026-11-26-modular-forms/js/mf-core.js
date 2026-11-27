/* Modular forms series: the numerical core.  No DOM in here, so the same file
   runs in the page and under node (see ../_check/core-check.cjs).
   Complex numbers are passed as separate real and imaginary parts and returned
   through a small `out` array, which keeps the per-pixel loops allocation-free. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MFC = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI;

  /* ---------- elementary number theory ---------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
  const mod = (a, n) => ((a % n) + n) % n;
  function xgcd(a, b) { // returns [g, x, y] with ax + by = g
    let x0 = 1, y0 = 0, x1 = 0, y1 = 1;
    while (b) { const q = Math.trunc(a / b); [a, b] = [b, a - q * b]; [x0, x1] = [x1, x0 - q * x1]; [y0, y1] = [y1, y0 - q * y1]; }
    return a < 0 ? [-a, -x0, -y0] : [a, x0, y0];
  }
  function isPrime(n) { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
  function primesUpTo(n) { const out = []; for (let p = 2; p <= n; p++) if (isPrime(p)) out.push(p); return out; }
  function divisors(n) { const out = []; for (let d = 1; d * d <= n; d++) if (n % d === 0) { out.push(d); if (d * d !== n) out.push(n / d); } return out.sort((a, b) => a - b); }
  function sigma(k, n) { let s = 0; for (const d of divisors(n)) s += Math.pow(d, k); return s; }
  function powmod(b, e, m) { let r = 1; b = mod(b, m); while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e >>= 1; } return r; }
  /* Legendre symbol (a/p) for an odd prime p */
  function legendre(a, p) { a = mod(a, p); if (a === 0) return 0; return powmod(a, (p - 1) / 2, p) === 1 ? 1 : -1; }
  /* Kronecker symbol (D/n) for n > 0 */
  function kronecker(D, n) {
    if (n === 1) return 1;
    let res = 1;
    for (let p = 2; n > 1; p++) {
      if (p * p > n) p = n;
      while (n % p === 0) {
        n /= p;
        if (p === 2) { const r = mod(D, 8); res *= (D % 2 === 0) ? 0 : ((r === 1 || r === 7) ? 1 : -1); }
        else res *= legendre(D, p);
      }
    }
    return res;
  }

  /* ---------- the arithmetic-geometric mean and complete elliptic integrals ---------- */
  function agm(a, b) { for (let i = 0; i < 40 && Math.abs(a - b) > 1e-16 * a; i++) { const t = (a + b) / 2; b = Math.sqrt(a * b); a = t; } return a; }
  const ellipK = k => PI / (2 * agm(1, Math.sqrt(1 - k * k)));
  const VARPI = PI / agm(1, Math.SQRT2);           // 2.62205755429...

  /* ---------- the lemniscate sine for complex argument ----------
     sl(z) = C * theta1(pi z / varpi) / theta3(pi z / varpi), theta functions of nome e^{-pi}. */
  const QL = Math.exp(-PI);
  const SLC = (function () {
    let t3 = 1, d1 = 0;
    for (let n = 1; n < 8; n++) t3 += 2 * Math.pow(QL, n * n);
    for (let n = 0; n < 8; n++) d1 += 2 * (n % 2 ? -1 : 1) * (2 * n + 1) * Math.pow(QL, (n + 0.5) * (n + 0.5));
    return VARPI * t3 / (PI * d1);
  })();
  function sl(x, y, out) {
    const m = Math.round(x / VARPI), n = Math.round(y / VARPI);
    const sgn = ((m + n) & 1) ? -1 : 1;
    const a = (x - m * VARPI) * PI / VARPI, b = (y - n * VARPI) * PI / VARPI;
    let nr = 0, ni = 0, dr = 1, di = 0;
    for (let k = 0; k < 6; k++) {
      const c1 = 2 * (k % 2 ? -1 : 1) * Math.pow(QL, (k + 0.5) * (k + 0.5)), f = 2 * k + 1;
      nr += c1 * Math.sin(f * a) * Math.cosh(f * b); ni += c1 * Math.cos(f * a) * Math.sinh(f * b);
      if (k > 0) { const c3 = 2 * Math.pow(QL, k * k), g = 2 * k; dr += c3 * Math.cos(g * a) * Math.cosh(g * b); di -= c3 * Math.sin(g * a) * Math.sinh(g * b); }
    }
    const den = dr * dr + di * di, s = sgn * SLC;
    out[0] = s * (nr * dr + ni * di) / den; out[1] = s * (ni * dr - nr * di) / den;
    return out;
  }

  /* ---------- the modular group acting on the upper half-plane ---------- */
  /* Move tau = x + iy into the standard fundamental domain.  out = [x', y', a, b, c, d]
     with tau' = (a tau + b)/(c tau + d).  `steps`, if given, receives the word in S and T. */
  function reduceTau(x, y, out, steps) {
    let a = 1, b = 0, c = 0, d = 1;
    for (let it = 0; it < 400; it++) {
      const n = Math.round(x);
      if (n !== 0) { x -= n; a -= n * c; b -= n * d; if (steps) steps.push(['T', -n]); }
      const r2 = x * x + y * y;
      if (r2 < 1 - 1e-13) {
        x = -x / r2; y = y / r2;
        const ta = a, tb = b; a = -c; b = -d; c = ta; d = tb;
        if (steps) steps.push(['S', 1]);
      } else break;
    }
    out[0] = x; out[1] = y; out[2] = a; out[3] = b; out[4] = c; out[5] = d;
    return out;
  }
  const S3 = [240, 2160, 6720, 17520, 30240, 60480, 82560, 140400, 181680, 272160];             // 240 sigma_3(n)
  const S5 = [-504, -16632, -122976, -532728, -1575504, -4058208, -8471232, -17047800, -29883672, -51991632]; // -504 sigma_5(n)
  const TAUS = [1, -24, 252, -1472, 4830, -6048, -16744, 84480, -113643, -115920, 534612, -370944];
  const _r = new Float64Array(6);
  /* E4, E6, Delta at a point already in the fundamental domain (|q| < 0.0044) */
  function formsReduced(x, y, o) { // o = [E4r,E4i,E6r,E6i,Dr,Di]
    const m = Math.exp(-TAU * y), qr = m * Math.cos(TAU * x), qi = m * Math.sin(TAU * x);
    let pr = qr, pi = qi, e4r = 1, e4i = 0, e6r = 1, e6i = 0, dr = 0, di = 0;
    for (let n = 0; n < 10; n++) {
      e4r += S3[n] * pr; e4i += S3[n] * pi; e6r += S5[n] * pr; e6i += S5[n] * pi; dr += TAUS[n] * pr; di += TAUS[n] * pi;
      const t = pr * qr - pi * qi; pi = pr * qi + pi * qr; pr = t;
      if (pr * pr + pi * pi < 1e-40) break;
    }
    o[0] = e4r; o[1] = e4i; o[2] = e6r; o[3] = e6i; o[4] = dr; o[5] = di;
  }
  const _f = new Float64Array(6);
  function cpowInv(cr, ci, k, out) { // (cr + i ci)^(-k)
    const n2 = cr * cr + ci * ci; let ur = cr / n2, ui = -ci / n2, rr = 1, ri = 0;
    for (let j = 0; j < k; j++) { const t = rr * ur - ri * ui; ri = rr * ui + ri * ur; rr = t; }
    out[0] = rr; out[1] = ri;
  }
  const _p = new Float64Array(2);
  /* which: 'E4' | 'E6' | 'Delta' | 'j'.  Valid anywhere in the upper half-plane. */
  function modularValue(which, x, y, out) {
    reduceTau(x, y, _r);
    formsReduced(_r[0], _r[1], _f);
    if (which === 'j') {
      const a = _f[0], b = _f[1], a2r = a * a - b * b, a2i = 2 * a * b, a3r = a2r * a - a2i * b, a3i = a2r * b + a2i * a;
      const dn = _f[4] * _f[4] + _f[5] * _f[5];
      out[0] = (a3r * _f[4] + a3i * _f[5]) / dn; out[1] = (a3i * _f[4] - a3r * _f[5]) / dn;
      return out;
    }
    const k = which === 'E4' ? 4 : which === 'E6' ? 6 : 12, i0 = which === 'E4' ? 0 : which === 'E6' ? 2 : 4;
    cpowInv(_r[4] * x + _r[5], _r[4] * y, k, _p);
    out[0] = _f[i0] * _p[0] - _f[i0 + 1] * _p[1]; out[1] = _f[i0] * _p[1] + _f[i0 + 1] * _p[0];
    return out;
  }

  /* ---------- Weierstrass p-function for the lattice Z + Z tau ----------
     returns p(z) in out[0..1] and p'(z) in out[2..3] */
  function wp(zx, zy, tx, ty, out) {
    // bring z into the strip |Im z| <= Im(tau)/2 so that the q-series converges quickly
    const n = Math.round(zy / ty); zx -= n * tx; zy -= n * ty; zx -= Math.round(zx);
    const qm = Math.exp(-TAU * ty), qr = qm * Math.cos(TAU * tx), qi = qm * Math.sin(TAU * tx);
    const um = Math.exp(-TAU * zy), ur = um * Math.cos(TAU * zx), ui = um * Math.sin(TAU * zx);
    let sr = 0, si = 0, dr = 0, di = 0;           // sums for p and p'
    const term = (wr, wi) => {                    // w/(1-w)^2 and w(1+w)/(1-w)^3
      const ar = 1 - wr, ai = -wi, a2r = ar * ar - ai * ai, a2i = 2 * ar * ai, n2 = a2r * a2r + a2i * a2i;
      const fr = (wr * a2r + wi * a2i) / n2, fi = (wi * a2r - wr * a2i) / n2;
      sr += fr; si += fi;
      // f * (1+w)/(1-w)
      const br = 1 + wr, bi = wi, n1 = ar * ar + ai * ai, gr = (br * ar + bi * ai) / n1, gi = (bi * ar - br * ai) / n1;
      dr += fr * gr - fi * gi; di += fr * gi + fi * gr;
    };
    term(ur, ui);
    let pr = qr, pi = qi, e2 = 0, e2i = 0;
    const un2 = ur * ur + ui * ui, vr = ur / un2, vi = -ui / un2; // 1/u
    for (let k = 1; k < 60; k++) {
      // q^k u  and  q^k / u : the second is the image of the first under z -> -z
      const w1r = pr * ur - pi * ui, w1i = pr * ui + pi * ur, w2r = pr * vr - pi * vi, w2i = pr * vi + pi * vr;
      term(w1r, w1i);
      { // term for q^k/u contributes f(w2) to p and -g-part to p'
        const ar = 1 - w2r, ai = -w2i, a2r = ar * ar - ai * ai, a2i = 2 * ar * ai, n2 = a2r * a2r + a2i * a2i;
        const fr = (w2r * a2r + w2i * a2i) / n2, fi = (w2i * a2r - w2r * a2i) / n2;
        sr += fr; si += fi;
        const br = 1 + w2r, bi = w2i, n1 = ar * ar + ai * ai, gr = (br * ar + bi * ai) / n1, gi = (bi * ar - br * ai) / n1;
        dr -= fr * gr - fi * gi; di -= fr * gi + fi * gr;
      }
      // -2 sum k q^k/(1-q^k)
      const cr = 1 - pr, ci = -pi, nn = cr * cr + ci * ci;
      e2 += k * (pr * cr + pi * ci) / nn; e2i += k * (pi * cr - pr * ci) / nn;
      const t = pr * qr - pi * qi; pi = pr * qi + pi * qr; pr = t;
      if (pr * pr + pi * pi < 1e-34) break;
    }
    const c = -TAU * TAU;                           // (2 pi i)^2
    out[0] = c * (sr + 1 / 12 - 2 * e2); out[1] = c * (si - 2 * e2i);
    // p'(z) = (2 pi i)^3 * sum w(1+w)/(1-w)^3   with (2 pi i)^3 = -i (2pi)^3
    const c3 = TAU * TAU * TAU;
    out[2] = c3 * di; out[3] = -c3 * dr;
    return out;
  }
  /* g2 and g3 of the lattice Z + Z tau */
  function g2g3(tx, ty, out) {
    const o = new Float64Array(2);
    modularValue('E4', tx, ty, o); const p4 = PI * PI * PI * PI;
    out[0] = 4 * p4 / 3 * o[0]; out[1] = 4 * p4 / 3 * o[1];
    modularValue('E6', tx, ty, o);
    out[2] = 8 * p4 * PI * PI / 27 * o[0]; out[3] = 8 * p4 * PI * PI / 27 * o[1];
    return out;
  }

  /* ---------- power series with integer coefficients ---------- */
  /* coefficients of prod_n (1 - q^(m n))^e, as numbers, up to q^N */
  function etaPower(N, m, e) {
    const c = new Float64Array(N + 1); c[0] = 1;
    for (let n = m; n <= N; n += m) {
      for (let r = 0; r < Math.abs(e); r++) {
        if (e > 0) for (let i = N; i >= n; i--) c[i] -= c[i - n];
        else for (let i = n; i <= N; i++) c[i] += c[i - n];
      }
    }
    return c;
  }
  function mulSeries(a, b, N) {
    const c = new Float64Array(N + 1);
    for (let i = 0; i <= N; i++) if (a[i]) for (let j = 0; i + j <= N; j++) c[i + j] += a[i] * b[j];
    return c;
  }
  /* the weight-2 newform of level 11:  q prod (1-q^n)^2 (1-q^(11n))^2 ; a[n] for n <= N */
  function level11(N) {
    const p = mulSeries(etaPower(N, 1, 2), etaPower(N, 11, 2), N), a = new Float64Array(N + 1);
    for (let n = 1; n <= N; n++) a[n] = p[n - 1];
    return a;
  }
  /* Ramanujan's tau(1..N) exactly, as BigInt.  Uses Jacobi: prod(1-q^n)^3 = sum (-1)^k (2k+1) q^(k(k+1)/2) */
  function ramanujanTau(N) {
    const M = N; let c = new Array(M).fill(0n);
    for (let k = 0; k * (k + 1) / 2 < M; k++) c[k * (k + 1) / 2] = BigInt((k % 2 ? -1 : 1) * (2 * k + 1));
    const sq = a => { const r = new Array(M).fill(0n); for (let i = 0; i < M; i++) { const ai = a[i]; if (ai === 0n) continue; for (let j = 0; i + j < M; j++) { const aj = a[j]; if (aj !== 0n) r[i + j] += ai * aj; } } return r; };
    c = sq(sq(sq(c)));                              // (eta^3)^8 = prod^24
    const t = [0n]; for (let n = 1; n <= N; n++) t.push(c[n - 1]);
    return t;
  }
  /* r_k(n): number of ways to write n as a sum of k squares, n <= N */
  function sumsOfSquares(k, N) {
    const th = new Float64Array(N + 1); th[0] = 1;
    for (let m = 1; m * m <= N; m++) th[m * m] = 2;
    let r = new Float64Array(N + 1); r[0] = 1;
    for (let i = 0; i < k; i++) r = mulSeries(r, th, N);
    return r;
  }

  /* ---------- curves over finite fields ---------- */
  /* affine solutions of y^2 + a1 xy + a3 y = x^3 + a2 x^2 + a4 x + a6 over F_p */
  function ecPoints(E, p) {
    const [a1, a2, a3, a4, a6] = E, pts = [];
    for (let x = 0; x < p; x++) {
      const rhs = mod(((x + a2) * x + a4) * x + a6, p);
      for (let y = 0; y < p; y++) if (mod(y * y + a1 * x * y + a3 * y - rhs, p) === 0) pts.push([x, y]);
    }
    return pts;
  }
  /* a_p = p + 1 - #E(F_p), counting the one point at infinity */
  const ecAp = (E, p) => p - ecPoints(E, p).length;
  /* twist by d of y^2 + y = f(x) style curves: count d Y^2 = 4 f(x) + (a1 x + a3)^2 over F_p, p odd */
  function ecTwistAp(E, d, p) {
    const [a1, a2, a3, a4, a6] = E; let n = 0;
    for (let x = 0; x < p; x++) {
      const g = mod(4 * (((x + a2) * x + a4) * x + a6) + (a1 * x + a3) * (a1 * x + a3), p);
      n += 1 + legendre(g * mod(d, p), p);         // d Y^2 = g  <=>  (dY)^2 = d g
    }
    return p - n;
  }
  /* GF(p^2) arithmetic as pairs [a, b] = a + b w, w^2 = r w + s irreducible */
  function fieldP2(p) {
    let r = 0, s = 0;
    outer: for (r = 0; r < p; r++) for (s = 1; s < p; s++) {
      let root = false; for (let t = 0; t < p; t++) if (mod(t * t - r * t - s, p) === 0) { root = true; break; }
      if (!root) break outer;
    }
    return {
      p, r, s,
      add: (u, v) => [(u[0] + v[0]) % p, (u[1] + v[1]) % p],
      mul: (u, v) => { const bb = u[1] * v[1]; return [mod(u[0] * v[0] + s * bb, p), mod(u[0] * v[1] + u[1] * v[0] + r * bb, p)]; },
    };
  }
  /* genus 2 curve y^2 + h(x) y = f(x); f, h as coefficient lists, lowest degree first.
     Returns [#C(F_p), #C(F_p^2)], including the points at infinity of the degree-6 model. */
  function genus2Counts(f, h, p) {
    const f6 = f[6] || 0, h3 = h[3] || 0;
    // over F_p
    let n1 = 0;
    const ev = (c, x) => { let v = 0; for (let i = c.length - 1; i >= 0; i--) v = mod(v * x + c[i], p); return v; };
    for (let x = 0; x < p; x++) { const fv = ev(f, x), hv = ev(h, x); for (let y = 0; y < p; y++) if (mod(y * y + hv * y - fv, p) === 0) n1++; }
    for (let y = 0; y < p; y++) if (mod(y * y + h3 * y - f6, p) === 0) n1++;
    // over F_p^2
    const F = fieldP2(p); let n2 = 0;
    const ev2 = (c, x) => { let v = [0, 0]; for (let i = c.length - 1; i >= 0; i--) { v = F.mul(v, x); v = [mod(v[0] + c[i], p), v[1]]; } return v; };
    const els = []; for (let a = 0; a < p; a++) for (let b = 0; b < p; b++) els.push([a, b]);
    const sqs = els.map(y => F.mul(y, y));
    for (const x of els) {
      const fv = ev2(f, x), hv = ev2(h, x);
      for (let i = 0; i < els.length; i++) { const y = els[i], t = F.add(sqs[i], F.mul(hv, y)); if (t[0] === fv[0] && t[1] === fv[1]) n2++; }
    }
    for (let i = 0; i < els.length; i++) { const y = els[i], t = F.add(sqs[i], [mod(h3 * y[0], p), mod(h3 * y[1], p)]); if (t[0] === mod(f6, p) && t[1] === 0) n2++; }
    return [n1, n2];
  }

  /* ---------- binary quadratic forms [a, b, c] = a x^2 + b xy + c y^2 ---------- */
  const disc = T => T[1] * T[1] - 4 * T[0] * T[2];
  /* apply the substitution (x, y) -> U (x, y):  returns the form T(U v) */
  function bqfAct(T, U) {
    const [a, b, c] = T, [[p, q], [r, s]] = U;
    return [a * p * p + b * p * r + c * r * r, 2 * a * p * q + b * (p * s + q * r) + 2 * c * r * s, a * q * q + b * q * s + c * s * s];
  }
  const matMul = (A, B) => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];
  /* Gauss reduction of a positive definite form.  Returns {form, U, steps} with form = T o U,
     det U = 1, and |b| <= a <= c (b >= 0 on the boundary). */
  function bqfReduce(T) {
    let [a, b, c] = T, U = [[1, 0], [0, 1]]; const steps = [];
    for (let it = 0; it < 500; it++) {
      if (b > a || b <= -a) {                       // shift x -> x + k y to bring b into (-a, a]
        const k = Math.floor((a - b) / (2 * a));
        c = a * k * k + b * k + c; b = b + 2 * a * k; U = matMul(U, [[1, k], [0, 1]]); steps.push(['T', k, [a, b, c]]);
      }
      if (a > c || (a === c && b < 0)) {            // swap: (x, y) -> (-y, x)
        [a, b, c] = [c, -b, a]; U = matMul(U, [[0, -1], [1, 0]]); steps.push(['S', 1, [a, b, c]]);
      } else break;
    }
    return { form: [a, b, c], U, steps };
  }
  /* the point of the upper half-plane belonging to a positive definite form: tau = (b + sqrt(D))/(2a) */
  const bqfPoint = T => [T[1] / (2 * T[0]), Math.sqrt(-disc(T)) / (2 * T[0])];
  /* all reduced primitive-or-not positive definite forms of discriminant D < 0 */
  function reducedForms(D) {
    const out = [];
    for (let a = 1; 3 * a * a <= -D; a++) for (let b = -a + 1; b <= a; b++) {
      const num = b * b - D; if (num % (4 * a)) continue; const c = num / (4 * a);
      if (c < a) continue; if (a === c && b < 0) continue; out.push([a, b, c]);
    }
    return out;
  }
  /* proper automorphs of a reduced form (matrices U in SL2(Z) with T o U = T) */
  function bqfAutos(T) {
    const out = [], [a, b, c] = T, B = Math.ceil(Math.sqrt(4 * c / Math.max(1, (4 * a * c - b * b) / (4 * c)))) + 2;
    const vecs = v => { const r = []; for (let x = -B; x <= B; x++) for (let y = -B; y <= B; y++) if (a * x * x + b * x * y + c * y * y === v) r.push([x, y]); return r; };
    for (const u of vecs(a)) for (const w of vecs(c)) {
      if (u[0] * w[1] - u[1] * w[0] !== 1) continue;
      const U = [[u[0], w[0]], [u[1], w[1]]], F = bqfAct(T, U);
      if (F[0] === a && F[1] === b && F[2] === c) out.push(U);
    }
    return out;
  }
  /* points of the projective line over Z/N, as normalised pairs (x : y) */
  const projKey = (x, y, N) => { let best = null; for (let u = 1; u <= N; u++) if (gcd(u, N) === 1) { const k = mod(u * x, N) * N + mod(u * y, N); if (best === null || k < best) best = k; } return best; };
  function projectiveLine(N) {
    const seen = new Set(), out = [];
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) {
      if (gcd(gcd(x, y), N) !== 1) continue;
      const k = projKey(x, y, N);
      if (!seen.has(k)) { seen.add(k); out.push([Math.floor(k / N), k % N]); }
    }
    return out;
  }
  /* lift a point (x : y) of P^1(Z/N) to a matrix in SL2(Z) whose first column is congruent to it */
  function liftToSL2(x, y, N) {
    for (let i = 0; i <= N + 1; i++) for (let j = 0; j <= N + 1; j++) {
      const xx = x + i * N, yy = y + j * N;
      if ((xx || yy) && gcd(xx, yy) === 1) { const [, s, t] = xgcd(xx, yy); return [[xx, -t], [yy, s]]; }
    }
    return null;
  }

  /* ---------- the E8 lattice ---------- */
  /* all vectors of norm <= maxNorm, coordinates doubled so that they are integers.  Grouped by norm. */
  function e8Vectors(maxNorm) {
    const byNorm = {}, lim = 4 * maxNorm, v = new Int8Array(8);
    const rec = (i, parity, sumsq, sum) => {
      if (i === 8) {
        if (sumsq === 0) return;
        if (mod(sum, 4) !== 0) return;               // sum of the true coordinates is even
        const n = sumsq / 4; (byNorm[n] = byNorm[n] || []).push(Int8Array.from(v)); return;
      }
      for (let t = -6; t <= 6; t++) { if (mod(t, 2) !== parity) continue; const s2 = sumsq + t * t; if (s2 > lim) continue; v[i] = t; rec(i + 1, parity, s2, sum + t); }
    };
    rec(0, 0, 0, 0); rec(0, 1, 0, 0);
    return byNorm;
  }
  /* number of pairs (x, y) in E8 with x.x = 2a, x.y = b, y.y = 2c */
  function e8PairCount(vecs, a, b, c) {
    const X = vecs[2 * a] || [], Y = vecs[2 * c] || [], want = 4 * b; let n = 0;
    for (let i = 0; i < X.length; i++) {
      const x = X[i], x0 = x[0], x1 = x[1], x2 = x[2], x3 = x[3], x4 = x[4], x5 = x[5], x6 = x[6], x7 = x[7];
      for (let j = 0; j < Y.length; j++) { const y = Y[j]; if (x0 * y[0] + x1 * y[1] + x2 * y[2] + x3 * y[3] + x4 * y[4] + x5 * y[5] + x6 * y[6] + x7 * y[7] === want) n++; }
    }
    return n;
  }
  /* Cohen's H(3, N) and the coefficient of the weight-4 Siegel Eisenstein series at [a, b, c] */
  function bernoulli3chi(D) { // generalised Bernoulli number B_{3,chi_D} for a fundamental discriminant D < 0
    const f = -D; let s = 0;
    for (let a = 1; a <= f; a++) { const x = a / f, B3 = x * x * x - 1.5 * x * x + 0.5 * x; s += kronecker(D, a) * B3; }
    return f * f * s;
  }
  function cohenH3(N) { // N = |D0| f^2
    const m4 = N % 4; if (m4 === 1 || m4 === 2) return 0;
    let D0 = -N, f = 1;
    for (let g = Math.floor(Math.sqrt(N)); g >= 1; g--) if (N % (g * g) === 0) { const d = -N / (g * g), r = mod(d, 4); if (r === 1 || (r === 0 && (mod(d / 4, 4) === 2 || mod(d / 4, 4) === 3))) { D0 = d; f = g; break; } }
    const L = -bernoulli3chi(D0) / 3;               // L(-2, chi_D0)
    let s = 0;
    for (const d of divisors(f)) { let mu = 1, t = d; for (let p = 2; p <= t; p++) if (t % p === 0) { t /= p; if (t % p === 0) { mu = 0; break; } mu = -mu; } if (mu) s += mu * kronecker(D0, d) * d * d * sigma(5, f / d); }
    return L * s;
  }
  function siegelE4(a, b, c) { const g = gcd(gcd(a, b), c), N = 4 * a * c - b * b; let s = 0; for (const d of divisors(g)) s += d * d * d * cohenH3(N / (d * d)); return -60480 * s; }

  /* ---------- periods of y^2 = prod (x - e_i), six real branch points ---------- */
  function gapIntegral(e, k, j, n) { // integral over (e[k], e[k+1]) of x^j dx / sqrt|f|
    const m = (e[k] + e[k + 1]) / 2, h = (e[k + 1] - e[k]) / 2; let s = 0; n = n || 80;
    for (let i = 1; i <= n; i++) {
      const x = m + h * Math.cos((2 * i - 1) * PI / (2 * n)); let pr = 1;
      for (let t = 0; t < e.length; t++) if (t !== k && t !== k + 1) pr *= Math.abs(x - e[t]);
      s += (j ? x : 1) / Math.sqrt(pr);
    }
    return s * PI / n;
  }
  /* Returns {A, B, Om}: A and B are the a- and b-period matrices (rows: cycles, columns: dx/y and x dx/y),
     with A purely imaginary and B real; Om = i * (2x2 real symmetric positive definite), returned as its imaginary part. */
  function genus2Periods(e) {
    const I = (k, j) => gapIntegral(e, k, j);
    // a-periods are i times these reals; b-periods are these reals
    const A = [[-2 * I(0, 0), -2 * I(0, 1)], [2 * I(2, 0), 2 * I(2, 1)]];
    const B = [[2 * (I(1, 0) - I(3, 0)), 2 * (I(1, 1) - I(3, 1))], [-2 * I(3, 0), -2 * I(3, 1)]];
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const Ai = [[A[1][1] / det, -A[0][1] / det], [-A[1][0] / det, A[0][0] / det]];
    // Omega = B (iA)^-1 = -i B A^-1 ; return Im Omega = -(B A^-1)
    const M = matMul(B, Ai);
    return { A, B, Y: [[-M[0][0], -M[0][1]], [-M[1][0], -M[1][1]]] };
  }

  return {
    PI, TAU, gcd, mod, xgcd, isPrime, primesUpTo, divisors, sigma, powmod, legendre, kronecker,
    agm, ellipK, VARPI, sl, reduceTau, modularValue, formsReduced, wp, g2g3,
    etaPower, mulSeries, level11, ramanujanTau, sumsOfSquares,
    ecPoints, ecAp, ecTwistAp, genus2Counts, fieldP2,
    disc, bqfAct, bqfReduce, bqfPoint, reducedForms, bqfAutos, projectiveLine, projKey, liftToSL2, matMul,
    e8Vectors, e8PairCount, cohenH3, siegelE4, gapIntegral, genus2Periods,
  };
});
