/* Headless check of the numerical core behind the modular forms series.
   Run:  node _check/core-check.cjs
   Every figure in the six posts draws numbers that come from ../js/mf-core.js;
   this file checks those numbers against independent facts. */
const path = require('node:path');
const M = require(path.join(__dirname, '..', 'js', 'mf-core.js'));
let bad = 0;
const ok = (name, cond, info) => { if (!cond) bad++; console.log((cond ? 'ok   ' : 'FAIL ') + name + (info !== undefined ? '   ' + info : '')); };
const close = (a, b, tol) => Math.abs(a - b) <= (tol || 1e-9) * Math.max(1, Math.abs(a), Math.abs(b));

/* ---- lemniscate sine ---- */
{
  const o = [0, 0];
  // arc length integral by substitution t = sin(theta): int_0^1 dt/sqrt(1-t^4) = varpi/2
  let s = 0; const n = 20000; for (let i = 0; i < n; i++) { const th = (i + 0.5) * Math.PI / (2 * n); s += 1 / Math.sqrt(1 + Math.sin(th) ** 2); } s *= Math.PI / (2 * n);
  ok('varpi/2 = int dt/sqrt(1-t^4)', close(s, M.VARPI / 2, 1e-8), M.VARPI);
  M.sl(M.VARPI / 2, 0, o); ok('sl(varpi/2) = 1', close(o[0], 1) && Math.abs(o[1]) < 1e-12);
  // sl'(z)^2 = 1 - sl(z)^4 at a complex point
  const z = [0.37, 0.81], h = 1e-5, a = [0, 0], b = [0, 0], c = [0, 0];
  M.sl(z[0] + h, z[1], a); M.sl(z[0] - h, z[1], b); M.sl(z[0], z[1], c);
  const dr = (a[0] - b[0]) / (2 * h), di = (a[1] - b[1]) / (2 * h);
  const d2 = [dr * dr - di * di, 2 * dr * di], c2 = [c[0] * c[0] - c[1] * c[1], 2 * c[0] * c[1]], c4 = [c2[0] * c2[0] - c2[1] * c2[1], 2 * c2[0] * c2[1]];
  ok("sl'^2 = 1 - sl^4", close(d2[0], 1 - c4[0], 1e-7) && close(d2[1], -c4[1], 1e-7));
  M.sl(0.3 * 0, 0.3, a); M.sl(0.3, 0, b); ok('sl(iz) = i sl(z)', close(a[1], b[0]) && Math.abs(a[0]) < 1e-12);
  M.sl(z[0] + M.VARPI, z[1] + M.VARPI, a); ok('(1+i)varpi is a period', close(a[0], c[0]) && close(a[1], c[1]));
  M.sl(z[0] + M.VARPI, z[1], a); ok('varpi is not a period (sign flips)', close(a[0], -c[0]) && close(a[1], -c[1]));
  // Fagnano doubling
  const r = 0.4; let u = 0; for (let i = 0; i < 4000; i++) { const t = (i + 0.5) * r / 4000; u += 1 / Math.sqrt(1 - t ** 4); } u *= r / 4000;
  M.sl(2 * u, 0, a); ok('Fagnano doubling', close(a[0], 2 * r * Math.sqrt(1 - r ** 4) / (1 + r ** 4), 1e-6));
  ok('agm(1, sqrt 2) = pi/varpi', close(M.agm(1, Math.SQRT2), Math.PI / M.VARPI));
}

