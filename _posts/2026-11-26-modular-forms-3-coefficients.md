---
title: "What the Coefficients Count (modular forms, part 3 of 6)"
date: 2026-11-26 09:04:00 -0500
custom_excerpt: |
  Part 3 of 6. Sums of squares, heat on a ring, Ramanujan's tau, and Hecke's sums over sublattices.
tag: slop
---
<link rel="stylesheet" href="/scripts/2026-11-26-modular-forms/series.css?v={{ site.time | date: '%s' }}">
<script>/* This post typesets its own formulas with the KaTeX the site already loads; tell the site's MathJax not to do them a second time. */ (function () { var c = { skipStartupTypeset: true }; if (window.MathJax && window.MathJax.Hub) window.MathJax.Hub.Config(c); else window.MathJax = c; })();</script>

The power-series coefficients of modular forms count things: divisors, lattice points on spheres. They also multiply. Both facts have short explanations, one from the physics of heat and one from the sublattices of a lattice.
{:.dek}

Written by Claude. Part 3 of a series that continues Beau Horenberger’s [History of Modular Forms 1](https://horenbergerb.github.io/2020/08/08/modularforms.html) (2020).
{:.by}

{% include modular-forms/nav.html part=3 %}

<div class="mf-timeline" data-part="3"></div>

[Part 2](/2026/11/26/modular-forms-2-lattices.html) defined a modular form as a function of lattices and found that such a function has a power series $$\sum a_n q^n$$ in the variable $$q = e^{2\pi i\tau}$$, where $$\tau$$ in the upper half-plane records the shape of the lattice. For the examples there, the coefficients $$a_n$$ were sums of powers of the divisors of $$n$$. This part is about the coefficients. It starts with a theorem about whole numbers that was proved with elliptic functions, which in 1829 nobody had reason to expect.

## 1. Four squares

In 1770 Joseph-Louis Lagrange proved that every positive whole number is a sum of four squares of whole numbers. For example $$7 = 4 + 1 + 1 + 1$$. The theorem says nothing about how many ways there are.

In 1829, on one of the last pages of the *Fundamenta Nova*, his book on elliptic functions, Carl Jacobi wrote down the exact count. Let $$r_4(n)$$ be the number of ways of writing $$n = a^2 + b^2 + c^2 + d^2$$ with integers $$a, b, c, d$$, where different orders and different signs count as different ways. Then

$$r_4(n) = 8 \sum_{d \,\mid\, n,\ 4 \,\nmid\, d} d.$$

Eight times the sum of the divisors of $$n$$ that are not multiples of 4. Since 1 is always such a divisor, the count is never zero, and Lagrange’s theorem falls out as a corollary. The figure checks this formula and two relatives by brute force. Only the two-square version can be drawn: there, the question is how many points of the square grid lie on a circle of radius $$\sqrt n$$.

<figure>
  <canvas id="c-squares" class="r-wide" aria-label="Left: a circle on a square grid with the grid points on it marked. Right: a bar chart of the number of representations as sums of squares, with the predicted values overlaid"></canvas>
  <div class="controls">
    <div class="seg" id="sq-k" role="group" aria-label="Number of squares"><button type="button" data-v="2">2 squares</button><button type="button" data-v="4">4 squares</button><button type="button" data-v="8">8 squares</button></div>
    <label><i>n</i> <input type="range" id="sq-n" min="1" max="150" step="1" value="25" aria-label="The number n"></label>
  </div>
  <p class="readout" id="sq-read"></p>
  <figcaption><b>Figure 1.</b> Bars: the number of ways to write <i>m</i> as a sum of squares, counted by multiplying out power series. Rings: the divisor formula. Every ring sits on the top of its bar. The left panel shows the two-square count for the chosen <i>n</i> as grid points on a circle. The two-square formula is 4 × (number of divisors of the form 4<i>j</i>+1, minus the number of the form 4<i>j</i>+3), which is why some circles miss the grid entirely.</figcaption>
</figure>

A count of lattice points on a sphere equals a sum over divisors. Part 2 had divisor sums coming out of modular forms. The plan suggests itself: show that the left side is also the coefficient of a modular form, and then use the fact that there are very few modular forms.

## 2. A generating function

The device that connects counting to functions is old. Put

$$\theta(\tau) = \sum_{n=-\infty}^{\infty} q^{n^2} = 1 + 2q + 2q^4 + 2q^9 + \cdots, \qquad q = e^{2\pi i \tau}.$$

Multiply $$\theta$$ by itself. A term $$q^{a^2}$$ from the first factor times $$q^{b^2}$$ from the second contributes to $$q^{a^2 + b^2}$$, so the coefficient of $$q^n$$ in $$\theta^2$$ is the number of pairs $$(a, b)$$ with $$a^2 + b^2 = n$$. In general

$$\theta(\tau)^k = \sum_{n \geq 0} r_k(n)\, q^n.$$

Everything about sums of $$k$$ squares is encoded in the $$k$$th power of one function. This $$\theta$$ is, up to notation, one of the *theta functions* that Jacobi introduced at the end of the *Fundamenta Nova* in order to write elliptic functions as quotients of rapidly converging series. That is how a book about inverting integrals came to contain a theorem about sums of squares.

To apply Part 2 we need to know how $$\theta$$ behaves under the two moves that generate changes of basis. The move $$\tau \mapsto \tau + 1$$ does nothing, because the series is in powers of $$q$$. The other move, $$\tau \mapsto -1/\tau$$, is the interesting one. The identity turns out to be

$$\theta\!\left(-\frac{1}{4\tau}\right) = \sqrt{-2i\tau}\;\,\theta(\tau),$$

and the cleanest way to see where it comes from has nothing to do with number theory.

## 3. Heat on a ring

Take a thin metal ring of circumference 1 and touch one point with a hot needle at time zero. How does the heat spread? There are two ways to work it out.

**Images.** On an infinite straight wire, a spike of heat spreads into a Gaussian bell curve whose width grows like $$\sqrt t$$. A ring is a wire that has been wrapped around, so the heat that would have reached position $$x + 1$$, $$x + 2$$, and so on all arrives at the same point $$x$$. The temperature on the ring is the sum of the bell curve and all its copies shifted by whole numbers:

$$u(x,t) = \frac{1}{\sqrt{4\pi t}} \sum_{n=-\infty}^{\infty} e^{-(x-n)^2/4t}.$$

**Modes.** Alternatively, decompose the initial spike into the standing waves that fit on the ring, $$\cos 2\pi k x$$. Each standing wave keeps its shape and simply decays, the wigglier ones faster. Joseph Fourier invented his series for problems of exactly this kind.

$$u(x,t) = \sum_{k=-\infty}^{\infty} e^{-4\pi^2 k^2 t}\, e^{2\pi i k x}.$$

Both are the temperature, so they are equal.

<figure>
  <canvas id="c-heat" class="r-wide" aria-label="Two plots of the same temperature profile on a ring: on the left as a sum of bell curves, on the right as a sum of cosine waves"></canvas>
  <div class="controls">
    <label>Time since the spike (logarithmic) <input type="range" id="heat-t" min="0" max="1" step="0.002" value="0.42" aria-label="Elapsed time"></label>
  </div>
  <p class="readout" id="heat-read"></p>
  <figcaption><b>Figure 2.</b> The same temperature profile computed two ways. Left: the heavy <span class="key k-blue">blue</span> curve is the sum of the faint bell curves, one for each trip around the ring. Right: the heavy <span class="key k-red">red</span> curve is the sum of the faint cosine waves. The heavy curves are identical at every time. Early on, one bell curve is the whole answer while dozens of waves are needed; late, a constant and one wave suffice while the bell curves overlap heavily.</figcaption>
</figure>

Now set $$x = 0$$ and write $$s = 4\pi t$$. The equality of the two formulas becomes

$$\sum_{n} e^{-\pi n^2 s} \;=\; \frac{1}{\sqrt{s}} \sum_{n} e^{-\pi n^2 / s}.$$

The same sum of Gaussians appears on both sides, at $$s$$ and at $$1/s$$. With $$q = e^{-\pi s}$$ this is a statement about $$\sum q^{n^2}$$: its value at $$s$$ determines its value at $$1/s$$. Translate $$s$$ into $$\tau$$ and it is the transformation law for $$\theta$$ quoted above.

In signal-processing terms this is the Poisson summation formula: sampling a function at the integers and summing gives the same answer as sampling its Fourier transform at the integers and summing. A Gaussian is its own Fourier transform, with the width inverted. So a narrow Gaussian sampled on the integers equals a wide Gaussian sampled on the integers, up to a factor. The move $$\tau \mapsto -1/\tau$$, which in Part 2 exchanged the two basis vectors of a lattice, here exchanges the time domain with the frequency domain.

## 4. Level, and why two coefficients are enough

The theta function is not quite a modular form in the sense of Part 2, in two ways. Its weight is $$\tfrac12$$: the factor in its transformation law is a square root. That is cured by taking even powers, and $$\theta^4$$ has weight 2. More importantly, the transformation law holds for $$\tau \mapsto -1/4\tau$$ and not $$\tau \mapsto -1/\tau$$. Combined with $$\tau \mapsto \tau + 1$$, that does not give every change of basis $$\tau \mapsto (a\tau + b)/(c\tau + d)$$. It gives exactly those with $$c$$ divisible by 4.

For any positive integer $$N$$, the changes of basis with $$c$$ divisible by $$N$$ form a subgroup of the modular group called $$\Gamma_0(N)$$, and a function that obeys the transformation law only for these is a modular form of *level* $$N$$. In lattice terms, $$\Gamma_0(N)$$ consists of the changes of basis that respect one extra piece of structure. Mark, inside the lattice generated by $$\omega_1$$ and $$\omega_2$$, the sublattice generated by $$\omega_1$$ and $$N\omega_2$$. A change of basis keeps the marked sublattice in place exactly when $$N$$ divides $$c$$. So a form of level $$N$$ is a function of a lattice together with a chosen sublattice of this kind. Level will be important from here to the end of the series.

The argument of Part 2 that counts zeros still works for $$\Gamma_0(N)$$, on a fundamental domain made of several copies of the old one, and it still shows that each space of forms is finite-dimensional. For weight 2 and level 4 the dimension is two. A basis can be written down from the divisor-sum series $$P(\tau) = 1 - 24\sum_{n\geq1} \sigma_1(n) q^n$$, which just fails to be a modular form of weight 2 but whose failure cancels in the combinations $$P(\tau) - 2P(2\tau)$$ and $$P(\tau) - 4P(4\tau)$$.

So $$\theta^4 = 1 + 8q + 24q^2 + \cdots$$ is some combination of those two. Two coefficients determine which. The answer is

$$\theta(\tau)^4 = \tfrac{1}{3}\bigl(4P(4\tau) - P(\tau)\bigr),$$

and reading off the coefficient of $$q^n$$ on the right gives $$8\sigma_1(n) - 32\sigma_1(n/4)$$, where the second term is present only when 4 divides $$n$$. That is eight times the sum of the divisors not divisible by 4. Jacobi’s theorem is the statement that two elements of a two-dimensional space agree once their first two coordinates agree.

## 5. Ramanujan’s function

The method works as long as divisor sums fill the space. For four and eight squares they do. For larger numbers of squares they don’t, and what is left over is the most interesting part of the theory.

In 1916 Srinivasa Ramanujan published a long paper titled “On certain arithmetical functions.” Studying sums of 24 squares, he found that the count is a divisor sum plus a correction, and the correction is built from the coefficients of the weight-12 form $$\Delta$$ from Part 2:

$$\Delta = q\prod_{n\geq 1}(1 - q^n)^{24} = \sum_{n \geq 1} \tau(n)\, q^n = q - 24q^2 + 252q^3 - 1472q^4 + 4830q^5 - 6048q^6 - \cdots$$

The letter $$\tau$$ for these coefficients is Ramanujan’s and has nothing to do with the variable $$\tau$$; the clash is permanent. The exact statement, for odd $$n$$, is $$r_{24}(n) = \tfrac{16}{691}\sigma_{11}(n) + \tfrac{33152}{691}\tau(n)$$. The divisor sum is the main term, about $$n^{11}$$ in size, and $$\tau(n)$$ is the error.

Unlike divisor sums, the numbers $$\tau(n)$$ have no formula. Ramanujan computed a table of them and saw three things.

1. $$\tau(mn) = \tau(m)\tau(n)$$ whenever $$m$$ and $$n$$ have no common factor.
2. For a prime $$p$$, the values at powers of $$p$$ obey a two-step recurrence, $$\tau(p^{r+1}) = \tau(p)\tau(p^r) - p^{11}\tau(p^{r-1})$$.
3. $$\lvert\tau(p)\rvert \leq 2p^{11/2}$$ for every prime $$p$$. The error term is about the square root of the main term.

Check the first on the series above: $$\tau(2)\tau(3) = -24 \cdot 252 = -6048 = \tau(6)$$.

<figure>
  <canvas id="c-tau" class="r-band" aria-label="A scatter plot of Ramanujan's tau at primes divided by its conjectured bound, staying between minus one and one, with a histogram that follows a semicircle"></canvas>
  <div class="controls">
    <label class="short"><i>m</i> <input type="number" id="tau-m" min="1" max="54" value="6"></label>
    <label class="short"><i>n</i> <input type="number" id="tau-n" min="1" max="54" value="35"></label>
  </div>
  <p class="readout" id="tau-read"></p>
  <figcaption><b>Figure 3.</b> Each dot is a prime <i>p</i> up to 3000 (horizontal axis, compressed) at height τ(<i>p</i>) divided by 2<i>p</i><sup>11/2</sup>. Ramanujan’s third observation says every dot lies between the dashed lines. The histogram on the right shows how the heights are distributed, against a <span class="key k-gold">semicircle</span>. Below, test the first two observations on any pair up to 54; try a pair with a common factor, and try <i>m</i> = <i>n</i> = a prime.</figcaption>
</figure>

Louis Mordell proved the first two observations within a year. The third resisted for almost sixty. Pierre Deligne proved it in 1974 as a consequence of his proof of the Weil conjectures, which concern the number of solutions of polynomial equations over finite fields. That an estimate for the coefficients of $$\Delta$$ should follow from counting points on varieties is the theme of Part 4. The semicircular shape of the histogram, the Sato–Tate law, was proved for $$\Delta$$ in 2011.

## 6. Why the coefficients multiply

Mordell’s proof was a clever calculation. In 1937 Erich Hecke turned it into a structure. His idea, put in the language of Part 2, is that there is something natural to do with a lattice function besides evaluating it: sum it over sublattices.

A sublattice of *index* $$n$$ in a lattice $$\Lambda$$ is a lattice contained in $$\Lambda$$ that keeps one point out of every $$n$$, in the sense that its basic parallelogram has $$n$$ times the area. There are finitely many. For a prime $$p$$ there are exactly $$p + 1$$.

<figure>
  <canvas id="c-sub" class="r-band" aria-label="Small pictures of a lattice, one for each sublattice of prime index, with the points of the sublattice emphasised"></canvas>
  <div class="controls">
    <span class="ctl-name">Index</span>
    <div class="seg" id="sub-p" role="group" aria-label="Index"><button type="button" data-v="2">2</button><button type="button" data-v="3">3</button><button type="button" data-v="5">5</button><button type="button" data-v="7">7</button></div>
  </div>
  <p class="readout" id="sub-read"></p>
  <figcaption><b>Figure 4.</b> All the sublattices of index <i>p</i> in one lattice. The heavy <span class="key k-blue">blue</span> points are the sublattice; the shaded parallelogram is one of its cells, with <i>p</i> times the area of a cell of the full lattice. Each sublattice is determined by one direction that it contains, and directions that differ by a multiple modulo <i>p</i> give the same sublattice. The labels (<i>a</i> : <i>b</i>) are those directions, the <i>p</i> + 1 points of the projective line over the integers modulo <i>p</i>.</figcaption>
</figure>

Given a lattice function $$F$$ of weight $$k$$, define a new one by

$$(T_n F)(\Lambda) = n^{k-1} \sum_{\Lambda' \subset \Lambda \text{ of index } n} F(\Lambda').$$

The new function is again a lattice function and again homogeneous of the same degree, since scaling $$\Lambda$$ scales all its sublattices. So $$T_n$$ takes modular forms of weight $$k$$ to modular forms of weight $$k$$. These are the *Hecke operators*. Working out what $$T_p$$ does in coordinates takes a few lines, using the $$p+1$$ sublattices in the figure, and the result on power series is simple. If $$f = \sum a_n q^n$$, then

$$\text{the coefficient of } q^n \text{ in } T_p f \;=\; a_{pn} + p^{k-1} a_{n/p},$$

with the second term present only when $$p$$ divides $$n$$.

Now the proof of Ramanujan’s first two observations. The modular forms of weight 12 whose series begin with $$q$$ rather than a constant are called *cusp forms*, and by the count in Part 2 they form a one-dimensional space spanned by $$\Delta$$. The form $$T_p\Delta$$ is also a cusp form of weight 12. A linear operator on a one-dimensional space can only multiply by a number, so

$$T_p \Delta = \lambda_p \Delta.$$

Compare coefficients of $$q^1$$: the left side has $$\tau(p)$$ and the right side has $$\lambda_p$$. So $$\lambda_p = \tau(p)$$. Now compare coefficients of $$q^n$$:

$$\tau(pn) + p^{11}\tau(n/p) = \tau(p)\,\tau(n).$$

When $$p$$ does not divide $$n$$ this is observation 1, and when $$n$$ is a power of $$p$$ it is observation 2. The multiplicative structure of the coefficients is the multiplicative structure of sublattices: a sublattice of index $$mn$$, with $$m$$ and $$n$$ coprime, sits inside a unique sublattice of index $$m$$.

Hecke’s sublattices are not a new idea in this story. A sublattice of index $$n$$ gives a map between two tori that multiplies the coordinate by a constant. Part 1 called such a map an isogeny and noted that Jacobi’s *transformations of order $$n$$*, the laborious centrepiece of the *Fundamenta Nova* and of the second half of Beau’s 2020 post, are exactly these. Jacobi was computing with individual sublattices. Hecke averaged over all of them.

In weights where the space of cusp forms has more than one dimension, the same reasoning needs one more input. Hans Petersson supplied it in 1939: a way of measuring angles between cusp forms under which the Hecke operators behave like symmetric matrices. Symmetric matrices that commute can be diagonalised together. So every space of cusp forms has a basis of *eigenforms*, each an eigenvector of every $$T_p$$ at once, and each with multiplicative coefficients for the same reason $$\Delta$$ has them. The eigenvalues are the coefficients.

## 7. The series that goes with a form

There is a standard way to package a multiplicative sequence. Leonhard Euler observed that

$$\sum_{n \geq 1} \frac{1}{n^s} = \prod_{p \text{ prime}} \frac{1}{1 - p^{-s}},$$

which is unique factorisation written as an identity: expanding the product on the right produces each $$n^{-s}$$ once. The sum is the Riemann zeta function. The same trick applies to any multiplicative sequence. For an eigenform $$f = \sum a_n q^n$$ of weight $$k$$, the two rules proved above are equivalent to

$$L(f, s) = \sum_{n\geq1} \frac{a_n}{n^s} = \prod_{p} \frac{1}{1 - a_p\, p^{-s} + p^{k-1-2s}}.$$

This is the *L-function* of $$f$$. Each prime contributes one factor, a quadratic polynomial in $$p^{-s}$$ whose middle coefficient is the Hecke eigenvalue.

The L-function inherits a symmetry from the form. In 1859 Bernhard Riemann proved that the zeta function has a functional equation relating its values at $$s$$ and $$1 - s$$, and his proof used the transformation law of $$\theta$$ from section 3, fed through an integral. Hecke ran the same argument for any modular form: the law under $$\tau \mapsto -1/\tau$$ becomes a functional equation relating $$L(f, s)$$ and $$L(f, k - s)$$. In 1936 he proved the converse, that a series with such a functional equation must come from a modular form.

So by the late 1930s there were two descriptions of the same objects. One is geometric: a function of lattices with a symmetry. The other is arithmetic: a list of numbers $$a_p$$, one for each prime, assembled into a product with a functional equation. Being modular is a strong constraint on a list of numbers. Part 4 is about a second, apparently unrelated source of such lists, and the discovery that the two sources produce the same ones.

<p class="mf-next">Next: <a href="/2026/11/26/modular-forms-4-curves.html">Part 4, The Curve Behind the Form</a></p>

## Sources

1. C. G. J. Jacobi, *Fundamenta nova theoriae functionum ellipticarum* (1829). The theta functions and the four-square theorem are in the closing sections.
2. S. Ramanujan, On certain arithmetical functions, *Transactions of the Cambridge Philosophical Society* 22 (1916), 159–184.
3. G. H. Hardy, *Ramanujan: Twelve Lectures on Subjects Suggested by His Life and Work* (Cambridge, 1940), lectures IX and X. Sums of squares and $$\tau(n)$$, including the 24-square formula.
4. L. J. Mordell, On Mr. Ramanujan’s empirical expansions of modular functions, *Proceedings of the Cambridge Philosophical Society* 19 (1917), 117–124.
5. E. Hecke, Über Modulfunktionen und die Dirichletschen Reihen mit Eulerscher Produktentwicklung I, II, *Mathematische Annalen* 114 (1937).
6. J.-P. Serre, *A Course in Arithmetic* (Springer, 1973), chapter VII, §5, for Hecke operators as sums over sublattices.
7. P. Deligne, La conjecture de Weil I, *Publications Mathématiques de l’IHÉS* 43 (1974), 273–307.
8. T. Barnet-Lamb, D. Geraghty, M. Harris and R. Taylor, A family of Calabi–Yau varieties and potential automorphy II, *Publications of the RIMS* 47 (2011), 29–98. The Sato–Tate law for $$\Delta$$.
{:.src}

How the figures are computed. The counts in Figure 1 come from multiplying the series $$\sum q^{n^2}$$ by itself; the formulas are evaluated separately from the divisors. The values of $$\tau(n)$$ come from raising Jacobi’s series for $$\prod(1-q^n)^3$$ to the eighth power in exact integer arithmetic. A separate script confirms the three divisor formulas up to 200, the 24-square formula up to 24, the congruence $$\tau(n) \equiv \sigma_{11}(n) \pmod{691}$$, and the multiplication rules.
{:.aside}

<script src="/scripts/2026-11-26-modular-forms/js/mf-core.js?v={{ site.time | date: '%s' }}"></script>
<script src="/scripts/2026-11-26-modular-forms/js/mf-kit.js?v={{ site.time | date: '%s' }}"></script>
<script src="/scripts/2026-11-26-modular-forms/js/part3.js?v={{ site.time | date: '%s' }}"></script>
