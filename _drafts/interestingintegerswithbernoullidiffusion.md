---
custom_excerpt: |
  "...Bungus..."
---

# Generating Interesting Integers with Bernoulli Diffusion

* TOC
{:toc}
## What?

[Bernoulli diffusion](https://github.com/horenbergerb/BernoulliDiffusion) is an implementation of a [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) designed for binary-valued sequences.

In other words, it's an algorithm that can learn to generate sequences of 1s and 0s by training on provided samples.

A simple example of data that you could teach to Bernoulli diffusion would be a repeating pattern where the first $\frac{n}{2}$ bits are random, but the last $\frac{n}{2}$ bits must match the first half exactly. Examples for $n=8$ include $11001100$, $10001000$, $01010101$, etc.

Here's an animation depicting the evolution of some samples from a Bernoulli diffusion model while it learns from a dataset of repeating examples:

|![An animation depicting samples from Bernoulli diffusion as it learns](/images/???.png)|
|:--:|
| *As Bernoulli diffusion learns, last half and first half of bits slowly become more similar until they are mostly identical* |

Now, this is all very nice. The [original diffusion paper](https://arxiv.org/abs/1503.03585) mentions Bernoulli diffusion as a toy model, merely a proof of concept. Why does it merit more discussion when people are [already generating beautiful images with diffusion](https://huggingface.co/spaces/stabilityai/stable-diffusion)?

