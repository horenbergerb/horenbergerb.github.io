# Elliptic Functions Revisited: What Were They Thinking

## Table of Contents <a name="toc"></a>

## 0.0) Introduction <a name="0.0"></a>

In my last post on modular forms, most of our time was spent talking about the investigation of elliptic functions during the early 1800s. In this post, we'll take another approach to the investigation of elliptic functions. This new perspective focuses on building towards the investigation of angle division. We'll see how it goes! First, I present a summary of the historical scene before we dig it.

In the wake of Newton's calculus and mechanics, many physical investigations led to differential equations and integrals. Only a small subset of these had been discovered to have [algebraic solutions][1]. Others, such as the integral
<div>
$$\int_0^x \frac{1}{\sqrt{t}}dt$$
</div>
could not be solved. This function was named the natural logarithm, $\ln x$. One of the first major breakthroughs came after the discovery of partial fraction expansion by Bernoulli. Bernoulli realized that all integrals of [rational functions][2] had algebraic solutions, so long as you were allowed to use $\ln$. Solving integrals became more difficult (and more interesting) when the integrand contained square roots. For example, the integral
<div>
$$\int_0^x \frac{1}{\sqrt{1-t^2}}dt$$
</div>
could not be solved algebraically, even in terms of $\ln$. It arises naturally as the arc length of the circle. It was instead given its own name, $\arcsin x$. Similarly,  Once it was given this name, other integrals involving the square root of degree 2 polynomials could be solved algebraically in terms of arcsin. It may interest you to know that mathematicians would soon discover that $\arcsin$ can, in fact, be expressed in terms of $\ln$, but only when complex numbers are introduced.

It's important to keep in mind the practical implications of these investigations. Because $\arcsin$ and $\ln$ could be calculated accurately using infinite series, tables of values could be calculated and distributed. Then, with the aid of these tables, and by using indefinite integration, a massive range of integrals could be calculated through simple algebra.

