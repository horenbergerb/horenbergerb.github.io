# 1700s Math: Investigation 1

## Introduction

In my post on elliptic functions, I realized how little I knew about the natural progression of math. I've often seen Euler's series or various functions of interest from the 1700s, but I tended to chalk it up to "they were all geniuses." While that's still valid, I think I've realized that the mathematical era could be more clear to me if I had more context about their work.

So I've decided to sample a collection of various mathematical issues that mathematicians were working on. I hope that by reviewing some random selection of works, I can catch a glimpse of the geist before moving on to the next era of math.

The first topic I intend to cover is Bernoulli's investigation of the elastica. It's a very reasonable physics problem in the context of Newtonian mechanics, and it relates to some interesting mathematical constructions like the lemniscate of Bernoulli. It also gives a flavor of how the mathematicians derived many interesting problems from physics using differentials.

In my next post, I think I'll go over Euler's creation of transcendental functions. But we'll burn that bridge when we get to it.

## Leibniz's Paracentric Isochronous Curve

Because physics and calculus were new and exciting, people were going bonkers looking for ways to apply them. Leibniz came up with many interesting questions about gravity that produced novel equations and curves.

Before we introduce the paracentric isochronous curve, let's start simpler. Leibniz introduced the *isochronous curve*, "a curve such that if a particle comes down along it by the pull of gravity, the vertical component of the speed is constant, when the gravitational field is supposed to be uniform." So we're asking about a ball sliding down a frictionless curve. Here is one example:

[<img src="https://mathcurve.com/courbes2d.gb/isochron/parbolesemicubiqueanim.gif">](mathcurve.com)

I'm going to try working through this using Cartesian mechanics, and then I'll try working it out with Lagrangian methods, which are more convenient.

So our particle has position function $s(t)=(x(t), y(t))$. This will define our curve (NOTE: what about possibility of ball leaving curve?). There is a net force on the particle, $\textbf{F}(t) = (a_x(t), a_y(t))$. Of course, $F(t) = \frac{d^2s}{dt^2}$. We know that our force is a sum of gravity, $(0, g)$ with the normal force of the curve. We want the normal force of the curve to impose that $a_x(t) = 0$. Finally, we set some initial conditions. We'll say $s(0)=(0,0)$ and $s'(0)=(v_{xi},v_{yi})$.

Let's think about how our normal force works. Along our curve, we can draw a tangent vector at any point. Then the normal force is orthogonal to this. The magnitude of the normal force is determined by the angle between the tangent line and gravity. The tangent vector is given by $s'(t)$, but we must normalize it to magnitude 1 to calculate the normal force. The magnitude of the normal force is the dot product of this vector with the gravity vector. Let's write that mathematically:

<div>
$$\vert \textbf{N}(t) \vert = \frac{1}{\sqrt{v_x(t)^2 + v_y(t)^2}}(v_x(t)*0+v_y(t)*g)=\frac{gv_y(t)}{\sqrt{v_x(t)^2 + v_y(t)^2}}$$
</div>

Now how do we get the direction of the normal vector? We simply use a 2D rotation matrix of 90 degrees on our normalized tangent vector. In other words multiply the $y$ component by $-1$ and then swap $x$ and $y$ components. Then we're going to multiply this by the magnitude we just calculated:

<div>
$$\textbf{N}(t) = \frac{gv_y(t)}{\sqrt{v_x(t)^2 + v_y(t)^2}}*(-v_y(t), x(t))$$
</div>

Now we have a description of our normal force. We will sum this with the force of gravity to get $\textbf{F}(t)$

<div>
$$\textbf{F}(t) = (a_x(t), a_y(t)) = \frac{gv_y(t)}{\sqrt{v_x(t)^2 + v_y(t)^2}}*(-v_y(t), x(t) + g)$$
</div>

Whammo, we've got a differential equation here. We can break it into two parts,

<div>
$$a_x(t) = \frac{-gv_y(t)^2}{\sqrt{v_x(t)^2 + v_y(t)^2}}, \quad\quad a_y(t) = \frac{gv_x(t)^2 + g^2v_x(t)}{\sqrt{v_x(t)^2 + v_y(t)^2}}$$
</div>

Oh, but I've been neglecting something that would be useful. $v_x(t)$ is a constant, and $a_x(t) = 0$. Oh yeah, now it's coming together.

<div>
$$0 = \frac{-gv_y(t)^2}{\sqrt{v_{xi}^2 + v_y(t)^2}}, \quad\quad a_y(t) = \frac{gv_{xi}^2 + g^2v_{xi}}{\sqrt{v_{xi}^2 + v_y(t)^2}}$$
</div>

This guys are definitely equations we can analyze. The equation for $a_y(t)$ looks like a differential equation for $v_y(t)$. I have the impression that $v_y(t) \simeq \sqrt{v_{xi}^2 + v_y(t)^2}$. but this would derive to

<div>
$$\frac{v_y(t)}{\sqrt{v_{xi}^2 + v_y(t)^2}}$$
</div>

which is not quite right.

## Sources and References:
 
* [Book on lemniscate][1]
* [Overview of paracentric isochronous curve[2]
* [Overview of isochronous curve][3]
* [Gravity on inclined planes][4]

[1]:https://webspace.science.uu.nl/~wepst101/elliptic/Bos_lemniscate.pdf
[2]:https://mathcurve.com/courbes2d.gb/isochron/isochrone_paracentrique.shtml
[3]:https://mathcurve.com/courbes2d.gb/isochron/isochrone%20leibniz.shtml
[4]:http://www.studyphysics.ca/newnotes/20/unit01_kinematicsdynamics/chp06_vectors/lesson25.htm