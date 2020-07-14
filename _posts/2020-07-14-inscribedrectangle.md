# The Inscribed Rectangle Proof, Visually

## Introduction

This post is about [an amazing modern proof published by Joshua Evan Greene and Andrew Lobb][1]. Their statement is simple, as far as mathematical papers go:

<div>
$$\text{For every smooth Jordan curve, }\lambda\text{, and rectangle }R\text{ in the Euclidean plane... There exists a rectangle similar to }R\text{ whose vertices lie on }\lambda\text{."}$$
</div>

Let's rephrase this in (approximately equivalent) human terms: Draw a smooth loop on a piece of paper. Now, pick a rectangle of some length:height proportion. A simple example might be 1:1, which is a square. 2:1 would be a little more rectangle-y. The claim is that you can find 4 points on your loop which make a rectangle of that proportion. This sounds a little zany, so let's look at an example.

First, here's your curve:
![Raw curve](images/rawcurve.png)

Now, let's start simple. Can we find a square? We sure can!

![Curve with square](images/curvewithsquare.png)

Keep in mind that the method used to find our shapes is algorithmic, and it's not perfect, but the proof that these shapes exist *is* perfect. Let's find a more rectangular rectangle. From now on, we will describe the proportions of a rectangle by the angle between its diagonals. For example, a square would be 90 degrees or $\pi /2$ radians. We will refer to this angle as $\phi$ (pronounced "fee," if you were wondering). Let's try a rectangle with $\phi = \pi /4$

![Curve with rectangle](images/curvewithrectangle.png)

So far, so good! But we won't much much further by picking more rectangles. If we want to see why this is true, we need to start digging into the actual proof. We'll ease into it by talking about what a rectangle really is in the eyes of these mathematicians.

## What's in a Rectangle?

I find one convenient way to begin down this long road is by asking an intuitive question: how would you search for an inscribed rectangle on some loop? Your first instinct might be along the lines of

1. Pick four points on the loop
2. Check if they form a rectangle
3. Check if the angle, $\phi$, is correct
4. Repeat

This is hypothetically a sufficient method to go about finding your rectangle. It might take a very long while, but that doesn't bother mathematicians. What does bother mathematicians, however, is excess! For example, say on step one you've picked two points and have two more to choose. You can immediately tell that most other points would not be a good choice! There's actually only four points on your piece of paper that would give you a rectangle of the desired proportions, and all you need to know is whether those points are on the curve too. Here's an example where we're searching for a rectangle with angle $\phi=\pi /4$. We've already picked two points, and we can see the only possible rectangles with the right proportions.

![Two points with all completed rectangles](images/completedrectangles.png)

Those two points are, consequently, no good. So this narrows our search a little bit, which is nice. However, the reason this method is important is because it's more distilled. When we were picking four points at a time, there was a lot of excess information that wasn't relevant, since two points already told us what we wanted to know. We're doing some housekeeping on the information relevant to our problem before we start building theory.

I'm sure you're all asking, "but given $\phi$, how can we mathematically determine these two rectangles once we've chosen a pair of points?" Well, I'll tell you. In the paper, the authors use complex numbers to make the arithmetic more convenient. We'll do that too, but you could also answer this with boring old geometry in cartesian coordinates if you desired.

The first thing we do is convert coordinates into complex numbers, $(a,b)\rightarrow a+bi$. Pretty easy, right? so our pair of points might go

<div>
$$(a,b)\rightarrow a+bi \quad (c,d)\rightarrow c+di$$
</div>

Next, we are going to calculate two intermediate values. These intermediate values will give us all four points on the rectangle.


[1]:https://arxiv.org/pdf/2005.09193.pdf "Original Preprint"