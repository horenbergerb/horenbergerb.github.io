---
custom_excerpt: |
  "...Bungus..."
---

# Langevin Dynamics: Origin Story

* TOC
{:toc}
## Early history of diffusion

- Calculus is developed throughout 1700s
    - This leads people to represent system with rates of change
    - Everyone's building diff equations
- [1738 Daniel Bernoulli nails the descriptions of gasses as molecules](https://en.wikipedia.org/wiki/Kinetic_theory_of_gases)
- [Fourier's heat equation makes the rounds](https://www3.nd.edu/~powers/ame.20231/fourier1878.pdf)
    - [Date from Wikipedia](https://en.wikipedia.org/wiki/Heat_equation)
    - [Fourier relied on newton's law of cooling](https://digitalcommons.ursinus.edu/cgi/viewcontent.cgi?article=1005&context=triumphs_differ)
    - [Solid intuition for the Laplacian](https://physics.stackexchange.com/questions/20714/laplace-operators-interpretation)
- [1833? Thomas Graham does experiments with diffusion of salts in liquids](https://en.wikipedia.org/wiki/Thomas_Graham_(chemist))
    - [Detailed descriptions of his experiments](https://www.sciencedirect.com/science/article/pii/S0187893X13725217)
    - [Paper by Graham on salts in water (possibly what Fick references?)](https://royalsocietypublishing.org/doi/epdf/10.1098/rstl.1851.0023)
    - [Another paper (better than the one above)](https://www.jstor.org/stable/108332?seq=2#metadata_info_tab_contents)
    - [1848? the rate of effusion of a gas is inversely proportional to the square root of the molar mass of its particles.](https://en.wikipedia.org/wiki/Graham%27s_law)
- [1855 Fick proposes Fick's laws of diffusion](https://web.archive.org/web/20090205030323/http://www.uni-leipzig.de/diffusion/journal/pdf/volume2/diff_fund_2(2005)1.pdf)
    - [Fick's actual paper](https://physics.emory.edu/faculty/roth/polymercourse/historical/Frick_1855.pdf)
    - This is the origin of the [diffusion equation](https://en.wikipedia.org/wiki/Diffusion_equation)

## Einstein's "Genius" Solution

$\Delta$ and $\Delta + d\Delta$

$$dn = n\phi(\Delta)d\Delta$$

$$\int_{-\infty}^{\infty}\phi(\Delta)d\Delta = 1$$

## Langevin DESTROYS Einstein

## What?

I've been reading a lot of papers about denoising diffusion.

Everyone in the diffusion scene talks about Langevin dynamics like it's common household knowledge. I've found sources that explain how to use Langevin dynamics, but I've yet to see someone actually explain it and frame it historically in a way that satisfies me.

At some point I got tired of the handwaving and decided to refer to the forbidden texts, i.e. primary sources.

It turned out that Langevin Dynamics only made sense in the context of Einstein's innovations in Brownian motion, which in turn relies on the diffusion equation, which has its own historical context, etc, etc.

So I recursed down and back up the rabbit hole to deliver you this nice, linear narrative about the history of Langevin dynamics. 

The tldr of this article is basically:

Heat and Temperature: (Newton's law of cooling $\rightarrow$ Fourier's heat equation) $\rightarrow$ (Adolph Fick's diffusion equation $\rightarrow$ Einstein's analysis of Brownian motion $\rightarrow$ Langevin Dynamics)

Where the first two components regard heat and temperature, while the last three regard gasses, liquids, and diffusion

I don't think this is a historically or pedagogically correct narrative.

It's pretty cool though.

## Heat and Temperature

The theory of diffusion relies critically on Fick's diffusion equation, which is, in Fick's own words, literally just the heat equation:

|![The diffusion equation is literally just the heat equation](/images/newtonslawofcooling/fickheatequation.png)|
|:--:|
| *The diffusion equation is literally just the heat equation* |

Fick's theory is just "well it worked for other stuff, so it probably works for this."

So, while we could jump in right here and start playing with Einstein, it seemed proper to go back and motivate the heat equation first.