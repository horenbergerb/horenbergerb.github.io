---
custom_excerpt: |
  Toy calculations for a mathematical approach to quantifying rote memorization vs generalization
tag: blog
---

# Paper Review: How much do language models memorize?

* Table of Contents
{:toc}

# Intro

I saw [this paper by Meta,](https://arxiv.org/pdf/2505.24832) and it really impressed me. At a glance, it seems like it's a solid mathematical approach to distinguishing between rote memorization vs generalization. I really liked the mathematics, so I thought I'd play with it a bit and make some observations.

This article spends a lot of time elaborating on section 2.1, which establishes the fundamental premise by defining a quantitative distinction between rote memorization of a dataset and generalization to the true underlying prior.

I also talk about how they used Kolmogorov complexity to make these calculations tractable with typical ML models. This boils down pretty quickly to a handful of equations, and after distilling it, I have some doubts.

# Setup

All of the derivations of interest here revolve around a prior distribution, $\Theta$, a dataset distribution, $X$, and a trained model, $\hat{\Theta}$. Let's define these.

The **prior distribution**, $\Theta$, is a distribution that represents the actual data. This is "the real world," in a sense. In most cases, we know very little about this distribution.

We can build a **dataset distribution** $X$ using samples of $\Theta$. There are many ways to do this. A simple example would be to a partial observation of $\Theta$, break it into "samples," then define $X$ as a uniform distribution over the samples. Note that, because we create $X$ by using $\Theta$, the dataset $X$ is conditioned by the properties of $\Theta$. In other words, $X$ contains information about $\Theta$.

Finally, we can train a **model** $\hat{\Theta}$ to imitate $\Theta$. The model is also a distribution. The training of $\hat{\Theta}$ can be considered a function of samples $x \sim X$.  $\hat{\Theta}$ is intended to imitate $\Theta$, but it often ends up knowing more about $X$ and less about $\Theta$.

# Memory definitions

Let $H(X)$ denote the entropy of $X$. They also call this the "amount of information present in X." Then let $X \vert Y$ be the uncertainty left in $X$ after fixing $Y$. We define the **mutual information** between two distributions as

$$I(X; Y) = H(X) - H(X \vert Y)$$

This represents the information about $X$ that stored in $Y$. For example if $Y = 2X$, then $H(X\vert Y) = H(X\vert 2X) = 0$, since $Y$ determines $X$ completely, and thus $I(X;Y)=H(X)$. So Y contains all of the information about X.

Now we can use this to define the different kinds of memory. Recall that we'd like for our model $\hat\Theta$ to learn about and act like the prior, $\Theta$. In practice, $\hat\Theta$ often behaves more like the training dataset $X$ than the true prior distribution.

We can rephrase this in terms of information. What amount of information does the model $\hat\Theta$ contain about $X$ and $\Theta$?

First, we define the **total memorization**. This represents all of the information about $X$ stored in $\hat{\Theta}$. The definition just the mutual information between the two:

$$\text{mem}(X, \hat{\Theta}) = I(X; \hat{\Theta}) = H(X) - H(X \vert \hat{\Theta})$$

The following definitions are more interesting. Next up is **unintended memorization**. This represents rote memorization of information which is relevant to the dataset $X$ but not representative of the true prior $\Theta$.

To measure this, we look at the information remaining in $X$ after fixing $\Theta$ and measure the mutual information with the model, $\hat\Theta$:

$$\text{mem}_U = I([X \vert \Theta]; \hat{\Theta}) = H(X \vert \Theta) - H(X \vert \Theta, \hat{\Theta})$$

Again, this mathematically means it's the information that $\hat\Theta$ contains about $X$ which does not apply to the underlying prior $\Theta$.

Finally, we have the **intended memorization**, which is information that truly generalizes to the underlying prior. We get this by subtracting the rote memorization from the total memorization:

$$\text{mem}_I = \text{mem}(X, \hat{\Theta}) - \text{mem}_U(X, \hat{\Theta}, \Theta) = I(X; \hat{\Theta}) - I(X \vert \Theta; \hat{\Theta})$$

Intuitively, this also makes sense. It's the information about $X$ contained by $\hat\Theta$ after subtracting any information about $X$ that is not applicable to the prior $\Theta$. $\text{mem}_I$ represents the learned information that also applies to the prior.

# Toy Example

In the real world, we'd probably have the prior $\Theta$ be the true distribution for human language, and $X$ be constructed by some sampling process. 

That's not very tractable, so we'll just pick some simple distributions and crunch through some calculations.

## Prior, dataset, and model

**Prior $\Theta$ (underlying model):**
- $\Theta$ is a fair coin: $\Theta \in \{0,1\}$ with $P(\Theta=0) = P(\Theta=1) = 0.5$.  

**Dataset $X$:**
You would probably expect this to be a uniform distribution over some collected samples $\theta \sim \Theta$, but I'm going to do something more interesting.

- If $\Theta=0$, $X \sim \text{Bernoulli}(0.1)$ (biased "tails")  
- If $\Theta=1$, $X \sim \text{Bernoulli}(0.9)$ (biased "heads")  

I do this for two reasons:
1) We can still create interesting distributions for $X$ using a single sample from $\Theta$. This simplifies the math a little.
2) This demonstrates that the theory works even if the relationship between the dataset $X$ and prior $\Theta$ isn't straightforward. There could be noise, or the sampled data could have some nontrivial indirect relationship to the actual data of interest


