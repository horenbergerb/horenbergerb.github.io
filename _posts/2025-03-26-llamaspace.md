---
custom_excerpt: |
  Proof-of-concept for an LLM-powered game about exploring space and doing research
tag: blog
---

# Astral Fugue: A space adventure RPG

<div class="p5js-sketch" id="simple-example-holder">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"></script>
    <script type="module" src="/scripts/llamaspace/main.js"></script>
</div>

# What is this?

<video width="320" height="240" controls>
  <source type="video/mp4" src="https://github.com/user-attachments/assets/bc48204e-0e3a-4a4e-a9d9-101d965a7931">
</video>

Astral Fugue is a game about traveling the stars on a research mission. You and your ragtag team are in search of scientific anomalies so that you can further the knowledge of all humankind. It's also kind of your last chance to prove yourself as a captain.

The game revolves around traveling to different star systems and coming up with research missions regarding the planetary bodies. The missions are evaluated and expanded upon by an LLM. Coming up with interesting and achievable missions will be rewarded.

This game uses the OpenRouter API to do its LLM stuff.  All you need is an API key.

The latest version is no longer open source, but the demo on this website is. Check it out [in the GitHub repo](https://github.com/horenbergerb/horenbergerb.github.io/tree/master/scripts/llamaspace).

If you like this game and want to see it developed further, [a donation would be greatly appreciated!](https://ko-fi.com/beauhorenberger)

# How to play

Make sure you paste an OpenRouter API key into the settings and then click Save. Then, travel to different systems. You can enter systems and visit the various bodies.

At each body, you may invent research missions for your crew to perform. The missions will be attempted and documented, and you'll either gain reputation or expend your ship's resources according to the output.

Reasonably possible, scientifically interesting missions will be rewarded, while other missions may fail more often or give less reputation.

Some bodies have interesting (LLM-generated) anomalies that merit special investigation...

# LLM-generated components

Each mission you invent is "simulated" by an LLM, and you can see the details of each mission step by hovering over the nodes:

![mission_in_progress.png](/images/2025-03-26-llamaspace/mission_in_progress.png)

![mission_step_details.png](/images/2025-03-26-llamaspace/mission_step_details.png)

Some planets will also have anomalies that are detected when you enter orbit, so try stopping at lots of different planets.

# Disclaimers

I take no responsibility for anything you do with your OpenRouter API key or anything you do with this game. Remember that your keys are valuable and private, and it's important to protect them.

# News

- 04/10/25: Huge update. Added anomaly scanner, tutorial, better missions, better planets, weird planets. All kinds of stuff.
- 03/28/25: Added anomalies
- 03/27/26: Initial release

# Todo

- Finish anomaly detection minigame
- Make missions cumulative (build upon previous results)
- Add more interactivity (chatting with crew, etc)
- ???