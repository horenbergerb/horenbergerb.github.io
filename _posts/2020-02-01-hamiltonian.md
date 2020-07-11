# What You Need To Know To Understand Quantum Modeling
This post is just a very general summary of the intuition behind quantum modeling. It describes how one practically uses quantum descriptions of a system to describe its expected behavior. Particularly, we show that modeling consists of building a Hamiltonian with a potential function, and then we talk about how quantum allows us to describe what we should expect from each possible kind of measurement, like momentum or position. This post is generally meant for people who've seen many quantum concepts before. In fact, it's actually meant for me, the author.
## Schrodinger Equation As An Entry Point
So, quantum begins (or we are beginning it) with the **Schrodinger equation**, presented here in one dimension:
<div>
$$\frac{-\hbar^2}{2m}\frac{\partial ^2}{\partial x^2}\Psi (x,t) + V(x)\Psi (x,t) = i\hbar \frac{\partial}{\partial t}\Psi(x, t)$$
</div>
This looks like a lot, but it's really a simple idea in a new light. The English translation of this equation says the following: "The momentum of the system and the potential energy of the system determine the change in the system over time." The first term is the **momentum** of the system. The second term is the **potential energy** configuration of the system. The third term is the change of the system with respect to time.\\
You can easily paint this in classical situations. Imagine a body in orbit around the earth. The earth's gravitational field defines $V(x)$. The body's momentum is $p=mv$. These two things are sufficient to describe the change in the particle's position over time. \\
Things are slightly more complicated in our classical model. Here, $\Psi(x,t)$ is *not* a typical position function $x(t)$. You do not input a time and get a definite location. Instead, $\Psi(x,t)$ is a **wave function**, and the output for each $x,t$ contains information about the probability that the particle will be found at $x$ at time $t$. Notice I said "contains information about the probability" and not "is the probability." We will discuss how to extract the probabilities later.
## An Example: The Particle In A Box
Suppose that you have a 1-D particle, which you've put in a box. Our box is an **infinite square well**, denoted
<div>
$$
V(x)= \begin{cases}0,& 0\leq x \leq a\\\infty,& \text{otherwise}\end{cases}
$$
</div>
This is to say that our particle will roam unobstructed where $V(x)=0$, but it can't overcome the barrier required to enter areas where $V(x)=\infty$. Compare to a valley surrounded by infinitely steep hills. You can walk as you please in the valley, but hiking up and over the hills is impossible! The probability of finding our particle where $V(x)=\infty$ is 0.\\
It turns out a quantum particle in such a box can only have certain wave functions. If we throw the particle in with initial state $\Psi(x,0)$, it will have form
<div>
$$
\Psi(x,t)=\sum_{n=1}^{\infty}c_n \sqrt{\frac{2}{a}}{}sin(\frac{n\pi}{a}x)e^{-i(n^{2}\pi ^{2} \hbar/2ma^{2})t})
$$
</div>
Where the variable $c_n$ is determined by
<div>
$$
c_n = \sqrt{\frac{2}{a}}{}\int_{0}^{a}sin(\frac{n\pi}{a}x)\Psi(x,0)dx
$$
</div>
This solution was formulated by solving Schrodinger's equation with our box, $V(x)$. The general solution is reached as follows: first, assume the solution is separable, or that $\Psi(x,t)=\psi(x)\rho(t)$ for some functions $\psi$ and $\rho$. Then solve the time-dependent parts (i.e. the parts including $rho$) and x-dependent (i.e. the parts including $\psi$) parts of the differential equation separately. Combining these as gives separable solutions $\Psi(x,t)=\psi(x)\rho(t)$ However, $\Psi(x,t)$ need not be actually separable. It can be proven that *any* solution of the differential equation can be expressed as a linear sum of separable solutions in the format we show above.\\
As one final restriction, the magnitude of any solution is **normalized**. This means that the wave functions satisfy
<div>
$$
\int_{-\infty}^{\infty} |\Psi(x,t)|^2dx = 1
$$
</div>
This condition is imposed because it creates a very convenient statistical interpretation later. It is also good to keep in mind that $\Psi(x,t)$ can generally be complex-valued.

