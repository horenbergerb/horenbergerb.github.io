# History of Modular Forms 1: The First Era, 1800s

## Introduction

The goal of this series of posts is to tell a story about the discovery of modular forms. Many people worked on math which was either directly or indirectly related to this topic. Because of this, any narrative about the "origin" of modular forms is bound to be incomplete. However, being wrong has never stopped me before, and it won't stop me now. I intend to highlight some of the tangible issues that led an era of mathematicians to get disproportionately interested in theta functions and modular forms. Please don't view this as an authoritative history, but rather as one of many possible narratives. This is also meant to be a soft introduction to some of the mathematics used in the study of modular forms.

In this entry of this series, we're exploring the 1800s, where astronomical investigations and inovations in analysis as well as complex numbers caused the discovery and investigation of elliptic functions. This set the stage for future investigation regarding general properties among sets of transcendental functions.

In the next post, we will see that Felix Klein's attempts to express relations among these elliptic functions would lead to the discovery of even more interesting functions, such as the j-function.

Following that, the next post will attempt to touch on the work of Erich Hecke, who expanded Klein's discovery into the more robust theory of modular forms.

Please do not expect this post to be accurate or useful, but hope that it will at least be fun.

## Historical Context: Who, What, When, Where, Why?

### The Soft Context

We'll start by excluding the mathematical history and focus on physics and cultural context.

The rabbit-hole of modular forms began with elliptic functions at the start of the 1800s, $\pm 30$ years. It was the twilight years of the Enlightenment Era, about a century after Newton's Principia and 20 years after Euclid's death. The telescope had been used by Galileo 200 years ago, but innovations by Newtons and others during the 1700s greatly improved the quality of observations.

Kepler's laws had been published around 1600, again nearly 200 years ago, and they gave an excellent approximation of the behaviors of heavenly bodies. However, it was Newton's innovations near 1700 that had fit Kepler's laws into a larger physics framework.

The implications of Newton's theories had been an extremely popular topic over the last 100 years, and the fact that they so neatly explained the movement of heavenly bodies captivated not just the scientific community, but also many political figures. Colleges and dukes alike were willing to pay mathematicians and astronomers (careers which frequently overlapped) to collect astronomical data and determine the orbits of bodies. You would have a very happy duke if you discovered an asteroid, named it after the duke, and predicted when it would next be seen in the sky.

This is all to say that every academic was tempted to dip into the field of astronomy. Many of them did. On the astronomical playing field of the era one could find Euler, Legendre, Gauss, Poisson, Laplace, Bessel, and Mobius. Additionally, many mathematicians were interested in the theoretical problems of determining orbits, such as Jacobi and Abel. These two figures will be relevant to us later.

### The Mathematical Context

#### Analysis and Transcendental Functions

A number of great mathematical innovations had occurred during the 1600s-1700s. One of the most notable was the development of the theory of calculus/analysis, including infinite series.

We will focus on a particular innnovation related to our upcoming astronomical investigations. Mathematicians had long been familiar with the concepts of $\sin{x}$, $\cos{x}$, and $e^x$. However, our understanding was limited since we could not connect them to elementary algebraic expressions.

This gap was bridged largely by innovations with infinite series and analysis. There were two major steps. Firstly, for all three of these examples, it was found that their inverses could be expressed as integrals:

<div>
$$\log(x+1)=\int_{0}^{x}\frac{dt}{1+t}, \quad \cosin^{x}=\int_{0}^{x}\frac{dt}{\sqrt{1-t^2}}, \quad \cotan{x}=\int_{0}^{x}\frac{dt}{1+t^2}$$
</div>

Each of these can be expanded into power series. The second step, then, is to take the inverse of the power series using Newton's method of series inversion. This yields an explicit power series for $\sin{x}$, $\cos{x}$, and $e^x$, which gives a much more tangible perspective on these transcendental functions. See 9.5 and 10.2 in *Mathematics and its History* (sources listed below) for more details.

So in summary, our first contextual point was that analysis was being used to get explicit power series of common transcendental functions by working on their inverse.

