# Modular Forms: Why Does Anyone Care?

## Introduction

The goal of this post is to tell a story about the discovery of modular forms. Many people worked on math which was either directly or indirectly related to this topic. Because of this, any narrative about the "origin" of modular forms is bound to be incomplete. However, being wrong has never stopped me before, and it won't stop me now. I intend to highlight some of the tangible issues of the time that led an era of mathematicians to get disproportionately interested in theta functions and modular forms. Please don't view this as an authoritative history, but rather as one of many possible narratives. This is also meant to be a soft introduction to some of the mathematics used in the study of modular forms.

Please do not expect this post to be accurate or useful, but hope that it will at least be fun.

## Historical Overview: Who, What, When, Where, Why?

### The Soft History

We'll start by excluding the mathematical history and focus on physics and cultural context.

The rabbit-hole of modular forms began near the start of the 1800s, $\pm 30$ years. It was the twilight years of the Enlightenment Era, about a century after Newton's Principia and 20 years after Euclid's death. The telescope was first seriously used by Galileo 200 years ago, but innovations by Newtons and others during the 1700s greatly improved the quality of observations.

Kepler's laws had been published around 1600, again nearly 200 years ago, and they gave an excellent approximation of the behaviors of heavenly bodies. However, it was Newton's innovations near 1700 that had fit Kepler's laws into a larger physics framework.

The implications of Newton's theories had been an extremely popular topic over the last 100 years, and the fact that they so neatly explained the movement of heavenly bodies captivated not just the scientific community, but also many political figures. Colleges and dukes alike were willing to pay mathematicians and astronomers (careers which frequently overlapped) to collect astronomical data and determine the orbits of bodies. You would have a very happy duke if you discovered an asteroid, named it after the duke, and predicted when it would next be seen in the sky.

This is all to say that every academic was tempted to dip into the field of astronomy. Many of them did. On the astronomical playing field of the era one could find Euler, Legendre, Gauss, Poisson, Laplace, Bessel, and Mobius. Additionally, many mathematicians were interested in the theoretical problems of determining orbits, such as Jacobi and Abel. These two figures will be relevant to us later.

### The Mathematical History

A number of great mathematical innovations had occurred during the 1600s-1700s. One of the most notable was the development of the theory of calculus/analysis, particularly infinite series.

We will focus on a particular innnovation related to our upcoming astronomical investigations. Mathematicians had long been familiar with the concepts of $\sin{x}$, $\cos{x}$, and $e^x$. However, our understanding was limited since we could not connect them to elementary algebraic expressions.

This gap was bridged largely by innovations with infinite series and analysis. There were two major steps. Firstly, for all three of these examples, it was found that their inverses could be expressed as integrals:

<div>
$$\log(x+1)=\int_{0}^{x}\frac{dt}{1+t} \quad sin^{-1}{x}=\int_{0}^{x}\frac{dt}{\sqrt{1-t^2}} \quad tan^{-1}{x}=\int_{0}^{x}\frac{dt}{1+t^2}$$
</div>

Each of these can be expanded into power series. The second step, then, is to take the inverse of the power series using Newton's method of series inversion. This yields an explicit power series for $\sin{x}$, $\cos{x}$, and $e^x$, which gives a much more tangible perspective on these transcendental functions. See 9.5 and 10.2 in *Mathematics and its History* (sources listed below) for more details.

So in summary, our first big contextual point was that analysis was being used to get explicit power series of common transcendental functions by working on their inverse.

##Further Reading

If you'd like to know more about this topic, there are some sources I'd recommend. I found it very interesting that all of these are available on www.libgen.is for free, with the exception of *Mathematics and its History*, which is available for free at the link provided. Downloading those texts at www.libgen.is would be copyright infringement in the US. [According to Wikipedia][5],

"An individual may be liable if the infringement was committed: (B) by the reproduction or distribution, including by electronic means, during any 180-day period, of 1 or more copies or phonorecords of 1 or more copyrighted works, which have a total retail value of more than $1,000; or (C) by the distribution of a work being prepared for commercial distribution, by making it available on a computer network accessible to members of the public, if such person knew or should have known that the work was intended for commercial distribution."

So don't do that. Anyways, just food for thought.

On The History of this topic:

* [Carl Friedrich Gauss: Titan of Science][1]
* [Mathematics and its History][3]
* [The Real And The Complex: A History of Analysis in the 19th Century][4]

On Modular Forms:

* [A First Course on Modular Forms][2]

[1]:https://www.amazon.com/Carl-Friedrich-Gauss-Titan-Science/dp/1258486636
[2]:https://link.springer.com/book/10.1007/978-0-387-27226-9
[3]:https://www.buffaloschools.org/site/handlers/filedownload.ashx?moduleinstanceid=2636&dataid=17548&FileName=Mathematics%20and%20Its%20History%20Third%20Edition%20by%20John%20Stillwell.pdf
[4]:https://www.springer.com/gp/book/9783319237145
[5]:https://en.wikipedia.org/wiki/Criminal_copyright_law_in_the_United_States