## Operators Describe The Observable Information For A Quantum System
So, having our solution $\Psi(x,t)$, how do we use this to actually understand our particle in a box? Well, we interpret information from $\Psi(x,t)$ by applying **operators** to it. One fundamental example is the energy operator, $\hat{H}$, which we call the **Hamiltonian**. Operators rely on a specific idea: since our solutions to Schrodinger's equation are a linear combination of functions (particularly orthogonal functions), we may think of the solutions as being in an infinite-dimensional vector space. Operators are actually linear operators on the vector space of wave functions. The **eigenvectors** of operators have **eigenvalues** that represent possible measurable values in an experiment. For the Hamiltonian, our energy operator, the eigenvalues $E_n$ such that
<div>
$$
\hat{H}\Psi_n(x,t) = E_n\Psi_n(x,t)
$$
</div>
represent all of the values that we might measure as the system's total energy. In addition, there is another critically important property of operators. The eigenvectors of the operator (remember: the eigenvectors are wave functions) represent the wave functions that the particle will be in at the time it is observed to have energy $E_n$. So operators tell us not only about the values we can expect from a measurement, but also the possible wave functions that our system would "collapse" to at the time of measurement. Note: this collapse is not actually modeled in our description. This is just how we interpret operators. Operators describe the possible results of a particular kind of measurement. When actually measuring, the system changes in a discontinuous way. Whatever $\Psi(x,t)$ was previously is replaced by a new function satisfying $\Psi(x,0)=\psi(x,0)$, where $\psi(x,0)$ is some eigenvector and the measurement occurs at time $t_m=0$. Upon measurement, the wave function collapses to a random eigenvector based on some probability distribution.//
Beyond the Hamiltonian, there are also position operators and momentum operators. As a matter of fact, all operators can generally be represented in terms of the position and momentum operators, including the Hamiltonian.
## Operators On Our Particle In A Box
Let's apply the Hamiltonian to our particle in a box. It turns out $\hat{H}\Psi_n(x,t) = E_n\Psi_n(x,t)$ has solutions $E_n$ such that
<div>
$$
E_n=\frac{n^2\pi^2\hbar^2}{2ma^2}
$$
</div>
for any $n\in\mathbb{N}$. That's right, there are discrete possible energy values, and they are determined by the size of the box! You might also be wondering about the wave functions that are eigenvectors for the Hamiltonian. Well, they have the form:
<div>
$$
\psi(x)=\sqrt{\frac{2}{a}}{}sin(\frac{n\pi}{a}x)
$$
</div>
The astute reader might recognize this as familiar. This is part of the general solution for $\Psi(x,t)$, and that's no coincidence. Calculating the eigenvectors and eigenvalues of Hamiltonian *is conceptually equivalent* to solving the time-independent component, $\psi(x)$, of the separable Schrodinger equation. The Hamiltonian's eigenvalues and eigenvectors are given by solving:
<div>
$$
-\frac{\hbar^2}{2m}\frac{d^{2}\psi}{dx^2}+V(x)=E\psi
$$
</div>
I will give one more set of claims about operators: firstly, the eigenvectors span the vector space. This isn't always true, but it's practically true for operators we will discuss. Finally, when representing some wave function as a linear sum of eigenvectors of an operator, the modulus of the coefficients of each eigenvector represent the probability of that eigenvalue being measured. In other words, if $\psi_{e}$ is an eigenvector for all $e\in \mathbb{N}$, and 
<div>
$$
\Psi(x,t)=\sum^{\infty}_{n=1}p_n\psi_n(x,t)
$$
</div>
is a representation of $\Psi(x,t)$ with $p_n\in \mathbb{C}$, then the probability of observing eigenvector $\psi_e(x,t)$ (and eigenvalue $E_e$) is 
<div>
$$
P(\psi_{e})=|p_{n}|^{2}
$$
</div>
This works because of our normalization condition we imposed above.
## Recap of Operators
I will summarize the biggest claims about operators here:
* Wave functions exist in a vector space of wave functions.
* Operators are linear operators in the vector space of wave functions.
* Operators have eigenvectors and eigenvalues.
* An operator corresponds to a specific kind of measurement. The eigenvalues are possible values from that measurement and the eigenvectors are the wave funciton the system must be at the time an eigenvalue is received from a measurement.
* The eigenvectors of an operator generally span the vector space.
* If a wave function is expressed as a linear combination of eigenvectors of an operator, then the modulus of the coefficients represent the probability of observing that eigenvector's eigenvalue from a measurement.

## Multiple Operators
This conversation has mostly been about an operator in a vacuum. However, there are some interesting notes about how multiple operators can interact. Suppose we have a particle in our box that is an eigenvector of, say, the Hamiltonian, $\Psi(x,0)=\psi_n(x)$. Then its energy is certainly known to be $E_n$ at time 0. However, eigenvectors of the Hamiltonian are not necessarily eigenvectors of another operator, say the **position operator** $\hat{X}$. In fact, representing $\Psi(x,0)=\psi_n(x)$ as a linear combination of eigenvectors of $\hat{X}$, it generally turns out the probabilities for positions are highly uncertain. Thus, knowing the energy and knowing the position are mutually exclusive possibilities, since the operators have different eigenvectors. There is a more general **uncertainty relation** between two operators. Here is an example: for the position operator $\hat{X}$ and the momentum operator $\hat{P}$, the probabilities of each for a wave function have standard deviations $\sigma_x, \sigma_p$ and these must satisfy
<div>
$$
\sigma_x\sigma_p \geq \frac{\hbar}{2}
$$
</div>
This demonstrates why knowledge of some information is mutually exclusive to knowledge about other information. Such uncertainty relations can be derived from definitions of operators.

## Closing Remarks and Future Topics
This has been an intuitive explanation of how people actually use the idea of quantum to model situations. People build Hamiltonians that are used to solve the Schrodinger equation, providing a picture of the quantum system and its evolution over time. Operators describe possible outcomes of measurements of properties probabilistically. The model suggests that certainty of certain properties excludes the possibility of certainty of other properties. In the next post, we will look at the Hamiltonian of electrons hopping between a finite, discrete set of possible positions on a molecule. Such models are very useful for determining properties of solids, from rigidity to thermal conductivity to electrical conductivity. Their quantum nature uniquely explains properties that classical models cannot, such as how electrons travel uninterrupted in conductors. Classically, electrons would frequently collide with atoms, causing huge heat production and poor conductivity that doesn't align with actual observations. The quantum solution shows that the electron is better modeled as a propagating wave riding along the periodic potential function of of atoms in a lattice, which does not have the collisions and dispersion of the classical model. Simulating and analyzing such models is useful for discovering new useful materials.
