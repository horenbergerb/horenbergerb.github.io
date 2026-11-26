/* Headless check of the numerical core.  Run:  node _check/core-check.cjs
   It searches 150 random loops at six shapes each and confirms that a rectangle
   is always found, that its corners are on the loop, and that it is a rectangle
   of the requested shape.  It also confirms that the two shadows of a patch of
   chords cancel. */
const path = require('node:path');
const P = require(path.join(__dirname, '..', 'core.js'));
let miss = 0, total = 0, worst = 0;
const counts = {};
const phis = [22.6, 30, 45, 53.13, 70, 90].map(d => (d * Math.PI) / 180);
for (let seed = 1; seed <= 150; seed++) {
  const loop = new P.Loop(P.randomLoop(seed));
  for (const phi of phis) {
    total++;
    let R = P.findRects(loop, phi, 144);
    if (!R.length) R = P.findRects(loop, phi, 320);
    if (!R.length) { miss++; console.log('no rectangle found', { seed, phi }); continue; }
    const key = (phi > 1.57 ? 'square:' : 'other:') + R.length;
    counts[key] = (counts[key] || 0) + 1;
    for (const q of R) {
      const [a, p, b, c] = q.corners;
      for (const k of q.corners) worst = Math.max(worst, Math.abs(loop.f(k[0], k[1])));
      const d1 = Math.hypot(a[0] - b[0], a[1] - b[1]), d2 = Math.hypot(p[0] - c[0], p[1] - c[1]);
      const ang = Math.acos(((a[0] - b[0]) * (p[0] - c[0]) + (a[1] - b[1]) * (p[1] - c[1])) / (d1 * d2));
      const corner = (p[0] - a[0]) * (b[0] - p[0]) + (p[1] - a[1]) * (b[1] - p[1]);
      worst = Math.max(worst, Math.abs(d1 - d2), Math.abs(corner), Math.min(Math.abs(ang - phi), Math.abs(Math.PI - ang - phi)));
    }
  }
}
const loop = new P.Loop(P.randomLoop(7));
function shadows(s0, t0, d, phi) {
  const n = 40, bm = [], bv = [];
  const edge = f => { for (let i = 0; i < n; i++) { const [s, t] = f(i / n), k = P.chord(loop, phi, s, t); bm.push(k.m[0], k.m[1]); bv.push(k.w[0], k.w[1]); } };
  edge(u => [s0 + u * d, t0]); edge(u => [s0 + d, t0 + u * d]); edge(u => [s0 + d - u * d, t0 + d]); edge(u => [s0, t0 + d - u * d]);
  return P.signedArea(bm) + P.signedArea(bv);
}
const leak = Math.max(Math.abs(shadows(0.3, 2.1, 0.5, 0)), Math.abs(shadows(0.3, 2.1, 0.5, 0.9)), Math.abs(shadows(1.3, 4.0, 0.8, 0.4)));
console.log({ searches: total, missed: miss, worstCornerOrShapeError: worst, shadowSum: leak, counts });
const oddOthers = Object.keys(counts).some(k => k.startsWith('other:') && Number(k.split(':')[1]) % 2);
const evenSquares = Object.keys(counts).some(k => k.startsWith('square:') && Number(k.split(':')[1]) % 2 === 0);
if (miss || worst > 1e-9 || leak > 1e-12 || oddOthers || evenSquares) { console.log('FAILED'); process.exit(1); }
console.log('ok');
