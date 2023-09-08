---
custom_excerpt: |
  "...All this is to say that I found myself straining to say anything interesting about rotational motion. Hence, the following discovery....."
tag: blog
---

# A Short Proof About Circular Motion

* TOC
{:toc}

# Hey, what's up?

It's been a while since I've made a new blog post. This is not for lack of shenanigans. I decided I'd get back into it by sharing a short little "proof" I came up with.

I've been reading the Feynman lectures on physics, and I've really appreciated the way he approaches problems by encouraging you to reason from first principles. It's something I want to internalize into my own studies, so I've been trying to take simple problems and attack them by direct reasoning without doing a bunch of supplementary research.

Last night, Morris Kline's "Mathematical Thought From Ancient To Modern Times Volume 2" got me thinking about pendulums, and I was trying to do some first principles derivations. I quickly found myself backtracking to the concept of rotational motion, where I discovered that I don't have much intuition developed. Further, it's not trivial to derive fundamental concepts in rotational motion from Newtonian mechanics.

All this is to say that I found myself straining to say anything interesting about rotational motion. Hence, the following discovery.

# The Velocity of Circular Motion

The question is simple: what does velocity look like during circular motion? You might know the answer, but can you prove it?

Here's how my investigation proceeded.

If we're talking about circular motion, we can start with a level set representation of the path in Cartesian coordinates:

$$x^2 + y^2 = r^2$$

Now let's parameterize this with respect to some time parameter, $t$. $y$ is determined by $x$ as follows:

$$y^2 = r^2 - x^2 \implies y = \pm \sqrt{r^2-x^2}, \; x\in [-r, r]$$

Let's focus on the upper hemisphere and make $x$ a function of time:

$$y=\sqrt{r^2-x^2}, \; x=f(t)$$

Okay, cool, so now we have an arbitrary circular trajectory. We can calculate the velocity as

$$\frac{dx}{dt} = f'(t)$$

$$\frac{dy}{dt} = \frac{-x f'(t)}{\sqrt{r^2-x^2}}$$

Can we say anything interesting about this? Let's take the simplified special case where $x=0$. Then

$$x=0 \implies \frac{dy}{dt}=0$$

This means that the velocity here is tangential to the trajectory.

|![](/images/2023-09-08-rotationalmotionproof/x_tangential_velocity.jpg)|
|:--:|
| *Yes, I drew this all by myself.* |


Neat, right? But also, isn't it odd? We chose the special case $x=0$, but isn't that rather arbitrary? In fact, we could simply rotate the sphere to a new coordinate system and make any point $x=0$, and the same proof would *still hold*. As a simple example, you can parameterize the function in terms of $y=g(t)$ and prove that the same is true when $y=0$.

Generally, we can use the rotational invariance of the circle to conclude that **the velocity of a particle on a circular trajectory is always tangential to the path of the particle.** This is pretty neat, because it's true even if the particle is speeding up or slowing down, etc. I also like that the proof seems to leverage properties which are invariant to parameterization. There's probably a lesson relating to manifolds, but I'm not really equipped to pontificate on that at the moment.

# Conclusion

Yeah, anyways, that's pretty much it. I just thought this was a neat bit of reasoning that enables you to make a sweeping conclusion about circular motion. I'm not sure how long I'll keep prodding at rotational motion before I get back to working on pendulums. Life's about the journey.

I also hope to post some other articles soon summarizing a bunch of random ML projects I've been working on. We'll see how that goes. Thanks for reading!

# Postscript: More Derivations

I figured I'd calculate the acceleration and see if there were any other interesting conclusions to be made. I got

$$\frac{d^2y}{dt^2} = \frac{\sqrt{r^2-x^2}\left[-f'(t)^2-xf''(t)\right]+xf'(t)\left[-\frac{1}{2}\sqrt{r^2-x^2}2xf'(t)\right]}{r^2-x^2}$$

Which looks awful, but if you set $x=0$ again, you get that

$$x=0\implies \frac{d^2y}{dt^2}=\frac{-f'(t)^2}{r}$$

So the radial acceleration is directly related to the square of the velocity and inversely related to the square of the radius. That's pretty neat, huh?

I was wondering if this an "if and only if" situation, i.e. Supposing there's a point such that the radial acceleration satisifes this criteria, does that imply the particle is on a circular path? I think this is true, since it seems this is the only restriction on acceleration imposed by circular motion.

I think the next thing I might do is try to reason in polar coordinates or something. I need to figure out how to get angles involved. I'm not sure if I'm going to take a geometrical approach or try and get after it analytically. I do enjoy drawing pictures.

Alright, I'm done for real now. Thanks!