/* ---- modular forms ---- */
{
  const o = [0, 0], o2 = [0, 0];
  // direct q-series for E4 high in the half-plane agrees
  const direct = (k, x, y) => { let re = 1, im = 0; const c = k === 4 ? 240 : -504; for (let n = 1; n < 400; n++) { const m = Math.exp(-2 * Math.PI * n * y); re += c * M.sigma(k - 1, n) * m * Math.cos(2 * Math.PI * n * x); im += c * M.sigma(k - 1, n) * m * Math.sin(2 * Math.PI * n * x); } return [re, im]; };
  for (const [x, y] of [[0.31, 0.4], [-1.27, 0.11], [0.05, 1.9]]) {
    const d4 = direct(4, x, y), d6 = direct(6, x, y);
    M.modularValue('E4', x, y, o); ok(`E4(${x}+${y}i) by reduction = direct series`, close(o[0], d4[0], 1e-8) && close(o[1], d4[1], 1e-8));
    M.modularValue('E6', x, y, o); ok(`E6(${x}+${y}i)`, close(o[0], d6[0], 1e-8) && close(o[1], d6[1], 1e-8));
    M.modularValue('Delta', x, y, o);
    const e43 = [d4[0] ** 3 - 3 * d4[0] * d4[1] ** 2, 3 * d4[0] ** 2 * d4[1] - d4[1] ** 3], e62 = [d6[0] ** 2 - d6[1] ** 2, 2 * d6[0] * d6[1]];
    ok('Delta = (E4^3 - E6^2)/1728', close(o[0], (e43[0] - e62[0]) / 1728, 1e-7) && close(o[1], (e43[1] - e62[1]) / 1728, 1e-7));
  }
  M.modularValue('j', 0, 1, o); ok('j(i) = 1728', close(o[0], 1728, 1e-9), o[0]);
  M.modularValue('j', -0.5, Math.sqrt(3) / 2, o); ok('j(rho) = 0', Math.abs(o[0]) < 1e-6 && Math.abs(o[1]) < 1e-6);
  M.modularValue('j', 0.5, Math.sqrt(7) / 2, o); ok('j((1+sqrt(-7))/2) = -3375', close(o[0], -3375, 1e-9), o[0]);
  M.modularValue('j', 0, Math.SQRT2, o); ok('j(sqrt(-2)) = 8000', close(o[0], 8000, 1e-9), o[0]);
  M.modularValue('j', 0.123, 0.0456, o); M.modularValue('j', -1 / (0.123 ** 2 + 0.0456 ** 2) * 0.123, 0.0456 / (0.123 ** 2 + 0.0456 ** 2), o2);
  ok('j(-1/tau) = j(tau)', close(o[0], o2[0], 1e-6) && close(o[1], o2[1], 1e-6));
  // Weierstrass: p'^2 = 4p^3 - g2 p - g3
  for (const [tx, ty, zx, zy] of [[0, 1, 0.3, 0.2], [0.3, 0.8, 0.41, 0.33], [-0.5, 0.9, 0.1, 0.7], [0.2, 2.2, 0.35, 1.0]]) {
    const w = new Float64Array(4), g = new Float64Array(4); M.wp(zx, zy, tx, ty, w); M.g2g3(tx, ty, g);
    const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
    const p = [w[0], w[1]], dp = [w[2], w[3]], p3 = mul(mul(p, p), p), lhs = mul(dp, dp), g2p = mul([g[0], g[1]], p);
    const rhs = [4 * p3[0] - g2p[0] - g[2], 4 * p3[1] - g2p[1] - g[3]];
    ok(`p'^2 = 4p^3 - g2 p - g3 (tau=${tx}+${ty}i)`, close(lhs[0], rhs[0], 1e-8) && close(lhs[1], rhs[1], 1e-8));
    // derivative against finite difference
    const a = new Float64Array(4), b = new Float64Array(4), h = 1e-5; M.wp(zx + h, zy, tx, ty, a); M.wp(zx - h, zy, tx, ty, b);
    ok('  p\' matches finite difference', close((a[0] - b[0]) / (2 * h), w[2], 1e-6) && close((a[1] - b[1]) / (2 * h), w[3], 1e-6));
  }
}