**Trained model $\hat{\Theta}$:**  
 
 The model is a stupid solution that's "trained" on a single sample $x \sim X$ sampled from $X$:
 
 $$\hat{\Theta} = \begin{cases} 
  0 & \text{if } x = 0 \\
  1 & \text{if } x = 1 
\end{cases}$$

## Preliminary entropy calculations
### Total entropy $H(X)$

Recall that $H(X) = -\sum P(x) \log_2 P(x)$. Then

$$P(x=0) = P(\Theta=0)P(x=0\vert\Theta=0) + P(\Theta=1)P(x=0\vert\Theta=1) = (0.5)(0.9) + (0.5)(0.1) = 0.5$$

and

- $P(x=1) = (0.5)(0.1) + (0.5)(0.9) = 0.5$
- $H(X) = -[0.5 \log_2(0.5) + 0.5 \log_2(0.5)] = 1$

So the total entropy of $H(X)$ is 1 bit, i.e. the same entropy as a single unbiased coin flip. At a glance, that's believable.

### Conditional entropy $H(X\vert\Theta)$

Recall that $H(X\vert\Theta) = \sum P(\theta) H(X\vert\Theta=\theta)$. Then

- $H(X\vert\Theta=0) = -[0.9 \log_2(0.9) + 0.1 \log_2(0.1)] \approx 0.469$ bits
- $H(X\vert\Theta=1) = -[0.1 \log_2(0.1) + 0.9 \log_2(0.9)] \approx 0.469$ bits
- $H(X\vert\Theta) = 0.5(0.469) + 0.5(0.469) \approx 0.469$ bits

So the information remaining in $X$ after fixing $\Theta$ is about 0.469 bits. That also makes sense; knowing $\Theta$ tells us quite a bit about $X$.

Note: It's interesting that the biased coin flip $\text{Bernoulli}(0.1)$ has about half the entropy of the unbiased coin flip $\text{Bernoulli}(0.5)$ (0.469 bits vs 1 bit). It doesn't feel like there's half as much uncertainty; it seems substantially more determined. But I suppose that's a problem with my own intuition.

## Memory calculations
### Mutual Information (Total Memorization)

Recall that

$$\text{mem}(X,\hat{\Theta}) = I(X;\hat{\Theta}) = H(X) - H(X\vert\hat{\Theta})$$

Since we defined $\hat{\Theta}=x$, where $x \sim X$, knowing $\hat\Theta$ means we know $X$ too, so $H(X\vert\hat{\Theta}) = 0$.

Therefore, $I(X;\hat{\Theta}) = 1 - 0 = 1$ bit. Thus, the total memorized information is 1 bit. 

