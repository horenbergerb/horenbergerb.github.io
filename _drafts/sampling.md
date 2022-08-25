---
custom_excerpt: |
  "...Bungus..."
---

# Sampling, Importance Sampling, Annealed Importance Sampling

* TOC
{:toc}
## What Sampling

![](/images/2022-08-21-sampling/SamplesOfNormalDist.png)

![](/images/2022-08-21-sampling/SampleNormalDistAnimCompressed.gif)

# Sampling, Importance Sampling, Annealed Importance Sampling

## Why are we talking about sampling?

Look, I'm not gonna stand here and act like I have some grand vision regarding sampling and its place in society. I'm writing this article for selfish reasons: I need to explain something to myself. Here's the punchline for why we are talking about sampling:

1) [Diffusion networks](https://arxiv.org/abs/1503.03585) rely critically on [annealed importance sampling](https://arxiv.org/abs/physics/9803008)
2) Annealed importance sampling is very abstract; it's the result of multiple iterations of sampling techniques

So there, that's the whole truth. We're talking about sampling because I want to understand how diffusion networks do the thing.

## What even is sampling?

Okay, sure, I'll take a whack at this. So let's assume you've got some random variable $X$ and it has a probability density function $p_X(x)$.

Sampling is, quite literally, drawing observations of $X$. For example, suppose that the event space was just $\{0,1\}$ and the probabilities were

$$p_X(x) = \begin{cases}
0.5, & x=0 \\
0.5, & x=1
\end{cases}$$

We could approximately sample from this random variable by flipping a coin.

These days, we take for granted that we can sample from everyday distributions. Python's Numpy package has [built-in functionality](https://numpy.org/doc/stable/reference/random/index.html) for generating pseudorandom samples from uniform distributions, Gaussian distributions, [and a whole lot more](https://numpy.org/doc/stable/reference/random/generator.html#distributions).

But what if I gave you a formula for some crazy probability density function (PDF)? What if it wasn't already in the Numpy libraries? This is where things get interesting.

## Wait, hold on, why would I ever need to sample?

Flipping coins, rolling dice, playing cards: if you gotta ask why, maybe sampling's not for you.

But, like, what about rejection sampling? Or importance sampling? When does anyone need those? Alright, fair question.

Sometimes in life, we find ourselves dealing with a function $f(\mathbf{z})$ of a random variable $\mathbf{z}$ with probability distribution $p(\mathbf{z})$. Often times we're interested in the expected value of the function:

$$\mathbb{E}[f] = \int f(\mathbf{z}) p(\mathbf{z}) d\mathbf{z}$$

Turns out, you can't always analytically solve this. Integrals are hard. Our only option is approximation.