/* ---- coefficients ---- */
{
  const t = M.ramanujanTau(60);
  ok('tau(1..7)', [1, -24, 252, -1472, 4830, -6048, -16744].every((v, i) => t[i + 1] === BigInt(v)));
  ok('tau(6) = tau(2) tau(3), tau(35) = tau(5) tau(7)', t[6] === t[2] * t[3] && t[35] === t[5] * t[7]);
  ok('tau(4) = tau(2)^2 - 2^11', t[4] === t[2] * t[2] - 2048n);
  let good = true; for (let n = 1; n <= 60; n++) { let s11 = 0n; for (const d of M.divisors(n)) s11 += BigInt(d) ** 11n; if ((t[n] - s11) % 691n !== 0n) good = false; }
  ok('tau(n) = sigma_11(n) mod 691', good);
  const r2 = M.sumsOfSquares(2, 200), r4 = M.sumsOfSquares(4, 200), r8 = M.sumsOfSquares(8, 200);
  let g2 = true, g4 = true, g8 = true;
  for (let n = 1; n <= 200; n++) {
    const ds = M.divisors(n);
    if (r2[n] !== 4 * ds.reduce((s, d) => s + (d % 4 === 1 ? 1 : d % 4 === 3 ? -1 : 0), 0)) g2 = false;
    if (r4[n] !== 8 * ds.reduce((s, d) => s + (d % 4 ? d : 0), 0)) g4 = false;
    if (r8[n] !== 16 * ds.reduce((s, d) => s + ((n + d) % 2 ? -1 : 1) * d ** 3, 0)) g8 = false;
  }
  ok('r2(n) = 4(d1 - d3), n <= 200', g2); ok('r4(n) = 8 sum of d not divisible by 4 (Jacobi)', g4); ok('r8(n) = 16 sum (-1)^(n+d) d^3', g8);
}

/* ---- the curve of conductor 11 and its modular form ---- */
{
  const E = [0, -1, 1, -10, -20], E3 = [0, -1, 1, 0, 0], a = M.level11(1200);
  let same = true, same3 = true; const row = [];
  for (const p of M.primesUpTo(100)) { const ap = M.ecAp(E, p); if (ap !== a[p]) same = false; if (p !== 11 && M.ecAp(E3, p) !== a[p]) same3 = false; row.push(p + ':' + ap); }
  ok('a_p of y^2+y=x^3-x^2-10x-20 equals coefficient of q prod(1-q^n)^2(1-q^11n)^2, p < 100', same, row.slice(0, 8).join(' '));
  ok('same for y^2+y=x^3-x^2 (p != 11)', same3);
  let tw = true; for (const d of [-3, 5, -7, 13]) for (const p of M.primesUpTo(60)) { if (p === 2 || p === 11 || d % p === 0) continue; if (M.ecTwistAp(E, d, p) !== M.legendre(d, p) * a[p]) tw = false; }
  ok('twisted curve has a_p = (d/p) a_p', tw);
  // periods: P(gamma) = sum a_n/n (q1^n - q0^n) with tau0 = (-d + i)/c, gamma tau0 = (a + i)/c
  const period = (ga, c, d) => { let re = 0, im = 0; const m = Math.exp(-2 * Math.PI / c); let mm = 1; for (let n = 1; n <= 1200; n++) { mm *= m; if (mm < 1e-18) break; const w = a[n] / n * mm; re += w * (Math.cos(2 * Math.PI * n * ga / c) - Math.cos(-2 * Math.PI * n * d / c)); im += w * (Math.sin(2 * Math.PI * n * ga / c) - Math.sin(-2 * Math.PI * n * d / c)); } return [re, im]; };
  const per = [];
  for (const c of [11, 22, 33]) for (let d = 1; d < c; d++) { if (M.gcd(c, d) !== 1) continue; const [, x] = M.xgcd(d, c); const ga = M.mod(x, c); per.push({ c, d, ga, P: period(ga, c, d) }); }
  // candidate basis: shortest two independent periods
  const nz = per.filter(q => Math.hypot(...q.P) > 1e-9).sort((u, v) => Math.hypot(...u.P) - Math.hypot(...v.P));
  const w1 = nz[0].P; let w2 = null; for (const q of nz) { const cr = w1[0] * q.P[1] - w1[1] * q.P[0]; if (Math.abs(cr) > 1e-6) { w2 = q.P; break; } }
  let lat = true; const det = w1[0] * w2[1] - w1[1] * w2[0];
  for (const q of per) { const al = (q.P[0] * w2[1] - q.P[1] * w2[0]) / det, be = (w1[0] * q.P[1] - w1[1] * q.P[0]) / det; if (Math.abs(al - Math.round(al)) > 1e-7 || Math.abs(be - Math.round(be)) > 1e-7) lat = false; }
  ok('all computed periods lie on one lattice', lat, `w1=${w1.map(v => v.toFixed(6))} w2=${w2.map(v => v.toFixed(6))} from ${per.length} matrices`);
  let tx = (w2[0] * w1[0] + w2[1] * w1[1]) / (w1[0] ** 2 + w1[1] ** 2), ty = (w2[1] * w1[0] - w2[0] * w1[1]) / (w1[0] ** 2 + w1[1] ** 2); if (ty < 0) { tx = -tx; ty = -ty; }
  const o = [0, 0]; M.modularValue('j', tx, ty, o);
  ok('j of the period lattice = -122023936/161051', close(o[0], -122023936 / 161051, 1e-7) && Math.abs(o[1]) < 1e-5, o[0] + ' vs ' + (-122023936 / 161051));
  console.log('     generators used:', JSON.stringify(nz.slice(0, 4).map(q => [q.ga, q.c, q.d, q.P.map(v => +v.toFixed(5))])));
}

