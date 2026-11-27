---
title: "Why Paramodular? (modular forms, part 6 of 6)"
date: 2026-11-26 09:01:00 -0500
custom_excerpt: |
  Part 6 of 6. The paramodular group, the conjecture that made people care about it, and a 2018 twist calculation replayed.
tag: slop
---
<link rel="stylesheet" href="/scripts/2026-11-26-modular-forms/series.css">
<script>/* This post typesets its own formulas with the KaTeX the site already loads; tell the site's MathJax not to do them a second time. */ (function () { var c = { skipStartupTypeset: true }; if (window.MathJax && window.MathJax.Hub) window.MathJax.Hub.Config(c); else window.MathJax = c; })();</script>

Curves with two holes have point counts too, and the conjecture that a modular form governs them needed the right notion of “level.” The answer, the paramodular group, leads to Fourier coefficients that are hard to look up and harder to twist. That is the computation Beau Horenberger worked on in 2018, and this part ends by replaying it.
{:.dek}

Written by Claude. The last part of a series that continues Beau Horenberger’s [History of Modular Forms 1](https://horenbergerb.github.io/2020/08/08/modularforms.html) (2020). It ends at his 2018 paramodular twist project and can be read as its background.
{:.by}

{% include modular-forms/nav.html part=6 %}

<div class="mf-timeline" data-part="6"></div>

Two threads from earlier parts meet here.

[Part 4](/2026/11/26/modular-forms-4-curves.html) was about curves with one hole. A cubic equation with rational coefficients has a *conductor* $$N$$, a whole number recording the primes where the equation misbehaves. Counting its solutions modulo each prime $$p$$ gives numbers $$a_p$$, and the modularity theorem says those numbers are the coefficients of a modular form of weight 2 and *level* $$N$$: a function $$f(\tau)$$ on the upper half-plane obeying $$f\bigl(\tfrac{a\tau+b}{c\tau+d}\bigr) = (c\tau+d)^2 f(\tau)$$ whenever $$c$$ is divisible by $$N$$.

[Part 5](/2026/11/26/modular-forms-5-genus-two.html) was about curves with two holes. In place of $$\tau$$ there is a symmetric two-by-two matrix $$\Omega$$; in place of the modular group there is the group $$\mathrm{Sp}_4(\mathbb{Z})$$ of four-by-four integer matrices; and a *Siegel modular form* is a function $$F(\Omega)$$ with the analogous transformation rule. Its Fourier coefficients are indexed not by whole numbers but by *binary quadratic forms* $$[a, b, c]$$, meaning expressions $$ax^2 + bxy + cy^2$$.

The question is whether Part 4 has a two-hole version.

## 1. A curve of genus 2, counted

Here is a curve of genus 2 with small coefficients:

$$C:\quad y^2 + (x^3 + x^2 + x + 1)\,y = -x^2 - x.$$

Count its points modulo $$p$$ as in Part 4. One count per prime turns out not to be enough. The natural object attached to a curve of genus 2 is its Jacobian, the four-real-dimensional torus of Part 5, and for a two-dimensional complex torus the factor contributed by each prime to the L-function has degree four where an elliptic curve’s has degree two:

$$1 - a_p T + b_p T^2 - p\,a_p T^3 + p^2 T^4, \qquad T = p^{-s}.$$

There are two unknowns, $$a_p$$ and $$b_p$$, and they are pinned down by two counts: the number of points with coordinates in the integers modulo $$p$$, and the number with coordinates in the field with $$p^2$$ elements, which is to the integers modulo $$p$$ what the complex numbers are to the reals.

<figure>
  <canvas id="c-277" class="r-wide" aria-label="Left: the solutions of the genus 2 curve modulo p on a grid. Right: the numbers a_p for primes up to 300, between the curves plus and minus four root p"></canvas>
  <div class="controls">
    <label class="short">Prime <select id="c277-p" aria-label="Prime p"></select></label>
  </div>
  <p class="readout" id="c277-read"></p>
  <div class="table-wrap" id="c277-table"></div>
  <figcaption><b>Figure 1.</b> Left: solutions of the equation modulo the chosen prime. Right: <i>a<sub>p</sub></i> for primes up to 300, inside the dashed bound ±4√<i>p</i>, the genus-2 version of Hasse’s bound. The table adds the count over the field with <i>p</i>² elements and the resulting factor. Its last column gives the numbers printed in the 2019 paper cited below for a certain Siegel modular form, where I have them; they are compared with this page’s counts and shown in <span class="key k-teal">green</span> when they agree.</figcaption>
</figure>

The conductor of this curve’s Jacobian is 277, a prime. The last column of the table is the subject of the rest of this section and the next two: there is a modular form whose data matches these counts, and the task is to say what kind of modular form and of what level.

That some Siegel modular form of weight 2 should correspond to a surface like this one was conjectured by Hiroyuki Yoshida in 1980. What remained unclear for a long time was the level.

## 2. What should “level N” mean?

For the ordinary modular group there is essentially one natural family of subgroups indexed by $$N$$, the matrices with lower-left entry divisible by $$N$$. [Part 3](/2026/11/26/modular-forms-3-coefficients.html) gave it a meaning: these are the changes of basis that respect a lattice together with a marked sublattice.

For four-by-four matrices there is more room, and several inequivalent families of subgroups compete. One can ask for the lower-left two-by-two block to be divisible by $$N$$, or just its bottom row, or various other patterns. Each gives a legitimate theory of “Siegel modular forms of level $$N$$.” The one that turned out to match the arithmetic is not obtained by imposing divisibility on $$\mathrm{Sp}_4(\mathbb{Z})$$ at all. It is

$$K(N) = \left\{ \begin{pmatrix} * & N* & * & * \\ * & * & * & */N \\ * & N* & * & * \\ N* & N* & N* & * \end{pmatrix} \right\},$$

where each $$*$$ stands for a whole number and the matrix must preserve the same alternating pairing as before. One entry is allowed a denominator. This is the *paramodular group* of level $$N$$. (Conventions for writing it differ from paper to paper by a relabelling of coordinates.)

Like every group in this series it is the answer to a change-of-basis question. In Part 5 the four loops on a surface with two holes had a crossing pattern: $$a_1$$ crosses $$b_1$$ once and $$a_2$$ crosses $$b_2$$ once. Abstractly, that is a rule assigning a whole number to each pair of vectors in the period lattice, and Riemann’s relations say the rule is compatible with the complex structure. Most two-dimensional complex tori admit no such compatible pairing, and those cannot be described by polynomial equations. The ones that do are the abelian surfaces. A compatible pairing can always be brought to a standard shape in which

$$a_1 \text{ crosses } b_1 \text{ once}, \qquad a_2 \text{ crosses } b_2 \ N \text{ times},$$

for some whole number $$N \geq 1$$, after removing any common factor. The case $$N = 1$$ is the one that comes from curves, and its changes of basis are $$\mathrm{Sp}_4(\mathbb{Z})$$. For other $$N$$, the changes of basis that preserve the pairing form the paramodular group $$K(N)$$. So a *paramodular form of level $$N$$* is a function of lattices in two-dimensional complex space carrying a pairing of this type, homogeneous in the sense of Part 2. It is the idea of Part 2 for the third time.

These groups were studied as part of the theory of abelian varieties in the 1950s. The name is usually credited to Goro Shimura in 1958. They were a side branch for decades.

A caution, parallel to one in Part 4. The level-11 form there lived on the space of lattices with a marked sublattice of index 11, but the elliptic curve it corresponds to is not itself “a lattice with a marked sublattice.” The same holds here. The Jacobian of the curve $$C$$ above has a pairing of the plain type, $$N = 1$$. The claim will be that its *form* lives at paramodular level 277. Level is where the form lives, and it is tied to the conductor of the surface, not to the type of the surface’s own pairing.

### Why this group and not the others

Two pieces of evidence, one structural and one numerical.

The structural one is a theorem of Brooks Roberts and Ralf Schmidt from 2007. Recall from Part 4 that Atkin and Lehner defined *newforms*, the forms that genuinely first appear at level $$N$$, and that this is what makes “a curve of conductor $$N$$ corresponds to a newform of level exactly $$N$$” a meaningful statement. Behind that lies a fact about each prime separately: looking at the groups of level $$p, p^2, p^3, \ldots$$ in turn, for the objects that matter here there is a first level at which a suitable vector appears, that level equals the conductor, and the vector is unique up to scaling. Roberts and Schmidt proved the same three statements for the four-by-four case, with the paramodular groups $$K(p^n)$$ as the tower. No other family of subgroups is known to have all three properties. If level is to equal conductor, the level has to be paramodular.

The numerical one came from two computations of different kinds that could be laid side by side. Armand Brumer and Kenneth Kramer were classifying abelian surfaces over the rationals with small conductor, proving for many values of $$N$$ that none exists. Cris Poor and David Yuen were computing spaces of paramodular forms of weight 2 and prime level. Most such forms are *lifts*, manufactured from modular forms in one variable by a construction of Valeri Gritsenko, and lifts are known not to correspond to surfaces. For prime levels below 600, Poor and Yuen found that forms other than lifts can exist only at

$$277,\ 349,\ 353,\ 389,\ 461,\ 523,\ 587.$$

Those are the prime conductors below 600 at which Brumer and Kramer knew abelian surfaces.

## 3. The paramodular conjecture

Brumer and Kramer stated the conjecture in a paper circulated in 2010 and published in 2014.

> **Paramodular conjecture (Brumer and Kramer).** Abelian surfaces over the rational numbers of conductor $$N$$, having no extra symmetries, correspond to paramodular newforms of weight 2 and level $$N$$ that have rational Hecke eigenvalues and are not lifts. The L-function of the surface, built from point counts as in Figure 1, equals the L-function of the form.
{:.claim}

It is the statement of the modularity theorem of Part 4 with every term replaced by its degree-2 counterpart. (As first stated it was slightly too strong in one direction. Frank Calegari pointed out that some forms on the right-hand side correspond to four-dimensional objects with a special symmetry, and the statement was amended to include them.)

The first case to be proved was the smallest. In 2019 Brumer, Ariel Pacetti, Poor, Gonzalo Tornaría, John Voight and Yuen showed that the Jacobian of the curve $$C$$ in section 1 corresponds to the unique non-lift paramodular form of weight 2 and level 277. Their method reduces the equality of two infinite lists to a finite check: if the factors agree for every prime up to 43, they agree for all primes. The table in Figure 1 stops at 43 for that reason, and its last column is the form’s side of the comparison for the primes where the paper prints it. They treated levels 353 and 587 the same way.

Weight 2 is what makes this hard. For large weights there are formulas for the dimensions of spaces of Siegel modular forms and direct ways to construct their elements. Weight 2 is below the range where those methods work. Poor and Yuen’s form of level 277 is written as a quotient: a quadratic expression in ten Gritsenko lifts divided by a linear one, with a proof that the quotient has no poles.

General results have come more recently. In work published in 2021, George Boxer, Calegari, Toby Gee and Vincent Pilloni proved that every abelian surface over the rationals becomes modular after passing to a suitable larger number field. In February 2025 the same four posted a proof that a positive proportion of abelian surfaces over the rationals are modular outright, under conditions on the behaviour at the primes 2 and 3. The full conjecture is open.

## 4. The lookup problem

Now to the Fourier coefficients, which is where Beau’s project lived.

A paramodular form of level $$N$$ has a Fourier expansion like any Siegel form. In the convention of the papers discussed below, its coefficients $$a[a, b, c]$$ are indexed by positive binary quadratic forms whose first entry $$a$$ is divisible by $$N$$.

Part 5 explained that a Siegel form for the full group has equal coefficients at equivalent forms, where equivalent means related by a substitution

$$x \mapsto px + qy, \qquad y \mapsto rx + sy, \qquad ps - qr = 1,$$

so that a table needs only one entry per class, at the reduced form found by Gauss’s algorithm. At level $$N$$ the symmetry is smaller. Only the substitutions with $$r$$ divisible by $$N$$ are available. These are the matrices of $$\Gamma_0(N)$$, the level-$$N$$ group of Part 3, appearing now in a second role, as symmetries of the index set. With fewer substitutions allowed, fewer forms are identified. Two indices that Gauss’s algorithm sends to the same reduced form can belong to different classes at level $$N$$ and carry different coefficients. A table keyed by the reduced form would return wrong answers.

How does one level-1 class split? There is a clean description. Let $$T_0$$ be the reduced form. Every form in its class is $$T_0$$ after some substitution, and the first entry of the new form is the value of $$T_0$$ at the pair $$(p, r)$$, the first column of the substitution. So the forms in the class with first entry divisible by $$N$$ come from columns $$(p, r)$$ at which $$T_0$$ vanishes modulo $$N$$. And two substitutions differ by an allowed level-$$N$$ substitution exactly when their first columns agree modulo $$N$$ up to a common factor. Columns modulo $$N$$ up to a common factor are the points of the projective line over the integers modulo $$N$$, the same finite set that labelled the sublattices in Part 3.

> At level $$N$$, the classes lying over a reduced form $$T_0$$ are the points $$(x : y)$$ of the projective line modulo $$N$$ at which $$T_0(x, y)$$ is divisible by $$N$$, with points identified when a symmetry of $$T_0$$ carries one to the other.
{:.claim}

<figure>
  <canvas id="c-roots" class="r-band" aria-label="The points of the projective line modulo N arranged in a ring, with the points where the quadratic form vanishes filled in"></canvas>
  <div class="controls">
    <label class="short">Level <i>N</i> <select id="roots-N" aria-label="Level N"><option>2</option><option>3</option><option>4</option><option>5</option><option>7</option><option>9</option><option selected>11</option><option>13</option><option>17</option><option>25</option><option>81</option><option>277</option></select></label>
    <label class="short"><i>a</i> <input type="number" id="roots-a" value="1"></label>
    <label class="short"><i>b</i> <input type="number" id="roots-b" value="0"></label>
    <label class="short"><i>c</i> <input type="number" id="roots-c" value="18"></label>
    <button type="button" data-rform="1,0,18">[1, 0, 18]</button>
    <button type="button" data-rform="2,0,9">[2, 0, 9]</button>
    <button type="button" data-rform="1,1,1">[1, 1, 1]</button>
    <button type="button" data-rform="2,1,3">[2, 1, 3]</button>
  </div>
  <p class="readout" id="roots-read"></p>
  <figcaption><b>Figure 2.</b> The ring is the projective line modulo <i>N</i>. A point is filled when the reduced form vanishes there modulo <i>N</i>. Each filled point (or each colour, when the form has symmetries) is one class of indices at level <i>N</i>, and the readout gives a representative with first entry divisible by <i>N</i>. For a prime <i>N</i> that does not divide the discriminant there are either two filled points or none, according to whether the discriminant is a square modulo <i>N</i>. When the weight is even, a form and its mirror image [<i>a</i>, −<i>b</i>, <i>c</i>] also share a coefficient, which pairs up some classes.</figcaption>
</figure>

Try level 277 with a few forms. Most of the time the count is two or zero, and the representatives have large entries, which is the practical nuisance: to use a table of a level-277 form you must decide, for an index with five-digit entries, which stored class it belongs to.

The first part of Beau’s 2018 summer project was about this. His report computes the number of ways of extending level-$$N$$ substitutions to all substitutions, which is the number of points on the ring in the figure, and lists them for prime-power levels, with a C++ program to produce one substitution for each. In the description above, those are the candidates to be tested against the form. In January 2026, Jennifer Johnson-Leung, who supervised the project, and Roberts released a full reduction theory “with level”: an algorithm giving each class at any level a canonical representative with small entries, benchmarked on ten thousand indices at level 277. The [preprint and software](https://doi.org/10.5281/zenodo.18317010) are public.

## 5. Twisting

The reason anyone needed to look up thousands of coefficients was *twisting*.

Recall the last section of Part 4. Inserting a number $$d$$ into the equation of an elliptic curve gives its twist, whose point counts are the original ones with signs $$\chi(p) = \pm1$$ attached. The modular form of the twist has coefficients $$\chi(n)a_n$$. It is a weighted sum of copies of the original form shifted by fractions, and its level goes up from $$N$$ to $$Nd^2$$.

A curve of genus 2 can be twisted the same way, and its counts change the same way: $$a_p$$ becomes $$\chi(p)a_p$$ and $$b_p$$ is unchanged. Its conductor is multiplied by the fourth power, since the degree-four factor of section 1 has four roots where an elliptic curve’s factor has two. The paramodular conjecture therefore predicts that for each paramodular form $$F$$ of level $$N$$ and each sign pattern $$\chi$$ modulo a prime $$p$$, there is a paramodular form $$F_\chi$$ of level $$Np^4$$.

Johnson-Leung and Roberts constructed $$F_\chi$$ directly, in a paper circulated in 2014 and published in 2017. As in Part 4 the construction starts from copies of $$F$$ shifted by fractions with denominator $$p$$. But $$\Omega$$ is a matrix, there are several directions to shift in, and a plain weighted sum of shifted copies does not have the right symmetry. The combination that works is more elaborate, and proving that it works takes a paper of a hundred pages.

In Part 4, the effect of twisting on coefficients was trivial to state: multiply the $$n$$th by $$\chi(n)$$. That was possible because the index $$n$$ was a number and a shift acted on $$q^n$$ by a simple factor. Here the index is a quadratic form, and the answer is a theorem. Its statement, in a companion paper, has five cases depending on which entries of the index are divisible by which powers of $$p$$. In the first case, for an index $$S = [a, b, c]$$ with $$p^4$$ dividing $$a$$ and $$p$$ not dividing $$b$$, the coefficient of the twisted form is

$$a_\chi(S) = p^{\,1-k}\,\chi(b)\sum_{t=1}^{p-1} \chi(t)\; a\bigl(S_t\bigr),$$

where $$k$$ is the weight and $$S_t$$ is the form obtained from $$S$$ by the substitution $$x \mapsto x - \tfrac{t}{p}\,y,\ \ y \mapsto p\,y$$. (An overall constant, the Gauss sum $$W$$ of Part 4, has been divided out, as the authors do.) Set it beside Part 4’s formula $$f_\chi(\tau) = \tfrac{1}{W}\sum_t \chi(t) f(\tau + t/p)$$. It has the same skeleton: a sum over $$t$$ from 1 to $$p-1$$, weighted by $$\chi(t)$$, of the original object shifted by $$t/p$$.

To *use* the formula, each $$S_t$$ has to be found in the table of the original form $$F$$. It will not be stored under that name. It has to be reduced, by the method of Part 5 if $$F$$ has level 1, or by the harder method of section 4 above if $$F$$ has level $$N$$. That is the connection between the two halves of the project.

### The calculation, replayed

The companion paper works one example. The form $$F$$ is a Siegel modular form of weight 20 and level 1, for which tables of coefficients have been published. The prime is 3, so $$\chi(1) = 1$$ and $$\chi(2) = -1$$, and the twisted form has level $$3^4 = 81$$. Everything below is computed on this page from the formula, except the two table values in step 4.

<figure>
  <canvas id="c-twist" class="r-band" aria-label="The upper half-plane with the fundamental domain, and the reduction paths of the two quadratic forms that arise in the twist calculation"></canvas>
  <div class="readout" id="twist-read"></div>
  <figcaption><b>Figure 3.</b> The picture shows step 3. Each shifted index is a point low in the upper half-plane, and Gauss’s algorithm walks it into the <span class="key k-gold">shaded</span> fundamental domain, where the table can be read. Each dot is the position after one swap of the two variables, shown after shifting sideways by a whole number into the central strip. Heights are drawn on a compressed scale so that both ends of the walk fit. The two table values are from the published coefficients of the form, as used in the paper and in the project’s test data.</figcaption>
</figure>

One nonzero coefficient is enough to prove that the twist of this form is not identically zero, which is what the paper wanted from the example. The archived Python solver from Beau’s and Kirk Bonney’s project reproduces this calculation, including the two lookups under their reduced names.

The project’s target was not this weight-20 example. It was weight 2, where the forms correspond to surfaces. The same 2019 paper that proved the conjecture at level 277 used the twisting theorems to go further: since the twist of the level-277 form is again paramodular and matches the twist of the surface, infinitely many twisted surfaces are modular as well. Computing the coefficients of those twisted forms means running the six steps above with a level-277 table, where step 3 is the lookup problem of section 4.

## 6. The whole arc

In January 1797 Gauss began studying an integral he could not evaluate. Inverting it gave a function with two periods ([Part 1](/2026/11/26/modular-forms-1-two-periods.html)). The two periods span a lattice, and asking for functions of a lattice that do not depend on how it is described gives modular forms ([Part 2](/2026/11/26/modular-forms-2-lattices.html)). Their coefficients count lattice points and multiply, because of heat flow and sublattices ([Part 3](/2026/11/26/modular-forms-3-coefficients.html)). In weight 2 they count points on cubic curves ([Part 4](/2026/11/26/modular-forms-4-curves.html)). The next integral up has four periods, which forces two complex variables, a matrix in place of $$\tau$$, and quadratic forms in place of whole numbers as indices ([Part 5](/2026/11/26/modular-forms-5-genus-two.html)). Matching those functions to curves with two holes needs the paramodular group, and working with them needs a reduction theory for quadratic forms with level.

Gauss’s 1801 book contains one sentence about the first step of this path and five long chapters about its last ingredient, the reduction of binary quadratic forms, with no sign that he saw any connection. A summer spent enumerating the points of a projective line modulo $$N$$ in C++ sits at the place where the two meet.

Each stage was one idea used again. A period lattice has no preferred basis. A function that respects that is modular. The basis changes that respect extra structure give a level. The series took that idea from one hole to two, and the mathematics does not stop there, but that is where the conjecture that motivated Beau’s project lives.

## Sources

1. A. Brumer and K. Kramer, [Paramodular abelian varieties of odd conductor](https://arxiv.org/abs/1004.4699), *Transactions of the American Mathematical Society* 366 (2014), 2463–2516, with a corrigendum (2019) incorporating Calegari’s remark.
2. C. Poor and D. S. Yuen, [Paramodular cusp forms](https://arxiv.org/abs/0912.0049), *Mathematics of Computation* 84 (2015), 1401–1438. The list of prime levels below 600 is also in Poor’s [survey for RIMS](https://www.kurims.kyoto-u.ac.jp/~kyodo/kokyuroku/contents/pdf/2100-17.pdf).
3. A. Brumer, A. Pacetti, C. Poor, G. Tornaría, J. Voight and D. S. Yuen, [On the paramodularity of typical abelian surfaces](https://arxiv.org/abs/1805.10873), *Algebra & Number Theory* 13 (2019), 1145–1195. The curve of section 1, the eigenvalues and factors quoted in Figure 1, the bound 43, and the application of twisting.
4. B. Roberts and R. Schmidt, *Local Newforms for GSp(4)*, Lecture Notes in Mathematics 1918 (Springer, 2007).
5. J. Johnson-Leung and B. Roberts, [Twisting of Siegel paramodular forms](https://arxiv.org/abs/1404.4596), *International Journal of Number Theory* 13 (2017), 1755–1854; [Fourier coefficients for twists of Siegel paramodular forms](https://arxiv.org/abs/1505.05463), *Journal of the Ramanujan Mathematical Society* 32 (2017), 101–119, Theorem 3.1 and the worked example; [Reduction theory for binary quadratic forms with level](https://doi.org/10.5281/zenodo.18317010) (preprint and software, 2026).
6. G. Boxer, F. Calegari, T. Gee and V. Pilloni, Abelian surfaces over totally real fields are potentially modular, *Publications mathématiques de l’IHÉS* 134 (2021), 153–501; [Modularity theorems for abelian surfaces](https://arxiv.org/abs/2502.20645) (preprint, 2025).
7. H. Yoshida, Siegel’s modular forms and the arithmetic of quadratic forms, *Inventiones Mathematicae* 60 (1980), 193–248.
8. B. Horenberger and K. Bonney, [SiegelParamodularTwists](https://github.com/horenbergerb/SiegelParamodularTwists) (2018–2020), and the [2018 conference abstract](https://scholarworks.boisestate.edu/icur/2018/Poster_Session/60/) for the project it grew from.
9. On the name: G. Shimura, Modules des variétés abéliennes polarisées et fonctions modulaires, *Séminaire Henri Cartan* 10 (1957–58).
{:.src}

How the figures are computed. Points of the genus-2 curve are counted by trying every pair of elements of the field, with the field of $$p^2$$ elements built as pairs of residues. A separate script checks that the two published models of the curve give identical counts and that the counts reproduce the published values of $$a_p$$ for $$p = 2, 3, 5, 7, 11$$ and of $$b_p$$ for $$p = 2, 3, 5$$. The splitting in Figure 2 is computed from the description in the text. I have not compared it against the 2026 software, and the statement about mirror images in the caption is the standard symmetry for even weight, not something this page verifies against a table. Figure 3 uses the general reduction routine from Part 5 and the two coefficients 2,256,995,864,880 and −4,329,978,670,800 from the project’s test data.
{:.aside}

<script src="/scripts/2026-11-26-modular-forms/js/mf-core.js"></script>
<script src="/scripts/2026-11-26-modular-forms/js/mf-kit.js"></script>
<script src="/scripts/2026-11-26-modular-forms/js/part6.js"></script>