[There are a million deterministic numerical methods for approximating integrals](https://en.wikipedia.org/wiki/Numerical_integration). The problem is that most methods totally choke in higher dimensions; you'd need to evaluate an insane quantity of points to get a reasonable answer. This is the "curse of dimensionality" everyone talks about.

These high-dimensional situations are exactly where sampling shines. In general, nondeterministic sampling helps you focus on regions which contribute most to the integral.

This is obvious in the expectation example above, but sampling random points can help you approximate arbitrary integrals; that's the premise behind [Monte Carlo integration](https://en.wikipedia.org/wiki/Monte_Carlo_integration).

### I don't believe you. Specifically outline a circumstance when someone would need advanced sampling methods. Don't dumb it down or I'll kill you

Okay, calm down, I'll tell you how sampling comes up in diffusion networks. Most readers can skip this section.

This example is basically just plagiarized from the [original diffusion paper](https://arxiv.org/abs/1503.03585).

I'm gonna focus on a simplified case of a diffusion network which is learning to output binary-valued sequences, i.e. things like $[1,0,0,1,0,0,1,...]$. This makes things more tangible since we end up using binomial distributions.

So suppose we have some unknown data distribution $q(\mathbf{x}^{(0)})$ from which we sample our training samples $\mathbf{x}^{(0)}$. The "forward process" of the diffusion network is an iterative noising process where we repeatedly add binomial noise to the $\mathbf{x}^{(0)}$, giving us $\mathbf{x}^{(1)}, \mathbf{x}^{(2)},\ldots \mathbf{x}^{(T)}$ where $\mathbf{x}^{(T)}$ has become so noisy that it's basically just a sample from a binomial distribution, $\mathcal{B}(1;0.5)$.

The "diffusion kernel" that we use to iteratively add noise is this binomial distribution:

$$q\left(\mathbf{x}^{(t)}\vert \mathbf{x}^{(t-1)} \right) =\mathcal{B}\left(\mathbf{x}^{(t)};\mathbf{x}^{(t-1)}(1-\beta_t) + 0.5\beta_t\right)$$

where $\beta_t=(T-t+1)^{-1}$.

The interesting part of diffusion networks is the "reverse process." It turns out that the process which undoes the iterative noising will have the same functional form. In other words, we can learn a function $\mathbf{f}_b(\mathbf{x}^{(t)},t)$ such that the reverse process is

$$p\left(\mathbf{x}^{(t-1)}\vert \mathbf{x}^{(t)} \right)=\mathcal{B}\left(\mathbf{x}^{(t-1)};\mathbf{f}_b(\mathbf{x}^{(t)},t)\right)$$

It doesn't really matter in this context, but just so you know, $\mathbf{f}_b(\mathbf{x}^{(t)},t)$ ends up being a multilayer perceptron.

Okay, let's bring this home. To train this model we're going to need to evaluate the loss:

$$L = \int d\mathbf{x}^{(0)}q\left(\mathbf{x}^{(0)}\right)\log p\left(\mathbf{x}^{(0)}\right)$$

The loss shows that we want the target data distribution, $q\left(\mathbf{x}^{(0)}\right)$, and the distribution of outputs from the learned reverse process, $p\left(\mathbf{x}^{(0)}\right)$, to be similar. We'd probably evaluate this by sampling a bunch of values from $q\left(\mathbf{x}^{(0)}\right)$, which is cool, but it's not the main attraction.

Here is the main attraction.

To calculate the loss, we will need to calculate $p\left(\mathbf{x}^{(0)}\right)$, the probability of a particular output for the reverse process. How do we do this? We could calculate

$$p\left(\mathbf{x}^{(0)}\right) = \int d\mathbf{x}^{(1\ldots T)} p\left(\mathbf{x}^{(0\ldots T)}\right)$$

This integral is not analytically tractable, and $p\left(\mathbf{x}^{(0\ldots T)}\right)$ is probably insane (high-dimensional with lots of variety), making numerical methods pretty much useless. We're up shit creek.

And now, in our darkest hour, down from the skies descends advanced sampling techniques.

The authors of the diffusion paper "\[take\] a cue from annealed importance sampling and the Jarzynski equality, \[and\] instead evaluate the relative probability of the forward and reverse trajectories, averaged over forward trajectories":

$$p\left(\mathbf{x}^{(0)}\right) = \int d\mathbf{x}^{(1\ldots T)} q\left(\mathbf{x}^{(1\ldots T)}\vert \mathbf{x}^{(0)} \right)p\left(\mathbf{x}^{(T)}\right) \prod_{t=1}^{T}\frac{p\left(\mathbf{x}^{(t-1)}\vert \mathbf{x}^{(t)} \right)}{q\left(\mathbf{x}^{(t)}\vert \mathbf{x}^{(t-1)} \right)}$$

Then "This can be evaluated rapidly by averaging over samples from the forward trajectory $q\left(\mathbf{x}^{(1\ldots T)}\vert \mathbf{x}^{(0)} \right)$."

Just to be clear, the algebra for deriving that last equation is almost bafflingly trivial. Check it out for yourself in the paper. And yet, the equation reveals a tractable methodology for approximating this integral which was previously unavailable.

Evaluating the loss for diffusion networks would not be possible without using sampling sleight-of-hand to turn an intractible integral into one that can be evaluated by sampling from an easily-accessible distribution.

So yeah, bitch, that's when you would need to use sampling in real life.

## Alright, I believe you. Tell me the basics of sampling