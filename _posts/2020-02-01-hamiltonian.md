# What You Need To Know To Understand Quantum Modeling
  This post is just a very general summary of the intuition behind quantum modeling. It describes how one practically uses quantum descriptions of a system to describe its expected behavior. Particularly, we show that modeling consists of building a Hamiltonian with a potential function, and then we talk about how quantum allows us to describe what we should expect from each possible kind of measurement, like momentum or position. This post is generally meant for people who've seen many quantum concepts before. In fact, it's actually meant for me, the author. As a baseline, you'll be most comfortable if you're familiar with linear algebra concepts like a vector space and a linear operator. We will see some differential equations which were constructed by physicists to fit experimental observations. Understanding how physicists fit differential equations to systems would be useful. The methods we use to solve these are generic differential equation methods. There are complex numbers floating around, but none of our examples leverage them very much, so you can pretend not to notice them.
## Schrodinger Equation As An Entry Point
  So, quantum begins (or we are beginning it) with the **Schrodinger equation**, presented here in one dimension:
<div>
$$\frac{-\hbar^2}{2m}\frac{\partial ^2}{\partial x^2}\Psi (x,t) + V(x)\Psi (x,t) = i\hbar \frac{\partial}{\partial t}\Psi(x, t)$$
</div>
  This looks like a lot, but it's really a simple idea in a new light. The English translation of this equation says the following: "The momentum of the system and the potential energy of the system determine the change in the system over time." The first term is the **momentum** of the system. The second term is the **potential energy** configuration of the system. The third term is the change of the system with respect to time.\\
You can easily paint this in classical situations. Imagine a body in orbit around the earth. The earth's gravitational field defines $V(x)$. The body's momentum is $p=mv$. These two things are sufficient to describe the change in the particle's position over time. \\
Things are slightly more complicated in our classical model. Here, $\Psi(x,t)$ is *not* a typical position function $x(t)$. You do not input a time and get a definite location. Instead, $\Psi(x,t)$ is a **wave function**, and the output for each $x,t$ contains information about the probability that the particle will be found at $x$ at time $t$. Notice I said "contains information about the probability" and not "is the probability." We will discuss how to extract the probabilities later. In summary, wave functions describe how a physical system will evolve over time, and the possible wave functions are constrained by the Schrodinger equation (specifically the potential function) of the particular system.
## An Example: The Particle In A Box
  Suppose that you have a 1-D particle, which you've set free in a box. Our box is an **infinite square well**, denoted
<div>
$$
V(x)= \begin{cases}0,& 0\leq x \leq a\\\infty,& \text{otherwise}\end{cases}
$$
</div>
  This is to say that our particle will roam unobstructed where $V(x)=0$, but it can't overcome the barrier required to enter areas where $V(x)=\infty$. Compare to a valley surrounded by infinitely steep hills. You can walk as you please in the valley, but hiking up and over the hills is impossible! The probability of finding our particle where $V(x)=\infty$ is 0.\\
  It turns out a quantum particle in such a box can only have certain wave functions. This means there is a limit on the things it could do over time, just like how orbital math shows that a satellite in stable orbit couldn't decide to suddenly change direction and break orbit. If we throw the particle in with initial state $\Psi(x,0)$, it will have form
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
  So, having our solution $\Psi(x,t)$, how do we use this to actually understand our particle in a box? Well, we interpret information from the wave function$\Psi(x,t)$ by applying **operators** to it. One fundamental example is the energy operator, $\hat{H}$, which we call the **Hamiltonian**. Operators rely on a specific idea: since our solutions to Schrodinger's equation are a linear combination of functions (particularly orthogonal functions), we may think of the solution functions as being vectors in an infinite-dimensional vector space. Operators are actually linear operators on the vector space of wave functions. The **eigenvectors** of operators have **eigenvalues** that represent possible measurable values in an experiment. For the Hamiltonian, our energy operator, the eigenvalues $E_n$ such that
<div>
$$
\hat{H}\Psi_n(x,t) = E_n\Psi_n(x,t)
$$
</div>
represent all of the values that we might measure as the system's total energy. In addition, there is another critically important property of operators. The eigenvectors of the operator (remember: the eigenvectors are wave functions) represent the wave functions that the particle will be in at the time it is observed to have energy $E_n$. So operators tell us not only about the values we can expect from a measurement, but also the possible wave functions that our system would "collapse" to at the time of measurement. Note: this collapse is not actually modeled in our description. This is just how we interpret operators. Operators describe the possible results of a particular kind of measurement. When actually measuring, the system changes in a discontinuous way. Whatever $\Psi(x,t)$ was previously is replaced by a new function satisfying $\Psi(x,0)=\psi(x,0)$, where $\psi(x,0)$ is some eigenvector and the measurement occurs at time $t_m=0$. Upon measurement, the wave function collapses to a random eigenvector based on some probability distribution.\\
  So now we know the eigenvalues and eigenvectors of an operator tell us about the possible results of a certain measurement. But what happens when we apply an operator to an arbitrary wave function? Well, the operator can be thought of as a change of basis, and the resulting wave function is now a linear combination of the eigenvectors of our operator. We implicitly assume most quantum math "starts" in the position eigenvector basis. In this case, the coefficients of each eigenvector actually contain information about the probability of observing each of their respective eigenvalues!\\
  Beyond the Hamiltonian, there are also position operators and momentum operators. As a matter of fact, all operators can generally be represented in terms of the position and momentum operators, including the Hamiltonian.
