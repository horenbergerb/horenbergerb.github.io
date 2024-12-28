---
dependencies:
    - p5
    - p5.dom
    - js.yaml
---

# Caravan

<div class="p5js-sketch" id="simple-example-holder">
    <script type="module" src="/scripts/caravan/main.js?v=0.2"></script>
</div>

# Caravan: An LLM-generated world

Caravan is a prototype that lets you explore a (relatively) coherent LLM-generated world. The world is composed of regions, subregions, and destinations. Each of these have interesting descriptions and accompanying images.

This particular world was generated using a finetune of Mistral Nemo (Note: that's a very small LLM, relatively speaking). The images were generated using a custom LoRA finetune of an image model.

The cool part of this framework is that I can automatically generate entirely new worlds at the click of a button. I will try to add a few more soon.

# How do I play?

Click on nodes to see pictures and get descriptions. Zoom out to see the subregions. Zoom out further to see the regions. You can also click on these for information.

Press the home button to see the whole map and get some info about the world in general.

Click on text boxes to get more info and see a zoomed-in picture of the region.

# That's it?

This is just a beta proof-of-concept. I have a lot of additional functionality on my to-do list. We'll see what I get done. I'd like to make it more interactive and game-like. There are two ways I'm considering gamifying:

- Using the world to facilitate real-time roleplay with an LLM. This is more straightforward but would have less structure as a "game" and be more of a collaborative creative session. Users would have to plug in their own LLM like ChatGPT or their own local model at runtime.
- Creating more generative infrastructure to pre-generate random events or other mechanics. Think Oregon Trail type gameplay. This would let me serve the game statically on my website, and it would have more game-like structure, but it wouldn't be as free-form and dynamic as directly plugging in an LLM API at runtime.

I'd also like to improve the map and world generation, maybe insert characters or other interesting elements, break down destinations into something more interactive, and a bunch of other things. The hard part is narrowing the scope to something achievable and fun.

# I love this and I want it to become something better. What can I do?

Hey, cool! I would love to hear your feedback. You can [shoot me a message on X](https://x.com/BeauHorenberger) if you have thoughts or questions about the future of Caravan. I would love to collaborate with other similarly-interested people.

You can also [donate a dollar or two](https://ko-fi.com/beauhorenberger) if you really like what I've got going on here.

# Is it open-source?

Kind of! The frontend source is all published on my blog. The backend LLM generation stuff isn't published yet, but it's not probably hard to replicate based on the details I've described in [this blog post](https://horenbergerb.github.io/2024/11/25/world-building-tree.html) and [this blog post](https://horenbergerb.github.io/2024/12/11/world-map-exploration.html). I haven't been in a rush since there's not exactly an audience at the moment. If you'd really like to see it all open-sourced, let me know!

# News

- 12/28/24
    - Added Vesper City, a much larger cyberpunk themed world
    - Added title page
    - Major refactoring and lots of bugfixes