Note: My interpretation of this formula is that we learned everything there is to learn about $X$. We essentially maximized $\text{mem}(X,\hat{\Theta})$ for a fixed $X$ by mimicking the data. However, we will see shortly that generalization still occurred.

### Unintended Memorization (Rote)

Recall that

$$\text{mem}_U = I([X\vert\Theta];\hat{\Theta}) = H(X\vert\Theta) - H(X\vert\Theta,\hat{\Theta})$$

As before, given $\Theta$ and $\hat{\Theta}$, $X$ is fully determined, so $H(X\vert\Theta,\hat{\Theta}) = 0$. Thus, $\text{mem}_U = 0.469 - 0 = 0.469$ bits.

### Intended Memorization (Generalization)

This follows trivially from the previous calculations:

$$\text{mem}_I = I(X;\hat{\Theta}) - \text{mem}_U = 1 - 0.469 = 0.531$$ So there are 0.531 bits of intended memorization.

## Discussion

So we had a dataset $X$ with 1 bit of entropy. Our trained model $\hat\Theta$ has 1 bit of mutual information or total memorization. This breaks down into 0.469 bits of rote memorization, and 0.531 bits of memorization.

What's odd to me is that our model $\hat\Theta$ was explicitly defined as a rote memorization of $X$, and yet it supposedly has more generalization than memorization.

I think what it comes down to is that these values are based on particular samples of $\theta\sim\Theta$ and $x\sim X$. Once the samples have been made, these calculations tell us what we've learned about $x$ and $\theta$. In this case, $X\vert\Theta$ has less uncertainty; $x$ is highly likely to be determined by $\theta$. On the flip side, $\theta$ is highly uncertain by itself, but $x$ gives us a strong clue about what $\theta$ probably is.

### $\text{mem}_I > \text{mem}_U$: what it doesn't mean

Despite the fact that we mathematically generalized more than we memorized, one could easily argue that $\hat\Theta$ is a better approximation of $X$ than of $\Theta$.

Let's look at the accuracy of our trained model in the case where $\Theta = 0$ and thus $X \sim \text{Bernoulli}(0.1)$ (There's a symmetry with $\text{Bernoulli}(0.9)$, so our calculations are also true if $\Theta=1$).
-  90% chance that the training data $x\sim X$ was tails, so $\hat\Theta$ would be correct 90% of the time.
- 10% chance that the training data $x \sim X$ was heads, so $\hat\Theta$ would be correct 10% of the time.

So the average accuracy is $(0.9)(0.9) + (0.1)(0.1) = 0.82$, i.e. an overall 82% accuracy rate across trained models.

Compare this to the baseline of randomly guessing:
- 50% chance of guessing tails, 90% chance of $X$ being tails
- 50% chance of guessing heads, 10% chance of $X$ being heads.

In this case, the average accuracy is $(0.5)(0.9) + (0.5)(0.1) = 0.5$, or 50% accuracy. So it's clear our training process generally produces an improved representation of $X$.

On the flip side, the best possible accuracy is 90%. If we were able to train on more samples, we could approach this accuracy.

Conversely, if we compare $\hat\Theta$ to $\Theta$, our trained model will always have 50% accuracy, regardless of the training process. On one hand, we have worse accuracy in general, but on the other, we've also achieved the best possible accuracy.

This means that we have better accuracy on $X$ than we do on $\Theta$, which makes sense, since we literally memorized an observation of $X$.

Accuracy is not the same thing as entropy, but I think this approach helps us delineate what the theory is and is not saying about our models. Having $\text{mem}_I > \text{mem}_U$ does not mean our model is better at representing the prior $\Theta$ than the dataset $X$.

What we are saying, more explicitly, is that the information contained in $\hat\Theta$ tells us a lot about $\Theta$. The same information might also inform us about $X$, but there's not much information that tells us *only* about $X$ and not $\Theta$.

### Last look at the memory math

The explanation necessarily lies in the mathematical definitions. If we look at unintended memorization:

