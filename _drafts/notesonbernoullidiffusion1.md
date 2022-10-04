---
custom_excerpt: |
  "...Bungus..."
---

# Notes on Bernoulli Diffusion

* TOC
{:toc}
## What is Bernoulli Diffusion?

Diffusion originated from the classic publication [Deep Unsupervised Learning using Nonequilibrium Thermodynamics](https://arxiv.org/abs/1503.03585) by Sohl-Dickstein et al.

In the original paper--as well as most practical applications of diffusion (see [stable-diffusion](https://arstechnica.com/information-technology/2022/09/with-stable-diffusion-you-may-never-believe-what-you-see-online-again/))--a Gaussian Markov diffusion kernel is used. This means the algorithm iteratively applies Gaussian noise to samples from the target distribution and then learns to reverse the noising process.

|![](/images/notesonbernoullidiffusion/gaussiandiffusionillustration.png)|
|:--:|
| *An illustration of Gaussian diffusion stolen from [this paper](https://arxiv.org/abs/2006.11239). You're legally required to put this in any technical article about diffusion.* |

However, the original paper offhandedly mentions that you can also implement diffusion for binary-valued data using a [Bernoulli distribution](https://en.wikipedia.org/wiki/Bernoulli_distribution) as your Markov diffusion kernel. 

|![](/images/notesonbernoullidiffusion/originalpaperbernoullidiffusion.png)|
|:--:|
| *A segment of the original diffusion paper which mentions using Bernoulli diffusion to learn "heartbeat data".* |

The authors of the paper [published the code for the Gaussian diffusion](https://github.com/Sohl-Dickstein/Diffusion-Probabilistic-Models/tree/master), but for some reason chose not to publish the Bernoulli diffusion model. I have yet to find an implementation of Bernoulli diffusion anywhere on the internet.

[So I decided to implement it myself](https://github.com/horenbergerb/BernoulliDiffusion). It was very hard. I calculated a lot of things and learned a lot of fancy new words.

This article details my trials and tribulations throughout my inspiriational journey on the road to Bernoulli diffusion.

## Diffusion: How Does It Work?

Implementing Bernoulli diffusion took about a month or two, and most of that time was spent studying the first five pages of the [diffusion paper](https://arxiv.org/abs/1503.03585). The vast majority of this study time was dedicated to page five, since that's really the first page with any equations.

|![](/images/notesonbernoullidiffusion/pagefive.png)|
|:--:|
| *My dear friend, page five of Deep Unsupervised Learning using Nonequilibrium Thermodynamics.* |

So what have I learned? What can I say about diffusion? Get ready to be disappointed, because I'm about to show you everything I know.

I'm going to explain diffusion using a concrete example: Bernoulli diffusion on hearbeat data.

### Problem Statement: What Does Diffusion Solve?

Let's define some shit. Let's start by denoting the *sample space*, $X$. This is the "canvas" within which we will formulate more structured data. In the case of stable-diffusion, $X$ contains all 512x512 images, or using RGB format, something like this:

|$X_{\text{stable-diffusion}} = \mathbb{Z}_{255}^{3\times 512\times 512}$|
|:--:|
| *512x512 pixels, each pixel having R, G, and B values each ranging from 0 to 255* |

For our toy example, heartbeat data, we will use

|$X_{\text{heartbeat}} = \mathbb{Z}_{1}^{20}$|
|:--:|
| *Sample space for binary-valued sequences of length 20* |

We denote an arbitrary member of the sample space as $\mathbf{x}^{(0)}\in X$.

The problem begins with some training data $\mathcal{H}\subset X$. Usually $\mathcal{H}$ is highly structured, and we don't know how to describe that structure in a tractable way. For stable-diffusion, $\mathcal{H}$ is billions of images scraped from the internet via [CommonCrawl](https://commoncrawl.org/).

We pretend that there's some 

### OTHER APPROACH (BAD? DELETE?)

For our toy example, we're going to use "heartbeat data." There are five possible samples that can be observed, each with equal probability:

```
[1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0]
[0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0]
[0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0]
[0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0]
[0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0]
[0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1]
```

Let's call the set of these five samples $\mathcal{H}$. Then for any $\mathbf{x}^{(0)}\in \{0,1\}^20$

$$q:\{0,1\}^{20}\rightarrow [0,1]$$

$$q(\mathbf{x}^{(0)}) = \begin{cases}
bungus \\
mungus
\end{cases}$$

We don't know $q(\mathbf{x}^{(0)})$, but we do have a bunch of samples from it. The goal of diffusion is to generate novel samples $\mathbf{x}^{(0)}$ from the distribution $q(\mathbf{x}^{(0)})$.

How are we going to do this? Once again I direct your attention to the same overused diagram:

|![](/images/notesonbernoullidiffusion/gaussiandiffusionillustration.png)|
|:--:|
| *It's just a good illustration, okay? Don't reinvent the wheel.* |

In the forward process, we will apply an iterative noising process where we repeatedly add noise to each sample $\mathbf{x}^{(0)}$, giving us $\mathbf{x}^{(1)}, \mathbf{x}^{(2)},\ldots \mathbf{x}^{(T)}$ where $\mathbf{x}^{(T)}$ has become so noisy that it's basically just pure noise.

Adding noise to samples from $q(\mathbf{x}^{(0)})$ actually creates new probability distributions. A bit of upcoming notational trickery: $q(\mathbf{x}^{(1)}),q(\mathbf{x}^{(2)}),\ldots q(\mathbf{x}^{(T)})$ each refer to distinct probability distributions. $q(\mathbf{x}^{(t)})$ is defined conditionally by applying noise to samples from $q(\mathbf{x}^{(t-1)})$.

To be more specific, $q\left(\mathbf{x}^{(t)}\vert \mathbf{x}^{(t-1)} \right)$ is usually a Gaussian distribution whose mean and variance is determined by $\mathbf{x}^{(t-1)}$, and

$$q(\mathbf{x}^{(t)}) = q\left(\mathbf{x}^{(t)}\vert \mathbf{x}^{(t-1)} \right)q(\mathbf{x}^{(t-1)})$$

 We're going to create some new distributions using observations from $q(\mathbf{x}^{(0)})$. Particularly, we define $q\left(\mathbf{x}^{(t)}\vert \mathbf{x}^{(t-1)} \right)$