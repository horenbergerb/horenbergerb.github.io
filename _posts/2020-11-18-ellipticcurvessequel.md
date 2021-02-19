# Elliptic Functions Revisited: What Were They Thinking

## Table of Contents <a name="toc"></a>
- [Table of Contents](#toc)
- [0.0) Introduction](#0.0)
- [1.0) Elliptic Integrals: If You Can't Integrate 'Em, Relate 'Em](#1.0)
  * [1.0a)  An Aside On Euler's Addition Formulae](#1.0a)
- [2.0) An Update Much Later In Time](#2.0)

## 0.0) Introduction <a name="0.0"></a>

In my last post on modular forms, most of our time was spent talking about the investigation of elliptic functions during the early 1800s. In this post, we'll take another approach to the investigation of elliptic functions. This new perspective focuses on building towards the investigation of angle division. We'll see how it goes! First, I present a summary of the historical scene before we dig it.

In the wake of Newton's calculus and mechanics, many physical investigations led to differential equations and integrals. Only a small subset of these had been discovered to have [algebraic solutions][1]. Others, such as the integral
<div>
$$\int_0^x \frac{1}{t}dt$$
</div>
could not be solved. This integral was deemed its own function, and it was named the natural logarithm, $\ln x$. One of the first major breakthroughs came after the discovery of partial fraction expansion by Bernoulli. Bernoulli realized that all integrals of [rational functions][2] had algebraic solutions, so long as you were allowed to use $\ln$. Solving integrals became more difficult (and more interesting) when the integrand contained square roots. For example, the integral
<div>
$$\int_0^x \frac{1}{\sqrt{1-t^2}}dt$$
</div>
could not be solved algebraically, even in terms of $\ln$. It arises naturally as the arc length of the circle. It was instead given its own name, $\arcsin x$. Once it was given this name, other integrals involving the square root of degree 2 polynomials could be solved algebraically in terms of $\arcsin$. It may interest you to know that mathematicians would soon discover that $\arcsin$ can, in fact, be expressed in terms of $\ln$, but only when complex numbers are introduced.

It's important to keep in mind the practical implications of these investigations. Because $\arcsin$ and $\ln$ could be calculated accurately using infinite series, tables of values could be calculated and distributed. Then, with the aid of these tables, and by using indefinite integration, a massive range of integrals could be calculated through simple algebra.

Thus far, we have explored the simplest cases of integration handled by mathematicians in the early 1800s. In this post, we will explore the next step in mathematical history. Mathematicians quickly ran into difficulties with integrals involving square roots of polynomials larger than degree two. These were natural candidates as the next focus, being "marginally" more complex than the integrals shown above, and also appearing in physical problems which are "marginally" more complex, such as the arc length of the [lemniscate of Bernoulli][3]:
<div>
$$\int_0^x \frac{1}{\sqrt{1-t^4}}dt$$
</div>
Thus begins the study of elliptic integrals.

## 1.0) Elliptic Integrals: If You Can't Integrate 'Em, Relate 'Em  <a name="1.0"></a>

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

### 1.0a) An Aside On Euler's Addition Formulae  <a name="1.0a"></a>

I was slightly uncertain about some language used when describing Euler's angle addition, so I wanted to clarify it here. Let's go back to the case of the lemniscate's arc length.
<div>
$$\int_0^x \frac{dt}{\sqrt{1-t^4}} + \int_0^y \frac{dt}{\sqrt{1-t^4}} = \int^{g(x,y)}_0\frac{dt}{\sqrt{1-t^4}}$$
</div>
Euler had a very traditional way of approaching this problem, and it feels somewhat "backwards" from our current angle. He formulated arc length addition as a differential equation
<div>
$$\frac{1}{\sqrt{1-x^4}}dx=-\frac{1}{\sqrt{1-y^4}}dy$$
</div>
What did Euler mean here? Well, let's define a function $f(x,y)$ as
<div>
$$f(x,y) = \int_0^x \frac{dt}{\sqrt{1-t^4}} + \int_0^y \frac{dt}{\sqrt{1-t^4}}$$
</div>
Then we can calculate the differential of this function,
<div>
$$df = \frac{\partial f}{\partial x}dx + \frac{\partial f}{\partial y}dy = \frac{1}{\sqrt{1-x^4}}dx + \frac{1}{\sqrt{1-y^4}}dy$$
</div>
So Euler's differential equation is really an equation of the exact differential form $df$,
<div>
$$df = 0$$
</div>
Okay, so what does this mean? Well, $df=0$ means that we're looking for a region where $f(x,y)$ is constant. In other words, we're looking for solutions to $f(x,y)=C$ or
<div>
$$ \int_0^x \frac{dt}{\sqrt{1-t^4}} + \int_0^y \frac{dt}{\sqrt{1-t^4}}=C$$
</div>
Euler more specifically chose
<div>
$$C = \int_0^{c} \frac{dt}{\sqrt{1-t^4}}$$
</div>
for some arbitrary $c$. So how do we find the values of $(x,y)$ such that $f(x,y)=c$? I have no idea. One source says "Euler guessed correctly and then verified that the solution of the differential equation is
<div>
$$x^2+y^2+c^2x^2y^2=c^2 + 2xy(1+c^4)^{1/2}"$$
</div>
It's a very interesting question as to how one would attack this differential equation, but it's perhaps more interesting that Euler formulated this problem without ever having heard of a differential form.

In closing, I'd just like to reflect that this feels very counter-intuitive from our original standpoint. Our original problem was stated like this: we pick an arbitrary $(x,y)$ and calculate the integrals
<div>
$$\int_0^x \frac{dt}{\sqrt{1-t^4}} + \int_0^y \frac{dt}{\sqrt{1-t^4}}$$
</div>
Then we wanted to find a value $c$ such that 
<div>
$$\int_0^x \frac{dt}{\sqrt{1-t^4}} + \int_0^y \frac{dt}{\sqrt{1-t^4}} = \int_0^c \frac{dt}{\sqrt{1-t^4}}$$
</div>
In a sense, Euler's investigation began from the other side. He's interested in level sets, meaning you first pick a $C$ such that $f(x,y)=C$ as above. He just picked his $C$ in a very clever way so that the problem was really about addition formulae.

## 2.0) An Update Much Later In Time <a name="2.0"></a>

It has been a while since I wrote this. I have since taken and completed a course on differential topology. My professor was kind enough to point me towards resources on this topic which give a much more lucid account of what is going on. I want to summarize that here.

The source is Siegel's *Topics in Complex Function Theory Volume 1*.

So Fagnano was interested in solving or simplifying
<div>
$$\int_0^x \frac{1}{\sqrt{1-t^4}}dt$$
</div>
As you recall, this integral describes the arc length of the lemniscate. Fagnano new that there was a clever way to simplify the arc length of a circle by "rationalizing" the integral. We will review this method on the circle, because it is the key to Euler's differential equation for the lemniscate. For the circle, we have
<div>
$$\int_0^x \frac{1}{\sqrt{1-t^2}}dt$$
</div>
If we make the substitution
<div>
$$t=\frac{2r}{1+r^2}$$
</div>
for $(0\leq r \leq 1)$ then we find that
<div>
$$\sqrt{1-t^2}=\frac{1-r^2}{1+r^2},\quad \frac{dt}{dr}=2\frac{1-r^2}{(1+r^2)^2},\quad \frac{dt}{\sqrt{1-t^2}}=\frac{2dr}{1+r}$$
</div>
Which means we can solve
<div>
$$\int_0^y \frac{2}{\sqrt{1+r}}dr$$
</div>
to get information about the unsolvable arc length integral! So what we've done here is essentially a change of variables on our integral. In this case, the differential equation
<div>
$$\frac{dt}{\sqrt{1-t^2}}=\frac{2dr}{1+r}$$
</div>
reflects the fact that when you change variables, the integral after substitution will give you identical results to the original integral.

Things get weirder with the lemniscate. Fagnano attempted a similar substitution,
<div>
$$t^2=\frac{2r^2}{1+r^4}$$
</div>
but it turns out this does not rationalize the integral. However, Fagnano noticed the resulting differential equation had a strange appearance:
<div>
$$\frac{dt}{\sqrt{1-t^4}=\sqrt{2}\frac{dr}{\sqrt{1+r^4}}$$
</div>
And he had the insight to apply a similar substitution once more,
<div>
$$r^2=\frac{2u^2}{1-u^4}$$
</div>
Which gives you, eventually,
<div>
$$\frac{dt}{\sqrt{1-t^4}}=2\frac{du}{\sqrt{1-u^4}}$$
</div>
Which you can integrate to derive the integral doubling relationship.

So what are we getting at here? Fundamentally, doubling the arc length is achieved by clever use of the change of variables technique. It might be worth pointing out that, while integrals are front-and-center to this process, actually calculating integrals has been totally irrelevant. We've been using the battlefield of integrals to facilitate some clever substitutions, and the behavior of the integrals simply verfies whether our substitutions do what we want.

What we've discovered form this investigation is that, if $t$ is a point on the ellipse, then $u(r(t))$ is the point which has half the arc length of $r$. That's the key discovery we've made.

Finally, I just wanted to wrap up by loosely discussing the general addition for the lemniscate. Essentially, one makes a substitution along the lines of
<div>
$$t=\frac{u\sqrt{1-v^4}+v\sqrt{1-u^4}}{1+u^2v^2}$$
</div>
I'll simply say that this is again inspired by the circle, and see Siegel for more details. Note in particular that when $u=0$, then $v=t$. Then one can take the derivative with respect  to $u$ and find that
<div>
$$\frac{du}{\sqrt{1-u^4}}+\frac{dv}{\sqrt{1-v^4}}=0$$
</div>
which, knowing that $u=0\implies v=t$, implies
<div>
$$\int_0^u\frac{du}{\sqrt{1-u^4}}+\int_t^v\frac{dv}{\sqrt{1-v^4}}=0$$
</div>
Then
<div>
$$\int_0^u\frac{du}{\sqrt{1-u^4}}+\int_0^v\frac{dv}{\sqrt{1-v^4}}-\int_0^t\frac{dv}{\sqrt{1-v^4}}=0$$
</div>
Finally implies
<div>
$$\int_0^u\frac{du}{\sqrt{1-u^4}}+\int_0^v\frac{dv}{\sqrt{1-v^4}}=\int_0^t\frac{dv}{\sqrt{1-v^4}}$$
</div>
So, this isn't the cleanest conclusion in the world, but I think what helped me here was seeing that the real magic is happening in the substitutions. The differential equation critically relies on the fact that $t=f(u,v)$ and that $u=0\implies v=t$.

Now that I'm done plagiarizing Siegel, I wanted to reflect a little bit before I peace outta here. In particular, I feel like this rundown lost sight of my original goal: obfuscating the problem with manifolds. What are we doing from the manifold perspective?

Looking at this with fresh eyes, here is my take: we have a differential form defined by
<div>
$$\omega=\frac{1}{\sqrt{1-t^4}}dt=\omega(t)dt$$
</div>
We use slightly ugly notation ($\omega \neq \omega(t)$) to distinguish the whole differential form from its constituent basis form and function part.

Now, we're interested in finding mappings to other manifolds that we can pull back $\omega$ to a sum of identical differential forms? Let's visualize the pullback. The first lemniscate substition is a mapping
<div>
$$F(r)=\sqrt{\frac{2r^2}{1+r^4}}=t$$
</div>
So to calculate the pullback, we are computing
<div>
$$F^*\omega=\omega(F(r))*dF$$
</div>
Breaking this apart, and using some constraints on the parameter (greater than/equal to 0, less than 1)
<div>
$$\omega(F(r))=\frac{t^4+1}{t^4-1}$$
</div>
And similarly we can calculate
<div>
$$dF=\frac{dF}{dt}dt=\frac{\sqrt{2}(1-t^4)}{(t^4+1)^{3/2}}$$
</div>
Putting these together, we find that, as expected,
<div>
$$F^*\omega=\sqrt{2}\frac{1}{\sqrt{t^4+1}}$$
</div>
Now, while this is a nice exercise in applying the language of manifolds to typical calculus, it doesn't really solve the fundamental questions I have about this situation. We have that angle addition formulae are mappings between manifolds that pull back differential forms to sums of identical differential forms. Does this phenomenon fit into a bigger picture?

I like the visualization of hopping along manifolds using substitutions, and in each manifold, you find that you've also solved another integral of interest. Is this the best way to view the situation? I don't know, but it's pretty cool.

Alright, gotta go do homework. Peace out.

[1]:https://en.wikipedia.org/wiki/Algebraic_function
[2]:https://en.wikipedia.org/wiki/Rational_function
[3]:https://en.wikipedia.org/wiki/Lemniscate_of_Bernoulli
[4]:https://en.wikipedia.org/wiki/Elliptic_integral
[]:https://www.math.purdue.edu/~arapura/preprints/diffforms.pdf