$$\text{mem}_U = I([X\vert\Theta];\hat{\Theta}) = H(X\vert\Theta) - H(X\vert\Theta,\hat{\Theta})$$

Unintended (or rote) memorization is bounded above by $H(X\vert\Theta)$, i.e. the information unique to $X$ after fixing $\Theta$. From our calculations above, we know this value is already small: $H(X\vert\Theta) \approx 0.469$ bits. There's a lot less uncertainty in $X\vert \Theta$ than there is in $\Theta$ (1 bit), which means there's less information to learn about $X$ once $\Theta$ is determined; we won't be that surprised by the training data.

But we also know that our model "learned" exactly one bit of information in total:

$$\text{mem}(X,\hat{\Theta}) = H(X) - H(X\vert\hat{\Theta}) = 1-0 = 1$$

The amount that $\hat\Theta$ can memorize in total (information about $X$ and $\Theta$) is bounded above by $H(X)$. Why is that? Intuitively, it's because $X$ is the only thing the model ever sees. However, by the properties of entropy,

$$H(X) = H(\Theta, X) - H(\Theta\vert X)$$

So this upper bound on what we can learn is, itself, bounded by the joint entropy $H(\Theta, X)$, and is larger if $X$ contains information about $\Theta$ (i.e. $H(\Theta\vert X)$ is small). This shared information is what we are gleaning when we generalize.

It makes intuitive sense that $\hat\Theta$ is storing a bit of information; it remembers exactly one observation of a coin toss $x \sim X$. So it learned one bit of information, but there's less than one bit of information unique to $X$ after fixing $\Theta$. Thus, memorizing $X$ also told us about $\Theta \vert X$, and there is more information to learn about $\Theta$ than there is to learn about $X\vert \Theta$.

# The rest of the paper: how useful is this theory?

The authors note that this formulation doesn't work for real life cases, since we can't calculate entropy from singular observations like $\theta$ and $x$ if the underlying distributions aren't known. They use Kolmogorov complexity to argue that you can use a predictive model's likelihoods to approximate Kalmogorov complexity:

$$H^K(x \mid \hat{\theta}) \approx -\log_2 p(x \mid \hat{\theta})$$

I think this is supposed to follow from Shannon's source coding theorem? And then that Kalmogorov complexity can be used to approximate entropy:

$$\mathbb{E}_{x\sim X}[H^K(x)] \approx H(X)$$

So, in the end, they are literally just doing simple math with the trained models' outputted logprobs to calculate entropies. It's so simple that it makes me suspicious, but after stewing on it for a while, I find it believable.

On the other hand, this new approximation is not a magical cheat code. It seems like they still can only calculate unintended memorization (and not total or intended memorization) for non-synthetic datasets. This is because there's no way to calculate $H(X)$ for non-synthetic data. As a result, the applicability is somewhat limited.

Even for unintended memorization, $H(X\vert\Theta,\hat{\Theta})$ is hard to compute. They use an oracle model and approximate the value using

$$\max\{p(x\vert\hat\theta),p(x\vert\theta)\}$$

I would like to hear more reasoning about the use of oracle models. Why do we expect these to be a good approximation of $H(X\vert\Theta,\hat{\Theta})$? I guess it makes sense if you generally believe that LLMs approach the true distribution as they get larger and train on more data. But I wonder how different the results would look depending on the choice of oracle.

All this being said, the results they claim seem believable and intuitive, so maybe it all just works. Who am I to talk shit?

# Conclusion

This paper is cool and gave me a lot to think about.

I did find it interesting to stumble upon an example in which literal memorization of training data produces, mathematically, more generalization than rote memorization. I'm not sure that it really matters in the grand scheme of things, but it is a fun brain teaser.

~~The jump from model logprobs to entropy approximations feels sketchy to me. I'd love for it to be true, but I need to think harder about it.~~ Edit (06/19/25: I'm feeling better about this now). The empirical results seem believable, though, and I do think this is still a fun read and suggests future experiments.

I'd like to see more fiddling with synthetic datasets to determine what kind of data various ML architectures can or cannot learn.

So yeah, nice paper. Good job.