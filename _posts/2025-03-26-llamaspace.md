---
custom_excerpt: |
  Proof-of-concept for an LLM-powered game about exploring space and doing research
tag: blog
---

# LLaMaSpace: A space adventure RPG

<div class="p5js-sketch" id="simple-example-holder">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"></script>
    <script type="module" src="/scripts/llamaspace/main.js"></script>
</div>

# What is this?

LLaMaSpace is a game about traveling the stars on a research mission. You and your ragtag team are in search of scientific anomalies so that you can further the knowledge of all humankind. It's also kind of your last chance to prove yourself as a captain.

The game revolves around traveling to different star systems and coming up with research missions regarding the planetary bodies. The missions are evaluated and expanded upon by an LLM. Coming up with interesting and achievable missions will be rewarded.

This game uses the OpenRouter API to do its LLM stuff.  All you need is an API key.

The source code is available [on my GitHub repo](https://github.com/horenbergerb/llamaspace).

If you like this game and want to see it developed further, [a donation would be greatly appreciated!](https://ko-fi.com/beauhorenberger)

# How to play

Make sure you paste an OpenRouter API key into the settings and then click Save. Then, travel to different systems. You can enter systems and visit the various bodies.

At each body, you may invent research missions for your crew to perform. The missions will be attempted and documented, and you'll either gain reputation or expend your ship's resources according to the output.

Reasonably possible, scientifically interesting missions will be rewarded, while other missions may fail more often or give less reputation.

# LLM-generated mission details

The coolest part is that the mission is "simulated" by an LLM, and you can see the details of each mission step by hovering over the nodes:

![mission_in_progress.png](/images/2025-03-26-llamaspace/mission_in_progress.png)

![mission_step_details.png](/images/2025-03-26-llamaspace/mission_step_details.png)

# Disclaimers

I take no responsibility for anything you do with your OpenRouter API key or anything you do with this game. Remember that your keys are valuable and private, and it's important to protect them.

# Todo

- Finish the anomalies system
- Add more interactivity (chatting with crew, etc)
- ???