/* ---- binary quadratic forms ---- */
{
  const R = M.bqfReduce([81, 78, 19]);
  ok('[81,78,19] reduces to [1,0,18]', R.form.join() === '1,0,18', JSON.stringify(R.U));
  ok('  and T o U is the reduced form, det U = 1', M.bqfAct([81, 78, 19], R.U).join() === '1,0,18' && R.U[0][0] * R.U[1][1] - R.U[0][1] * R.U[1][0] === 1);
  ok('[81,24,2] reduces to [2,0,9]', M.bqfReduce([81, 24, 2]).form.join() === '2,0,9');
  ok('h(-23) = 3, h(-72) forms', M.reducedForms(-23).length === 3, JSON.stringify(M.reducedForms(-72)));
  let good = true;
  for (let i = 0; i < 2000; i++) { const a = 1 + Math.floor(Math.random() * 300), c = 1 + Math.floor(Math.random() * 300), b = Math.floor(Math.random() * 600) - 300; if (b * b - 4 * a * c >= 0) continue; const r = M.bqfReduce([a, b, c]), f = r.form; if (!(Math.abs(f[1]) <= f[0] && f[0] <= f[2]) || M.bqfAct([a, b, c], r.U).join() !== f.join() || M.disc(f) !== M.disc([a, b, c])) good = false; const pt = M.bqfPoint(f); if (pt[0] ** 2 + pt[1] ** 2 < 1 - 1e-9 || Math.abs(pt[0]) > 0.5 + 1e-9) good = false; }
  ok('random forms reduce into the fundamental domain', good);
  ok('P^1(Z/N) has N prod(1+1/p) points', [2, 3, 4, 5, 6, 9, 11, 12].every(N => { let idx = N; for (const p of M.primesUpTo(N)) if (N % p === 0) idx = idx / p * (p + 1); return M.projectiveLine(N).length === idx; }));
  ok('automorphs: [1,0,1] has 4, [1,1,1] has 6, [1,0,18] has 2', M.bqfAutos([1, 0, 1]).length === 4 && M.bqfAutos([1, 1, 1]).length === 6 && M.bqfAutos([1, 0, 18]).length === 2);
}

