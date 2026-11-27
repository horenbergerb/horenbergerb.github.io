---
title: "An Integral with Two Periods (modular forms, part 1 of 6)"
date: 2026-11-26 09:06:00 -0500
custom_excerpt: |
  Part 1 of 6. An arc length nobody could integrate turns out to hide a function that repeats in two directions at once.
tag: slop
---
<link rel="stylesheet" href="/scripts/2026-11-26-modular-forms/series.css?v={{ site.time | date: '%s' }}">
<script>/* This post typesets its own formulas with the KaTeX the site already loads; tell the site's MathJax not to do them a second time. */ (function () { var c = { skipStartupTypeset: true }; if (window.MathJax && window.MathJax.Hub) window.MathJax.Hub.Config(c); else window.MathJax = c; })();</script>

Around 1800 an arc length that nobody could integrate turned out to hide a function that repeats in two directions at once. Modular forms are what you get by taking that discovery seriously for two centuries.
{:.dek}

Written by Claude, picking up Beau Horenberger’s [History of Modular Forms 1](https://horenbergerb.github.io/2020/08/08/modularforms.html) and [Elliptic Functions Revisited](https://horenbergerb.github.io/2020/11/18/ellipticcurvessequel.html) (2020).
{:.by}

{% include modular-forms/nav.html part=1 %}

<div class="mf-timeline" data-part="1"></div>

A modular form is usually introduced by its definition: a function $$f$$ on the upper half of the complex plane that satisfies

$$f\!\left(\frac{a\tau+b}{c\tau+d}\right) = (c\tau+d)^k\, f(\tau)$$

for all integers $$a, b, c, d$$ with $$ad - bc = 1$$. Nobody would write that condition down unprompted, and nobody did. It was found, piece by piece, by people who were trying to compute the length of a curve. This series follows the trail in six parts. It ends at Siegel paramodular forms, the objects behind a computation Beau worked on as an undergraduate in 2018, and the last part explains that computation with everything before it in hand.

This first part covers the years 1718 to 1829. It ends with one fact: the natural functions attached to these arc lengths are *doubly periodic*, and each one comes with a parallelogram that describes it. The rest of the series is about that parallelogram.

## 1. An arc length that would not integrate

Start with the circle. If a point on the unit circle is at height $$x$$, the arc from the horizontal up to that point has length

$$\arcsin x = \int_0^x \frac{dt}{\sqrt{1-t^2}}.$$

The integral has no formula in terms of polynomials and roots. Mathematicians dealt with that by giving it a name and tabulating it. The more useful function is the inverse: the sine takes an arc length and returns a height, it has a clean power series, and it repeats with period $$2\pi$$.

In 1694 Jacob Bernoulli, whose study of how an elastic rod bends had led him to the integral below, introduced a figure-eight curve whose arc length it measures. He named it the *lemniscate*. It is the set of points whose distances to two fixed points have a constant product, and in polar coordinates its equation is $$r^2 = \cos 2\theta$$. Its arc length is one line of calculus. Differentiating the equation gives $$r\,dr = -\sin 2\theta\, d\theta$$, and $$\sin^2 2\theta = 1 - r^4$$, so

$$ds^2 = dr^2 + r^2\,d\theta^2 = dr^2\left(1 + \frac{r^4}{1-r^4}\right) = \frac{dr^2}{1-r^4}.$$

The arc from the crossing point out to distance $$r$$ is therefore

$$s = \int_0^r \frac{dt}{\sqrt{1-t^4}}.$$

This looks like the arcsine with one exponent changed. It behaves very differently. No change of variables turns it into anything known, and in the 1830s Joseph Liouville proved that none can. For a century before that proof, people worked on it anyway, because integrals of this shape kept appearing: in the elastic rod, in the period of a pendulum, in the length of an ellipse. They were named *elliptic integrals* after the last of those, which is why a subject that is mostly not about ellipses has “elliptic” in every other term.

## 2. Relating what you cannot integrate

The first real result was not about evaluating the integral. In 1718 Count Giulio Fagnano found that you can *double* a lemniscate arc with algebra alone. If the point at distance $$r$$ marks off an arc of length $$s$$, then the point that marks off the arc $$2s$$ is at distance

$$\frac{2r\sqrt{1-r^4}}{1+r^4}.$$

Compare the circle, where a point at height $$x$$ doubles to height $$2x\sqrt{1-x^2}$$, which is $$\sin 2s = 2\sin s\cos s$$ written without naming the sine. Fagnano had found the same kind of law for a curve whose arc length nobody could write down.

On 23 December 1751 the Berlin Academy sent Fagnano’s collected works to Leonhard Euler to referee. Within weeks Euler had the general version: for any two arcs, the distance for the sum is

$$z = \frac{x\sqrt{1-y^4} + y\sqrt{1-x^4}}{1 + x^2y^2}.$$

That is an addition theorem, the analogue of $$\sin(a+b) = \sin a\cos b + \cos a\sin b$$. Carl Jacobi later called the day Euler received the book the birthday of the theory of elliptic functions. The slogan in Beau’s second post for this stage is “if you can’t integrate ’em, relate ’em,” and it is exact: the integral stays unknown, but its values at different points are tied to each other by algebra.

In the figure below, the same arc length $$s$$ is laid along both curves. The lemniscate’s arc starts at the crossing point. Turn on the doubled arc and compare the readout: the number from Fagnano’s expression, which uses only the distance, matches the number measured from the doubled arc.

<figure>
  <canvas id="c-arcs" class="r-wide" aria-label="A circle and a lemniscate with the same arc length marked on each, and below them the graphs of the sine and the lemniscate sine"></canvas>
  <div class="controls">
    <label>Arc length <i>s</i> <input type="range" id="arcs-s" min="0" max="12.566" step="0.002" value="0.9" aria-label="Arc length s"></label>
    <label class="tick"><input type="checkbox" id="arcs-dbl" checked> show the doubled arc</label>
  </div>
  <p class="readout" id="arcs-read"></p>
  <figcaption><b>Figure 1.</b> The <span class="key k-blue">blue</span> arc on the circle and the <span class="key k-red">red</span> arc on the lemniscate have the same length <i>s</i>. The black segments are what each curve’s “sine” measures: the height of the point on the circle, and the straight-line distance from the crossing point on the lemniscate (counted negative on the left loop). The <span class="key k-gold">gold</span> dots mark the arc 2<i>s</i>. Below, both functions plotted against <i>s</i>. You can also drag the red point.</figcaption>
</figure>

The lower panel of the figure is ahead of the story. It plots distance as a function of arc length, which is the inverse of the integral. Nobody had thought to do that yet.

## 3. Turning the integral around

The entry in Carl Friedrich Gauss’s mathematical diary for 8 January 1797, when he was nineteen, reads:

> I have begun to examine thoroughly the lemniscate curve, which depends on $$\int \frac{dx}{\sqrt{1-x^4}}$$.
> <cite>Gauss, diary entry 51. In the manuscript the word <i>elasticam</i> is crossed out and <i>lemniscatam</i> written in its place.</cite>
{:.src-quote}

What he did was treat the integral the way the arcsine is treated: as the inverse of the function you actually want. Define the *lemniscate sine* $$\operatorname{sl}$$ by

$$\operatorname{sl}(s) = r \quad\text{whenever}\quad s = \int_0^r \frac{dt}{\sqrt{1-t^4}}.$$

So $$\operatorname{sl}$$ takes an arc length and returns a distance, just as $$\sin$$ takes an arc length and returns a height. Going once around the whole figure-eight brings you back to the start, so $$\operatorname{sl}$$ is periodic. Its period is the total length of the curve. Gauss wrote that length as $$2\varpi$$, using a variant form of the letter pi, where

$$\varpi = 2\int_0^1 \frac{dt}{\sqrt{1-t^4}} = 2.62205755\ldots$$

<div class="table-wrap"><table>
<tr><th></th><th>Circle</th><th>Lemniscate</th></tr>
<tr><td>the integral</td><td>\(\displaystyle\arcsin x = \int_0^x \frac{dt}{\sqrt{1-t^2}}\)</td><td>\(\displaystyle\int_0^x \frac{dt}{\sqrt{1-t^4}}\)</td></tr>
<tr><td>its inverse</td><td>\(\sin s\), period \(2\pi\)</td><td>\(\operatorname{sl} s\), period \(2\varpi\)</td></tr>
<tr><td>the constant</td><td>\(\pi = 3.14159\ldots\)</td><td>\(\varpi = 2.62206\ldots\)</td></tr>
<tr><td>the companion</td><td>\(\cos s = \sin(\tfrac{\pi}{2} - s)\)</td><td>\(\operatorname{cl} s = \operatorname{sl}(\tfrac{\varpi}{2} - s)\)</td></tr>
<tr><td>the identity</td><td>\(\sin^2 + \cos^2 = 1\)</td><td>\(\operatorname{sl}^2 + \operatorname{cl}^2 + \operatorname{sl}^2\operatorname{cl}^2 = 1\)</td></tr>
<tr><td>doubling</td><td>\(\sin 2s = 2 \sin s \cos s\)</td><td>\(\displaystyle\operatorname{sl} 2s = \frac{2\operatorname{sl} s\,\operatorname{sl}' s}{1 + \operatorname{sl}^4 s}\)</td></tr>
</table></div>

In this language Fagnano’s and Euler’s formulas stop being curiosities about integrals and become ordinary identities for a new function. The square root in Fagnano’s expression is $$\operatorname{sl}'$$, the derivative, which changes sign as the point passes the tip of a loop. That is the sign the figure’s readout is quietly tracking.

Gauss published none of this. The only public trace is one sentence in his 1801 book *Disquisitiones Arithmeticae*, in the section on dividing the circle into equal parts, remarking that the same principles apply “to many other transcendental functions, for example to those which depend on the integral $$\int dx/\sqrt{1-x^4}$$.” That sentence is what sent Niels Henrik Abel looking, twenty-five years later. Keep the *Disquisitiones* in mind. Most of the book is about something that seems unrelated, the arithmetic of expressions $$ax^2 + bxy + cy^2$$, and that thread comes back in Part 5 to meet this one.

## 4. The clue: too many roots

Two months into the work, Gauss wrote down a question.

> Why dividing the lemniscate into $$n$$ parts leads to an equation of degree $$n^2$$.
> <cite>Gauss, diary entry 60, 19 March 1797.</cite>
{:.src-quote}

Here is what he had noticed. For the circle, the triple-angle formula $$\sin 3s = 3\sin s - 4\sin^3 s$$ lets you find $$\sin s$$ from $$\sin 3s$$ by solving a cubic. A cubic has three roots, and they make sense: they are the sines of the three arcs $$s$$, $$s + \tfrac{2\pi}{3}$$, $$s + \tfrac{4\pi}{3}$$, all of which triple to the same place. For the lemniscate, Euler’s addition theorem gives

$$\operatorname{sl} 3s = \frac{\operatorname{sl} s\,\bigl(3 - 6\operatorname{sl}^4 s - \operatorname{sl}^8 s\bigr)}{1 + 6\operatorname{sl}^4 s - 3\operatorname{sl}^8 s},$$

and finding $$\operatorname{sl} s$$ from $$\operatorname{sl} 3s$$ means solving an equation of degree nine. Three of its roots are the expected ones, from the arcs $$s$$, $$s + \tfrac{2\varpi}{3}$$, $$s + \tfrac{4\varpi}{3}$$. The other six are not real numbers at all. Cutting into five parts gives degree twenty-five, with twenty roots unaccounted for.

Gauss was the right person to be bothered by this. Two years later he would give the first accepted proof that a polynomial has as many complex roots as its degree, and he did not think of complex roots as debris. If the equation has nine roots, then there are nine arcs, and six of them are complex numbers. So the function $$\operatorname{sl}$$ has to make sense for complex arc lengths.

It does, and the integral shows how. Substitute $$t = iu$$:

$$\int_0^{ir} \frac{dt}{\sqrt{1-t^4}} = i\int_0^{r} \frac{du}{\sqrt{1-u^4}},$$

because $$(iu)^4 = u^4$$. An imaginary distance corresponds to an imaginary arc of the same size, so

$$\operatorname{sl}(is) = i \operatorname{sl}(s).$$

Now use the period. Since $$\operatorname{sl}(s + 2\varpi) = \operatorname{sl}(s)$$ for real arcs, the last identity gives $$\operatorname{sl}(s + 2\varpi i) = \operatorname{sl}(s)$$ as well. The lemniscate sine has a second period, and it points straight up the imaginary axis. A function of a complex variable with two independent periods repeats like wallpaper. No function with that property had been seen before.

The figure shows $$\operatorname{sl}$$ over the complex plane, drawn by *domain colouring*: each point $$z$$ is painted with a colour for the direction of the complex number $$\operatorname{sl}(z)$$ and a brightness for its size. Dark spots are zeros and bright spots are places where the function blows up. Switch to the ordinary sine to see what a function with a single period looks like for comparison.

<figure>
  <canvas id="c-plane" class="r-wide" aria-label="The complex plane coloured by the value of the lemniscate sine, showing a pattern that repeats in two directions"></canvas>
  <div class="controls">
    <div class="seg" id="plane-mode" role="group" aria-label="Function"><button type="button" data-v="sl">sl <i>z</i></button><button type="button" data-v="sin">sin <i>z</i></button></div>
    <span class="ctl-name">Divide into</span>
    <div class="seg" id="plane-n" role="group" aria-label="Number of parts"><button type="button" data-v="1">off</button><button type="button" data-v="3">3 parts</button><button type="button" data-v="5">5 parts</button><button type="button" data-v="7">7 parts</button></div>
    <label class="tick"><input type="checkbox" id="plane-cells" checked> period cells</label>
  </div>
  <p class="readout" id="plane-read"></p>
  <figcaption><b>Figure 2.</b> Colour shows the direction of the value (the wheel in the corner is the key) and brightness its size, with a step each time the size doubles. For sl the white grid marks the true period cells and the dashed square is the 2ϖ by 2ϖ<i>i</i> square from the argument above. The dots are every point <i>z</i> at which the function of <i>nz</i> equals its value at the black diamond <i>u</i>: <span class="key k-gold">gold</span> on the real axis, white off it. Drag the diamond.</figcaption>
</figure>

With the picture in front of you the mystery of the nine roots is gone. Asking for $$\operatorname{sl}(3z) = \operatorname{sl}(u)$$ means $$3z$$ may differ from $$u$$ by any period, and there are now two directions of period to choose from: $$z = \tfrac{1}{3}\bigl(u + 2\varpi a + 2\varpi i\, b\bigr)$$ with $$a$$ and $$b$$ each running over three values. That is a three-by-three grid of solutions, nine in all, of which the three with $$b = 0$$ are real. Divide by $$n$$ and the grid is $$n$$ by $$n$$. On the sine’s plane the same recipe has only one direction to move in and produces $$n$$ points, all real.

Gauss’s diary shows he had this within days. Two entries later he recorded that the lemniscate can be divided into five equal parts by ruler and compass, and the hint he printed in 1801 came from here: the theory he had built for dividing the circle, which produced the regular 17-gon, carried over to the lemniscate once the complex division points were in view.

One detail of the picture answers a loose end in the 2020 post, which derived the second period, noticed it had the same length as the first, and wondered whether that was a mistake. It was not. The two periods have equal length and meet at a right angle because the integrand does not change when $$t$$ is replaced by $$it$$. The lemniscate’s wallpaper has a square pattern for the same reason a square has a quarter-turn symmetry. What the argument above does miss is that $$2\varpi$$ and $$2\varpi i$$ are not the smallest periods. Moving by $$\varpi$$ alone flips the sign, $$\operatorname{sl}(z + \varpi) = -\operatorname{sl}(z)$$, and so does moving by $$\varpi i$$, so moving by $$\varpi + \varpi i$$ changes nothing. The true cells are the diamonds in the figure, each half the area of the dashed square, and each holds two zeros and two poles.

On 29 March, ten days after the question about degree $$n^2$$, Gauss wrote $$\operatorname{sl}$$ as a quotient of two series that converge everywhere, computed the value of the denominator at $$\varpi$$ as 4.810480, and noticed that its natural logarithm was 1.570796, which is $$\pi/2$$. He called this “most remarkable.” It is the first time a number like $$e^{\pi}$$ shows up in this subject. From Part 2 on, such numbers are everywhere, under the name $$q$$.

## 5. Computing the period

A function is only as useful as your ability to compute it, and $$\varpi$$ is defined by an integral with a singularity at its endpoint. Gauss had been playing since his teens with a process he called the *arithmetic-geometric mean*: start with two positive numbers, replace them by their arithmetic mean and their geometric mean, and repeat.

$$a_{n+1} = \frac{a_n + b_n}{2}, \qquad b_{n+1} = \sqrt{a_n b_n}.$$

The two numbers rush together; the number of correct digits roughly doubles at each step. Starting from $$1$$ and $$\sqrt2$$, four steps give the common limit $$1.19814023\ldots$$ On 30 May 1799 he divided $$\pi$$ by $$\varpi$$, got the same digits, and wrote:

> We have established that the arithmetic-geometric mean between 1 and $$\sqrt2$$ is $$\pi/\varpi$$ to the eleventh decimal place; the demonstration of this fact will surely open an entirely new field of analysis.
> <cite>Gauss, diary entry 98.</cite>
{:.src-quote}

He proved it within the year, in a general form. For any $$k$$ between 0 and 1,

$$K(k) = \int_0^1 \frac{dt}{\sqrt{(1-t^2)(1-k^2t^2)}} = \frac{\pi}{2\,M\!\left(1, \sqrt{1-k^2}\right)},$$

where $$M$$ is the arithmetic-geometric mean. The integral on the left is the general elliptic integral of this family, with a parameter $$k$$ called the *modulus*. Hold on to that word; it is where “modular” comes from. The lemniscate is the case $$k^2 = -1$$, which can be converted to $$k = 1/\sqrt2$$. The figures on this page compute every period with this formula.

## 6. What the second period means

Abel and Jacobi rediscovered the inversion independently and published in 1827 to 1829, in a race that produced Abel’s *Recherches sur les fonctions elliptiques* and Jacobi’s *Fundamenta Nova*. They worked with a general modulus. Inverting the integral above gives a function $$\operatorname{sn}(u)$$, the *elliptic sine*, which depends on $$k$$ and has two periods:

$$4K \quad\text{and}\quad 2iK', \qquad\text{where } K' = K\!\left(\sqrt{1-k^2}\right).$$

The lemniscate was special in having a square pattern. In general the real period and the imaginary period have different lengths, and their ratio depends on $$k$$.

An imaginary period sounds like a formal accident, so it is worth seeing one in a physical system. A pendulum released from rest at angle $$\theta_0$$ obeys $$\ddot\theta = -\sin\theta$$, in units where a small swing has period $$2\pi$$. Its motion is exactly an elliptic sine:

$$\sin\frac{\theta(t)}{2} = k \operatorname{sn}(t + K), \qquad k = \sin\frac{\theta_0}{2}.$$

The real period $$4K$$ is the time of one full swing. It grows with the amplitude, which is the old observation that a pendulum is not quite isochronous. Putting the two formulas together gives a tidy statement: the period of a pendulum is $$2\pi$$ divided by the arithmetic-geometric mean of 1 and $$\cos(\theta_0/2)$$.

Now let time be imaginary. Replacing $$t$$ by $$it$$ flips the sign of the second derivative, so the equation becomes $$\ddot\theta = +\sin\theta$$. That is the same pendulum with gravity pointing up. Released from the same position, it now falls *away* from the bottom, swings over the top, and comes back, and the time this takes is $$4K'$$. Paul Appell pointed this out in 1878. The imaginary period of the elliptic function is a real period of the same machine in a mirrored world.

<figure>
  <canvas id="c-pend" class="r-wide" aria-label="A pendulum swinging under ordinary gravity and under reversed gravity, beside a rectangle whose sides are the two periods"></canvas>
  <div class="controls">
    <label>Release angle <input type="range" id="pend-a" min="5" max="175" step="1" value="60" aria-label="Release angle in degrees"></label>
    <button type="button" id="pend-run">Pause</button>
  </div>
  <p class="readout" id="pend-read"></p>
  <figcaption><b>Figure 3.</b> Left: the <span class="key k-blue">blue</span> bob swings under ordinary gravity; the <span class="key k-red">red</span> bob is released from the same angle with gravity reversed. Right: the height of the bob, as a function of complex time, repeats on this rectangle. Its width 2K is half a blue swing (the bob is back at the same height) and its height 2K′ is half a red swing. Try 90°, and try the two ends of the slider.</figcaption>
</figure>

Three settings of the slider are worth a look.

At **90°**, a pendulum released from horizontal, the two periods are equal and the rectangle is a square. This is the lemniscate’s shape. The two problems share an elliptic function up to scaling, which is not obvious from a swinging weight and a figure-eight.

At **small angles** the rectangle becomes very tall: $$K \to \pi/2$$ while $$K' \to \infty$$. The reversed pendulum, released just beside its unstable balance point, takes forever to get going. In the limit the second period is gone and the motion is $$\sin t$$. The trigonometric functions have one period because they are the degenerate case of functions with two, where one period has moved off to infinity.

Near **180°** it is the real period that runs away, for the same reason with the roles exchanged.

So the modulus $$k$$ is a dial that changes the *shape* of the period rectangle. Different physical or geometric problems that land on the same shape are governed by the same function.

## 7. Where this leaves us

In a century the object of study changed twice. First it was an integral, to be evaluated. Then, with Gauss, Abel and Jacobi, it was the inverse function, with its addition theorem and its two periods. By 1830 it was becoming clear that the two periods themselves, the parallelogram they span, carried most of the information. The modulus $$k$$ of the integral only matters through the shape of that parallelogram.

Jacobi pushed this furthest in the *Fundamenta Nova*. Much of that book, which Beau’s 2020 post works through, is about *transformations*: algebraic substitutions that turn an elliptic integral with one modulus into an elliptic integral with another. In hindsight each of Jacobi’s transformations is a relationship between two period parallelograms, one of which fits inside the other a whole number of times. He also found that his functions could be written as quotients of rapidly converging series in the quantity $$q = e^{-\pi K'/K}$$, which depends only on the shape of the rectangle. Those series are the theta functions, and they return in Part 3.

Part 2 makes the change of viewpoint official. Forget the integral, forget the curve, and start with the grid of periods. Ask which functions of a grid make sense. The answer is where the strange transformation rule at the top of this page comes from.

<p class="mf-next">Next: <a href="/2026/11/26/modular-forms-2-lattices.html">Part 2, A Lattice Has No Preferred Basis</a></p>

## Notes on the 2020 posts

Three points where this account differs from the earlier ones, or settles something they left open.

**Which integral gets inverted.** The first post suggests Gauss inverted the arc length of the ellipse. The ellipse’s arc length is an elliptic integral of the *second kind*, and its inverse has no good properties. The functions in this story invert integrals of the *first kind*, the ones with nothing but a square root in the denominator. The lemniscate is the lucky curve whose arc length is of the first kind, which is one reason it and not the ellipse was the way in.

**The second period.** The post’s closing to-do list doubts the derivation of a second period equal in size to the first. Section 4 above confirms it and adds the diagonal period that the derivation misses.

**Whether the substitutions fit a bigger picture.** The second post works through Fagnano’s substitution in the language of differential forms and asks whether “hopping between manifolds” by substitutions that multiply the form $$dt/\sqrt{1-t^4}$$ by a constant is the right way to see it. It is. In the coordinate $$s$$, the form is just $$ds$$, the curve is the plane rolled up along its two periods, and adding arcs is ordinary addition of complex numbers. Fagnano’s substitution is the map $$s \mapsto 2s$$, and it pulls $$ds$$ back to $$2\,ds$$. A map between two such rolled-up planes that multiplies $$ds$$ by a constant is called an *isogeny*. Jacobi’s transformations are isogenies, and in Part 3 they become the Hecke operators.

## Sources

1. C. F. Gauss, *Mathematisches Tagebuch 1796–1814*, entries 51, 60, 62, 63 and 98, with the commentary of F. Klein and L. Schlesinger in *Werke* X.1 (1917). [Scan of the commented edition](https://webspace.science.uu.nl/~wepst101/elliptic/GaussTagebuch.pdf). The translations here are mine, from the Latin.
2. D. A. Cox, The arithmetic-geometric mean of Gauss, *L’Enseignement Mathématique* 30 (1984), 275–330. The standard account of what Gauss knew and when.
3. J. Stillwell, *Mathematics and Its History*, 3rd ed. (Springer, 2010), chapter 12. Fagnano, Euler, and the lemniscate.
4. J. Gray, *The Real and the Complex: A History of Analysis in the 19th Century* (Springer, 2015), chapters 3 to 9.
5. C. L. Siegel, *Topics in Complex Function Theory*, vol. 1 (Wiley, 1969), chapter 1. Fagnano’s substitution done slowly.
6. P. Appell, Sur une interprétation des valeurs imaginaires du temps en Mécanique, *Comptes Rendus* 87 (1878), 1074–1077.
7. B. Horenberger, [History of Modular Forms 1: The First Era, 1800s](https://horenbergerb.github.io/2020/08/08/modularforms.html) and [Elliptic Functions Revisited](https://horenbergerb.github.io/2020/11/18/ellipticcurvessequel.html) (2020).
{:.src}

How the figures are computed. The lemniscate sine is evaluated for complex arguments as a quotient of two theta series with $$q = e^{-\pi}$$, which converge in five terms. A separate script checks it against the integral, against $$\operatorname{sl}'^2 = 1 - \operatorname{sl}^4$$, and against Fagnano’s formula. Periods come from the arithmetic-geometric mean. The pendulums are integrated numerically over one period and replayed; the script confirms that each returns to its starting state after the period the formula predicts. Mathematics is typeset with KaTeX.
{:.aside}

<script src="/scripts/2026-11-26-modular-forms/js/mf-core.js?v={{ site.time | date: '%s' }}"></script>
<script src="/scripts/2026-11-26-modular-forms/js/mf-kit.js?v={{ site.time | date: '%s' }}"></script>
<script src="/scripts/2026-11-26-modular-forms/js/part1.js?v={{ site.time | date: '%s' }}"></script>
