- \text{Intro}

  * \text{encoder + decoder is traditionally a deterministic function}

  * x -> encoder -> latent space z -> decoder d(z)

  * \text{problem: meaningless outputs due to little structure in latent space}

  * show irregular latent space (the problem we are having)

  * show regular latent space (the thing we would like)

- \text{VAEs}

  * \text{VAEs add noise to the encoding process}

  z ~ \mathcal{N}(\mu(x), \sigma(x))

  ( encoder -> gaussian parameters -> sampling -> decoder)

  * \text{Why? Intuitively, the area around $\mu_x$ in the latent space must be similar to x}

  * regular noisy latent space is what this hopefully does; has properties we want

  * \text{The catch: latent encodings must be near each other for this to work}

- \text{Training a VAE}

  * \textbf{Goals:}
    - \text{1) Get a "nice" latent space}
    - \text{2) Get accurate decoding}

  * \text{How do we do this? Using Bayesian methods}

  * \text{Assumptions}
    - p(z) = \mathcal{N}(1,0)