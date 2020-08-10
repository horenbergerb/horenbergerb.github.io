# History of Modular Forms 1: The First Era, 1800s

## 0.0 Introduction

The goal of this series of posts is to tell a story about the discovery of modular forms. Many people worked on math which was either directly or indirectly related to this topic. Because of this, any narrative about the "origin" of modular forms is bound to be incomplete. However, being wrong has never stopped me before, and it won't stop me now. I intend to highlight some of the tangible issues that led an era of mathematicians to get disproportionately interested in theta functions and modular forms. Please don't view this as an authoritative history, but rather as one of many possible narratives. This is also meant to be a soft introduction to some of the mathematics used in the study of modular forms.

In this entry of the series, we're exploring the 1800s, where astronomical investigations and inovations in analysis as well as complex numbers caused the discovery and investigation of elliptic functions. This set the stage for future investigation regarding general properties among sets of transcendental functions.

In the next post, we will see that Felix Klein's attempts to express relations among these elliptic functions would lead to the discovery of even more interesting functions, such as the j-function.

Following that, the next post will attempt to touch on the work of Erich Hecke, who expanded Klein's discovery into the more robust theory of modular forms.

Technically, you could follow most of this with Calculus I-III experience, but it will help a lot to be familiar with real analysis as well as the basics of complex numbers (and maybe a teeny bit of complex analysis).

Please do not expect this post to be accurate or useful, but hope that it will at least be fun.

## 1.0) Historical Context: Who, What, When, Where, Why?

### 1.1) The Soft Context

We'll start by excluding the mathematical history and focus on physics and cultural context.

The rabbit-hole of modular forms began with elliptic functions at the start of the 1800s, $\pm 30$ years. It was the twilight years of the Enlightenment Era, about a century after Newton's Principia and 20 years after Euclid's death. The telescope had been used by Galileo 200 years ago, but innovations by Newtons and others during the 1700s greatly improved the quality of observations.

Kepler's laws had been published around 1600, again nearly 200 years ago, and they gave an excellent approximation of the behaviors of heavenly bodies. However, it was Newton's innovations near 1700 that had fit Kepler's laws into a larger physics framework.

The implications of Newton's theories had been an extremely popular topic over the last 100 years, and the fact that they so neatly explained the movement of heavenly bodies captivated not just the scientific community, but also many political figures. Colleges and dukes alike were willing to pay mathematicians and astronomers (careers which frequently overlapped) to collect astronomical data and determine the orbits of bodies. You would have a very happy duke if you discovered an asteroid, named it after the duke, and predicted when it would next be seen in the sky.

This is all to say that every academic was tempted to dip into the field of astronomy. Many of them did. On the astronomical playing field of the era one could find Euler, Legendre, Gauss, Poisson, Laplace, Bessel, and Mobius. Additionally, many mathematicians, such as Jacobi and Abel, were interested in the theoretical issues behind astronomical and other physical problems. These two figures will be relevant to us later.

### 1.2) The Mathematical Context

#### 1.2a) Analysis and Transcendental Functions

A number of great mathematical innovations had occurred during the 1600s-1700s. One of the most notable was the development of the theory of calculus/analysis, including infinite series.

We will focus on a particular innnovation related to our upcoming astronomical investigations. Mathematicians had long been familiar with the transcendental functions like $\sin{x}$, $\tan{x}$, and $e^x$. However, our understanding was limited. Particularly, we could not represent them as elementary algebraic expressions.

This gap was bridged largely by innovations with infinite series and analysis. There were two major steps. Firstly, for all three of these examples, it was found that their inverses could be expressed as integrals of algebraic expressions:

<div>
$$\log(x+1)=\int_{0}^{x}\frac{dt}{1+t}, \quad \text{sin}^{-1}x=\int_{0}^{x}\frac{dt}{\sqrt{1-t^2}}, \quad \text{tan}^{-1}x=\int_{0}^{x}\frac{dt}{1+t^2}$$
</div>

Each of these integrals can be expanded into power series. The second step, then, was to take the inverse of the power series using Newton's method of series inversion. This yielded an explicit power series for $\sin{x}$, $\cos{x}$, and $e^x$, which gave a much more tangible perspective on these transcendental functions. See 9.5 and 10.2 in *Mathematics and its History* (sources listed below) for more details.

