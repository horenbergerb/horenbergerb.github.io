---
custom_excerpt: |
  Surprising one-shot improvements. Claude good.
tag: blog
---

# Optimizing Bernoulli Diffusion with Claude

* Table of Contents
{:toc}

# Bernoulli Diffusion? What?

You've probably heard of diffusion, which is the thing that people use to generate shitty flyers and [occasionally cooler things.](https://pixelparmesan.com/blog/ai-assisted-reference-and-photobashing-for-pixel-artists) Well, I made a version of this optimized for generating binary-valued data. What's it good for? I dunno. Maybe genetics or something. You can read more about the mathematics behind it [here](https://horenbergerb.github.io/2022/10/03/bernoulliderivations.html) or check out the repo [here.](https://github.com/horenbergerb/BernoulliDiffusion)

# Can Claude optimize my stuff?

Yes. I basically loaded up the [Bernoulli Diffusion](https://github.com/horenbergerb/BernoulliDiffusion) repo and explained to claude the following:

> I always felt like I didn't get good convergence on a solution. Training and validation loss improved, but qualitatively the results never looked great. I'd like for you to start by doing an audit. Look over the whole code base and see if anything stands out to you. Come back to me with a report on issues that you think might be related to the convergence problem.

There were a few low-hanging fruit like early stopping that Claude detected, but it also pitched a few ideas that really interested me. Figured I'd summarize them here.

Each row adds one change on top of the previous ones. All runs are on the "repeating patterns" dataset: 20-bit strings made of a random 10-bit block written twice (e.g. `0110111111 0110111111`), with 973 of the 1024 possible patterns used for training and 51 held out. "Loss" is the full negative ELBO in bits per sample with the constant terms removed; a perfect model would score $\log_2 973 \approx 9.93$ bits.

| Change | The idea | Loss (bits) | Invalid samples | Patterns generated (of 1024) | Held-out patterns generated (of 51) | Training |
|---|---|---|---|---|---|---|
| Original code | - | 227 | 0.3%* | 677 | 25 | 100 steps, 5m42 |
| + Skip connection | Each reverse step does almost nothing. This helps them stabilize. | 15.0 | 16.3% | 979 | 48 | 100 steps, 6m05 |
| + One random timestep per example | Estimate the sum over all $T$ timesteps with one random sample. Makes each training step ~2000x cheaper | 11.2 | 3.1% | 1013 | 50 | ~78k steps in 2m50 (best checkpoint at ~39k) |
| + Predict $\mathbf{x}^{(0)}$ | Have the network guess the clean data, and compute each reverse step exactly from that guess using the forward process posterior | 10.2 | 0.7% | 1013 | 51 | ~39k steps, 2m32 |

\*The original model's samples look clean because it collapsed onto about two-thirds of the patterns, which the loss penalizes heavily.

# Reminder of how Bernoulli Diffusion works

You might not give a shit about this, in which case you can skip to the next section. But since Claude has made it much easier to write LaTeX slop, I'm going to throw this in so that I have it as a future reference.

Equations are mostly from [Deep Unsupervised Learning using Nonequilibrium Thermodynamics](https://arxiv.org/abs/1503.03585) (Sohl-Dickstein et al., 2015).

## Forward trajectory

tldr: Incrementally add "noise" to your training data by flipping values according to Bernoulli trials.

The data distribution $q\left(\mathbf{x}^{(0)}\right)$ is gradually converted into a simple distribution $\pi\left(\mathbf{y}\right)$ (like a Bernoulli distribution!) by repeatedly applying a Markov diffusion kernel $T_\pi\left(\mathbf{y} \vert \mathbf{y}'; \beta\right)$ with diffusion rate $\beta$:

$$\pi\left(\mathbf{y}\right) = \int d\mathbf{y}' \, T_\pi\left(\mathbf{y} \vert \mathbf{y}'; \beta\right) \pi\left(\mathbf{y}'\right)$$

$$q\left(\mathbf{x}^{(t)} \vert \mathbf{x}^{(t-1)}\right) = T_\pi\left(\mathbf{x}^{(t)} \vert \mathbf{x}^{(t-1)}; \beta_t\right)$$

Running $T$ steps of this starting from the data gives the forward trajectory:

$$q\left(\mathbf{x}^{(0 \cdots T)}\right) = q\left(\mathbf{x}^{(0)}\right) \prod_{t=1}^T q\left(\mathbf{x}^{(t)} \vert \mathbf{x}^{(t-1)}\right)$$

For binary data, the simple distribution is unbiased, independent coin flips and the kernel is a Bernoulli trial, where $\mathcal{B}\left(u; r\right)$ means $u = 1$ with probability $r$:

$$\pi\left(\mathbf{x}^{(T)}\right) = \mathcal{B}\left(\mathbf{x}^{(T)}; 0.5\right)$$

$$q\left(\mathbf{x}^{(t)} \vert \mathbf{x}^{(t-1)}\right) = \mathcal{B}\left(\mathbf{x}^{(t)}; \mathbf{x}^{(t-1)}\left(1 - \beta_t\right) + 0.5\beta_t\right)$$

The schedule erases a constant fraction $\frac{1}{T}$ of the original signal per step:

$$\beta_t = \left(T - t + 1\right)^{-1}$$

## Reverse trajectory

tldr: the model is learning to undo each step of the noising by predicting what bits to unflip at each step.

The generative model runs the same trajectory backwards, starting from the simple distribution:

$$p\left(\mathbf{x}^{(T)}\right) = \pi\left(\mathbf{x}^{(T)}\right)$$

$$p\left(\mathbf{x}^{(0 \cdots T)}\right) = p\left(\mathbf{x}^{(T)}\right) \prod_{t=1}^T p\left(\mathbf{x}^{(t-1)} \vert \mathbf{x}^{(t)}\right)$$

For small $\beta_t$, the reverse of a binomial diffusion step is also a Bernoulli trial, so the only thing to learn is a function $\mathbf{f}_b$ giving the bit probabilities:

$$p\left(\mathbf{x}^{(t-1)} \vert \mathbf{x}^{(t)}\right) = \mathcal{B}\left(\mathbf{x}^{(t-1)}; \mathbf{f}_b\left(\mathbf{x}^{(t)}, t\right)\right)$$

## Model probability

The probability the model assigns to an actual output is an intractable integral over all trajectories:

$$p\left(\mathbf{x}^{(0)}\right) = \int d\mathbf{x}^{(1 \cdots T)} \, p\left(\mathbf{x}^{(0 \cdots T)}\right)$$

Borrowing from annealed importance sampling, it can instead be written as an average over forward trajectories:

$$\begin{aligned}
p\left(\mathbf{x}^{(0)}\right) &= \int d\mathbf{x}^{(1 \cdots T)} \, q\left(\mathbf{x}^{(1 \cdots T)} \vert \mathbf{x}^{(0)}\right) \frac{p\left(\mathbf{x}^{(0 \cdots T)}\right)}{q\left(\mathbf{x}^{(1 \cdots T)} \vert \mathbf{x}^{(0)}\right)} \\
&= \int d\mathbf{x}^{(1 \cdots T)} \, q\left(\mathbf{x}^{(1 \cdots T)} \vert \mathbf{x}^{(0)}\right) \, p\left(\mathbf{x}^{(T)}\right) \prod_{t=1}^T \frac{p\left(\mathbf{x}^{(t-1)} \vert \mathbf{x}^{(t)}\right)}{q\left(\mathbf{x}^{(t)} \vert \mathbf{x}^{(t-1)}\right)}
\end{aligned}$$

This doesn't make the integral tractable, but it's not much easier to estimate by sampling, since sampling forward processes will be much more meaningful; we know how to pick samples that start with our target data. Picking samples from the reverse process is much harder; most won't converge on our target data $\mathbf{x}^{(0)}$.

## Training

Training maximizes the model log likelihood:

$$L = \int d\mathbf{x}^{(0)} \, q\left(\mathbf{x}^{(0)}\right) \log p\left(\mathbf{x}^{(0)}\right)$$

Jensen's inequality gives a lower bound:

$$L \geq \int d\mathbf{x}^{(0 \cdots T)} \, q\left(\mathbf{x}^{(0 \cdots T)}\right) \log \left[ p\left(\mathbf{x}^{(T)}\right) \prod_{t=1}^T \frac{p\left(\mathbf{x}^{(t-1)} \vert \mathbf{x}^{(t)}\right)}{q\left(\mathbf{x}^{(t)} \vert \mathbf{x}^{(t-1)}\right)} \right]$$

which reduces to $L \geq K$, where every term can be computed analytically:

$$\begin{aligned}
K = &-\sum_{t=2}^T \int d\mathbf{x}^{(0)} d\mathbf{x}^{(t)} \, q\left(\mathbf{x}^{(0)}, \mathbf{x}^{(t)}\right) \cdot D_{KL}\left(q\left(\mathbf{x}^{(t-1)} \vert \mathbf{x}^{(t)}, \mathbf{x}^{(0)}\right) \vert\vert p\left(\mathbf{x}^{(t-1)} \vert \mathbf{x}^{(t)}\right)\right) \\
&+ H_q\left(\mathbf{X}^{(T)} \vert \mathbf{X}^{(0)}\right) - H_q\left(\mathbf{X}^{(1)} \vert \mathbf{X}^{(0)}\right) - H_p\left(\mathbf{X}^{(T)}\right)
\end{aligned}$$

Training finds the reverse transitions that maximize this bound:

$$\hat{p}\left(\mathbf{x}^{(t-1)} \vert \mathbf{x}^{(t)}\right) = \operatorname*{argmax}_{p\left(\mathbf{x}^{(t-1)} \vert \mathbf{x}^{(t)}\right)} K$$

And this bound gets tighter as step size $\beta_t$ gets smaller, more or less.

## In summary

The math is not *that* hard, but it's not  trivial, and there's a lot of prior knowledge being leveraged. Even further, it's not obvious how to actually compute any of this. I'd like to remind the audience that I proudly built my original Bernoulli Diffusion implementation before LLMs were good.

This is why I had to write [another article of derivations.](https://horenbergerb.github.io/2022/10/03/bernoulliderivations.html) And it's why I didn't bother optimizing any further until Claude came along.

# Claude's improvements