## Operators On Our Particle In A Box
  Let's analyze the Hamiltonian as it relates to our particle in a box. It turns out the eigenvectors and eigenvalues $\hat{H}\Psi_n(x,t) = E_n\Psi_n(x,t)$ have solutions $E_n$ such that
<div>
$$
E_n=\frac{n^2\pi^2\hbar^2}{2ma^2}
$$
</div>
for any $n\in\mathbb{N}$. That's right, the possible observable energy values are discrete, and they are determined by the size of the box! You might also be wondering about the wave functions that are eigenvectors for the Hamiltonian. Well, they have the form:
<div>
$$
\psi(x)=\sqrt{\frac{2}{a}}{}sin(\frac{n\pi}{a}x)
$$
</div>
  It's worth mentioning that these are exactly the wave functions with definite energies, and they happen to also be wave functions with (maximally) uncertain positions. That's the uncertainty principle at work. As a teaser, I'll note that this is related to the fact that the Hamiltonian and the position operator do not share any eigenvectors. The astute reader might recognize these functions as familiar. They constitute the general solution for $\Psi(x,t)$, and that's no coincidence. Calculating the eigenvectors and eigenvalues of Hamiltonian *is conceptually equivalent* to solving the time-independent component, $\psi(x)$, of the separable Schrodinger equation. Phrased another way, a settled (time-independent) system's wave function is always an eigenvector of the Hamiltonian, meaning it must have definite energy. The Hamiltonian's eigenvalues and eigenvectors are given by solving:
<div>
$$
-\frac{\hbar^2}{2m}\frac{d^{2}\psi}{dx^2}+V(x)=E\psi
$$
</div>
  Next we'll talk about time-dependent cases and interpreting linear combinations of eigenvectors. Recall that the eigenvectors of operators span the vector space. This isn't always true, but it's practically true for operators we will discuss. When representing some wave function as a linear sum of eigenvectors of an operator, the modulus of the coefficients of each eigenvector represents the probability of that eigenvalue being measured. In other words, if $\psi_{e}$ is an eigenvector for all $e\in \mathbb{N}$, and 
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
* Wave functions are functions that describe the behavior of a system, and they are also vectors in a vector space of wave functions.
* Operators are linear operators on the vector space of wave functions.
* Operators have eigenvectors (also called eigenfunctions) and eigenvalues.
* An operator corresponds to a specific kind of measurement. The eigenvalues are possible observable values from that measurement, and the eigenfunctions are the wave function the system must be whenever the corresponding eigenvalue is observed from a measurement.
* The eigenfunctions of an operator generally span the vector space.
* When an operator is applied to a wave function, it converts the wave function to a linear combination of the operator's eigenfunctions. Then the modulus of the coefficient for each eigenfunction represents the probability of observing that eigenfunction's eigenvalue from a measurement.

## Multiple Operators
  This conversation has mostly been about an operator in a vacuum. However, there are some interesting notes about how multiple operators can interact. Suppose we have a particle in our box that is an eigenfunction of the Hamiltonian, $\Psi(x,0)=\psi_n(x)$ (equivalently, we've chosen a time-independent wave function). Then its energy is certainly known to be $E_n$ at time 0. However, we mentioned earlier that eigenfunctions of the Hamiltonian are not necessarily eigenfunctions of another operator, say the **position operator** $\hat{X}$. In fact, representing our time-independent state $\Psi(x,0)=\psi_n(x)$ as a linear combination of eigenfunctions of $\hat{X}$, it turns out the probabilities for positions are highly uncertain. More generally, certainty of the energy and certainty of the position are mutually exclusive possibilities, since the operators have different eigenvectors. There is a more general **uncertainty relation** between two operators. Here is an example: for the position operator $\hat{X}$ and the momentum operator $\hat{P}$, the probabilities of each for a wave function have standard deviations $\sigma_x, \sigma_p$ and these must satisfy
<div>
$$
\sigma_x\sigma_p \geq \frac{\hbar}{2}
$$
</div>
  This demonstrates why knowledge of some information is mutually exclusive to knowledge about other information. Such uncertainty relations can be derived from definitions of operators. Typically, this is done by observing the difference, $\hat{X}\hat{H}-\hat{H}\hat{X}$. Intuitively, calculating this is equivalent to checking how different the results would be if you were to measure position *then* energy as opposed to energy *then* position.

## Closing Remarks and Future Topics
  This has been an intuitive explanation of how people actually use the idea of quantum to model situations. People build Hamiltonians using knowledge of a system's potential function. The Hamiltonian is used to solve the Schrodinger equation, providing a picture of the quantum system and its possible evolutions over time. Operators describe possible outcomes of various measurements probabilistically. The quantum model suggests that certainty of certain properties excludes the possibility of certainty of other properties whenever operators have distinct eigenfunctions. In the future, I may walk through some analysis of the Hamiltonian of an electron hopping between a finite, discrete set of possible positions on a molecule. Such models are very useful for determining properties of solids, including rigidity, thermal conductivity, and electrical conductivity. Their quantum nature uniquely explains properties that classical models cannot, such as how electrons travel uninterrupted in conductors. Classically, electrons would frequently collide with atoms, causing huge heat production and poor conductivity that doesn't align with actual observations. The quantum solution shows that the electron is better modeled as a propagating wave riding along the periodic potential function of of atoms in a lattice, which does not have the collisions and dispersion of the classical model. Simulating and analyzing such models is useful for discovering new useful materials.