So in summary, our first contextual point was that analysis was being used to get explicit power series of common transcendental functions by working on their inverse.

It's also worth keeping in mind that mathematicians generally didn't know whether every integral could be solved in terms of elementary algebra, $\sin{x}$, $\cos{x}$, and $e^x$. There was still room to believe that every integral was explicitly solvable, which led mathematicians to be quite interested in integrals that would eventually be proven unsolvable by Liouville around 1830. This caused a development in "function theoretic" methods (not functional analysis), meaning the practice of making mathematical statements about functions that don't have an explicit expression.

#### 1.2b) Complex Numbers

Complex numbers have an extremely long history of being despised and ignored by mathematicians. They originated from one of the oldest hobbies of mathematics: solving polynomial equations. Since the era of the Babylonians around 1500BC, nerds were solving for $x$ in quadratic equations like $x^2+3x+1=0$. I can't tell you why this was so popular, except that this was a natural way to extend intutive geometric problems like the area of a square given the length of its sides.

Nevertheless, solving quadratic equations is an ancient practice, and consequently so our neglect of $\sqrt{-1}$. The traditional mindset was that these solutions to quadratics were nonsense because they didn't have a geometrical meaning, so no one did arithmetic with $\sqrt{-1}$.

It wasn't until the end of the 1500s that Bombelli faced up to a serious problem. Cardano's formula for the roots of cubics necessarily required doing algebra with $\sqrt{-1}$, even for roots that were real and had geometric meaning. Despite the practical value of his methods, complex numbers continued to be neglected as a field of study.

At the start of the 1700s, complex numbers began to pop up when solving problems such as angle division, making their utility harder to ignore. Finally, towards the end of the 1700s, d'Alembert and Gauss both produced significant results on the geometric intuition of complex numbers as well as the Fundamental Theorem of Algebra, which helped make complex numbers more widely accepted and popular.

However, there is another development with complex numbers during the mid-1700s that is more relevant to our discussion. In particular, it was discovered that complex numbers could relate many of the transcendental functions. Recall from before that 

<div>
$$\log(x+1)=\int_{0}^{x}\frac{dt}{1+t}, \quad \text{tan}^{-1} x=\int_{0}^{x}\frac{dt}{1+t^2}$$
</div>

It was Bernoulli who observed, surprisingly, that if one was willing to work with $\sqrt{-1}$, then

<div>
$$\frac{d z}{1+z^{2}}=\frac{d z}{2(1+z \sqrt{-1})}+\frac{d z}{2(1-z \sqrt{-1})}$$
</div>

What is being said here? By integrating, one can see that

<div>
$$\text{tan}^{-1}z=\frac{1}{2 i} \log \frac{i-z}{i+z}$$
</div>

This is to say that the inverse trigonometric functions are deeply related to logarithms, thus uniting many transcendental functions in a way which had never been done before.

This culminated in Euler's formula in 1748:

<div>
$$e^{i x}=\cos{x}+ i \sin{x},$$
</div>

The value of these discoveries was two-fold. Part of their value was that they made computation with the common transcendental functions much easier. The other part of their value was that it brought all the popular transcendental functions closer together on a theoretical level, allowing us to analyze them collectively.

In summary, the key point here is that complex numbers showed us new ways to interrelate transcendental functions, and they often provided intuitive solutions to practical problems that would be difficult to recreate using only real numbers.

## 2.0) Kinds of Elliptic Integrals: Gotta Catch 'em All

### 2.1) Second Kind: Astronomy and Ellipses

We next discuss Gauss's astronomical investigations, which led him to investigate one kind of elliptic function about 30 years before Jacobi and Abel published works on a more general theory of elliptic functions.

Although the physics was 100 years old, the theory of astronomy was booming at the end of the 1700s due to the analytical innovations of Euler and others. New data was being collected en masse from sightings of astronomical objects such as planets and asteroids. Those who could calculate the paths of these objects and predict their return were guaranteed repute and a decent paycheck. Thus much of the efforts were focused on mathematical techniques to turn sets of observations into a function for the object's position over time.

Deriving this function depended on the fact that the theory of gravity proposed orbiting objects should follow elliptical paths. We'll pass over the physics of this and focus on the nature of ellipses.

