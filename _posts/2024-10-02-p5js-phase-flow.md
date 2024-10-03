---
custom_excerpt: |
  A few animations relating to the harmonic oscillator. This post is just a prequel in the symplectic geometry cinematic universe.
tag: blog
dependencies:
    - p5
    - p5.dom
---

# Visualizing Phase Fluid and Liouville's Theorem

* Table of Contents
{:toc}

# Introduction

I've been trying to make sense of symplectic geometry again. I know that it originates from classical mechanics, particularly Hamiltonians, but I'm not totally clear how. I came across a very interesting [Reddit post](https://www.reddit.com/r/math/comments/wt9rsz/how_to_explain_symplectic_geometry/) that made the following remark:

>if we imagine many nearby points in our phase space and watch a "fluid" of points flowing as time passes, the volume of that fluid is preserved (cf [Liouville's theorem](https://en.wikipedia.org/wiki/Liouville%27s_theorem_(Hamiltonian)))! The way we measure the volume of a phase fluid is called a symplectic form, and symplectic geometry is precisely the study of 2N-dimensional spaces endowed with a symplectic form.

I don't plan to elaborate on symplectic forms here, but I did realize I can make some neat visualizations of phase fluid.

# Harmonic oscillator phase diagram

So a [harmonic oscillator](https://en.wikipedia.org/wiki/Harmonic_oscillator) is basically just a pendulum or a frictionless spring. The behavior of a harmonic oscillator is determined by the equation

$$\vec{F}=-k\vec{x}$$

where $k$ is a constant.

Sometimes we want to consider all the possible configurations of a particular harmonic oscillator (i.e. a harmonic oscillator with some known value of $k$). What I mean is, if we start the oscilator at any position $x$ and velocity $v$, what will it do?

We can represent all of the configurations simultaneously by imagining the [phase space](https://en.wikipedia.org/wiki/Phase_space). This is just a graph where the x-axis is the oscillator's position and the y-axis is the oscillator's velocity.

If you choose a starting point on the plot, you can calculate how the oscillator's position and velocity will change at each moment based on its current position using $\vec{F}=-k\vec{x}$. This lets you simulate the oscillator bouncing over time.

Here's a bunch of spring configurations that have randomly initialized positions and velocities. Each dot represents one spring. You can see some of the behavior you might expect from a spring: the $x$ values oscillate, and $x$ reaches a maximum when $v$ is at 0.

<div class="p5js-sketch" id="simple-sketch-holder-1">
    <script type="text/javascript" src="/scripts/2024-10-02-p5js-phase-flow/harmonic_oscillator_phase_trajectories.js"></script>
</div>

There are some other interesting properties, too. Notice how the dots never intersect? That's pretty neat, and there's more to say about it.

# Estimating area of a region in phase space

So basically, Liouville's theorem says that if you initialized a whole region of the phase space and let it flow around, the area of that "phase fluid" should remain constant as it moves around. This is only true for systems where the total energy is conserved.

We can visualize this for the harmonic oscillator. I'll initialize a rectanglar region of phase fluid and let it flow.

<div class="p5js-sketch" id="simple-sketch-holder-2">
    <script type="text/javascript" src="/scripts/2024-10-02-p5js-phase-flow/harmonic_oscillator_phase_fluid_volume.js"></script>
</div>

Strangely, the phase fluid remains a 4-sided polygon over time, although the width, height, and angles can vary. This preservation of polygons is NOT a general property of phase spaces, but rather a quirk of harmonic oscillators (todo: prove this).

But that means that it's easy to calculate the area of our phase fluid at any point in time. All you need is the corner points (highlighted in the visualization). Then you can use the [shoelace formula](https://en.wikipedia.org/wiki/Shoelace_formula) to calculate the area of the polygon.

Lo and behold, the area remains constant! That's pretty cool! So you can actually visualize the fact that Liouville's theorem holds for a harmonic oscillator.

This trick would be harder to pull off for other physical systems, but I think I can extend it to systems where simple polygons remain simple polygons (so I can measure area of the phase fluid using the shoelace algorithm).

# Conclusion

I dunno, this is just a neat trick I whipped up pretty quickly. p5.js is useful for visualization. I think this is helping provide some more intuition for how symplectic geometry works, but I'll have to write a separate article about that. Thanks for reading!

# Todos

Things I'd like to do:

- Verify Liouville's theorem is expected to hold here. I see a lot of people only apply it after massaging things to get the Hamiltonian equations. Is that necessary?

- Add friction and visualize again. The area conservation probably won't hold then, but what will it look like?

- Relate this to the symplectic form $d\omega$. You integrate a symplectic form over a region to get an area. Letting the phase flow progress for a fixed time $t$ is basically like a change of variables for the integral? Then you can show that for conservative systems, this transformation preserves $d\omega$? Something like that.

- Plug in some more interesting systems and see how the areas/volumes transform over time.