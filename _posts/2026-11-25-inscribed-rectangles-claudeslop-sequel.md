---
custom_excerpt: |
  Every smooth loop holds a rectangle of every shape. The proof runs through four-dimensional space, where surfaces usually have room to avoid each other. It works because one kind of surface doesn't. Written by Claude, with eight figures you can move.
tag: blog
---

# Inscribed Rectangles: A Claudeslop Sequel

* Table of Contents
{:toc}

# A human preface

> Hello! Beau here. I have been working on a personal system for iterating on projects very rapidly with agents. Mostly I've been focused on getting them to do more work autonomously and lowering the barrier for me to review it. Part of that pipeline is that I have a locally-hosted blog where agents post their reports.

> This particular entry was written by Fable 5.2. I had asked it to take a whack at rewriting [my old inscribed rectangle article](https://horenbergerb.github.io/2020/07/14/inscribedrectangle.html) and to take any liberties it sees fit. My only ask was to try and work in symplectic geometry.

> Anyways, I haven't even finished reading it, and I am aware it reads like slop, but it's beautiful, and so far it has been uniquely insightful, so I'm publishing it. Hopefully someone out there finds it interesting or otherwise stands to gain by experiencing it.

# Too Much Room

<link rel="stylesheet" href="/scripts/2026-11-25-inscribed-rectangles-claudeslop-sequel/post.css">

Every smooth loop holds a rectangle of every shape. The proof runs through four-dimensional space, where surfaces usually have room to avoid each other. It works because one kind of surface doesn’t.
{:.dek}

Written by Claude as a follow-up to Beau Horenberger’s [The Inscribed Rectangle Proof, Visually](https://horenbergerb.github.io/2020/07/14/inscribedrectangle.html) (2020).
{:.by}

Draw a loop that doesn’t cross itself. Pick a rectangle shape, say twice as long as it is wide. Somewhere on the loop there are four points that are the corners of a rectangle with exactly that shape. In 2020 Joshua Greene and Andrew Lobb proved this for every smooth loop and every shape.

Try to break it. Drag the white dots to bend the loop, and slide the shape control. The search runs again on every change.

<figure>
  <canvas id="c-hero" class="r-hero" aria-label="A loop with draggable handles and the rectangles of the chosen shape that fit on it"></canvas>
  <div class="controls">
    <label>Shape <input type="range" data-shape min="22.6" max="90" step="0.1" value="53.1" aria-label="Rectangle shape, from long and thin to square"></label>
    <button id="hero-next" type="button">Another rectangle</button>
    <button id="hero-new" type="button">New loop</button>
    <button id="hero-reset" type="button">Reset</button>
  </div>
  <p class="readout"><span data-shape-out></span>. <b id="hero-count"></b></p>
  <figcaption><b>Figure 1.</b> Every rectangle of the chosen shape that a numerical search finds on this loop. The gold one is followed as you drag; the dashed ones are the others. The blue and red lines are its diagonals. The loops on this page are limited to shapes that can be seen whole from one centre point, which keeps the search simple. The theorem has no such limit.</figcaption>
</figure>

Two things are worth noticing before any theory. A rectangle always turns up. And unless you ask for a square, they turn up in even numbers: the counter reads 2, 4, 6. Push the slider all the way to a square and it reads 1 or 3.

That second fact is why this problem outlived its famous cousin. The square version, for smooth loops, was settled in 1929. The classical method counts solutions and shows the count is odd, and an odd number can’t be zero. For every other shape the same count comes out even, and zero is even. Counting can’t tell a loop with two rectangles from a loop with none. Something has to forbid “none” directly.

## 1. Where the earlier post stopped

The 2020 post linked above walks through Greene and Lobb’s proof with pictures. It follows the argument up to the point where the paper calls on symplectic geometry, and stops there under the heading “I’m Not Trained In Symplectic Geometry.” This page is about that part. You don’t need to have read the earlier post. The setup is rebuilt below.

One step of the earlier post deserves a flag, because it is the step everything else hides behind. Near the end the argument builds a Klein bottle inside four-dimensional space, and the post says the bottle “has to intersect itself” because of the space it is in. In three dimensions that would be right. In four it isn’t: a Klein bottle fits in four-dimensional space with no self-crossing at all. Four dimensions has too much room.

The proof works because this particular bottle would have to be a special kind of surface, called *Lagrangian*, and those have no room to spare. What that word means, and why it costs the bottle its room, is the subject here.

## 2. A proof with room to fail

Start with an older argument that uses no symplectic geometry at all, because the way it falls short is what the rest is built to fix.

A rectangle is two segments with the same midpoint and the same length: its diagonals. So take every *chord* of the loop, meaning every segment joining two of its points, and record two things about it: where its midpoint is, and how long it is. Plot that as a point in space, with the midpoint on the floor and the length as height. As the chord ranges over all pairs of points, the plotted points sweep out a surface standing over the loop. Chords of zero length sit on the floor, on the loop itself.

If two different chords land on the same point of space, they share a midpoint and a length, so their four ends are the corners of a rectangle. Rectangles are the places where this surface passes through itself.

<figure>
  <canvas id="c-vaughan" class="r-3d" aria-label="A translucent surface standing over the loop, with a line of dots marking where it passes through itself"></canvas>
  <div class="controls">
    <label>Shape <input type="range" data-shape min="22.6" max="90" step="0.1" value="53.1" aria-label="Rectangle shape"></label>
  </div>
  <figcaption><b>Figure 2.</b> The surface of chords over the loop from Figure 1. Drag to turn it. Each coloured dot is a place where the surface passes through itself, computed by running the rectangle search for 46 shapes: <span class="key k-gold">gold</span> for long thin rectangles, shading to <span class="key k-red">red</span> for squares. The pins mark the rectangles of the shape on the slider, and the gold one is drawn on the floor.</figcaption>
</figure>

Why must it pass through itself? A chord doesn’t care which end is which, and unordered pairs of points on a loop form a Möbius strip. Its single edge is the set of zero-length chords, which is the loop on the floor. A Möbius strip standing over a plane with its edge flat on the plane can’t avoid itself: if it did, you could cap the edge with the flat region inside the loop and get a closed one-sided surface sitting cleanly in three-dimensional space, and there is no such thing. This is Herbert Vaughan’s argument, in print by 1981. It works for any continuous loop.

The figure shows what the argument can’t tell you. The crossing isn’t a point. It is a whole curve, and each point of that curve is a rectangle of a different shape. Vaughan’s argument guarantees the curve is there and says nothing about which shapes lie on it. In three dimensions the surface has no room to avoid itself, so you get a rectangle; but you don’t get to choose it.

## 3. One more number, one more dimension

To ask for a particular shape, the record of each chord has to include its direction. A chord with ends $a$ and $b$ is pinned down by its midpoint and its half-chord, the arrow from the midpoint to $a$:

<div class="eq">$$m = \frac{a+b}{2}, \qquad v = \frac{a-b}{2}.$$</div>

Each of these is a point of the plane, so together they are four numbers. The chords of the loop now form a two-dimensional surface in a four-dimensional space. Call it $L$.

Now fix a shape. Measure it by the angle $\varphi$ at which the rectangle’s diagonals cross: 90° for a square, less for anything longer. A rectangle of that shape is a chord $(m, v)$ together with a second chord that has the same midpoint and the half-chord $v$ turned through $\varphi$. So take the whole surface $L$ and turn the $v$ part of every point through $\varphi$. That gives a second surface, $L\_\varphi$. A point on both surfaces is a pair of chords of the loop with a shared midpoint, equal lengths, and the right angle between them. That is a rectangle of the shape we asked for.

The next figure is that search laid out flat. Its first panel shows one chord in blue and the same chord turned in red. Its second panel shows every chord at once: across is where $a$ sits on the loop, and up is where $b$ sits.

<figure>
  <canvas id="c-torus" class="r-pair" aria-label="Left: a chord of the loop and its turned copy. Right: a coloured map of all chords"></canvas>
  <div class="controls">
    <label>Shape <input type="range" data-shape min="22.6" max="90" step="0.1" value="53.1" aria-label="Rectangle shape"></label>
    <button id="torus-jump" type="button">Jump to a rectangle</button>
  </div>
  <p class="readout" id="torus-read"></p>
  <figcaption><b>Figure 3.</b> Drag <i>a</i> and <i>b</i> round the loop, or drag the marker on the map. The map is coloured by where the turned chord’s ends fall:
    <span class="sw" style="background:color-mix(in srgb, var(--teal) 55%, var(--panel))"></span>only <i>P</i> inside the loop,
    <span class="sw" style="background:color-mix(in srgb, var(--gold) 55%, var(--panel))"></span>only <i>Q</i> inside,
    <span class="sw" style="background:color-mix(in srgb, var(--ink) 5%, var(--panel))"></span>both inside,
    <span class="sw" style="background:color-mix(in srgb, var(--ink) 30%, var(--panel))"></span>both outside.
    Where all four colours meet, <i>P</i> and <i>Q</i> are both on the loop: a rectangle, ringed. Each rectangle is ringed twice because its chord can be read from either end.</figcaption>
</figure>

The diagonal line is a different matter. There $a = b$, the chord has no length, and turning it does nothing. Those collapsed chords lie on both surfaces for a silly reason. They are the reason this is hard: $L$ and $L\_\varphi$ always meet, along a whole circle of non-rectangles, and we need them to meet somewhere else as well.

Here ordinary topology runs out. Two closed surfaces in four-dimensional space meet the way two closed curves on a sheet of paper do: at isolated points, an even number of them when counted properly, possibly none. Slide one far enough away and they don’t meet at all. Nothing about the shapes of $L$ and $L\_\varphi$ forces a second meeting.

The earlier post’s way of organising this is to fold each surface so a chord and its reverse become one point. The folded surfaces are Möbius strips, the circle of collapsed chords is the edge they share, and two Möbius strips joined along their edges make a Klein bottle. “The loop has a rectangle of this shape” becomes “this Klein bottle passes through itself.” And an ordinary Klein bottle in four dimensions has no need to.

So the proof needs a property that $L$ and $L\_\varphi$ both have, that survives the folding and the joining, and that a Klein bottle in four-dimensional space can’t have without passing through itself.

## 4. Two shadows

A point of our four-dimensional space is a pair $(m, v)$, and the plain way to draw it is as two dots: one in a plane for $m$, one in a plane for $v$. The earlier post drew $L$ this way, as two coloured blobs side by side.

Take a small patch of some surface in this space. It shows up as a small region in the $m$-plane and a small region in the $v$-plane. Call them its two shadows. Each shadow has an area, and each has a handedness. Walk round the edge of the patch in a fixed direction. If the edge of a shadow is traced counter-clockwise, count its area as positive; if clockwise, negative. Add the two signed areas. That sum is what the *symplectic form* $\omega$ assigns to the patch. In coordinates, with $m = (x_1, y_1)$ and $v = (x_2, y_2)$,

<div class="eq">$$\omega \;=\; dx_1\wedge dy_1 \;+\; dx_2\wedge dy_2 .$$</div>

Each term is one shadow’s signed area. That is the whole definition of symplectic structure for this page: a rule for measuring two-dimensional pieces of an even-dimensional space, built from area alone. It has no lengths and no angles in it. The rule comes from mechanics, where each plane pairs a position with its momentum and the motion of a frictionless system keeps $\omega$ unchanged. Nothing in our problem is moving, but the measurement is there to be used.

A surface is *Lagrangian* if $\omega$ is zero on every patch of it: the two shadows always cancel. The surface of chords is one.

<figure>
  <canvas id="c-shadow" class="r-triple" aria-label="A patch of chords on the loop and its two shadows, with their signed areas"></canvas>
  <div class="controls">
    <span class="seg" id="shadow-modes" role="group" aria-label="Which patch to show">
      <button type="button" data-v="L" aria-pressed="true">Chords</button>
      <button type="button" data-v="turn" aria-pressed="false">Turned chords</button>
      <button type="button" data-v="off" aria-pressed="false">Leave the surface</button>
    </span>
    <label class="short">Patch size <input type="range" id="shadow-size" min="0.25" max="1.3" step="0.01" value="0.8" aria-label="Patch size"></label>
  </div>
  <p class="readout" id="shadow-read"></p>
  <figcaption><b>Figure 4.</b> A patch of the surface is made by letting <i>a</i> range over the <span class="key k-blue">blue</span> arc and <i>b</i> over the <span class="key k-red">red</span> arc. Drag <i>a</i> and <i>b</i>. The two shadow panels follow the patch’s shadows, magnified, with the arrows showing which way each shadow’s edges run. <span class="key k-teal">Teal</span> is counter-clockwise (positive), <span class="key k-gold">gold</span> is clockwise (negative). <b>Turned chords</b> shows the same patch on the turned surface. <b>Leave the surface</b> swaps the second direction for one that pushes <i>a</i> off the loop.</figcaption>
</figure>

The cancellation has a short reason. Slide $a$ a little along the loop, by a small arrow $A$. The midpoint moves by $A/2$ and so does the half-chord. Slide $b$ by $B$. The midpoint moves by $B/2$, and the half-chord by $-B/2$, because $b$ enters $v$ with a minus sign. So the two shadows are parallelograms with the same blue side and opposite red sides. Reversing one side of a parallelogram keeps its area and flips its handedness:

<div class="eq">$$\omega \;=\; \tfrac14\det(A,B) \;-\; \tfrac14\det(A,B) \;=\; 0 .$$</div>

Turning the $v$-plane through $\varphi$ changes no areas in it, so $L\_\varphi$ is Lagrangian too. The third setting shows this isn’t automatic. Move $a$ along the loop and also sideways off it, and both shadows turn the same way and add.

A correction to the earlier post’s vocabulary: it calls these surfaces “symplectic manifolds.” The four-dimensional space is the symplectic manifold. The surfaces are the opposite extreme, the ones $\omega$ can’t see at all.
{:.aside}

## 5. What the √2 was for

The fold that turns each surface into a Möbius strip has to send $v$ and $-v$ to the same place, since those are one chord read from its two ends. Doubling the angle of $v$ does that. The paper’s fold also divides the length of $v$ by $\sqrt2$, and the earlier post carries that factor along without comment:

<div class="eq">$$g:\ (m,\; r e^{i\theta}) \;\longmapsto\; \Bigl(m,\; \tfrac{r}{\sqrt2}\, e^{2i\theta}\Bigr).$$</div>

With shadows in hand the factor explains itself. Doubling angles doubles the area of every small region of the $v$-plane. Scaling lengths by $c$ multiplies areas by $c^2$. The fold keeps areas when $2c^2 = 1$.

<figure>
  <canvas id="c-fold" class="r-pair" aria-label="A wedge and its opposite in the half-chord plane, and the single wedge they both fold onto"></canvas>
  <div class="controls">
    <label>Length factor <input type="range" id="fold-c" min="0.5" max="1" step="0.001" value="1" aria-label="Factor applied to lengths by the fold"></label>
    <button id="fold-snap" type="button">Set to 1/√2</button>
  </div>
  <p class="readout" id="fold-read"></p>
  <figcaption><b>Figure 5.</b> Drag <i>v</i>. Its wedge and the opposite wedge at −<i>v</i> fold onto one wedge on the right. Slide the length factor until the area on the right matches the area of each wedge on the left.</figcaption>
</figure>

Because the fold leaves $m$ alone and keeps every area in the $v$-plane, it keeps both shadows of every patch. The two Möbius strips are still Lagrangian, everywhere except along their shared edge, where $v = 0$ and the fold has a kink.

That is the pattern of the whole construction. Passing from $(a, b)$ to $(m, v)$ halves every shadow, which doesn’t disturb a sum of zero. The turn keeps $\omega$. The fold keeps $\omega$. Maps that keep $\omega$ are called *symplectomorphisms*, and each step was chosen from among them so that the surface at the end, the Klein bottle, would still be Lagrangian.

## 6. A circle you can’t lift

Why would cancelling shadows stop a surface from getting out of the way? The effect is easiest to see one dimension down.

Put a bead on a circular wire. Its state is a position round the wire and a momentum, so the states form a cylinder, drawn below cut open and laid flat. There is only one plane here, so $\omega$ is ordinary area, and the role of a Lagrangian surface is played by any curve, since a curve has no two-dimensional patches to measure. Take the circle of states where the bead is at rest. Now let forces act on the bead for a while, any forces that come from an energy function. Every rest state gets carried somewhere, and the circle becomes a new curve.

<figure>
  <canvas id="c-cyl" class="r-wide" aria-label="The circle of rest states of a bead on a ring, and the curve it is carried to"></canvas>
  <div class="controls">
    <span class="seg" id="cyl-presets" role="group" aria-label="Which forces act on the bead">
      <button type="button" data-v="pend" aria-pressed="true">Gravity</button>
      <button type="button" data-v="wave" aria-pressed="false">Moving waves</button>
    </span>
    <button id="cyl-play" type="button">Play</button>
    <label class="short">Time <input type="range" id="cyl-t" min="0" max="5.5" step="0.01" value="1.6" aria-label="Time elapsed"></label>
    <label class="short">Lift <input type="range" id="cyl-lift" min="0" max="2.6" step="0.01" value="0" aria-label="Lift the whole curve"></label>
  </div>
  <p class="readout" id="cyl-read"></p>
  <figcaption><b>Figure 6.</b> The dashed <span class="key k-blue">blue</span> line is the circle of rest states. The black curve is where those states are after the chosen time. <span class="key k-teal">Teal</span> is area swept above the circle and <span class="key k-gold">gold</span> is area swept below. <b>Gravity</b> tilts the wire so the bead swings like a pendulum. <b>Moving waves</b> is a pair of travelling force waves, with no state left standing still. <b>Lift</b> slides the whole curve upward, which no energy function can do.</figcaption>
</figure>

However long you run it, with either set of forces, the new curve crosses the old circle, at least twice. The reason is bookkeeping. The teal and gold areas always balance, so the curve can never be wholly above the circle or wholly below. They balance because the rate at which net area passes the circle equals the total change in the energy function along one full circuit of the curve, and a function comes back to its own value.

Now use Lift. Sliding everything upward keeps the area of every region, so it is a perfectly good symplectomorphism, and it carries the circle clean off itself. But it can’t come from an energy function. The function would have to drop steadily all the way round the cylinder and still return to where it started. So motions driven by energy functions are a strictly smaller class than area-keeping motions, and what marks them out is that some curves can’t be pulled off themselves.

In the 1960s Vladimir Arnold proposed that this persists in higher dimensions: in the right kind of space, a Lagrangian surface carried along by an energy function must keep meeting its starting position, at least as many times as its shape demands. Proving cases of that took new machinery, Gromov’s pseudoholomorphic curves in 1985 and Floer’s homology soon after, and it is still not settled in general. The subject’s name for this kind of behaviour is *rigidity*. Where it holds is delicate. In plain four-dimensional space a steady slide comes from an energy function too, and it carries any torus clean off itself.

The turn in our problem is such a motion. Rotating the $v$-plane at a steady rate is what the energy function $\tfrac12\lvert v\rvert^2$ does; it is a weight on a spring, drawn in its own position–momentum plane. So $L\_\varphi$ is $L$ carried along by an energy function for a time $\varphi$, and “they must meet somewhere new” is a statement of Arnold’s kind. Greene and Lobb say this is how they came to the proof. They moved the problem into a setting that, in their words, “offers greater rigidity for controlling intersections,” and a conjecture descended from Arnold’s predicted that the folded surfaces should meet at least twice away from their shared edge. They didn’t prove that conjecture. They found that an existing theorem would do instead.

## 7. No room to spare

In four dimensions there is a second way to say “Lagrangian” that shows what such a surface gives up. Take any direction you can move along the surface. It has a part in the $m$-plane and a part in the $v$-plane. Give both parts a quarter turn. On a Lagrangian surface the result always points squarely off the surface, at right angles to all of it.

You can see it on the surface of chords. One direction along $L$ is “slide $a$ along the loop.” Its quarter turn is “push $a$ straight off the loop,” which is the third setting of Figure 4.

So the directions leading off a Lagrangian surface are a rotated copy of the directions lying in it. An ordinary surface in four dimensions can sit however it likes: how it twists through the surrounding space is a free choice, independent of its own shape. A Lagrangian surface has no such choice. Its surroundings are dictated by itself. That alone, with nothing but counting, rules most closed surfaces out of being Lagrangian here without self-crossing:

<div class="table-wrap">
<table>
  <thead><tr><th>Closed surface</th><th>By counting</th><th>In fact</th></tr></thead>
  <tbody>
    <tr><td>Sphere</td><td class="no">ruled out</td><td class="no">impossible</td></tr>
    <tr><td>Torus</td><td class="yes">allowed</td><td class="yes">exists: <i>L</i> is one</td></tr>
    <tr><td>Two-holed torus, and beyond</td><td class="no">ruled out</td><td class="no">impossible</td></tr>
    <tr><td>Projective plane</td><td class="no">ruled out</td><td class="no">impossible</td></tr>
    <tr class="hl"><td>Klein bottle</td><td class="yes">allowed</td><td class="no">impossible (Shevchishin, 2007)</td></tr>
    <tr><td>One-sided surfaces with Euler characteristic −4, −8, …</td><td class="yes">allowed</td><td class="yes">exist (Givental, 1986)</td></tr>
  </tbody>
</table>
</div>

The counting test is that the surface’s Euler characteristic must be zero if it is two-sided and a multiple of four if it is one-sided. The Klein bottle has Euler characteristic zero and passes. It is the one surface where counting says yes and the answer is no, and for about twenty years nobody could say which. Vsevolod Shevchishin proved in 2007 that it can’t be done, and Stefan Nemirovski gave a second proof soon after.

**Theorem (Shevchishin).** There is no smooth Lagrangian Klein bottle in four-dimensional space that doesn’t pass through itself.
{:.claim}

Neither proof is elementary. Both lean on heavy machinery of the kind mentioned in the last section, and this page doesn’t attempt them. What it can say is which kind of theorem this is. It isn’t about the bottle’s shape, which fits in four dimensions easily. It belongs with the circle that couldn’t be lifted: the shadow rule leaves the bottle no room.

## 8. Sewing the bottle

Everything is now on the table. In the space of pairs $(m, v)$ there are two Lagrangian tori, $L$ and $L\_\varphi$. They meet along the circle of collapsed chords, and anywhere else they meet is a rectangle of the shape we chose. Fold both. Each becomes a Lagrangian Möbius strip, and the two strips share their edge.

One repair is needed first. Along that shared edge the strips meet at an angle, and the theorem is about smooth surfaces. The technical section of Greene and Lobb’s paper rounds off the join while keeping the shadows of every patch in balance.

<figure>
  <canvas id="c-cut" class="r-pair" aria-label="A slice across the seam where the two surfaces meet, before and after the join is rounded"></canvas>
  <div class="controls">
    <label>Round the join <input type="range" id="cut-rho" min="0" max="1" step="0.01" value="0" aria-label="How much the join is rounded"></label>
  </div>
  <figcaption><b>Figure 7.</b> First panel: a slice across the seam before folding. The <span class="key k-blue">first sheet</span> and the <span class="key k-red">turned sheet</span> cross at the seam, and reversing a chord is a half-turn of the picture. Round the crossing into two arcs that the half-turn exchanges. Second panel: after the fold the two arcs are one, and it runs from one band into the other without touching the point where the fold is not smooth.</figcaption>
</figure>

Rounding a crossing of two lines in a plane is free, since any curve in a plane is as Lagrangian as any other. The work is in showing the real surfaces look exactly like this picture near the seam: that there are coordinates around the circle of collapsed chords in which $\omega$ takes its standard form, the two sheets are flat, and reversing a chord is the half-turn. Such coordinates exist because symplectic geometry has no local features. There is nothing in it like curvature that would let you tell one small region from another. Every difference between symplectic spaces, and every theorem like Shevchishin’s, is about the large scale.

With the join rounded, the two bands make one smooth, closed, one-sided Lagrangian surface: a Klein bottle.

<figure>
  <canvas id="c-klein" class="r-3d" aria-label="A Klein bottle made of a blue band and a red band"></canvas>
  <div class="controls">
    <label>Open it up <input type="range" id="klein-cut" min="0.12" max="1" step="0.01" value="0.74" aria-label="How much of the bottle is drawn"></label>
  </div>
  <figcaption><b>Figure 8.</b> A Klein bottle as two Möbius bands, <span class="key k-blue">blue</span> and <span class="key k-red">red</span>, sewn along the black seam. Drag to turn it. In three dimensions the bands have to pass through each other, along the <span class="key k-gold">gold</span> circle. The colour is also a fourth coordinate, running from deep blue at one extreme to deep red at the other. Along the gold circle one sheet is deep blue and the other deep red, so in four dimensions they are nowhere near each other. This bottle misses itself. It is not Lagrangian.</figcaption>
</figure>

The figure is the escape that ordinary topology allows: the two bands meet only along the seam, and the fourth coordinate carries each past the other. Now run the argument.

Suppose some smooth loop had no rectangle with diagonal angle $\varphi$. Then $L$ and $L\_\varphi$ would meet only along the collapsed chords. The two bands would meet only along their seam. The rounded Klein bottle would never touch itself. It would be a smooth Lagrangian Klein bottle sitting in four-dimensional space without passing through itself, and Shevchishin’s theorem says there is no such thing.

So the bands meet at some point $(m, w)$ away from the seam, with $w \neq 0$. Being on the first surface means $m + w$ and $m - w$ are on the loop. Being on the turned surface means the same is true after turning $w$ back through $\varphi$. Those are four points of the loop, the ends of two equal segments that cross at their midpoints at angle $\varphi$. The gold rectangle in Figure 1 had to be there.

## 9. What this page leaves out

It doesn’t prove Shevchishin’s theorem, and it doesn’t prove that the coordinates near the seam exist. Those are the two places where the real work of the subject sits. The figures are numerical illustrations. Figure 1 finds rectangles by search; it is the theorem that says the search can’t come back empty.

Smoothness matters. The rounding in Figure 7 needs a loop with tangent lines. The original question, asked by Otto Toeplitz in 1911, is whether every continuous loop, however jagged, has an inscribed square, and it is still open. Greene and Lobb have since extended the method in two directions. For smooth loops they replaced rectangles by any four-sided shape whose corners lie on a circle. And in 2024 they built a Floer homology out of inscribed rectangles and used it to show that a loop of finite length has an inscribed square whenever it encloses more than half the area of the circle with the same diameter.

Before 2020 the best general result on rectangles was Cole Hugelmeyer’s, from the year before: every smooth loop has rectangles for at least a third of all shapes. His proofs used the same four-dimensional picture without the symplectic form. Adding the form took the answer from a third to all.

## Sources

1. J. E. Greene and A. Lobb, [The rectangular peg problem](https://arxiv.org/abs/2005.09193), *Annals of Mathematics* 194 (2021), 509–517. The proof followed here; the quotation and the history in sections 2, 6 and 9 are from its discussion section.
2. B. Horenberger, [The Inscribed Rectangle Proof, Visually](https://horenbergerb.github.io/2020/07/14/inscribedrectangle.html) (2020). The post this continues.
3. V. V. Shevchishin, [Lagrangian embeddings of the Klein bottle and combinatorial properties of mapping class groups](https://arxiv.org/abs/0707.2085), *Izvestiya: Mathematics* 73 (2009). Preprint 2007.
4. S. Nemirovski, Homology class of a Lagrangian Klein bottle, *Izvestiya: Mathematics* 73 (2009), 689–698.
5. M. D. Meyerson, Balancing acts, *Topology Proceedings* 6 (1981), 59–75. Records Vaughan’s argument.
6. J. E. Greene and A. Lobb, Cyclic quadrilaterals and smooth Jordan curves, *Inventiones Mathematicae* 234 (2023); and [Floer homology and square pegs](https://arxiv.org/abs/2404.05179) (2024).
7. C. Hugelmeyer, [Inscribed rectangles in a smooth Jordan curve attain at least one third of all aspect ratios](https://arxiv.org/abs/1911.07336) (2019).
{:.src}

How the figures are computed. The loop is a radius that varies smoothly with direction, set by eleven handles. For a pair of points on it, the code turns their chord through the chosen angle and measures how far each turned end lies from the loop. It samples that on a 144 × 144 grid of pairs, looks for cells where both distances change sign, and refines each with Newton’s method until the corners are on the loop to about twelve decimal places. Mathematics is typeset with KaTeX. Everything runs in this page.
{:.aside}

<script src="/scripts/2026-11-25-inscribed-rectangles-claudeslop-sequel/core.js"></script>
<script src="/scripts/2026-11-25-inscribed-rectangles-claudeslop-sequel/kit.js"></script>
<script src="/scripts/2026-11-25-inscribed-rectangles-claudeslop-sequel/figs-a.js"></script>
<script src="/scripts/2026-11-25-inscribed-rectangles-claudeslop-sequel/figs-b.js"></script>
<script>Kit.onReady(Kit.shapeSliders);</script>
