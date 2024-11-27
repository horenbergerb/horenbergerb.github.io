---
custom_excerpt: |
  "...Turns out, it's hard to figure out how to walk in a straight line along a surface. I guess that's why I'm studying differential geometry, huh?"
tag: diary
dependencies:
    - three
    - three.addons
---

# Differential Geometry Visualization Test

* Table of Contents
{:toc}

# Funky plot

This was just an experiment to see if I could render 3D surfaces and do things on them.

Here you'll see $\sin{\sqrt{x^2+y^2}}$ plotted in 3D, which is cool. You can click and drag to rotate it.

Additionally, anywhere you click, it will trigger a "march" along the surface moving parallel to a particular axis. The length of the march along the surface is fixed.

I originally wanted to make geodesics, i.e. march in a straight line from the perspective of an ant living on the surface. Turns out, it's hard to figure out how to walk in a straight line along a surface. I guess that's why I'm studying differential geometry, huh?

<div class="p5js-sketch" id="simple-example-holder">
    <script type="text/javascript" src="/scripts/2024-11-25-visual-diff-geo/sketch_window.js"></script>
</div>