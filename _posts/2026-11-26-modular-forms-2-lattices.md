---
title: "A Lattice Has No Preferred Basis (modular forms, part 2 of 6)"
date: 2026-11-26 09:05:00 -0500
custom_excerpt: |
  Part 2 of 6. Where the modular transformation law comes from: a lattice has many bases, and a good function of lattices can't care which one you picked.
tag: slop
---
<link rel="stylesheet" href="/scripts/2026-11-26-modular-forms/series.css?v={{ site.time | date: '%s' }}">
<script>/* This post typesets its own formulas with the KaTeX the site already loads; tell the site's MathJax not to do them a second time. */ (function () { var c = { skipStartupTypeset: true }; if (window.MathJax && window.MathJax.Hub) window.MathJax.Hub.Config(c); else window.MathJax = c; })();</script>

Start from the grid of periods instead of the integral. A grid can be described by many different pairs of arrows, and an honest function of the grid cannot care which pair you used. Written in coordinates, that requirement is the definition of a modular form.
{:.dek}

Written by Claude. Part 2 of a series that continues Beau Horenberger’s [History of Modular Forms 1](https://horenbergerb.github.io/2020/08/08/modularforms.html) (2020).
{:.by}

{% include modular-forms/nav.html part=2 %}

<div class="mf-timeline" data-part="2"></div>

[Part 1](/2026/11/26/modular-forms-1-two-periods.html) ended in 1829 with a new kind of function. The inverse of an elliptic integral such as $$\int dt/\sqrt{1-t^4}$$ is *doubly periodic*: it repeats under two independent shifts of its complex argument, $$f(z + \omega_1) = f(z + \omega_2) = f(z)$$. All the shifts that leave it unchanged, $$m\omega_1 + n\omega_2$$ for integers $$m$$ and $$n$$, form a grid of points in the plane called its *period lattice*.

For Gauss, Abel and Jacobi the lattice was a consequence. You began with an integral, inverted it, and found two periods. In the decades after 1830 the order was reversed. This part follows that reversal and its payoff, which is the transformation law

$$f\!\left(\frac{a\tau+b}{c\tau+d}\right) = (c\tau+d)^k f(\tau)$$

derived in two lines from something that needs no justification.

## 1. Building the function from the lattice

Joseph Liouville, lecturing in the 1840s, isolated what double periodicity alone forces. His first theorem is that a doubly periodic function with no poles is constant. It is bounded on one period parallelogram, hence bounded everywhere, and a bounded function that is differentiable on the whole complex plane is constant. So any interesting doubly periodic function must blow up somewhere, and where and how it blows up comes close to determining it.

That suggests writing one down directly. Given a lattice $$\Lambda$$, put the simplest possible pole at every lattice point and add them up. Gotthold Eisenstein did this in 1847, and Karl Weierstrass made it the basis of his Berlin lectures in the 1860s. Weierstrass’s function is

$$\wp(z) = \frac{1}{z^2} + \sum_{\omega \in \Lambda,\ \omega \neq 0}\left(\frac{1}{(z-\omega)^2} - \frac{1}{\omega^2}\right).$$

The subtracted term is there to make the sum converge. Nothing in the definition mentions an integral or a curve. It is visibly unchanged when $$z$$ moves by a lattice point, since that only reshuffles the terms.

The curve comes back by itself, and there is a reason to expect it. Part 1’s functions were inverses of integrals, and the inverse of an integral always satisfies a differential equation of one particular shape. Take the sine. If $$z = \int_0^x dt/\sqrt{1-t^2}$$, then $$dz/dx = 1/\sqrt{1-x^2}$$, so $$(dx/dz)^2 = 1 - x^2$$. With $$x = \sin z$$ that is the familiar $$(\sin')^2 = 1 - \sin^2$$. The same step works with any polynomial $$P$$ under the root: a function $$x(z)$$ inverts $$z = \int dx/\sqrt{P(x)}$$ exactly when

$$x'(z)^2 = P\bigl(x(z)\bigr).$$

The function $$\wp$$ was built from a lattice with no integral in sight. If it is nevertheless the inverse of an elliptic integral, then $$\wp'^2$$ must equal a polynomial in $$\wp$$. That is the thing to look for.

Liouville’s theorem says the search has to succeed. The difference of two doubly periodic functions that blow up in the same way at the same places has no poles, so it is constant. A doubly periodic function is therefore determined, up to an added constant, by how it blows up. Now count. $$\wp$$ has a pole of order 2 at each lattice point and nowhere else, and $$\wp'$$ has one of order 3. Both $$\wp$$ and $$\wp'^2$$ are unchanged when $$z$$ is replaced by $$-z$$, which again only reshuffles the sum. So

$$1,\quad \wp,\quad \wp^2,\quad \wp^3,\quad \wp'^2$$

are five even, doubly periodic functions whose only poles are at the lattice points, of order at most 6. The 6 is the order of the pole of $$\wp^3$$ and of $$\wp'^2$$.

Near the origin, a function with a pole of order at most 6 there has an expansion

$$\begin{aligned}
f(z) = {} & \frac{a_{-6}}{z^6} + \frac{a_{-5}}{z^5} + \frac{a_{-4}}{z^4} + \frac{a_{-3}}{z^3} + \frac{a_{-2}}{z^2} + \frac{a_{-1}}{z} \\
& {} + a_0 + a_1 z + a_2 z^2 + \cdots.
\end{aligned}$$

Only the six terms with negative powers go to infinity as $$z \to 0$$, so those six coefficients are what “how it blows up” means. For an even function, replacing $$z$$ by $$-z$$ must leave the series unchanged. That flips the sign of every odd power, so $$a_{-5} = a_{-3} = a_{-1} = 0$$. Three numbers are left: $$a_{-6}$$, $$a_{-4}$$ and $$a_{-2}$$. The origin is the only place that needs checking, because the function is periodic and its behaviour at every other lattice point is a copy.

Two combinations of the five functions with the same three numbers blow up in the same way, so they differ by a constant, and the constant term $$a_0$$ settles which constant. A combination is therefore pinned down by four numbers. With five functions to combine and only four numbers to control, some combination that is not all zeros has all four numbers equal to zero. That combination is the zero function, and it is a linear relation among the five.

Finding the relation takes the expansions. For a single lattice point,

$$\frac{1}{(z-\omega)^2} - \frac{1}{\omega^2} = \frac{2z}{\omega^3} + \frac{3z^2}{\omega^4} + \frac{4z^3}{\omega^5} + \cdots.$$

Summed over the lattice, the odd powers of $$\omega$$ cancel, because $$-\omega$$ is a lattice point whenever $$\omega$$ is. So near $$z = 0$$,

$$\begin{aligned}
\wp(z) &= \frac{1}{z^2} + 3G_4 z^2 + 5 G_6 z^4 + \cdots, \\
\text{where}\quad G_k &= \sum_{\omega \neq 0} \frac{1}{\omega^k}.
\end{aligned}$$

Differentiate, then multiply out, keeping everything up to the constant term:

$$\begin{aligned}
\wp'(z) &= -\frac{2}{z^3} + 6G_4 z + 20 G_6 z^3 + \cdots \\
\wp'(z)^2 &= \frac{4}{z^6} - \frac{24\,G_4}{z^2} - 80\,G_6 + \cdots \\
\wp(z)^3 &= \frac{1}{z^6} + \frac{9\,G_4}{z^2} + 15\,G_6 + \cdots
\end{aligned}$$

Now cancel from the worst term down. Subtracting $$4\wp^3$$ from $$\wp'^2$$ removes the $$z^{-6}$$ and leaves $$-60G_4 z^{-2} - 140G_6 + \cdots$$. Adding $$60G_4\,\wp$$ removes the $$z^{-2}$$. Adding the number $$140G_6$$ removes the constant. No $$z^{-4}$$ turns up along the way, because $$\wp$$ has no constant term; the subtracted $$1/\omega^2$$ in its definition saw to that.

The result is the combination $$\wp'^2 - 4\wp^3 + 60G_4\wp + 140G_6$$, and its expansion at the origin has no negative powers of $$z$$ and no constant term. It is doubly periodic, because $$\wp$$ and $$\wp'$$ are. Its only possible poles were at the lattice points; the one at the origin is gone, and by periodicity so are all the others. A doubly periodic function with no poles is constant, and this one vanishes at the origin, so it is zero. So

$$\begin{aligned}
\wp'(z)^2 &= 4\wp(z)^3 - g_2\,\wp(z) - g_3, \\
g_2 &= 60 G_4,\qquad g_3 = 140 G_6.
\end{aligned}$$

Read this as a statement about points. As $$z$$ moves over the plane, the pair $$(x, y) = (\wp(z), \wp'(z))$$ always lies on the cubic curve $$y^2 = 4x^3 - g_2x - g_3$$. Shifting $$z$$ by a period gives the same point. The plane rolled up along the lattice, which is a torus, has been mapped onto a cubic curve. The 2020 post ended by asking whether every doubly periodic function parametrises a curve; this is the answer, and the curve is always a cubic.

This is the shape that was promised, $$x'^2 = P(x)$$ with a cubic for $$P$$, so the integral comes back too. Along the curve, $$dz = dx/y$$, so

$$z = \int \frac{dx}{\sqrt{4x^3 - g_2 x - g_3}}.$$

The coordinate $$z$$ on the torus is an elliptic integral on the curve. Part 1’s story ran from the integral to the function; this runs from the lattice to the function to the integral, and arrives at the same place.

One caution before the picture. For most $$z$$ the numbers $$\wp(z)$$ and $$\wp'(z)$$ are complex, so “the cubic curve” means every pair of complex numbers $$(x, y)$$ that satisfies the equation. Two complex coordinates are four real dimensions and one complex equation removes two of them, so that set is a surface. The torus is mapped onto this surface, with one extra point at infinity for $$z = 0$$, and each point of the surface comes from exactly one point of the torus. A drawing with real axes can only show the part of the surface where $$x$$ and $$y$$ are both real.

In the figure, the lattice is a rectangle with sides 1 and $$\tau$$, which makes $$g_2$$ and $$g_3$$ real. The points $$z$$ where $$\wp(z)$$ and $$\wp'(z)$$ are both real are then the two horizontal lines in the rectangle, and the right half of the figure draws the images of those two lines and nothing else. The rest of the rectangle goes to points of the curve with complex coordinates, which this picture has no room for. Drag the two black points; they stay on the two lines for that reason.

<figure>
  <div class="controls tabs"><div class="seg" id="cubic-view" role="group" aria-label="Which picture of the curve to show"><button type="button" data-v="real">Real points only</button><button type="button" data-v="torus">Whole curve, rolled up</button><button type="button" data-v="coords">Whole curve, in coordinates</button></div></div>
  <div id="cubic-real">
  <canvas id="c-cubic" class="r-wide" aria-label="A period rectangle with two marked points, and the cubic curve onto which the rectangle is mapped, with the corresponding points and the line through them"></canvas>
  <div class="controls">
    <label>Height of the rectangle <input type="range" id="cubic-t" min="0.6" max="2.2" step="0.01" value="1.3" aria-label="Height of the period rectangle"></label>
  </div>
  <p class="readout" id="cubic-read"></p>
  </div>
  <div id="cubic-whole" hidden>
  <canvas id="c-surface" class="r-surface" aria-label="Left: a period rectangle coloured by the value of the Weierstrass function, with a movable point. Right: the same coloured rectangle as a surface in space, either rolled into a torus or drawn in the coordinates of the cubic curve, with the two loops of real points marked"></canvas>
  <div class="controls">
    <label>Turn <input type="range" id="surface-turn" min="0" max="360" step="1" value="330" aria-label="Turn the surface"></label>
    <label>Tilt <input type="range" id="surface-tilt" min="0" max="90" step="1" value="35" aria-label="Tilt the surface"></label>
  </div>
  <p class="readout" id="surface-read"></p>
  </div>
  <figcaption><b>Figure 1.</b> <span id="cubic-cap-real">Left: one period rectangle. The <span class="key k-blue">blue</span> line maps to the unbounded branch of the curve and the <span class="key k-red">red</span> line to the oval. Right: the points P(z) = (℘(z), ℘′(z)) for z on those two lines, which are all the points of the curve with real coordinates. The straight line through P(z₁) and P(z₂) meets the curve once more; reflect that third point in the horizontal axis and you land on <span class="key k-gold">P(z₁ + z₂)</span>. The readout computes the third crossing two ways. The axes are scaled separately to fit.</span><span id="cubic-cap-torus" hidden>The whole curve, for a rectangle of height 1.3. Left: the period rectangle, coloured by the value of ℘(z); the colour is the direction of the complex number and the brightness its size. Right: the rectangle rolled up, with opposite edges glued. Every point of this surface is one point of the complex curve. The <span class="key k-blue">blue</span> and <span class="key k-red">red</span> loops are the real points, which are all that the first view draws. The black point is z = 0, where ℘ is infinite; the blue loop runs through it, so the two ends of the unbounded branch meet at infinity. Drag the <span class="key k-gold">gold</span> point in the rectangle: away from the two lines its coordinates are complex numbers. A ring marks it when it is on the far side. Turn the surface with the sliders, or by dragging it with a mouse.</span><span id="cubic-cap-coords" hidden>The same surface, drawn in the curve’s own coordinates. Four real dimensions do not fit in a picture, so the imaginary part of y is left out: the real and imaginary parts of x run across, and the real part of y runs up. Large values are pulled in so that the picture is finite, which puts infinity on the open rim. There are two sheets because each x has two values of y that differ by a sign. The sheets pass through each other, which the true surface never does: where they cross, the two points differ only in the coordinate that was left out. The <span class="key k-blue">blue</span> and <span class="key k-red">red</span> curves are again the real points.</span></figcaption>
</figure>

The straight line in the figure is Euler’s addition theorem from Part 1, turned into geometry. Adding two complex numbers on the torus corresponds to drawing a line through two points of the cubic. That is why a formula for $$\operatorname{sl}(u+v)$$ could exist at all and why it involved nothing worse than square roots: the third intersection of a line with a cubic can be found by solving for one unknown root when two are already known. This “chord rule” is the group law on what is now called an *elliptic curve*, and from Part 4 on it is the cubic, not the function, that takes centre stage.

Slide the rectangle to height 1. The lattice is square, the readout reports $$g_3 = 0$$, and the curve becomes $$y^2 = 4x^3 - g_2 x$$. That is the lemniscate’s curve.

## 2. Functions of a lattice

The quantities $$g_2$$ and $$g_3$$ are the first examples of a new kind of object. They are not functions of a point $$z$$. They are functions of the lattice itself: hand over a lattice, receive a number. The sums

$$G_k(\Lambda) = \sum_{\omega \in \Lambda,\ \omega \neq 0} \frac{1}{\omega^{k}}$$

converge for $$k \geq 3$$ and vanish for odd $$k$$, because $$\omega$$ and $$-\omega$$ cancel. They have two properties that are obvious from the formula.

**They depend only on the lattice as a set of points.** The sum runs over all lattice points. It doesn’t ask how you generated them.

**They are homogeneous.** Scale or rotate the whole lattice by a complex number $$c$$, and every term picks up the same factor:

$$G_k(c\Lambda) = c^{-k}\, G_k(\Lambda).$$

To compute anything we need coordinates. A lattice is specified by a *basis*, two arrows $$\omega_1, \omega_2$$ that generate it. Only the shape matters up to the homogeneity rule, so factor out $$\omega_1$$ and record the ratio:

$$\Lambda = \omega_1\,(\mathbb{Z} + \mathbb{Z}\tau), \qquad \tau = \frac{\omega_2}{\omega_1}.$$

Ordering the pair so that $$\omega_2$$ is counterclockwise from $$\omega_1$$ puts $$\tau$$ in the upper half of the complex plane. Then $$G_k(\Lambda) = \omega_1^{-k}\, G_k(\tau)$$, where $$G_k(\tau)$$ is shorthand for the sum over the lattice generated by $$1$$ and $$\tau$$. Lattice functions have become functions of one complex variable $$\tau$$.

But the same lattice has many bases, and so many values of $$\tau$$.

<figure>
  <canvas id="c-basis" class="r-pair" aria-label="Left: a lattice of dots with two basis arrows. Right: the upper half-plane divided into curved triangles, with a point marking the ratio of the two arrows"></canvas>
  <div class="controls">
    <button type="button" id="basis-T"><b>T</b>: ω₂ → ω₂ + ω₁</button>
    <button type="button" id="basis-Ti"><b>T⁻¹</b>: ω₂ → ω₂ − ω₁</button>
    <button type="button" id="basis-S"><b>S</b>: (ω₁, ω₂) → (ω₂, −ω₁)</button>
    <button type="button" id="basis-reduce">Reduce</button>
    <button type="button" id="basis-new">New lattice</button>
  </div>
  <p class="readout" id="basis-read"></p>
  <figcaption><b>Figure 2.</b> Left: a lattice and one basis for it, <span class="key k-blue">ω₁</span> and <span class="key k-red">ω₂</span>. Right: the ratio τ. Press <b>S</b> and <b>T</b>: the arrows change, τ jumps, and <i>the dots do not move</i>. Drag an arrowhead, or τ itself, and the dots do move, because that changes the lattice. <b>Reduce</b> walks the basis to the shortest one, which puts τ in the <span class="key k-gold">gold</span> region. The dashed trail shows where τ has been.</figcaption>
</figure>

The readout is the whole idea of this post in three lines. The sum $$\sum \omega^{-4}$$ and the quantity $$j$$, which we will meet shortly, are properties of the dots, and the buttons can’t touch them. The value $$E_4(\tau)$$, which is $$G_4(\tau)$$ divided by a constant that section 5 will supply, belongs to the description, and changes every time the description does.

## 3. The transformation law, derived

How exactly does it change? Any other basis of the same lattice has the form

$$\omega_2' = a\,\omega_2 + b\,\omega_1, \qquad \omega_1' = c\,\omega_2 + d\,\omega_1,$$

with integers $$a, b, c, d$$. For the new pair to generate everything the old pair did, the change must be reversible over the integers, which means $$ad - bc = \pm 1$$, and keeping the orientation means $$ad - bc = 1$$. The new ratio is

$$\tau' = \frac{\omega_2'}{\omega_1'} = \frac{a\tau + b}{c\tau + d}.$$

The lattice has not changed, so $$G_k(\Lambda)$$ has not changed. Write it in both coordinate systems:

$$\begin{aligned}
\omega_1^{-k}\, G_k(\tau) &= \omega_1'^{\,-k}\, G_k(\tau') \\
&= \omega_1^{-k}\,(c\tau + d)^{-k}\, G_k(\tau'),
\end{aligned}$$

using $$\omega_1' = \omega_1(c\tau + d)$$. Cancel $$\omega_1^{-k}$$:

$$G_k\!\left(\frac{a\tau+b}{c\tau+d}\right) = (c\tau+d)^k\, G_k(\tau).$$

That is the definition from the top of Part 1. The factor $$(c\tau + d)^k$$ is bookkeeping: it is the amount by which the first basis vector was rescaled, raised to the power that the homogeneity rule demands.

> A **modular form of weight $$k$$** is a function of lattices that is homogeneous of degree $$-k$$, written in the coordinate $$\tau$$.
{:.claim}

(The full definition adds two regularity conditions: the function must be differentiable in the complex sense, and must stay bounded as $$\tau$$ goes up the imaginary axis. The second one will matter in sections 5 and 6.)

The integer matrices with determinant 1 form a group, written $$\mathrm{SL}_2(\mathbb{Z})$$ and called the *modular group*. The two buttons in Figure 2 generate it:

$$T:\ \tau \mapsto \tau + 1, \qquad S:\ \tau \mapsto -\frac{1}{\tau}.$$

So to check that something is a modular form it is enough to check $$f(\tau + 1) = f(\tau)$$ and $$f(-1/\tau) = \tau^k f(\tau)$$.

The vocabulary is a record of this history. “Modular” goes back to the *modulus* $$k$$ of Legendre’s and Jacobi’s elliptic integrals: once the lattice took over, $$k^2$$ turned out to be a function of $$\tau$$, and Richard Dedekind called functions of this kind *Modulfunktionen*. “Form” is used in the old algebraic sense of a homogeneous expression, as in “quadratic form.” Felix Klein’s *Modulform* was literally a homogeneous function of the pair $$(\omega_1, \omega_2)$$.

## 4. The space of shapes

The gold region in Figure 2 is the set

$$\mathcal{F} = \left\{\tau :\ \lvert\tau\rvert \geq 1,\ \ \lvert \operatorname{Re}\tau\rvert \leq \tfrac12 \right\}.$$

Every lattice has a basis whose $$\tau$$ lies in it, and the recipe is geometric: let $$\omega_1$$ be a shortest nonzero vector of the lattice, and $$\omega_2$$ a shortest vector that is not a multiple of $$\omega_1$$. The **Reduce** button gets there by a version of Euclid’s algorithm. Subtract multiples of $$\omega_1$$ from $$\omega_2$$ until it is as short as possible; if it is now shorter than $$\omega_1$$, swap them; repeat. Apart from coincidences on the boundary, the reduced $$\tau$$ is unique. So $$\mathcal{F}$$ is a catalogue of the shapes of lattices with each shape listed once, and it is called a *fundamental domain*.

Applying the group to $$\mathcal{F}$$ gives the other tiles in the picture. Each tile is the same catalogue described with a different choice of basis. The tiles crowd toward the real axis, where the basis vectors are nearly parallel.

Gauss had the reduction procedure in print in 1801, in the *Disquisitiones Arithmeticae*, though in different clothing: as an algorithm for simplifying expressions $$ax^2 + bxy + cy^2$$. That such an expression is a lattice with a basis is a remark to save for Part 5. The picture came into its own with Dedekind in 1877 and with Klein, whose papers from 1878 on and whose two-volume treatise with Robert Fricke (1890–92) are full of drawings like the right half of Figure 2.

Henri Poincaré supplied the reason the picture looks the way it does. In 1880, stepping onto a bus during a geological excursion, he realised that the transformations $$\tau \mapsto (a\tau+b)/(c\tau+d)$$ are the rigid motions of the non-Euclidean plane of Bolyai and Lobachevsky, with the upper half-plane serving as a map of it. In that geometry every tile in the picture is congruent to every other. They look smaller near the bottom for the reason Greenland looks large on a Mercator map.

<figure>
  <canvas id="c-slide" class="r-wide" aria-label="The upper half-plane divided into curved triangular tiles, each carrying an identical circle with a hand. The whole pattern can be slid by a rigid motion of the non-Euclidean plane, which brings a chosen tile to the top"></canvas>
  <div class="controls">
    <button type="button" id="slide-reset">Start again</button>
    <label class="tick"><input type="checkbox" id="slide-coins" checked> a coin in every tile</label>
  </div>
  <p class="readout" id="slide-read"></p>
  <figcaption><b>Figure 3.</b> The tiling as a map that can be slid. Tap any tile. The whole plane moves by one rigid motion of the non-Euclidean geometry until that tile sits where the <span class="key k-gold">gold</span> tile began; with a mouse you can also drag the map by hand. Every tile carries a coin. All the coins are the same size in the geometry, and the hand on each shows which way it has been turned. A tile brought to the top is drawn larger and larger on the way, the gold one is drawn smaller as it leaves, and when the move is finished the pattern of tiles is exactly what it was. Nothing was stretched. The map draws the same thing smaller the nearer it is to the bottom edge.</figcaption>
</figure>

## 5. Where the integers come in

The sums $$G_k$$ of section 2 have a name. Written out in the coordinate $$\tau$$, where the lattice points are the numbers $$m + n\tau$$ with $$m$$ and $$n$$ integers,

$$G_k(\tau) = \sum_{(m,n) \neq (0,0)} \frac{1}{(m + n\tau)^k}.$$

These are the *Eisenstein series*, after the Eisenstein of section 1, who put a pole at every lattice point. For even $$k \geq 4$$ they are modular forms of weight $$k$$; that is what section 3 showed. They are also the only modular forms we have so far, and $$g_2 = 60G_4$$ and $$g_3 = 140G_6$$ are two of them. This section works out what they look like as functions of $$\tau$$.

**A modular form is a power series in one variable.** The rule for $$T$$ says $$f(\tau + 1) = f(\tau)$$. A function with period 1 has a Fourier series: it is a sum of the waves $$e^{2\pi i n\tau}$$, each with a constant coefficient. Every one of those waves is a power of the single quantity

$$q = e^{2\pi i \tau},$$

so the Fourier series is a series in powers of $$q$$:

$$f(\tau) = a_0 + a_1 q + a_2 q^2 + a_3 q^3 + \cdots.$$

(This $$q$$ is the square of Jacobi’s, which appeared at the end of Part 1.) There are no negative powers, for the following reason. The size of $$q$$ is $$e^{-2\pi y}$$, where $$y$$ is the height of $$\tau$$ above the real axis, so going up the half-plane sends $$q$$ to $$0$$. A negative power of $$q$$ would blow up there, and the second regularity condition in section 3 says that a modular form stays bounded. The number $$a_0$$ is the value the form settles to at the top of the half-plane. It is called the *constant term*, and the $$a_n$$ are the *Fourier coefficients*.

**The Fourier series of $$G_k$$, one row at a time.** Take $$k$$ even and at least 4, and sort the lattice points $$m + n\tau$$ into rows according to $$n$$. The row $$n = 0$$ is the nonzero integers, and it contributes a number that does not depend on $$\tau$$:

$$\sum_{m \neq 0} \frac{1}{m^k} = 2\left(1 + \frac{1}{2^k} + \frac{1}{3^k} + \cdots\right) = 2\,\zeta(k).$$

The rows $$n$$ and $$-n$$ contribute equal amounts, because $$k$$ is even and $$(-m - n\tau)^k = (m + n\tau)^k$$. So

$$G_k(\tau) = 2\,\zeta(k) + 2\sum_{n \geq 1}\ \sum_{m = -\infty}^{\infty} \frac{1}{(m + n\tau)^k}.$$

The inner sum is a single row, and every row is the same function evaluated at a different point: the row at height $$n$$ is $$\sum_m (z + m)^{-k}$$ with $$z = n\tau$$. That function of $$z$$ is unchanged when $$z$$ increases by 1, since this only renames $$m$$. So it has a Fourier series of its own, and this one can be found exactly.

It comes from a formula of Euler’s for the cotangent. The cotangent has a pole at every integer, and Euler showed that it is the sum of those poles:

$$\pi\cot \pi z = \frac{1}{z} + \sum_{m \geq 1}\left(\frac{1}{z+m} + \frac{1}{z-m}\right).$$

The cotangent can also be written with exponentials. Put $$w = e^{2\pi i z}$$, which has size less than 1 when $$z$$ is in the upper half-plane. Then

$$\begin{aligned}
\pi\cot \pi z &= \pi i\,\frac{w + 1}{w - 1} \\
&= -\pi i\left(1 + 2w + 2w^2 + \cdots\right),
\end{aligned}$$

a geometric series. The two right-hand sides are the same function. Differentiate both of them $$k - 1$$ times with respect to $$z$$. In the first, each $$1/(z+m)$$ becomes $$-(k-1)!/(z+m)^k$$. In the second, the constant disappears and each $$w^d = e^{2\pi i d z}$$ picks up a factor $$(2\pi i d)^{k-1}$$. After the constants are tidied,

$$\sum_{m=-\infty}^{\infty} \frac{1}{(z+m)^k} = \frac{(2\pi i)^k}{(k-1)!}\sum_{d \geq 1} d^{\,k-1}\, e^{2\pi i d z}.$$

Now put $$z = n\tau$$, so that $$e^{2\pi i d z} = q^{nd}$$, and add up the rows:

$$G_k(\tau) = 2\,\zeta(k) + \frac{2\,(2\pi i)^k}{(k-1)!}\sum_{n \geq 1}\ \sum_{d \geq 1} d^{\,k-1}\, q^{nd}.$$

**Collecting powers.** The row at height $$n$$ produces only the powers $$q^n, q^{2n}, q^{3n}, \ldots$$ So a given power $$q^N$$ turns up once for each way of writing $$N = n \cdot d$$, which is once for each divisor $$d$$ of $$N$$, and each time with coefficient $$d^{k-1}$$. Its total coefficient is

$$\sigma_{k-1}(N) = \sum_{d \,\mid\, N} d^{\,k-1},$$

the sum of the $$(k-1)$$th powers of the divisors of $$N$$. For example $$\sigma_3(6) = 1 + 8 + 27 + 216 = 252$$. So

$$G_k(\tau) = 2\,\zeta(k) + \frac{2\,(2\pi i)^k}{(k-1)!}\sum_{N \geq 1} \sigma_{k-1}(N)\, q^N.$$

**Scaling the constant term to 1.** The constant term is $$2\zeta(k)$$, and Euler evaluated these numbers as well: $$\zeta(4) = \pi^4/90$$ and $$\zeta(6) = \pi^6/945$$. Divide $$G_k$$ by its constant term and call the result $$E_k$$. The powers of $$\pi$$ cancel and whole numbers are left. For $$k = 4$$ the coefficient of the sum is $$(2\pi)^4/3!$$ divided by $$\pi^4/90$$, which is $$16 \cdot 90/6 = 240$$. For $$k = 6$$ it is $$-(2\pi)^6/5!$$ divided by $$\pi^6/945$$, which is $$-64 \cdot 945/120 = -504$$. So

$$\begin{aligned}
E_4(\tau) &= 1 + 240\sum_{n \geq 1} \sigma_3(n)\, q^n, \\
E_6(\tau) &= 1 - 504\sum_{n \geq 1} \sigma_5(n)\, q^n,
\end{aligned}$$

and the first of them begins $$E_4 = 1 + 240q + 2160q^2 + 6720q^3 + \cdots$$.

These two functions carry the rest of the series. They are the $$g_2$$ and $$g_3$$ of section 1 with the constants removed: for the lattice generated by 1 and $$\tau$$, $$g_2 = \tfrac{4}{3}\pi^4 E_4$$ and $$g_3 = \tfrac{8}{27}\pi^6 E_6$$.

Nothing arithmetic was put in. A sum over the points of a lattice was sorted into rows, and the divisors of $$N$$ appeared because $$q^n$$ and its powers are all that the row at height $$n$$ can produce. The integers came out of the lattice’s own bookkeeping.

## 6. Four functions, and a picture of each

With $$E_4$$ and $$E_6$$ in hand, two more functions are forced on us.

The cubic $$y^2 = 4x^3 - g_2 x - g_3$$ has three distinct roots exactly when $$g_2^3 - 27 g_3^2 \neq 0$$. In terms of the normalised series that quantity is a constant times

$$\begin{aligned}
\Delta &= \frac{E_4^3 - E_6^2}{1728} \\
&= q - 24q^2 + 252q^3 - 1472q^4 + \cdots,
\end{aligned}$$

a modular form of weight 12 called the *discriminant*. A genuine lattice always gives a cubic with distinct roots, so $$\Delta$$ is never zero in the upper half-plane.

That makes it safe to divide by. The quotient

$$j = \frac{E_4^3}{\Delta} = \frac{1}{q} + 744 + 196884\,q + \cdots$$

has weight $$12 - 12 = 0$$: the factors $$(c\tau + d)^{12}$$ cancel. It is not merely homogeneous but *invariant*, a true function of the shape of the lattice. Dedekind introduced it in 1877 and Klein built his theory around it. Its key property is that it takes each complex value exactly once on the fundamental domain. Two lattices have the same shape if and only if they have the same $$j$$, and every complex number is the $$j$$ of some lattice. Because lattices are cubic curves, the same statement classifies those curves: $$j$$ is a complete label for an elliptic curve up to change of coordinates.

Figure 4 draws all four over the half-plane, and it is a picture of the transformation law. The thing to compare is one tile with the next. For $$j$$, which has weight 0, nothing changes: every tile holds an identical copy. For a form of weight $$k$$, the value at the matching point of another tile is multiplied by $$(c\tau + d)^k$$, so the colours do not repeat. Two things still do. A zero multiplied by anything is still a zero, so the dark spots sit at the same place in every tile. And the size of the factor is exactly undone by the change in height: the quantity $$\lvert f(\tau)\rvert\,y^{k/2}$$, where $$y$$ is the height of $$\tau$$ above the real axis, is the same at matching points of every tile. That quantity is the brightness the figure uses. So a modular form of positive weight is not a function of the shape of the lattice, but the places where it vanishes are a property of the shape.

<figure>
  <canvas id="c-forms" class="r-wide" aria-label="The upper half-plane coloured by the value of a modular function, overlaid with the tiling by the modular group"></canvas>
  <div class="controls">
    <div class="seg" id="forms-which" role="group" aria-label="Function"><button type="button" data-v="j"><i>j</i> (weight 0)</button><button type="button" data-v="E4">E₄</button><button type="button" data-v="E6">E₆</button><button type="button" data-v="Delta">Δ (weight 12)</button></div>
    <label class="tick"><input type="checkbox" id="forms-tiling" checked> tiling</label>
  </div>
  <p class="readout" id="forms-read"></p>
  <figcaption><b>Figure 4.</b> Colour is the direction of the value and brightness its size, as in Part 1. For the three forms of positive weight the brightness uses the size multiplied by (Im τ)<sup>k/2</sup>, which is the same in every tile; the colours still differ from tile to tile because of the factor (cτ + d)<sup>k</sup>. For <i>j</i> nothing needs correcting: every tile carries an identical copy of the whole picture, each colour and brightness exactly once.</figcaption>
</figure>

With that in mind, three things to look for.

**In $$j$$,** follow one colour, say red, the positive real numbers. Inside each tile it appears along a single curve running from the corners to infinity. Every tile contains every value once.

**In $$E_4$$,** the dark spots sit at $$\rho = e^{2\pi i/3}$$ and its copies, the points where three tiles meet at each side. The lattice there is the hexagonal one, which is unchanged when multiplied by $$\rho$$. Homogeneity then says $$G_4 = \rho^{-4} G_4$$, and since $$\rho^{-4} \neq 1$$, the value must be zero. **In $$E_6$$** the zeros are at $$i$$ and its copies, the square lattice, by the same argument with a quarter turn: $$G_6 = i^{-6}G_6 = -G_6$$. The square lattice has $$g_3 = 0$$, as Figure 1 showed. A symmetry of the lattice forces a zero of the form.

**In $$\Delta$$** there are no dark spots at all, only a steady dimming toward the top of each tile.

## 7. There are very few modular forms

Counting those dark spots leads to the fact that makes the theory useful. By integrating around the boundary of the fundamental domain, one shows that a nonzero modular form of weight $$k$$ has exactly $$k/12$$ zeros in $$\mathcal{F}$$, provided a zero at $$i$$ is counted as a half, a zero at $$\rho$$ as a third, and the order of vanishing in $$q$$ at the top of the domain is included. Check it against the picture: $$E_4$$ has its one zero at $$\rho$$, and $$4/12 = 1/3$$. $$E_6$$ has one at $$i$$, and $$6/12 = 1/2$$. $$\Delta$$ begins with $$q^1$$ and has no others, and $$12/12 = 1$$.

A fixed budget of zeros leaves almost no freedom. The consequences:

- There are no modular forms of odd weight, of negative weight, or of weight 2.
- Every modular form is a polynomial in $$E_4$$ and $$E_6$$.
- The forms of weight $$k$$ make up a finite-dimensional vector space. Its dimension is 1 for $$k = 0, 4, 6, 8, 10, 14$$ and 2 for $$k = 12$$, and grows by one every time $$k$$ increases by 12.

Finite-dimensionality converts coincidences into theorems. Here is the standard first example. $$E_4^2$$ has weight 8. So does the Eisenstein series $$E_8 = 1 + 480\sum \sigma_7(n) q^n$$. The space of weight-8 forms is one-dimensional and both begin with 1, so they are equal. Comparing coefficients of $$q^n$$ on the two sides:

$$\sigma_7(n) = \sigma_3(n) + 120\sum_{m=1}^{n-1} \sigma_3(m)\,\sigma_3(n-m).$$

Try $$n = 2$$: the divisors of 2 give $$\sigma_7(2) = 1 + 128 = 129$$ and $$\sigma_3(2) = 9$$, and the right side is $$9 + 120 \cdot 1 \cdot 1 = 129$$. This is a statement about sums of divisors with no visible connection to lattices or elliptic functions, and its proof is that a certain vector space has dimension one.

## 8. Where this leaves us

By 1890 the definition was in place and the main examples understood. A modular form is a homogeneous function of lattices; the modular group is the ambiguity in describing a lattice; the transformation law is bookkeeping; and there are so few modular forms of each weight that two of them with the same first few coefficients must coincide.

One thing from Part 1 has not been translated yet. Jacobi’s *transformations*, the substitutions relating elliptic integrals of different moduli, are in lattice terms very simple: a transformation of order $$n$$ relates a lattice to a *sublattice* that contains one out of every $$n$$ of its points. Sublattices are the other natural thing to do with a lattice besides rescaling it, and they turn out to control the arithmetic of the Fourier coefficients.

Part 3 is about those coefficients: what they count, why Ramanujan’s guesses about them were true, and what sublattices have to do with it.

<p class="mf-next">Next: <a href="/2026/11/26/modular-forms-3-coefficients.html">Part 3, What the Coefficients Count</a></p>

## Sources

1. J.-P. Serre, *A Course in Arithmetic* (Springer, 1973), chapter VII. The lattice-function point of view, the count of zeros, and the structure theorem, in twenty pages.
2. F. Diamond and J. Shurman, *A First Course in Modular Forms* (Springer, 2005), chapter 1.
3. J. Gray, *Linear Differential Equations and Group Theory from Riemann to Poincaré*, 2nd ed. (Birkhäuser, 2000). Dedekind, Klein and Poincaré, with the original figures.
4. G. Eisenstein, Genaue Untersuchung der unendlichen Doppelproducte, aus welchen die elliptischen Functionen als Quotienten zusammengesetzt sind, *Journal für die reine und angewandte Mathematik* 35 (1847). A. Weil’s *Elliptic Functions according to Eisenstein and Kronecker* (Springer, 1976) is a modern reading.
5. R. Dedekind, Schreiben an Herrn Borchardt über die Theorie der elliptischen Modulfunctionen, *Journal für die reine und angewandte Mathematik* 83 (1877), 265–292.
6. F. Klein and R. Fricke, *Vorlesungen über die Theorie der elliptischen Modulfunctionen*, 2 vols. (Teubner, 1890–92).
7. H. Poincaré, *Science et méthode* (1908), book I, chapter 3, for the bus at Coutances.
{:.src}

How the figures are computed. To evaluate a modular form at $$\tau$$, the code first reduces $$\tau$$ into the fundamental domain, where $$\lvert q\rvert < 0.005$$ and ten terms of the $$q$$-series are more than enough, then multiplies by the factor $$(c\tau+d)^{-k}$$ from the reduction. So the transformation law is not just illustrated; the pictures are drawn with it. A separate script checks the result against direct summation of the series, and checks $$j(i) = 1728$$, $$j(\rho) = 0$$, $$j(\sqrt{-2}) = 8000$$. The Weierstrass function is computed from its $$q$$-series and checked against its differential equation.
{:.aside}

<script src="/scripts/2026-11-26-modular-forms/js/mf-core.js?v={{ site.time | date: '%s' }}"></script>
<script src="/scripts/2026-11-26-modular-forms/js/mf-kit.js?v={{ site.time | date: '%s' }}"></script>
<script src="/scripts/2026-11-26-modular-forms/js/part2.js?v={{ site.time | date: '%s' }}"></script>