It's also worth keeping in mind that mathematicians generally didn't know whether every integral could be solved in terms of elementary algebra, $\sin{x}$, $\cos{x}$, and $e^x$. There was still room to believe that every integral was explicitly solvable, which led mathematicians to be quite interested in integrals that would eventually be proven unsolvable by Liouville around 1830. This caused a development in "functional" theory (not functional analysis), meaning mathematical statements about functions that don't have an explicit expression.

#### Complex Numbers

Complex numbers have an extremely long history of being despised and ignored by mathematicians. They originated from one of the oldest hobbies of mathematics: solving polynomial equations. Since the era of the Babylonians around 1500BC, nerds were solving for $x$ in quadratic equations like $x^2+3x+1=0$. I can't tell you why this was so popular, except that this was a natural way to extend intutive geometric problems like the area of a square given the length of its sides.

Nevertheless, solving quadratic equations is an ancient practice, and consequently so our neglect of $\sqrt{-1}$. The traditional mindset was that these solutions to quadratics were nonsense because they didn't have a geometrical meaning, so no one did arithmetic with $\sqrt{-1}$.

It wasn't until the end of the 1500s that Bombelli faced up to a serious problem. Cardano's formula for the roots of cubics necessarily required doing algebra with $\sqrt{-1}$, even for roots that were real and had geometric meaning. Despite the practical value of his methods, complex numbers continued to be neglected as a field of study.

At the start of the 1700s, complex numbers began to pop up in problems such as angle division, making their utility harder to ignore. Finally, towards the end of the 1700s, d'Alembert and Gauss both produced significant results on the geometric intuition of complex numbers as well as the Fundamental Theorem of Algebra, which helped make complex numbers more widely accepted and popular.

However, there is another development with complex numbers during the mid-1700s that is more relevant to our discussion. In particular, it was discovered that complex numbers could relate many of the transcendental functions. Recall from before that 

<div>
$$\log(x+1)=\int_{0}^{x}\frac{dt}{1+t}, \quad \cotan{x}=\int_{0}^{x}\frac{dt}{1+t^2}$$
</div>

It was Bernoulli who observed, surprisingly, that if one was willing to work with $\sqrt{-1}$, then

<div>
$$\frac{d z}{1+z^{2}}=\frac{d z}{2(1+z \sqrt{-1})}+\frac{d z}{2(1-z \sqrt{-1})}$$
</div>

What is being said here? By integrating, one can see that

<div>
$$\cotan{z}=\frac{1}{2 i} \log \frac{i-z}{i+z}$$
</div>

This is to say that the inverse trigonometric functions are deeply related to logarithms, thus uniting many transcendental functions in a way which had never been done before.

This culminated in Euler's formula in 1748:

<div>
$$e^{i x}=\cos{x}+ i \sin{x},$$
</div>

The value of these discoveries was two-fold. Part of their value was that they made computation with the common transcendental functions much easier. The other part of their value was that it brought all the popular transcendental functions closer together on a theoretical level, allowing us to analyze them collectively.

In summary, the key point here is that complex numbers showed us new ways to interrelate transcendental functions, and they often provided intuitive solutions to practical problems that would be difficult to recreate using only real numbers.

## The Eye of the Storm: Elliptic Functions

### Astronomy and Ellipses

Although the physics was 100 years old, the theory of astronomy was booming at the end of the 1700s due to the analytical innovations of Euler and others. New data was being collected en masse from sightings of astronomical objects such as planets and asteroids. Those who could calculate the paths of these objects and predict their return were guaranteed repute and a decent paycheck. Thus much of the efforts were focused on mathematical techniques to turn sets of observations into a function for the object's position over time.

Deriving this function depended on the fact that the theory of gravity proposed orbiting objects should follow elliptical paths. We'll pass over the physics of this and focus on the nature of ellipses.

An *ellipse* is defined on a plane by selecting two points, $F_1$ and $F_2$, as well as some constant $h$. Then the ellipse is the set of all points such that for each point $x$, the sum of the distance from $x$ to $F_1$ and $x$ to $F_2$ is equal to $h$.