An *ellipse* is defined on a plane by selecting two points, $F_1$ and $F_2$, as well as some constant $h$. Then the ellipse is the set of all points such that for each point $x$, the sum of the distance from $x$ to $F_1$ and $x$ to $F_2$ is equal to $h$.

The picture below is an example from Wikipedia of such an ellipse with many common vocabulary terms illustrated.

[<img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Ellipse-def0.svg">](wikipedia.com)

As a fun fact, the constant $h$ is equal to twice the distance from the center of the ellipse to the vertex. This is also a demonstration that many defined properties of the ellipse can be equated, thus there are many equivalent perspectives from which you can talk about an ellipse.

In order to make your life less fulfilling, standard practice is to characterize an ellipse not with the constant $h$ as we have been doing. Instead, we use the constant called *eccentricity*, $k$, which is defined as the ratio of the focus to the center vs the vertex to the center. If our vertex is $V$ and our center is $C$, then $k=\vert F_1 C \vert / \vert VC \vert$. This is simply because this constant is more convenient in future calculations. 

One can create an equation that defines the points of an ellipse:

<div>
$$\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1$$
</div>

Notice that this is unsurprisingly similar to the equation for a circle.

In this case, our eccentricity can be shown to be 

<div>
$$k=\sqrt{1-\left(\frac{b}{a}\right)^{2}}$$
</div>

One can also convert this to a polar parameterization, $(r(\theta), \theta)$ for $0 \leq \theta < 2\pi$. This is achieved by substitution. We will particularly be interested in solving $r(\theta)$ in terms of $\theta$.

To make this conversion, note that $x = r(\theta)\cos{\theta}$ and $y = r(\theta)\sin{\theta}$. Substituting,

<div>
$$\left(\frac{r(\theta)\cos{\theta}}{a}\right)^2 + \left(\frac{r(\theta)\cos{\theta}}{b}\right)^2 = 1 \quad \implies \quad r(\theta) = \frac{ab}{\sqrt{(b\cos{\theta})^2 + (a\sin{\theta})^2}}$$
</div>

So we have the mathematical language to talk about ellipses. My goal in this next two sections is to move towards the mathematics of elliptic functions while also answering the question, "Why would an astronomer do this?"

### Motivating Studies of Arc Length/Elliptic Integrals with Trigonometry

For a function $f:[a,b]\rightarrow \mathbb{R}$, the length of the curve defined by $f$ is

<div>
$$L(f)=\int_{a}^{b}\left|f^{\prime}(t)\right| d t$$
</div>

It's a short and disgusting algebraic leap to apply this to an elliptic curve. We will use polar coordinates. The length traversed along the ellipse of eccentricity $k$ by sweeping out an angle $\phi$ is

<div>
$$E(\phi, k)=\int_{0}^{\phi} \sqrt{1-k^{2} \sin ^{2} \theta} \mathrm{d} \theta$$
</div>

This is called the *elliptic integral of the second kind*. So, it's worth noting here that we made the arc length a function of both $\phi$ and the parameter $k$. There are a few reasons for this. The first reason is "because we can." The second (and better) reason is "because it's useful." But why? In fact, why are we talking about arc length of an ellipse at all? Who cares?

That is an excellent question. Why did the astronomers of the early 1800s such as Gauss get so obsessed with arc length of the ellipse?

Here is one rationalization. When Gauss was working with ellipses, he probably thought about generalizing the methods used on circles, the simplest kind of ellipse.

One of the virtues of circles is that they are described so neatly by standard trig functions. One key example: parameterizing a circle with the trig functions is extremely convenient: $(\cos{t}, \sin{t})$. It's even more convenient when you consider that $\cos{t} = \frac{d}{dt}\sin{t}$, so the two functions can be neatly derived from each other.

How might we create an analogous concept of $\sin$ and $\cos$ for an ellipse instead of the circle? As we've discussed before, the clearest picture of the trig functions comes from inverting the series expansion of their inverses. For example, with $\sin{x}$,

<div>
$$\text{sin}^{-1}x=\int_{0}^{x}\frac{dt}{\sqrt{1-t^2}}$$
</div>

This inverse has a series expansion, and the series expansion can be inverted fairly easily to give us a series expansion for $\sin{x}$.

But wait! Here is an interesting observation: $\text{sin}^{-1}x$ *is the arc length of the circle*. In fact, that's why it's commonly called "arcsin." So these useful trig tools are derived from the arc length integral!

So maybe, just maybe, Gauss thought about treating the elliptic integral of the second kind (i.e. the arc length of an ellipse) as if it were some generalized inverse trig function. This obviously sounds like it could yield valuable tools for working with ellipses.

As a consequence, it seems very obvious that we would now be interested in the inverse of elliptic integrals of the second kind. Somewhat counter-intuitively, the inverse of the elliptic integral would actually be analogous to $\sin{x}$, while the integral itself is analogous to $\text{sin}^{-1} x$

Additionally, we can see why Gauss (and Jacobi and Abel after him) would be interested in fitting complex numbers into the picture. They reduced standard trig quite neatly, so perhaps they would do the same here!

It's clear that elliptic integrals of the second kind and their inverses would be of practical interest among both mathematicians and physicists. But this isn't the whole story. Indeed, there are also a first and third kind of elliptic integral. These, too, appear in physics problems. We'll look at an example of the first kind next.

### 2.2) First Encounter With Another Kind of Elliptic Integral

Before we'd go on, I'd like to present one more major definition. An *elliptic function* is the inverse of an elliptic integral. I don't who chose such a vague name for this concept. Just keep in mind our goal of generalizing trigonometry to other curves. The elliptic functions and elliptic integrals are analogies to $\sin{x}$ and $\text{sin}^{-1} x$, respectively. Anyways, back to the story.

While ellipses were relevant to astronomers, physicists and mathematicians were running into different curves in their own studies. Many of these curves had arc length integrals which resembled the arc lengths of circles and ellipses.

Gauss, among others, realized the common theme and took advantage of it. In fact, his first successful investigations of elliptic functions used a simple non-ellipse curve which we will explore now.

Before we go on, I warn you that our poor choice of vocabulary is going to haunt us from here on out. The first and third kinds of elliptic integral are derived from curves that are not ellipses. For this reason, the nomenclature "elliptic integral" is disappointingly misleading.

But enough general talk. Let's get an example. I present to you the equation for the *lemniscate of Bernoulli*:

<div>
$$\left(x^{2}+y^{2}\right)^{2}=a^2(x^{2}-y^{2})$$
</div>

It can also be represented with polar coordinates:

<div>
$$r^{2}=\cos 2 \theta$$
</div>

This thing is a monstrous creation Bernoulli Frankenstein'ed together by taking inspiration from elliptic equations. We also define the lemniscate in a way similar to our definition of the ellipse. Given two foci, $F_1$ and $F_2$, and a distance $2a$ between them, then the lemniscate of Bernoulli is the set of all points P such that $\vert PF_1 \vert * \vert PF_2 \vert = a^2$.

But enough talk. Let's look at some pictures (courtesy of Wikipedia):

[<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Lemniskate_bernoulli2.svg/660px-Lemniskate_bernoulli2.svg.png">](wikipedia.com)

This handsome bastard is the lemniscate, and we're once again interested in the formula for its arc length.

We can parameterize this curve like before and use this parameterization to derive the arc length. If you're interested in this process, see [this link][9] or the exercises of section 12.3 in *Mathematics and its History* in the sources below.

The punchline is that the arc length of the lemniscate would be either

<div>
$$\int_{0}^{x} \frac{d t}{\sqrt{1-t^{4}}}$$
</div>

or

<div>
$$\sqrt{2} a \int_{0}^{\tau}[3-\cos (2 t)]^{-1 / 2} d t$$
</div>

depending on your parameterization. Either way, it so happens that his gives us an *elliptic integral of the first kind*. As a gentle reminder, "elliptic" is a misnomer, since we're now talking about some other kind of curve.

You may be wondering why Gauss would take interest in this curve. Although similar, it's not obviously a simpler than elliptic integrals of the second kind. Well, one motivation might be because these particular integrals had already been studied by others, including Euler and Fagnano. As an example, Fagnano generalized the fact that

<div>
$$2\text{sin}^{-1}(x) = \text{sin}^{-1}(2x\sqrt{1-x^2})$$
</div>

to the analogous $\text{sin}^{-1}$ defined on the lemniscate of Bernoulli. We'll denote the "lemniscatic inverse sine" as $\text{sl}^{-1}(x)$, and it's defined using the arc length integral:

<div>
$$\text{sl}^{-1}(x)=\int_{0}^{x} \frac{d t}{\sqrt{1-t^{4}}}$$
</div>

Then Fagnano derived the fact that

<div>
$$2\text{sl}^{-1}(x) = \text{sl}^{-1}(2 x \sqrt{1-x^{4}} /(1+x^{4}))$$
</div>

This clear analogue to $\text{sin}^{-1}$ suggested that there may be utility in exploring these generalized trig functions.

So we can see one reason Gauss might have been tempted to investigate this integral. The integral obviously had practical properties similar to standard trigonometry, and it was similar to integrals which appeared in his own practical work.

Rather than explore an example of the third kind of elliptic integral, we'll next discuss Legendre's effort to describe the entire set of integrals which appear similar to the definition of $\text{sin}^{-1}$. We won't spend much more time discussing elliptic integrals. Instead, we will discuss their inverses, elliptic functions. Between 1800 and 1830, mathematicians slowly came to realize that elliptic functions had even more spectacular properties than elliptic integrals.

### 2.3) The Classification of Elliptic Integrals

We have described two kinds of elliptic integral, but we haven't clearly explained why they are distinct and how we're categorizing them. This problem was addressed by Legendre, [who described the integrals of interest generally and used this to show any case could be reduced to one of three kinds][8]. You can also get info on this in section 3.2 of [this book][4], which I'm practically quoting here.

Legendre described the general integral as

<div>
$$\int \frac{P d x}{R}$$
</div>

where $P$ is a rational function of $x$ and $R$ is the square root of a quartic. Everything we've discussed so far is a particular case of this integral.

Legendre showed that any integral of this form can be simplified to the form

<div>
$$\int \frac{Q d t}{\sqrt{\left(1-t^{2}\right)\left(1-c^{2} t^{2}\right)}}$$
</div>

where $Q$ is another rational function. You can substitute $t=\sin{\phi}$ to get

<div>
$$\int \frac{Q d \phi}{\sqrt{\left(1-c^{2} \sin ^{2} \phi\right)}}$$
</div>

Here's the interesting punchline: any elliptic integral can be represented as a linear combination of three specific elliptic integrals. We've seen two of them, and you can view all three kinds [here][10].

On the one hand, you may be thinking "oh, wow, that is somewhat surprising that all these integrals are simply linear combinations of three specific integrals." On the other hand, you may be thinking "we've gotten pretty far out into the weeds. Weren't we talking about astronomy?"

Let's address the practical implications of Legendre's discovery. Firstly, keep in mind that this was an era before calculators, and most important calculations relied on using tables of pre-calculated values.

What Legendre showed was that calculating values for the three kinds of elliptic integrals is enough to help us solve many general integral problems. Indeed, quoting [our source][10]: "For a new function to be accepted into mathematics it has to be shown to be useful, and if it is to be applied then its values have to be known numerically. Legendre devoted Book III (1816) to the production of several sets of tables..., and then put the new functions to work solving geometrical and mechanical problems."

So Legendre's abstract discovery of classifications did indeed relate to progress in practical matters. Diverse physical problems were reduced into the three kinds of elliptic integral, allowing us to reuse calculations and focus on more general theory.

As a fun aside, I myself have stumbled upon elliptic integrals while modeling with electrodynamics. I can verify that they do exist, even in modern physics problems.

The discovery of these classifications is not obvious, and you can find a more technical overview of Legendre's methods [at the start of this paper][11] as well as in [Legendre's original paper in French][8].

We've now explored elliptic integrals sufficiently for my tastes, and it's time to take another chronological step forward and talk about their inverses, elliptic functions.

## 3.0) Elliptic Functions: The Other Side of the Coin

While Fagnano, Euler, and others were discovering interesting, trig-like properties of elliptic integrals during the 1700s, it wasn't until the start of the 1800s that Gauss began investigating the inverse of elliptic integrals, elliptic functions. For the record, I am now going to stop reminding you that elliptic functions are the inverse of elliptic integrals.

Although Gauss made many substantial conclusions about elliptic functions, he didn't publish his work until around the 1820s. He was spurred to action when Jacobi and Abel sniped many of his conclusions in their own publications. 

Our first goal will be to step through Gauss's investigations of the elliptic function derived from the lemniscate. We'll look at his methods and motivations before moving on to Abel and Jacobi, the last key players in this era.

### 3.1) Gauss and the Lemniscate Sine

We've already discussed that Gauss was interested in elliptic integrals as generalizations of the trig functions to curves beyond the circle. We also discussed that his investigations eventually focused on the lemniscate of Bernoulli, possibly because Euler and Fagnano had recently shown the integral had additive properties similar to $\text{sin}^{-1}$.

The [trigonometric functions have many additive identities][12], and our example with Euler and Fagnano is only one identity for one elliptic integral. The identity was similar to the double-angle formula for $\text{sin}^{-1}$.

Gauss's investigations were focused on creating more of these identities. One reason was certainly to verify that the generalization resembled the standard trig functions. However, a more compelling motivation was that, in the era before computation, trigonometry tables were used when calculating with the trigonometric functions, and these were [generated using angle addition identities][13]. Thus these proofs would go a long way in making the new functions practical.

To build these identities, he began with the lemniscatic integral and defined the elliptic function $sl(x)$ as its inverse,

<div>
$$sl(x)=z \quad \text{such that} \quad x=\int_{0}^{z} \frac{d t}{\sqrt{\left(1-t^{4}\right)}}$$
</div>

Thus $sl(x)$ is analogous to $\sin{x}$. Gauss actually created a tangible representation of $sl(x)$ using infinite series. According to [9.2 in this source][4], " He treated the integrand as a function of $t$, expanded it as a power series and integrated it term by term, thus obtaining $x$ as a power series in$z$. He then inverted this series to obtain $z$ as a power series in $x$,thus inverting the lemniscatic integral."

UNDER CONSTRUCTION

## Further Reading

If you'd like to know more about this topic, there are some sources I'd recommend. I found it very interesting that all of these are available on www.libgen.is for free, with the exception of the ones which are already available for free in the links provided. Downloading those texts at www.libgen.is would be copyright infringement in the US. [According to Wikipedia][5],

"An individual may be liable if the infringement was committed: (B) by the reproduction or distribution, including by electronic means, during any 180-day period, of 1 or more copies or phonorecords of 1 or more copyrighted works, which have a total retail value of more than $1,000; or (C) by the distribution of a work being prepared for commercial distribution, by making it available on a computer network accessible to members of the public, if such person knew or should have known that the work was intended for commercial distribution."

So don't do that. Anyways, just food for thought.

On the history of this topic (and some good math references, honestly):

* [Carl Friedrich Gauss: Titan of Science][1]
* [Mathematics and its History][3]
* [The Real And The Complex: A History of Analysis in the 19th Century][4]

On elliptic topics and modular forms:

* [A First Course on Modular Forms][2]
* [Studys on Elliptic Functions by Abel][6]
* [Euler's work in general][7]
* [Memoir sur les Transcendantes Elliptiques, by Legendre (on classifying the three kinds of elliptic integral)][8]

[1]:https://www.amazon.com/Carl-Friedrich-Gauss-Titan-Science/dp/1258486636
[2]:https://link.springer.com/book/10.1007/978-0-387-27226-9
[3]:https://www.buffaloschools.org/site/handlers/filedownload.ashx?moduleinstanceid=2636&dataid=17548&FileName=Mathematics%20and%20Its%20History%20Third%20Edition%20by%20John%20Stillwell.pdf
[4]:https://www.springer.com/gp/book/9783319237145
[5]:https://en.wikipedia.org/wiki/Criminal_copyright_law_in_the_United_States
[6]:https://www.maa.org/sites/default/files/images/upload_library/1/abeltranslation.pdf
[7]:https://www.agtz.mathematik.uni-mainz.de/algebraische-geometrie/van-straten/euler-kreis-mainz/
[8]:https://books.google.com/books/about/M%C3%A9moire_sur_les_transcendantes_elliptiq.html?id=I4laAAAAcAAJ
[9]:https://mathworld.wolfram.com/Lemniscate.html
[10]:https://en.wikipedia.org/wiki/Elliptic_integral
[11]:https://projecteuclid.org/download/pdf_1/euclid.chmm/1428686948
[12]:https://en.wikipedia.org/wiki/Trigonometric_functions#Sum_and_difference_formulas
[13]:https://en.wikipedia.org/wiki/Trigonometric_tables#Half-angle_and_angle-addition_formulas