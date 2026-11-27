---
title: "Two Holes, Four Periods (modular forms, part 5 of 6)"
date: 2026-11-26 09:02:00 -0500
custom_excerpt: |
  Part 5 of 6. Curves with two holes, their period matrices, and Siegel's modular forms in several variables.
tag: slop
---
<link rel="stylesheet" href="/scripts/2026-11-26-modular-forms/series.css">
<script>/* This post typesets its own formulas with the KaTeX the site already loads; tell the site's MathJax not to do them a second time. */ (function () { var c = { skipStartupTypeset: true }; if (window.MathJax && window.MathJax.Hub) window.MathJax.Hub.Config(c); else window.MathJax = c; })();</script>

The next integral after the elliptic ones has four periods, and no function of one variable can have four periods. Getting past that took thirty years. On the other side, the single number that recorded the shape of a lattice has become a matrix, and the whole numbers that indexed Fourier coefficients have become quadratic forms.
{:.dek}

Written by Claude. Part 5 of a series that continues Beau Horenberger’s [History of Modular Forms 1](https://horenbergerb.github.io/2020/08/08/modularforms.html) (2020).
{:.by}

{% include modular-forms/nav.html part=5 %}

<div class="mf-timeline" data-part="5"></div>

The story so far, in one paragraph. An *elliptic integral* such as $$\int dx/\sqrt{1 - x^4}$$ has a square root of a polynomial of degree three or four. Its inverse function has two periods ([Part 1](/2026/11/26/modular-forms-1-two-periods.html)). The periods form a lattice, the shape of the lattice is a point $$\tau$$ in the upper half-plane, and a *modular form* is a function of lattices written in terms of $$\tau$$ ([Part 2](/2026/11/26/modular-forms-2-lattices.html)). The coefficients of its power series carry arithmetic ([Part 3](/2026/11/26/modular-forms-3-coefficients.html)), and in weight 2 they count points on cubic curves ([Part 4](/2026/11/26/modular-forms-4-curves.html)).

This part goes back to the 1820s and asks the question Abel and Jacobi asked as soon as elliptic functions were in hand. What happens when the polynomial under the square root has degree five or six?

## 1. The integral that could not be inverted

Take

$$u = \int_0^x \frac{dt}{\sqrt{f(t)}}, \qquad f \text{ a polynomial of degree 6 with distinct roots.}$$

Integrals of this kind are called *hyperelliptic*. Everything in Part 1 suggests the next move: treat $$u$$ as the independent variable and study $$x$$ as a function of $$u$$.

Niels Henrik Abel had the first general result, in a memoir submitted to the Paris Academy in 1826. The manuscript was mislaid among Cauchy’s papers and not printed until 1841, twelve years after Abel’s death. Its theorem says that sums of such integrals obey an addition law, with a twist. For elliptic integrals, the sum of two integrals equals one integral whose endpoint is an algebraic function of the two original endpoints; that is Euler’s addition theorem. For the degree-six case, a sum of any number of integrals can be reduced to a sum of *two*, and no further. Every algebraic integral has such a number attached to it, the least number of terms that sums can always be reduced to. It is 1 for elliptic integrals and 2 here. Later it was named the *genus*.

Jacobi found the obstruction in 1834. Part 1 found the periods of the lemniscate integral by integrating between its special points. Do the same here. The polynomial has six roots, and integrating between consecutive roots gives more independent periods than before: four of them. So the inverse function $$x(u)$$ would have to satisfy $$x(u + \omega_i) = x(u)$$ for four complex numbers $$\omega_1, \ldots, \omega_4$$.

No reasonable function can do this. Two periods in different directions generate a lattice. A third complex number, unless it happens to lie in a lattice with the first two, ruins everything: whole-number combinations of three numbers in a plane can be made as small as you like.

<figure class="narrow">
  <canvas id="c-dense" class="r-wide" aria-label="The complex plane with dots at every whole-number combination of two, three or four fixed complex numbers"></canvas>
  <div class="controls">
    <div class="seg" id="dense-k" role="group" aria-label="Number of periods"><button type="button" data-v="2">2 periods</button><button type="button" data-v="3">3 periods</button><button type="button" data-v="4">4 periods</button></div>
    <label>Largest coefficient <input type="range" id="dense-n" min="1" max="14" step="1" value="4" aria-label="Largest coefficient"></label>
  </div>
  <p class="readout" id="dense-read"></p>
  <figcaption><b>Figure 1.</b> Every combination <i>n</i>₁ω₁ + <i>n</i>₂ω₂ + … with whole-number coefficients up to the chosen size. With two periods the dots form a lattice and stay apart. With three, they fill the plane, and the shortest nonzero combination shrinks toward zero as the range grows.</figcaption>
</figure>

A function with arbitrarily small periods takes the same value at points arbitrarily close together, and if it is differentiable that forces it to be constant. Jacobi’s verdict on a function of one variable with more than two periods was that the idea was absurd.

So inverting a single hyperelliptic integral is impossible. The integral still has its four periods; what cannot exist is a single-valued inverse.

## 2. Jacobi’s way out

Jacobi’s proposal, made in 1832 and worked out in the paper of 1834, was guided by Abel’s theorem. If sums reduce to two integrals and no further, then two is the natural number of things to work with. There are two different integrands that stay finite everywhere on this curve,

$$\frac{dx}{\sqrt{f(x)}} \qquad\text{and}\qquad \frac{x\,dx}{\sqrt{f(x)}},$$

so take both, and take two upper limits $$x_1$$ and $$x_2$$:

$$u_1 = \int^{x_1}\!\frac{dx}{\sqrt{f}} + \int^{x_2}\!\frac{dx}{\sqrt{f}}, \qquad u_2 = \int^{x_1}\!\frac{x\,dx}{\sqrt{f}} + \int^{x_2}\!\frac{x\,dx}{\sqrt{f}}.$$

Now invert the pair. Jacobi conjectured that the symmetric combinations $$x_1 + x_2$$ and $$x_1 x_2$$ are single-valued functions of the *two* variables $$(u_1, u_2)$$.

The four periods are still there, but each is now a pair of numbers, a vector in two-dimensional complex space. That space has four real dimensions. Four vectors in a four-dimensional space can perfectly well generate a lattice with nothing accumulating anywhere. The absurdity came from squeezing a four-dimensional lattice into a plane.

Finding the functions became known as the *Jacobi inversion problem*. Adolph Göpel in 1847 and Georg Rosenhain, in a prize memoir written in 1846, solved it for genus 2 with theta functions of two variables, the direct generalisation of the series from Part 3. Bernhard Riemann and Karl Weierstrass solved it in general in the 1850s. The solution that matters here is Riemann’s, because it came with a picture.

## 3. Riemann’s picture

Riemann’s way of making $$\sqrt{f(x)}$$ single-valued was to change the domain. Take two copies of the complex plane. The square root has two values at each $$x$$, one for each copy, except at the six roots of $$f$$ where the two values coincide. Pair up the roots and slit both planes along a cut joining each pair. Crossing a cut switches from one copy to the other. Glue accordingly, and the two slit planes become one closed surface. With two roots’ worth of cuts you would get a sphere, with four roots a torus, and with six roots a surface with **two holes**. The genus is the number of holes.

On a surface with two holes there are four independent closed loops: around each hole, and through each hole. Call them $$a_1, a_2$$ and $$b_1, b_2$$. Integrating the two finite integrands around the four loops gives eight numbers, the *periods*. They are the four period vectors of section 2.

There is a normalisation, just as in Part 2 where the first basis vector of a lattice was scaled to 1. Replace the two integrands by the combinations of them whose integrals around $$a_1, a_2$$ are $$(1, 0)$$ and $$(0, 1)$$. Then the integrals around $$b_1, b_2$$ form a two-by-two matrix

$$\Omega = \begin{pmatrix} \tau_1 & z \\ z' & \tau_2 \end{pmatrix}.$$

In genus 1 this procedure gives a single number: the $$a$$-period is scaled to 1 and the $$b$$-period is $$\tau$$. So $$\Omega$$ is what $$\tau$$ becomes. Riemann proved two facts about it in 1857.

> **Riemann’s relations.** The matrix $$\Omega$$ is symmetric, $$z = z'$$, and its imaginary part is positive definite.
{:.claim}

The second is the analogue of “$$\tau$$ lies in the upper half-plane.” The first has no analogue in genus 1 and is not at all obvious: $$z$$ and $$z'$$ are computed from different loops and different integrands.

In the figure the six roots are real, which makes the integrals easy to compute, and the cuts are the three black segments. Drag the roots.

<figure>
  <canvas id="c-g2" class="r-band" aria-label="A number line with six draggable branch points, three cuts between them, and four loops labelled a1, a2, b1, b2"></canvas>
  <div id="g2-read"></div>
  <figcaption><b>Figure 2.</b> The surface of y² = (x − e₁)…(x − e₆), seen from above one of its two sheets. Heavy black segments are the cuts. Each loop is solid on the upper sheet and dashed where it runs on the lower one. The <span class="key k-blue">a-loops</span> circle a cut; the <span class="key k-red">b-loops</span> pass through two cuts. The grey ovals are the points where both x and y are real. The table gives the eight periods and the matrix Ω computed from them. With real roots Ω is purely imaginary. Its two off-diagonal entries are computed separately and printed to nine digits.</figcaption>
</figure>

Two things in the figure connect to Part 1. The $$b$$-loops lie over the stretches of the line where $$f$$ is positive, so they are the real ovals of the curve, and their periods are real. The $$a$$-loops lie over the cuts, where $$f$$ is negative and $$y$$ is imaginary, and their periods are imaginary. This is the pendulum and its reversed-gravity twin again: real periods from the real motion, imaginary periods from the motion in the mirrored world, except that now there are two of each.

The set of all symmetric two-by-two complex matrices with positive definite imaginary part is called the *Siegel upper half-space* of degree 2. It has three complex dimensions, one for each of $$\tau_1, z, \tau_2$$. That count is right: six roots, minus the three that can be moved anywhere by a change of variable $$x \mapsto (\alpha x + \beta)/(\gamma x + \delta)$$, leaves three parameters for a curve of genus 2.

And the two-dimensional complex space of pairs $$(u_1, u_2)$$, rolled up along the lattice of periods, is a four-real-dimensional torus on which Jacobi’s functions live. It is called the *Jacobian* of the curve. It is the true analogue of the elliptic curve of Part 2, since its points can be added. A complex torus of this kind that can also be described by polynomial equations is called an *abelian surface*, after Abel.

## 4. Change of basis, again

Part 2 turned on the observation that a lattice has many bases, and that an honest function of the lattice must not care. The same thing happens here. The four loops $$a_1, a_2, b_1, b_2$$ were a choice. What made them a good choice is their crossing pattern: $$a_1$$ crosses $$b_1$$ once, $$a_2$$ crosses $$b_2$$ once, and no other pair crosses. Any other set of four loops with that pattern is as good, and Riemann’s relations hold for it too.

The changes of basis that preserve the crossing pattern are the four-by-four integer matrices, written in two-by-two blocks as $$\begin{pmatrix} A & B \\ C & D\end{pmatrix}$$, that preserve a certain alternating pairing. They form a group, $$\mathrm{Sp}_4(\mathbb{Z})$$, the *Siegel modular group* of degree 2. Recomputing $$\Omega$$ with the new loops gives

$$\Omega' = (A\Omega + B)(C\Omega + D)^{-1},$$

which is $$\tau' = (a\tau + b)/(c\tau + d)$$ with matrices in place of numbers. In degree 1 the condition of preserving the pairing is the condition of having determinant 1, and the group is the modular group of Part 2.

The definition writes itself. A **Siegel modular form** of weight $$k$$ is a function $$F$$ on the Siegel upper half-space, differentiable in the complex sense, with

$$F\bigl((A\Omega + B)(C\Omega + D)^{-1}\bigr) = \det(C\Omega + D)^k\, F(\Omega).$$

The determinant is there for the reason $$(c\tau + d)^k$$ was: it is the factor by which the normalised integrands were rescaled, now a change of basis in a two-dimensional space, raised to the power that homogeneity requires.

## 5. Why Siegel wanted them: counting again

The definition is named for Carl Ludwig Siegel, who introduced these functions in a long paper of 1935 and set out their general theory in 1939. He did not come to them from Riemann surfaces. He came from the counting problem of Part 3.

Part 3 counted the ways to write a number as a sum of squares. Said geometrically: in the lattice of points with whole-number coordinates, how many vectors have a given length? The same question makes sense in any lattice $$L$$ in any dimension, and the generating function $$\sum_{x \in L} q^{x\cdot x/2}$$ is a modular form.

Siegel asked the next question. Instead of single vectors of a given length, count *pairs* of vectors with given lengths and a given angle between them. That is: fix three whole numbers $$a, b, c$$ and count the pairs $$(x, y)$$ of vectors in $$L$$ with

$$x\cdot x = 2a, \qquad x \cdot y = b, \qquad y \cdot y = 2c.$$

There is now a count for every triple. The triple is best thought of as the expression $$a\,X^2 + b\,XY + c\,Y^2$$, a *binary quadratic form*, because that expression is the squared length of the vector $$Xx + Yy$$, up to the factor 2. Call it $$T = [a, b, c]$$ and the count $$r_L(T)$$.

A generating function for these counts needs three variables, one for each of $$a, b, c$$. Use $$\tau_1, z, \tau_2$$:

$$\Theta_L(\Omega) = \sum_{T} r_L(T)\; e^{2\pi i\,(a\tau_1 + b z + c\tau_2)}.$$

Siegel proved that for suitable lattices this is a Siegel modular form of degree 2. The three variables that count pairs of lattice vectors are the three entries of the period matrix of a curve of genus 2.

That is the fact that matters most for Part 6, so here it is on its own.

> The Fourier coefficients of a Siegel modular form of degree 2 are indexed by binary quadratic forms $$[a, b, c]$$. In the basic examples, the coefficient at $$[a, b, c]$$ counts pairs of lattice vectors whose lengths and inner product are given by $$a$$, $$b$$ and $$c$$.
{:.claim}

### An example that can be checked

The lattice called $$E_8$$ lives in eight dimensions. It consists of the vectors whose coordinates are all whole numbers or all whole numbers plus one half, and whose coordinates add up to an even number. Its shortest vectors have $$x \cdot x = 2$$, and there are 240 of them. (This lattice gives the densest way to pack equal balls in eight dimensions, which Maryna Viazovska proved in 2016 with an argument that constructs a special function from modular forms.)

Its generating function for pairs has weight 4. The space of Siegel modular forms of degree 2 and weight 4 is one-dimensional, by a theorem of Jun-ichi Igusa from 1962 that plays the role of “polynomials in $$E_4$$ and $$E_6$$” from Part 2. It is spanned by a Siegel version of the Eisenstein series, whose coefficients are given by an explicit, if intricate, formula. So, as with Jacobi’s four squares, there is a closed formula for the number of pairs, and the reason is that a vector space has dimension one. The figure below does the count by brute force and compares.

### Equivalent forms, equal coefficients

The figure also shows the most practically important feature of these coefficients. Suppose $$(x, y)$$ is a pair with data $$[a, b, c]$$. Then $$(x, x + y)$$ is another pair of lattice vectors, with different lengths and inner product, so it is counted under a different triple. The map $$(x, y) \mapsto (x, x+y)$$ is reversible, so the two triples have the same count. The same goes for any substitution

$$X \mapsto pX + qY, \qquad Y \mapsto rX + sY$$

with whole numbers satisfying $$ps - qr = \pm 1$$. Two forms related this way are called *equivalent*, and

$$\text{equivalent forms have equal coefficients}$$

(up to a sign, $$(ps - qr)^k$$, for general Siegel forms of weight $$k$$). A table of coefficients therefore needs one entry for each class of equivalent forms, and a way to decide which class a given form belongs to.

That problem was solved in 1801. It is the subject of the fifth section of Gauss’s *Disquisitiones Arithmeticae*: every positive form is equivalent to exactly one *reduced* form, with

$$\lvert b\rvert \leq a \leq c,$$

and there is an algorithm to find it. Part 2 promised to explain why Gauss’s algorithm is the same as the reduction of a lattice basis. A positive form $$[a, b, c]$$ is the table of lengths and inner products of two vectors in the plane: $$a = \lvert\omega_1\rvert^2$$, $$c = \lvert\omega_2\rvert^2$$, $$b = 2\,\omega_1\cdot\omega_2$$. So it is a lattice with a basis, with the rotation forgotten. The ratio $$\tau = \omega_2/\omega_1$$ works out to

$$\tau = \frac{b + \sqrt{b^2 - 4ac}}{2a},$$

a point of the upper half-plane. A substitution in the form is a change of basis, which moves $$\tau$$ by the modular group. The reduced forms are the ones whose $$\tau$$ lies in the fundamental domain from Part 2.

<figure>
  <canvas id="c-index" class="r-band" aria-label="The upper half-plane with the modular tiling, a point for the entered quadratic form, and the path it takes to the fundamental domain"></canvas>
  <div class="controls">
    <label class="short"><i>a</i> <input type="number" id="index-a" value="3"></label>
    <label class="short"><i>b</i> <input type="number" id="index-b" value="3"></label>
    <label class="short"><i>c</i> <input type="number" id="index-c" value="1"></label>
    <button type="button" data-form="3,3,1">[3, 3, 1]</button>
    <button type="button" data-form="1,3,3">[1, 3, 3]</button>
    <button type="button" data-form="1,-1,1">[1, −1, 1]</button>
    <button type="button" data-form="2,3,3">[2, 3, 3]</button>
    <button type="button" data-form="81,78,19">[81, 78, 19]</button>
  </div>
  <p class="readout" id="index-read"></p>
  <figcaption><b>Figure 3.</b> A form [<i>a</i>, <i>b</i>, <i>c</i>] is a point of the upper half-plane; the <span class="key k-red">red</span> dot is the form you entered and the <span class="key k-gold">gold</span> dot its reduced form, joined by the steps of Gauss’s algorithm. The readout counts the pairs of E₈ vectors for each, where the vectors are short enough to enumerate (<i>a</i> and <i>c</i> at most 3), and gives the value predicted by the Eisenstein series. Try the first three buttons, which are three names for the same class.</figcaption>
</figure>

The last button, $$[81, 78, 19]$$, is not a random choice. It is one of the two table lookups in the worked example of the paper Beau’s 2018 project implemented, and its reduction to $$[1, 0, 18]$$ is the first step of the calculation replayed in the last figure of [Part 6](/2026/11/26/modular-forms-6-paramodular.html).

Part 1 pointed out that the *Disquisitiones* contains one sentence about the lemniscate, in its seventh section, and hundreds of pages about binary quadratic forms, in its fifth. For a century and a third those were separate subjects. They meet here. The functions that grew out of the lemniscate integral, taken one genus higher, have Fourier coefficients indexed by Gauss’s classes of forms.

## 6. Where this leaves us

After 1939 the degree-2 analogue of Part 2 was in place:

<div class="table-wrap"><table>
<tr><th></th><th>Degree 1</th><th>Degree 2</th></tr>
<tr><td>the surface</td><td>one hole: a torus</td><td>two holes</td></tr>
<tr><td>periods</td><td>a lattice in the plane</td><td>a lattice in two-dimensional complex space</td></tr>
<tr><td>the shape</td><td>\(\tau\) in the upper half-plane</td><td>a symmetric matrix \(\Omega\), three numbers</td></tr>
<tr><td>changes of basis</td><td>\(\mathrm{SL}_2(\mathbb{Z})\)</td><td>\(\mathrm{Sp}_4(\mathbb{Z})\)</td></tr>
<tr><td>the factor</td><td>\((c\tau+d)^k\)</td><td>\(\det(C\Omega+D)^k\)</td></tr>
<tr><td>coefficients indexed by</td><td>whole numbers \(n\)</td><td>classes of forms \([a,b,c]\)</td></tr>
<tr><td>the basic count</td><td>vectors of a given length</td><td>pairs with given lengths and inner product</td></tr>
</table></div>

What is missing is the analogue of Part 4. There, an elliptic curve with rational coefficients had a conductor $$N$$, and its point counts were the coefficients of a form of weight 2 and level $$N$$. A curve of genus 2 with rational coefficients also has point counts and a conductor. Is there a Siegel modular form of weight 2 that knows them? And what should “level $$N$$” mean when the group is $$\mathrm{Sp}_4(\mathbb{Z})$$ and there are several different ways to cut it down?

The answer to the second question is a group that is not even contained in $$\mathrm{Sp}_4(\mathbb{Z})$$. It is called the paramodular group, and Part 6 is about why.

<p class="mf-next">Next: <a href="/2026/11/26/modular-forms-6-paramodular.html">Part 6, Why Paramodular?</a></p>

## Sources

1. N. H. Abel, Mémoire sur une propriété générale d’une classe très étendue de fonctions transcendantes, presented 1826, printed in *Mémoires présentés par divers savants* 7 (1841), 176–264.
2. C. G. J. Jacobi, Considerationes generales de transcendentibus Abelianis, *Journal für die reine und angewandte Mathematik* 9 (1832), 394–403; De functionibus duarum variabilium quadrupliciter periodicis, quibus theoria transcendentium Abelianarum innititur, same journal, 13 (1835), 55–78.
3. A. Göpel, Theoriae transcendentium Abelianarum primi ordinis adumbratio levis, same journal, 35 (1847), 277–312. G. Rosenhain, Mémoire sur les fonctions de deux variables et à quatre périodes, *Mémoires présentés par divers savants* 11 (1851), 361–468.
4. B. Riemann, Theorie der Abel’schen Functionen, same journal, 54 (1857), 115–155.
5. C. L. Siegel, Über die analytische Theorie der quadratischen Formen, *Annals of Mathematics* 36 (1935), 527–606; Einführung in die Theorie der Modulfunktionen n-ten Grades, *Mathematische Annalen* 116 (1939), 617–657.
6. J. Igusa, On Siegel modular forms of genus two, *American Journal of Mathematics* 84 (1962), 175–200.
7. M. Eichler and D. Zagier, *The Theory of Jacobi Forms* (Birkhäuser, 1985), §2 and §6, for the coefficient formula of the Siegel Eisenstein series.
8. G. van der Geer, Siegel modular forms and their applications, in *The 1-2-3 of Modular Forms* (Springer, 2008). The most readable introduction.
9. C. Houzel, The work of Niels Henrik Abel, and J. Gray, *The Real and the Complex* (Springer, 2015), chapters 16 to 18, for the inversion problem.
{:.src}

How the figures are computed. The periods in Figure 2 are integrals between consecutive roots, evaluated by Gauss–Chebyshev quadrature with 80 nodes, which handles the square-root singularities at the endpoints exactly. Nothing in the code assumes the matrix is symmetric; a separate script checks that it comes out symmetric to fifteen digits and positive definite for two hundred random sets of roots. The $$E_8$$ counts enumerate all 9,120 vectors with $$x\cdot x \leq 6$$ and test every pair. The same script checks twelve forms against the Eisenstein series formula, computed from generalised Bernoulli numbers.
{:.aside}

<script src="/scripts/2026-11-26-modular-forms/js/mf-core.js"></script>
<script src="/scripts/2026-11-26-modular-forms/js/mf-kit.js"></script>
<script src="/scripts/2026-11-26-modular-forms/js/part5.js"></script>
