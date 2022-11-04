---
custom_excerpt: |
  "...Bungus..."
---

# Highlights From The History of Heat

* TOC
{:toc}
## Heat?

These days everybody knows heat. 

## Newton's Law of Cooling

Newton's law of cooling (NLC) is usually ascribed to an anonymous work (by Newton) published  in 1701, [Scala Graduum Caloris](https://archive.org/details/philtrans07084697), or, in English, [A Scale Of The Degrees Of Heat](https://www.originalsources.com/Document.aspx?DocID=S6VEXZVMWT1M2W2).

The paper itself has *no equations*, and in fact the bulk of the paper is just a fat table containing temperatures of various important things:

|![Examples from Newton's table of temperatures](/images/newtonslawofcooling/newtonscaleexample.png)|
|:--:|
| *Examples from Newton's table of temperatures* |

The rest of the paper is just a long description of how Newton made the two temperature scales and how he took the measurements.

In fact, the goal of this paper was to create a good temperature scale, and Newton's profound cooling law which preceeded a revolution in the science of heat transfer is actually just an off-handed remark towards the end of the paper:

> The iron was laid not in a calm air, but in a wind that blew uniformly upon it, that the air heated by the iron might be always carried off by the wind and the cold air succeed it alternately; for thus equal parts of air were heated in equal times, and received a degree of heat proportional to the heat of the iron

[The idea can be illustrated quite nicely](https://sci-hub.se/https://www.tandfonline.com/doi/abs/10.1080/001075199181549):

|![How air cools iron](/images/newtonslawofcooling/stolendiagram.png)|
|:--:|
| *How air cools iron* |

i.e. If the temperature change is $T_w - T_b$, then it stands to reason that the amount of heat exchanged is probably proportional.

This might sound like a non-sequitur, because yeah, it kinda is. But look where it got Newton. How's the whole "being rigorous" thing going for you, bud?

At the time, there was almost no theoretical understanding of heat. [The thermometer had only been invented in the last 100 years](https://antonhowes.substack.com/p/age-of-invention-why-wasnt-the-steam-76c), and [Daniel Bernoulli's model of heat as particles bumping around](https://en.wikipedia.org/wiki/Kinetic_theory_of_gases) was still 40 years from being invented.

This is all to say that "temperature" and "heat" were both super vague terms, and Newton used them interchangeably.

In more modern terms, [Newton was saying that](https://web.archive.org/web/20160614213315/http://paginas.fisica.uson.mx/laura.yeomans/tc/Sci-Edu-Springer-2010.pdf)

$$\frac{dT_b}{dt} \propto -(T_w - T_b)$$

And he really believed it was an obvious and logical law. 

Where $Q$ is the heat flow rate, $A$ is surface area, $h$ is a magical heat transfer coefficient, $T$ is the temperature of the block of iron, and $T_{env}$ is the temperature of the environment.

And the same people usually cite Newton's paper as the source of this equation.





- Calculus developed throughout 1700s
    - Newton is a bamf
    - Diff eqs are hot
- Heat is a topic of interest
    - Survey the studies of heat?
- [Newton's law of cooling](https://en.wikipedia.org/wiki/Newton%27s_law_of_cooling)
    - [Original Paper](https://www.originalsources.com/Document.aspx?DocID=S6VEXZVMWT1M2W2)
    - [Paper about original paper](https://sci-hub.se/https://www.tandfonline.com/doi/abs/10.1080/001075199181549)
    - [Great derivation of Newton's Law of Cooling](https://web.archive.org/web/20160614213315/http://paginas.fisica.uson.mx/laura.yeomans/tc/Sci-Edu-Springer-2010.pdf)

$$\dot{Q}=hA(T(t)-T_{env}) = hA\Delta T(t)$$

