---
title: "The Curve Behind the Form (modular forms, part 4 of 6)"
date: 2026-11-26 09:03:00 -0500
custom_excerpt: |
  Part 4 of 6. Count the points on a cubic modulo each prime, and the answers are already sitting in a q-series.
tag: slop
---
<link rel="stylesheet" href="/scripts/2026-11-26-modular-forms/series.css">
<script>/* This post typesets its own formulas with the KaTeX the site already loads; tell the site's MathJax not to do them a second time. */ (function () { var c = { skipStartupTypeset: true }; if (window.MathJax && window.MathJax.Hub) window.MathJax.Hub.Config(c); else window.MathJax = c; })();</script>

Count the solutions of a cubic equation modulo each prime. Separately, multiply out an infinite product. The two lists of numbers agree, and the reason takes the story back to where it started: an integral, its periods, and a lattice.
{:.dek}

Written by Claude. Part 4 of a series that continues Beau Horenberger’s [History of Modular Forms 1](https://horenbergerb.github.io/2020/08/08/modularforms.html) (2020).
{:.by}

{% include modular-forms/nav.html part=4 %}

<div class="mf-timeline" data-part="4"></div>

The first three parts built up one kind of object. A *modular form of weight $$k$$ and level $$N$$* is a function $$f$$ on the upper half of the complex plane that satisfies $$f\bigl(\tfrac{a\tau+b}{c\tau+d}\bigr) = (c\tau+d)^k f(\tau)$$ for all integer matrices of determinant 1 with $$c$$ divisible by $$N$$. [Part 2](/2026/11/26/modular-forms-2-lattices.html) explained this as a function of lattices that does not care which basis describes the lattice. [Part 3](/2026/11/26/modular-forms-3-coefficients.html) showed that the coefficients $$a_n$$ of its series $$\sum a_n q^n$$, with $$q = e^{2\pi i\tau}$$, satisfy multiplication rules, and that the numbers $$a_p$$ for primes $$p$$ assemble into a product called an L-function.

This part is about a different kind of object, a cubic equation with whole-number coefficients, and the discovery that it produces the same lists of numbers.

## 1. Two lists

Take the equation

$$E:\quad y^2 + y = x^3 - x^2 - 10x - 20.$$

For a prime $$p$$, count the pairs $$(x, y)$$ of integers between 0 and $$p - 1$$ for which the two sides agree modulo $$p$$. A typical value of $$x$$ gives either two values of $$y$$ or none, with equal likelihood, so the count should be near $$p$$. Add 1 to it, for a reason given below, and record how far the total falls short of $$p + 1$$:

$$a_p = p + 1 - \#\{\text{points of } E \text{ modulo } p\}.$$

Now take a formula that has nothing to do with cubic equations:

$$f = q\prod_{n \geq 1} (1 - q^n)^2 (1 - q^{11n})^2 = q - 2q^2 - q^3 + 2q^4 + q^5 + 2q^6 - 2q^7 - 2q^9 - 2q^{10} + q^{11} + \cdots$$

The coefficient of $$q^p$$ in this product is $$a_p$$. For every prime.

<figure>
  <canvas id="c-count" class="r-wide" aria-label="Left: a grid of residues modulo p with the solutions of the cubic marked. Right: a plot of the numbers a_p against p for both the curve and the product, between the curves plus and minus two root p"></canvas>
  <div class="controls">
    <label class="short">Prime <select id="count-p" aria-label="Prime p"></select></label>
    <span class="ctl-name">Twist by</span>
    <div class="seg" id="count-d" role="group" aria-label="Quadratic twist"><button type="button" data-v="1">none</button><button type="button" data-v="-3">−3</button><button type="button" data-v="5">5</button><button type="button" data-v="-7">−7</button><button type="button" data-v="13">13</button></div>
  </div>
  <p class="readout" id="count-read"></p>
  <div class="table-wrap" id="count-table"></div>
  <figcaption><b>Figure 1.</b> Left: every solution of the equation modulo the chosen prime, found by trying all pairs. Right: for each prime up to 400, the <span class="key k-blue">dot</span> is the coefficient of <i>q<sup>p</sup></i> in the product and the ring is the number computed from the count. Every dot sits inside its ring. The dashed <span class="key k-gold">gold</span> curves are ±2√<i>p</i>. The table lists the primes below 100. The “twist” buttons are for section 6.</figcaption>
</figure>

The counting has a long past. The last entry in Gauss’s diary, from July 1814, counts the solutions modulo $$p$$ of $$x^2 + y^2 + x^2y^2 = 1$$, which is the identity relating the lemniscate sine and cosine in the table in [Part 1](/2026/11/26/modular-forms-1-two-periods.html). He had come back, at the end, to the curve he began with, and asked how many points it has in a finite number system. In the 1930s Helmut Hasse proved that for any cubic of this kind the error is small,

$$\lvert a_p \rvert \leq 2\sqrt{p},$$

which is the gold curve in the figure. Then one packages the $$a_p$$ exactly as in Part 3:

$$L(E, s) = \prod_p \frac{1}{1 - a_p\, p^{-s} + p^{1-2s}}.$$

Put this beside the L-function of a modular eigenform of weight $$k$$, whose factors were $$1 - a_p p^{-s} + p^{k-1-2s}$$. They have the same shape when $$k = 2$$. Hasse’s bound $$2\sqrt p$$ is Ramanujan’s bound $$2p^{(k-1)/2}$$ when $$k = 2$$. The curve’s L-function is behaving like that of a modular form of weight 2. But a product over primes defined by counting has no reason to have a functional equation. If it secretly came from a modular form, it would.

## 2. Why a cubic, and why the extra point

The cubic equations in question are the elliptic curves of Part 2. There, every lattice in the complex plane produced a curve $$y^2 = 4x^3 - g_2 x - g_3$$, and the plane rolled up along the lattice mapped onto the curve, with addition of complex numbers turning into the rule “three points on a line add up to zero.” The equation $$E$$ above is a cubic of that kind after a change of variables to clear fractions. The one point the rolled-up plane has that the equation lacks is the image of the lattice points themselves, where $$\wp$$ blows up. It is a point “at infinity,” and it is the zero of the addition. The count modulo $$p$$ includes it because the chord rule works modulo $$p$$ just as well, and it is the full set, including that point, that forms a group.

So an elliptic curve has two lives. Over the complex numbers it is a torus, a lattice, a point $$\tau$$ in the upper half-plane. Over the integers modulo $$p$$ it is a finite set of points whose size fluctuates around $$p + 1$$. The equation ties the two lives together, and the claim of this part is that the second life is governed by a modular form.

## 3. Weight 2 means “something you can integrate”

Why weight 2? Because of one line of calculus. If $$\tau' = \frac{a\tau + b}{c\tau + d}$$ then

$$d\tau' = \frac{d\tau}{(c\tau+d)^2}.$$

A form of weight 2 picks up the factor $$(c\tau + d)^2$$, which cancels this exactly:

$$f(\tau')\,d\tau' = f(\tau)\,d\tau.$$

So for weight 2, and only for weight 2, the expression $$f(\tau)\,d\tau$$ does not depend on the choice of basis at all. It can be integrated along a path, and the answer depends only on where the path goes in the space of lattices-with-marked-sublattice, not on which descriptions $$\tau$$ were used along the way.

That space has a name, $$X_0(N)$$, and a shape. Glue the edges of a fundamental domain for $$\Gamma_0(N)$$ together according to which boundary points describe the same lattice, add the few points needed to close it up, and the result is a closed surface: a sphere with some number of handles. The number of handles is called the *genus*. A basic theorem about such surfaces, due to Riemann, says that the number of independent expressions $$f(\tau)\,d\tau$$ that are finite everywhere equals the genus.

For level 1 and for every level up to 10 the surface is a sphere, genus 0, and there are no forms to integrate. This is the same fact as “no modular forms of weight 2” from Part 2. Level 11 is the first with a handle. The surface $$X_0(11)$$ is a torus, and it carries exactly one such expression, up to scaling. It is the product $$f$$ of section 1.

## 4. The form builds its own lattice

A torus carrying something to integrate is where Part 1 began. There, the surface was hidden in the integrand $$dt/\sqrt{1-t^4}$$, and integrating around closed loops produced the periods $$2\varpi$$ and $$2\varpi i$$. Here the torus is $$X_0(11)$$ and the integrand is $$f(\tau)\,d\tau$$. Do the same thing.

A closed loop on $$X_0(11)$$ is a path in the upper half-plane from a point $$\tau_0$$ to a point $$\gamma\tau_0$$ that describes the same lattice and marked sublattice, where $$\gamma$$ is a matrix in $$\Gamma_0(11)$$. Because $$f$$ is a power series in $$q$$, the integral can be done term by term:

$$\int_{\tau_0}^{\gamma\tau_0} 2\pi i\, f(\tau)\, d\tau = \sum_{n\geq1} \frac{a_n}{n}\left(e^{2\pi i n \gamma\tau_0} - e^{2\pi i n\tau_0}\right).$$

The figure evaluates this for forty different matrices $$\gamma$$.

<figure>
  <canvas id="c-periods" class="r-wide" aria-label="Left: the upper half-plane with a fundamental domain for level 11 and a path between two equivalent points. Right: the complex plane with the values of forty integrals, all lying on the points of one lattice"></canvas>
  <div class="controls">
    <button type="button" id="per-prev">Previous loop</button>
    <button type="button" id="per-next">Next loop</button>
  </div>
  <p class="readout" id="per-read"></p>
  <figcaption><b>Figure 2.</b> Left: the shaded tiles together are one fundamental domain for level 11; it takes twelve copies of the level-1 domain. The <span class="key k-red">red</span> path joins two points that describe the same lattice with the same marked sublattice, so on the surface it is a closed loop. Right: the value of the integral of <i>f</i> around each of forty such loops, one <span class="key k-blue">blue</span> dot each (many coincide). They all fall on the points of a single lattice, drawn in <span class="key k-gold">gold</span>. Click a dot or step through the loops.</figcaption>
</figure>

Forty integrals of an infinite product, and every one of them lands on a point of the same lattice. That is the torus showing itself: there are only two independent ways around it, so every loop’s integral is a whole-number combination of two basic ones.

Now apply Part 2 to this lattice. Its shape $$\tau = \omega_2/\omega_1$$ has a $$j$$-invariant, and a lattice determines a cubic curve. The readout computes $$j$$ from the lattice. It also gives the $$j$$-invariant of the equation $$E$$ from section 1, which can be computed from the equation’s coefficients by a standard formula and is the rational number $$-122023936/161051 = -2^{12}\cdot 31^3/11^5$$. They agree to every digit shown.

So the curve can be manufactured from the form. Start with the product, integrate it around loops, get a lattice, and the lattice is the curve $$E$$. Martin Eichler worked out this example in 1954. Goro Shimura showed over the following decade that the construction is general: every weight-2 eigenform with whole-number coefficients, at any level $$N$$, yields an elliptic curve with whole-number coefficients, and the curve’s point counts are the form’s coefficients. The reason the counts match is that the Hecke operator $$T_p$$ of Part 3, which is built from sublattices of index $$p$$, becomes when read modulo $$p$$ the operation of raising coordinates to the $$p$$th power, and that operation is what controls the number of solutions modulo $$p$$.

## 5. The converse

That direction, from forms to curves, was a construction. The surprising claim runs the other way: *every* elliptic curve with rational coefficients arises like this.

Yutaka Taniyama raised a version of it as a problem at a conference in Japan in 1955. Shimura sharpened it. In 1967 André Weil gave it the form that made it testable. Every elliptic curve over the rationals has a *conductor*, a whole number $$N$$ built from the primes at which the equation, read modulo $$p$$, acquires a singular point, with exponents measuring how bad the singularity is. The curve $$E$$ above is singular only modulo 11, and its conductor is 11. Weil’s precise statement was that a curve of conductor $$N$$ should correspond to a form of level exactly $$N$$. That turned a vague hope into something that could be checked on a computer, level by level, and it always checked.

> **Modularity theorem.** For every elliptic curve over the rational numbers with conductor $$N$$ there is a modular form of weight 2 and level $$N$$, an eigenform of the Hecke operators with whole-number coefficients, whose coefficient $$a_p$$ equals $$p + 1$$ minus the number of points of the curve modulo $$p$$, for every prime $$p$$ not dividing $$N$$.
{:.claim}

The word “exactly” in “level exactly $$N$$” needs a definition. A form of level 11 is automatically a form of level 22 or 33, since the condition for a higher level is weaker. In 1970 Oliver Atkin and Joseph Lehner showed how to separate the forms that genuinely first appear at level $$N$$, the *newforms*, from those inherited from lower levels. With that, the correspondence is clean: newforms of level $$N$$ and weight 2 with whole-number coefficients on one side; elliptic curves of conductor $$N$$ on the other, where curves related by an isogeny (Part 1’s word) are counted as the same.

The proof is famous for a side effect. In 1985 Gerhard Frey observed that a counterexample to Fermat’s Last Theorem would produce an elliptic curve too strange to be modular, and Kenneth Ribet proved the strangeness in 1986. So modularity for a large class of curves would imply Fermat. Andrew Wiles, with Richard Taylor, proved that class in 1995. Christophe Breuil, Brian Conrad, Fred Diamond and Taylor finished the remaining cases in 2001.

For this series the point is what the theorem says about the two lives of an elliptic curve. The numbers $$a_p$$ come from the curve’s life over finite fields. The modular form lives on the upper half-plane, the catalogue of complex lattices. The theorem says the first is always the Fourier series of the second.

## 6. Twists

One more construction, because Part 6 depends on its analogue.

Take an integer $$d$$ and change the equation by inserting it in front of the square. Completing the square in $$E$$ gives $$Y^2 = 4x^3 - 4x^2 - 40x - 79$$, and the *twist by $$d$$* is

$$E_d:\quad d\,Y^2 = 4x^3 - 4x^2 - 40x - 79.$$

Over the complex numbers this is the same curve, since $$\sqrt d$$ can be absorbed into $$Y$$. Modulo a prime $$p$$ it depends on whether $$d$$ is a square modulo $$p$$. If it is, nothing changes. If it is not, then every $$x$$ that had two values of $$Y$$ now has none and vice versa, and the surplus becomes a deficit. So

$$a_p(E_d) = \chi(p)\, a_p(E), \qquad \chi(p) = \begin{cases} +1 & d \text{ is a square modulo } p,\\ -1 & \text{otherwise.}\end{cases}$$

Press the twist buttons in Figure 1 to see the grid change and the signs flip.

By the modularity theorem $$E_d$$ has its own modular form. What is it? The coefficients say: $$f_\chi = \sum \chi(n)\, a_n q^n$$, the same series with signs attached. But it is not obvious that attaching signs to the coefficients of a modular form gives a modular form. The argument that it does is short, and its shape is worth remembering.

For simplicity let $$d$$ be a prime, or minus a prime, with the sign chosen so that $$d$$ leaves remainder 1 when divided by 4. The buttons in the figure are all of this kind. Then the sign pattern $$\chi(n)$$ repeats with period $$\lvert d\rvert$$, so it can be written as a combination of the pure oscillations $$e^{2\pi i\, nb/\lvert d\rvert}$$ for $$b = 1, \ldots, \lvert d\rvert-1$$. This is a finite Fourier transform, and the weights turn out to be $$\chi(b)$$ again, up to one overall constant $$W$$ called a Gauss sum. And multiplying the $$n$$th coefficient of a $$q$$-series by $$e^{2\pi i\, nb/\lvert d\rvert}$$ is the same as shifting $$\tau$$ by $$b/\lvert d\rvert$$, because $$q^n = e^{2\pi i n\tau}$$. Therefore

$$f_\chi(\tau) = \frac{1}{W}\sum_{b=1}^{\lvert d\rvert-1} \chi(b)\, f\!\left(\tau + \frac{b}{\lvert d\rvert}\right).$$

The twisted form is a weighted sum of shifted copies of the original. Each shifted copy obeys a transformation law for a smaller group, and the sum obeys one for level $$N d^2$$. That matches the curve: the conductor of $$E_d$$ is $$11 d^2$$.

In this setting the recipe is almost embarrassingly easy to carry out. To twist, multiply the $$n$$th coefficient by $$\chi(n)$$. The reason is that the coefficients are indexed by whole numbers, and a shift of $$\tau$$ acts on $$q^n$$ by a simple factor. In Part 6 the same recipe is applied to forms whose coefficients are indexed by something more complicated than whole numbers, and the easy step becomes a theorem with five cases.

## 7. Where this leaves us

Elliptic curves are tori. A torus has one handle, its periods form a lattice in the complex plane, the shapes of lattices are catalogued by the upper half-plane, and modular forms are functions on the catalogue. The modularity theorem closes the circle by saying that the arithmetic of the curve is one of those functions.

All of that is the story of surfaces with one handle. Surfaces with two handles come from integrals like $$\int dx/\sqrt{x^5 - x}$$, where the polynomial under the root has degree five or six in place of three or four. Abel and Jacobi had turned to those immediately after the events of Part 1, and what they found blocked the way for twenty years. Part 5 goes back to 1826 and follows that second line forward, to the generalisation of everything in Part 2.

<p class="mf-next">Next: <a href="/2026/11/26/modular-forms-5-genus-two.html">Part 5, Two Holes, Four Periods</a></p>

## Sources

1. M. Eichler, Quaternäre quadratische Formen und die Riemannsche Vermutung für die Kongruenzzetafunktion, *Archiv der Mathematik* 5 (1954), 355–366. The level-11 example.
2. G. Shimura, *Introduction to the Arithmetic Theory of Automorphic Functions* (Princeton, 1971), chapter 7.
3. A. Weil, Über die Bestimmung Dirichletscher Reihen durch Funktionalgleichungen, *Mathematische Annalen* 168 (1967), 149–156.
4. A. O. L. Atkin and J. Lehner, Hecke operators on Γ₀(m), *Mathematische Annalen* 185 (1970), 134–160.
5. A. Wiles, Modular elliptic curves and Fermat’s Last Theorem, and R. Taylor and A. Wiles, Ring-theoretic properties of certain Hecke algebras, *Annals of Mathematics* 141 (1995).
6. C. Breuil, B. Conrad, F. Diamond and R. Taylor, On the modularity of elliptic curves over **Q**: wild 3-adic exercises, *Journal of the American Mathematical Society* 14 (2001), 843–939.
7. F. Diamond and J. Shurman, *A First Course in Modular Forms* (Springer, 2005). Chapters 2, 3 and 6 for the surfaces $$X_0(N)$$ and the construction of the curve; chapter 8 for the point counts.
8. The curve is [11.a2 in the L-functions and Modular Forms Database](https://www.lmfdb.org/EllipticCurve/Q/11/a/2), and the form is [11.2.a.a](https://www.lmfdb.org/ModularForm/GL2/Q/holomorphic/11/2/a/a/).
{:.src}

How the figures are computed. Points are counted by trying every pair of residues. The product is multiplied out to 400 terms (600 for the integrals). A separate script confirms that the two lists agree for all primes below 100, that the twisted counts equal the twisted coefficients for four values of $$d$$, that all forty integrals lie on one lattice, and that the lattice’s $$j$$-invariant matches the curve’s to ten digits.
{:.aside}

<script src="/scripts/2026-11-26-modular-forms/js/mf-core.js"></script>
<script src="/scripts/2026-11-26-modular-forms/js/mf-kit.js"></script>
<script src="/scripts/2026-11-26-modular-forms/js/part4.js"></script>