Thus far, we have explored the simplest cases of integration handled by mathematicians in the early 1800s. In this post, we will explore the next step in mathematical history. Mathematicians quickly ran into difficulties with integrals involving square roots of polynomials larger than degree two. These were natural candidates as the next focus, being "marginally" more complex than the integrals shown above, and also appearing in physical problems which are "marginally" more complex, such as the arc length of the [lemniscate of Bernoulli][3]:
<div>
$$\int_0^x \frac{1}{\sqrt{1-t^4}dt$$
</div>
Thus begins the study of elliptic integrals.

## 1.0) Elliptic Integrals: If You Can't Integrate 'Em, Relate 'Em

The most general definition of [elliptic integral][4] is a function of the form
<div>
$$f(x)=\int_c^x R(t,\sqrt{P(t)})dt$$
</div>
where "$R$ is a rational function, $P$ is a polynomial of degree 3 or 4 with no repeated roots, and $c$ is constant." We have seen that these were some of the most notorious unsolved integrals at the time. They appeared in many physical problems, and they differed only very slightly from solved integrals, such as when $P$ is instead degree 2. I will spoil the fun and warn you now: we never integrate elliptic integrals. Instead, we will follow mathematicians as they discover the nuances of the subject. Along the way, they discover many convenient properties of elliptic integrals which make them much less daunting computationally.

The lemniscate was at the heart of one discovery made by Fagnano. Because the lemniscate is a geometric figure, and because its arc length was the elliptic integral being investigated, Fagnano naturally compared it to the circle and its arc length. One interesting property of the circle is that one can algebraically "double the arc length." What this means is that given an point, $x$, and its corresponding arc length, it was known that integrating to $2x\sqrt{1-x^2}$ gave double the arc length. In other words,
<div>
$$2\int^x_0 \frac{dt}{\sqrt{1-t^2}} = \int^{2x\sqrt{1-x^2}}_0\frac{dt}{\sqrt{1-t^2}}$$
</div>
This is not just aesthetically pleasing. Remember that this integral does not have an algebraic solution, so calculating its value can be a chore (especially before calculators were invented). Because of this, relationships such as "doubling the arc length" could help avoid recalculating integrals. Instead, you could relate it to an integral which has already been calculated.

Fagnano attempted to discover similar relationships for the arc length of the lemniscate. Impressively, he succeeded in doubling the arc length on the lemniscate. The formula was
<div>
$$2\int^x_0 \frac{dt}{\sqrt{1-t^4}}=\int^{2x\sqrt{1-x^4}/(1+x^4)}_0 \frac{dt}{\sqrt{1-t^4}}$$
</div>

Euler generalized this concept greatly. First, he introduced "arc length addition" on the lemniscate:
<div>
$$\int^x_0 \frac{dt}{\sqrt{1-t^4}} + \int^y_0 \frac{dt}{\sqrt{1-t^4}}= \int^{(x\sqrt{1-y^4} + y\sqrt{1-x^4})/(1+x^2y^2)}_0 \frac{dt}{\sqrt{1-t^4}}$$
</div>
Then, he found that there were similar *addition formulae* for a huge class of elliptic integrals, even when they weren't obviously related to arc length. Later, it would be discovered that all elliptic integrals have similar addition properties. It was one of the most tangible aspects of the otherwise-elusive elliptic integrals.

### 1.0a) An Aside On Euler's Angle Addition

I was slightly uncertain about some language used when describing Euler's angle addition, so I wanted to clarify it here. Let's go back to the case of the circle's arc length.
<div>
$$\int_0^x \frac{dt}{\sqrt{1-t^2}} + \int_0^y \frac{dt}{\sqrt{1-t^2}} = \int^{g(x,y)}_0\frac{dt}{\sqrt{1-t^2}}$$
</div>
Euler had a very traditional way of approaching this problem, and it feels somewhat "backwards" from our current angle. He formulated angle addition as a differential equation
<div>
$$\frac{1}{\sqrt{1-x^2}}dx=-\frac{1}{\sqrt{1-y^2}}dy$$
</div>
What did Euler mean here? Well, let's define a function $f(x,y)$ as
<div>
$$f(x,y) = \int_0^x \frac{dt}{\sqrt{1-t^2}} + \int_0^y \frac{dt}{\sqrt{1-t^2}}$$
</div>
Then we can calculate the differential of this function,
<div>
$$df = \frac{\partial f}{\partial x}dx + \frac{\partial f}{\partial y}dy = \frac{1}{\sqrt{1-x^2}}dx + \frac{1}{\sqrt{1-y^2}}dy$$
</div>
So Euler's differential equation is really an equation of the exact differential form $df$,
<div>
$$df = 0$$
</div>
Okay, so what does this mean? Well, $df=0$ means that we're looking for a region where $f(x,y)$ is constant. In other words, we're looking for solutions to $f(x,y)=C$ or
<div>
$$ \int_0^x \frac{dt}{\sqrt{1-t^2}} + \int_0^y \frac{dt}{\sqrt{1-t^2}}=C$$
</div>
Euler more specifically chose
<div>
$$C = \int_0^{c} \frac{dt}{\sqrt{1-t^2}}$$
</div>
for some arbitrary $c$. So how do we find the values of $(x,y)$ such that $f(x,y)=c$? I have no idea. One source says "Euler guessed correctly and then verified that the solution of the differential equation is
<div>
$$x^2+y^2+c^2x^2y^2=c^2 + 2xy(1+c^4)^{1/2}"$$
</div>
It's a very interesting question as to how one would attack this differential equation, but it's perhaps more interesting that Euler formulated this problem without ever having heard of a differential form.

[1]:https://en.wikipedia.org/wiki/Algebraic_function
[2]:https://en.wikipedia.org/wiki/Rational_function
[3]:https://en.wikipedia.org/wiki/Lemniscate_of_Bernoulli
[4]:https://en.wikipedia.org/wiki/Elliptic_integral