The picture below is an example from Wikipedia of such an ellipse with many common vocabulary terms illustrated.

[<img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Ellipse-def0.svg">](wikipedia.com)

As a fun fact, the constant $h$ is equal to twice the distance from the center of the ellipse to the vertex. This is also a demonstration that many defined properties of the ellipse can be equated, thus there are many equivalent perspectives from which you can talk about an ellipse.

In order to make your life less fulfilling, standard practice is to characterize an ellipse not with the constant $h$ as we have been doing. Instead, we use the constant called *eccentricity*, $k$, which is defined as the ratio of the focus to the center vs the vertex to the center. If our vertex is $V$ and our center is C$, then $k=\vert F_1 C \vert / \vert VC \vert$. This is simply because this constant is more convenient in future calculations. 

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
$$(\frac{r(\theta)\cos{\theta}}{a})^2 + (\frac{r(\theta)\cos{\theta}}{b})^2 = 1 \quad \implies \quad r(\theta) = \frac{ab}{\sqrt{(b\cos{\theta})^2 + (a\sin{\theta})^2}}$$
</div>

So we have the mathematical language to talk about ellipses. My goal in this next two sections is to move towards the mathematics of elliptic functions while also answering the question, "Why would an astronomer do this?"

### Elliptical Integrals and Arc Length

For a function $f:[a,b]\rightarrow \mathbb{R}$, the length of the curve defined by f is

<div>
$$L(f)=\int_{a}^{b}\left|f^{\prime}(t)\right| d t$$
</div>

It's a short skip and a hop to apply this to an elliptic curve. We will use polar coordinates. The length traversed along the ellipse of eccentricity $k$ by sweeping out an angle $\phi$ is

<div>
$$F(\phi, k)=\int_{0}^{\phi} \frac{\mathrm{d} \theta}{\sqrt{1-k^{2} \sin ^{2} \theta}}$$
</div>

So, it's worth noting here that we made the length a function of both $\phi$ and the parameter $k$. There are a few reasons for this. The first reason is: because we can. But the other reason touches on a more general problem: why are we talking about arc length of an ellipse at all? Who cares?

That is an excellent question. Why did the astronomers of the early 1800s get so obsessed with arc length of the ellipse? The honest answer is that I don't know. However, I'm not an honest person, and I'm going to try and explain anyways.



### Elliptical Functions

## Further Reading

If you'd like to know more about this topic, there are some sources I'd recommend. I found it very interesting that all of these are available on www.libgen.is for free, with the exception of *Mathematics and its History*, which is available for free at the link provided. Downloading those texts at www.libgen.is would be copyright infringement in the US. [According to Wikipedia][5],

"An individual may be liable if the infringement was committed: (B) by the reproduction or distribution, including by electronic means, during any 180-day period, of 1 or more copies or phonorecords of 1 or more copyrighted works, which have a total retail value of more than $1,000; or (C) by the distribution of a work being prepared for commercial distribution, by making it available on a computer network accessible to members of the public, if such person knew or should have known that the work was intended for commercial distribution."

So don't do that. Anyways, just food for thought.

On the history of this topic (and some good math references, honestly):

* [Carl Friedrich Gauss: Titan of Science][1]
* [Mathematics and its History][3]
* [The Real And The Complex: A History of Analysis in the 19th Century][4]

On elliptic topics and modular forms:

* [A First Course on Modular Forms][2]

[1]:https://www.amazon.com/Carl-Friedrich-Gauss-Titan-Science/dp/1258486636
[2]:https://link.springer.com/book/10.1007/978-0-387-27226-9
[3]:https://www.buffaloschools.org/site/handlers/filedownload.ashx?moduleinstanceid=2636&dataid=17548&FileName=Mathematics%20and%20Its%20History%20Third%20Edition%20by%20John%20Stillwell.pdf
[4]:https://www.springer.com/gp/book/9783319237145
[5]:https://en.wikipedia.org/wiki/Criminal_copyright_law_in_the_United_States