/* ---- E8 and the Siegel Eisenstein series of weight 4 ---- */
{
  const t0 = Date.now(), V = M.e8Vectors(6);
  ok('E8 has 240, 2160, 6720 vectors of norm 2, 4, 6', V[2].length === 240 && V[4].length === 2160 && V[6].length === 6720, (Date.now() - t0) + ' ms');
  const cases = [[1, 1, 1], [1, 0, 1], [1, 1, 2], [1, 0, 2], [1, 1, 3], [1, 0, 3], [2, 2, 2], [2, 1, 2], [2, 0, 2], [1, 2, 3], [2, 1, 3], [3, 3, 3]];
  let all = true; const shown = [];
  for (const [a, b, c] of cases) { const n = M.e8PairCount(V, a, b, c), e = Math.round(M.siegelE4(a, b, c)); if (n !== e) all = false; shown.push(`[${a},${b},${c}]:${n}/${e}`); }
  ok('pairs in E8 with Gram matrix T  =  Eisenstein coefficient (Cohen numbers)', all, shown.join(' '));
  ok('equivalent forms give equal counts: [1,1,1] ~ [1,3,3] ~ [3,3,1]', M.e8PairCount(V, 1, 1, 1) === M.e8PairCount(V, 1, 3, 3) && M.e8PairCount(V, 3, 3, 1) === 13440);
}

/* ---- genus 2 ---- */
{
  let sym = true, pos = true, worst = 0;
  for (let i = 0; i < 200; i++) {
    const e = Array.from({ length: 6 }, () => Math.random() * 10 - 5).sort((u, v) => u - v);
    let minGap = 1; for (let k = 0; k < 5; k++) minGap = Math.min(minGap, e[k + 1] - e[k]); if (minGap < 0.25) continue;
    const { Y } = M.genus2Periods(e); worst = Math.max(worst, Math.abs(Y[0][1] - Y[1][0]) / Math.abs(Y[0][0]));
    if (Math.abs(Y[0][1] - Y[1][0]) > 1e-6 * Math.abs(Y[0][0])) sym = false;
    if (!(Y[0][0] > 0 && Y[0][0] * Y[1][1] - Y[0][1] * Y[1][0] > 0)) pos = false;
  }
  ok('period matrix is symmetric (Riemann bilinear relation)', sym, 'worst relative asymmetry ' + worst.toExponential(2));
  ok('and its imaginary part is positive definite', pos);
  // the curve of conductor 277:  y^2 + (x^3+x^2+x+1) y = -x^2 - x
  const f = [0, -1, -1], h = [1, 1, 1, 1], want = { 2: -2, 3: -1, 5: -1, 7: 1, 11: -2 }, Q = { 2: [2, 4], 3: [1, 1], 5: [1, -2] };
  let good = true; const got = [];
  for (const p of [2, 3, 5, 7, 11, 13]) {
    const [n1, n2] = M.genus2Counts(f, h, p), ap = p + 1 - n1, bp = (ap * ap - (p * p + 1 - n2)) / 2;
    got.push(`p=${p}: a=${ap} b=${bp}`);
    if (want[p] !== undefined && want[p] !== ap) good = false;
    if (Q[p] && (Q[p][0] !== -ap || Q[p][1] !== bp)) good = false;
  }
  ok('point counts on the conductor-277 curve match the published Hecke eigenvalues', good, got.join('; '));
  // same curve in the model y^2 + y = x^5 - 2x^3 + 2x^2 - x
  let same = true; for (const p of [3, 5, 7, 11, 13]) { const A = M.genus2Counts(f, h, p), B = M.genus2Counts([0, -1, 2, -2, 0, 1], [1], p); if (A[0] !== B[0] || A[1] !== B[1]) same = false; }
  ok('both published models give the same counts', same);
}

console.log(bad ? `\n${bad} check(s) FAILED` : '\nall checks passed');
process.exit(bad ? 1 : 0);
