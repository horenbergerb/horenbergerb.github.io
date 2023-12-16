---
tag: diary
---

# Assorted News

* TOC
{:toc}


# Random fun things

[This article about hacking Bluetooth appliances is really cool](https://www.whizzy.org/2023-12-14-bricked-xmas/) and I'd love to investigate Bluetooth myself some time...

[Empirical evidence regarding what an undertrained LLM looks like.](https://www.amazon.science/blog/do-large-language-models-really-need-all-those-layers) I wonder why the important activations were clustered in particular regions... Also very interesting that they associate certain activations with particular tasks, but I'm curious how strong the correlation really is. I should look into the Anthropic research they mentioned about induction heads.

# Mixtral and local MoEs

[MIxtral of Experts LLM.](https://mistral.ai/news/mixtral-of-experts/) This is a super interesting development in the local language model scene. First impression on benchmarks suggests ~54B params of MoE can blow out 70B llama models and go head-to-head with GPT-3.5.

The community is exceptionally enthusiastic about Mistral. It seems users believe it; they think it's actual progress and not just benchmark shenanigans.

One question is how much performance is due to MoE and how much is simply due to high-quality data and good training practices. This remains to be determined.

I'm also withholding my own opinion on the model. My experiences with it so far have been lukewarm. I haven't felt like it handily beats 70B models at many tasks, and often I feel like it's hardly keeping up with 30B. Could be a skill issue though. There's also lots of unknowns with the implementation. Some quantizations are borked, GPU prompt processing is broken, etc. I'm sure bugs will be ironed out and performance will improve.

All in all, I'm tentatively optimistic about Mixtral and MoEs, and I'd like to think local models are about to become notably more performant.

