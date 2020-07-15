# The Inscribed Rectangle Proof, Visually

## Introduction

This post is about [an amazing modern proof published by Joshua Evan Greene and Andrew Lobb][1]. Their statement is simple, as far as mathematical papers go:

<div>
$$\text{For every smooth Jordan curve, }\lambda\text{, and rectangle }R\text{ in the Euclidean plane...}$$

$$\text{There exists a rectangle similar to }R\text{ whose vertices lie on }\lambda\text{."}$$
</div>

Let's rephrase this in (approximately equivalent) human terms: Draw a smooth loop on a piece of paper. Now, pick a rectangle of some length:height proportion. A simple example might be 1:1, which is a square. 2:1 would be a little more rectangle-y. The claim is that you can find 4 points on your loop which make a rectangle of that proportion. This sounds a little zany, so let's look at an example.

First, here's your curve:

![Raw curve](/images/rawcurve.png)

Now, let's start simple. Can we find a square? We sure can!

![Curve with square](/images/curvewithsquare.png)

Keep in mind that the method used to find our shapes is algorithmic, and it's not perfect, but the proof that these shapes exist *is* perfect. Let's find a more rectangular rectangle. From now on, we will describe the proportions of a rectangle by the angle between its diagonals. For example, a square would be 90 degrees or $\pi /2$ radians. We will refer to this angle as $\phi$ (pronounced "fee," if you were wondering). Let's try a rectangle with $\phi = \pi /4$

![Curve with rectangle](/images/curvewithrectangle.png)

So far, so good! But we won't much much further by picking more rectangles. If we want to see why this is true, we need to start digging into the actual proof. We'll ease into it by talking about what a rectangle really is in the eyes of these mathematicians.

## Turning Points on a Loop Into Rectangles

### A Particular Method of Searching
I find one convenient way to begin down this long road is by asking an intuitive question: how would you search for an inscribed rectangle on some loop? Your first instinct might be along the lines of

1. Pick four points on the loop
2. Check if they form a rectangle
3. Check if the diagonal's angle, $\phi$, is correct
4. Repeat

This is hypothetically a sufficient method to go about finding your rectangle. It might take a very long while, but that doesn't bother mathematicians. What *does* bother mathematicians, however, is excess! For example, say on step one you've picked two points on your loop and have two more to choose. You can immediately tell that most other points would not be a good choice! Once you've picked two points, there's actually only two pairs of points on your piece of paper that would give you a rectangle of the desired proportions, and all you need to know is whether those points are on the curve too. Here's an example where we're searching for a rectangle with angle $\phi=\pi /4$. We've already picked two points, and we can see the only possible rectangles with the right proportions.

![Two points with all completed rectangles](/images/completedrectangles.png)

Those two points are, consequently, no good. So this narrows our search a little bit, which is nice. However, the reason this method is important is because it's more distilled. When we were picking four points at a time, there was a lot of excess information that wasn't relevant, since two points already told us what we wanted to know. We're doing some housekeeping on the information relevant to our problem before we start building theory.

### Calculating the Two Rectangles for a Pair of Points

I'm sure you're all asking, "but given $\phi$ and a pair of points, how can we mathematically determine these two rectangles?" Well, I'll tell you. In the paper, the authors use complex numbers to make the arithmetic more convenient. We'll do that too, but you could also answer this with boring old geometry in cartesian coordinates if you desired. There are two rectangles, so we'll describe two processes and give them each a name. This is straight out of the original paper, so get excited: you're doing math!

The first thing we do is convert coordinates into complex numbers, $(a,b)\rightarrow a+bi$. Pretty easy, right? so our pair of points might go

<div>
$$(a,b)\rightarrow z=a+bi \quad (c,d)\rightarrow w=c+di$$
</div>

Notice we renamed the two points $z$ and $w$ now that they're just complex numbers.

#### Rectangle One

First we are going to calculate two intermediate values. These intermediate values will then give us all four points on the rectangle. For the first rectangle, these values are given by

<div>
$$l:(z, w) \mapsto\left(\frac{z+w}{2}, \frac{z-w}{2}\right) = (p,q)$$
</div>

So now we've got two new complex numbers, which we named $p$ and $q$. If you want your rectangle from these two points, here is how you get them. The first two rectangle points are given by $p+q$ and $p-q$. But that's boring, since these are just the two points we started with (check it yourself). To get the other two points, we're going to rotate $q$ and then do the same adding and subtracting.

Remember that a complex number like $p$ can also be described by a distance and an angle, $r$ and $\theta$. We switch to that notation here because it's a lot easier to write a rotation function. When we switch notations, we'll write $q$ like $(r_q, \theta_q)$. Try to remember that those are exactly the same things.

So, we rotate $q$ by $-\phi$ (negative simply to keep consistent with the paper; don't panic). We can express this as $(p,q)\rightarrow (p, r_q, \theta_q-\phi)=(p,q')$. Then, finally, the last two points of our rectangle are $p+q'$ and $p-q'$.

I won't dwell on why this works for too long. You should be able to calculate why the first two rectangle points work. As for the second two points, the idea is that we're reorienting to get the points on the other diagonal, which is why the angle between diagonals, $\phi$, is involved. I encourage you to explore further on your own.

#### Rectangle Two

One more rectangle to go! This process is very similar to the previous, but we add one more step. Our last construction implicitly assumed which diagonal (a rectangle has two) our original pair of points were on. We're now going to assume they're on the other diagonal. To do this, we start with the function $l:(z, w)=(p,q)$ as before. Now we're adding a new step: another rotation. Define a function that just rotates the $p$ in $(q,p)$ forward by an angle of $\phi$:

<div>
$$R_{\phi}:(p, r_q, \theta_q) \mapsto(z, r_q, \theta_q+\phi)$$
</div>

Then we rotate $q$ again, but this time by $-\phi$, just like our first rectangle. Then, finally, the last two points of our rectangle are $p+q'$ and $p-q'$. The astute reader might be thinking, "hey, didn't we just rotate $q$ by $\phi$ and then by $-\phi$? Isn't that redundant?" It sure is, but I wanted to stay true to the notation of the actual paper, which leads us into this awkward discussion. What matters is that you notice $q$ is rotated by a different amount (a difference of $\phi$) in Rectangle One vs. Rectangle Two.

### Summary

So we've started laying the groundwork for talking about rectangles on loops. We found out that, once you pick a diagonal angle $\phi$, every pair of points $z$ and $w$ can be on two possible rectangles. We calculate the vertices of these two rectangles using two intermediate pairs of points: $l(z,w)$ and $R_{\phi}(l(z,w))$. an intermediate pair $p,q$ is converted to a rectangle by calculating $p \pm q$ and $p \pm (r_q, \theta_q-\phi)$. Here's an overview animation of the process we just described for a bunch of different pairs of points:

![Overview of Search Procedure for Rectangles](/images/rectanglesearch.gif)

The top row shows our selection of two points. In columns one and two, we see the construction of rectangles one and two, respectively. In particular, we build the two $p$ and $q$ points that we will be adding and subtracting to get rectangle vertices. Finally, we see the corresponding rectangle.

We're cooking now!

## The Existence Question

### Beginning With Pairs on the Loop

We've been talking about how one might *search* for a rectangle with the desire proportions, but we haven't talked about whether such a rectangle *actually exists*. This is a pretty big gap to leap. The success of the proof is due partly to the fact that they rephrased the existence question in a way that hinted how one might investigate further.

With our understanding from the previous section, we're ready to start asking the big questions as well. In fact, we only need to play with the tools we've established a tiny bit to see how we might ask whether a rectangle exists at all. Here's the logical process: suppose during our search that we picked a pair of points and found that they *did*, in fact, yield the desired rectangle on our loop. By the Rectangle processes above, our two points will be one of the diagonals.

Here is the interesting part: if we had to use the Rectangle One process to get the right result from our pair, then we could also use the Rectangle Two process on the other diagonal pair to get the same rectangle, and vice versa. So we could have found either diagonal pair to solve our problem. Going further, the two diagonal pairs of the rectangle must use opposite Rectangle processes (check this, if you please). However, you get the same rectangle *and* the same intermediate points (since these uniquely determine the rectangle).

This may sound really elaborate, but we're making this argument because we can now phrase the existence problem within a very neat mathematical framework. The punchline is this:

<div>
$$\text{A rectangle with diagonal angle }\phi\text{ exists on the loop if there is two pairs of points,}$$
</div>

<div>
$$(a,b)\text{ and }(c,d)\text{ on the loop such that }l(a,b) = R_{\phi}(l(z,w)).$$
</div>

To rephrase this one more time, a rectangle exists on the loop if there are two pairs such that you can apply the Rectangle One process to one pair and the Rectangle Two process to the other and get the same intermediate values. Here's a picture to illustrate this concept. The top row is two pairs of points which form the diagonals of the same rectangle. The middle row is the intermediate values, except the first pair used the Rectangle One process while the other pair used the Rectangle Two process.
Finally, we see they generate the same rectangles by the opposite processes.

![Visual example of l(a,b) and R_phi(c,d) on rectangle](/images/existenceclaimexample.png)

So, here's the punchline: if we want to show that a rectangle of the desired proportion exists, all we need to show is that there's some $(a,b)$ and $(c,d)$ on the curve such that $l(a,b) = R_{\phi}(l(z,w))$. To tackle this problem, we're going to leave behind points on the curve and start talking about the spaces of possible intermediate points, $l(z_1,w_1)$ and $R_{\phi}(l(z_2,w_2))$. Another way to word our problem is that we're trying to show that their intersection is non-empty, meaning they share a point somewhere.

### Rephrasing With Intermediate Values

  We now know that finding a rectangle with diagonal angle $\phi$ is equivalent to finding a shared pair of points between $l(z_1,w_2)$ and $R_{\phi}(l(z_2,w_2))$. Thus far, we've taken points from our loop one pair at a time and plugged them into these formulas. Since we're looking for the intersection of these two spaces, we need to think bigger.

We're going to take *all* the pairs of points off the loops, plug them into $l(z_1,w_2)$, and call resulting blob of pair of intermediate values $L$. We can make this more rigorous: if $\lambda$ is all the points on our curve, then $\lambda \times \lambda$ is the set of all pairs of points, and $L=l(\lambda \times \lambda)$. We also define something similar for the other equation, $L_{\phi} = R_{\phi}(l(\lambda \times \lambda))$.

Thus, we have two blobs, which are each composed of pairs of complex numbers received by plugging into our two Rectangle processes.

$$L=l(\lambda \times \lambda) \quad L_{\phi} = R_{\phi}(l(\lambda \times \lambda))$$

This may seem a little abstract, so the following visualizations show how these blobs relate to our original curve. We trace a path along pairs of points in the original curve, and we observe the resulting points in $L$ and $L_{\phi}$. How we represent our intermediate points is a little different from how we plotted our original pairs of points. We give each of the intermediate points its own graph, because we want to leave room to see all the possible pairs at once.

The colored blob was drawn by the tracing process illustrated in the images. It's very important to observe the color gradient. *Only* pairs which were drawn simultaneously--and thus which have the same color--are valid pairs. You *cannot* pick any arbitrary point from each blob and mash them together.

![plotting L](/images/L_animated.gif)

![plotting L](/images/L_phi_animated.gif)

So, in summary, our spaces $L$ and $L_{\phi}$, the collections of possible intermediate values, are each represented by two colorful blobs. Each blob is all possible values of one point in the pair of points. For $L$ or $L_{\phi}$, you can match intermediate pairs between the two blobs by finding points with identical colors.

You should keep in mind that the plots here are not perfect: you can see that the path overlaps itself, and thus previous colors in a spot get wiped out by later colors. As a result, you can't see all of the valid pairs of points. This method is imperfect because the pairs of complex-valued points actually sit in 4-dimensional space. I'm strapping together two 2-dimensional planes and calling it close enough. This model is sufficient for expressing many of the ideas to come.

Now, how do we rephrase our original goal to fit these pretty pictures? We're trying to find pairs of points on L (remember they must match in color) which are in the same positions as a pair of points on $L_{\phi}$ (which must have their own matching color). This is the intersection of $L$ and $L_{\phi}$.

To clarify this, let's plug in the diagonals of an actual solution rectangle. Notice that we plug one diagonal into $L$ and the other diagonal into $L_{\phi}$. This is a reminder to keep in mind that the original points don't need to be the same for our intersection. We can leave behind our original points and start thinking about $L$ and $L_{\phi} alone. In the next section, we'll start making some sense of these blobs!

## Intermission: Gathering Information With Topology

So we've got two spaces, $L$ and $L_{\phi}$, and the inscribed rectangle existence question has been made equivalent to the question of whether $L$ and $L_{\phi}$ share any points. Why have we done all of this awkward rephrasing? Well, believe it or not, mathematicians have a lot of tools for handling questions like this.

In this section, we're going to start invoking some tools of topology to describe our $L$ and $L_{\phi}$ spaces. Although the concepts are somewhat abstract, our visual guides will help keep us grounded. We're going to establish that most of the things we've been looking at are some kind of torus. Then we're going to twist $L$ and $L_{\phi}$ up into mobius strips by mapping them with a function. Topologists do this kind of bending and distorting to get new perspectives on the same data. We already did some of this earlier with $l$ and $R_{\phi}$ on our original set!

In fact, at this point we are very near the heart of the proof. The general idea is that when $L$ and $L_{\phi}$ are twisted into mobius strips, you can "smooth" them together into one collective object. This object is a Klein bottle ([Here is a brief summary of how a Klein bottle is made from two mobius strips][2]). But since we're in 4-dimensional space ($\mathbb{C}^2$), the Klein bottle has to intersect itself. However, this means that $L$ and $L_{\phi}$ have to intersect each other, thus solving the existence problem!

[1]:https://arxiv.org/pdf/2005.09193.pdf "Original Preprint"
[2]:https://www.youtube.com/watch?v=a5Azcwe9p4o