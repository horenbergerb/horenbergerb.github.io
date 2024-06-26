---
tag: diary
---

# Solving equations with the Lambert W function and GPT

* TOC
{:toc}


## The problem and my solution

My girlfriend sent me this problem earlier and asked if it was solveable.

![image0-22.jpg](/images/obsidian/image0-22.jpg)

The presence of $ln(x)$ and $x$ tipped me off that it probably wasn't trivial to solve. I googled something like "solve equation with ln(x) and x" and stumbled upon the [Lambert W function.](https://en.m.wikipedia.org/wiki/Lambert_W_function#:~:text=The%20Lambert%20W%20function%20is%20used%20to%20solve%20equations%20in,z%20using%20the%20W%20function.)

The takeaway was that a solution could be calculated in terms of W if I could wrangle things into the following form:

![Screenshot_20231205-120414~2.png](/images/obsidian/Screenshot_20231205-120414~2.png)

So I took a crack at it. Here's some half-ass wrangling I did on sticky notes:

![IMG_20231205_120619914.jpg](/images/obsidian/IMG_20231205_120619914.jpg)

This made it look pretty solveable. To bring it home:

![IMG_20231205_123850033.jpg](/images/obsidian/IMG_20231205_123850033.jpg)

This was enough to calculate $a_0$ and $c$. Then I could plug the whole equation into Wolfram Alpha, which can handle the Lambert W function. The end result was that $x\approx 7$, in case you're wondering.

## Can GPT solve it?

Short answer: no

I'll add the whole chat log here later. OpenAI is giving an error when I try to share.

I had a conversation with ChatGPT to see how far it could get. Even if it couldn't handle the algebra, could it give me the same tips as a Google search?

At first it hallucinated a simpler version of the problem which involved $\ln x$ but not $x$. Once I pointed this out, it corrected itself and rephrased the problem correctly.

Next it insisted that the solution was probably a transcendental equation and recommended using numerical approximation. This is probably good general advice. I was sad it didn't mention the Lambert function though.

I tried encouraging it to find an algebraic solution, but it didn't attempt it, nor did it provide any clues or suggestions.

Finally, I got a little more direct to get what I was hoping to see:

![Screenshot_20231205-224616-390.png](/images/obsidian/Screenshot_20231205-224616-390.png)

So it is aware of Lambert functions, but it felt like a hollow victory.

Lastly, I pushed for an algebraic solution, and it ended up plugging the equation into sympy. The calculation timed out, but I was really surprised and impressed.

````python
from sympy import symbols, Eq, log, solve, lambertw

# Define the variable
x = symbols('x')

# Given constants in the equation from the image
a = 0.0178
b = 8.0973
c = 0.0732
d = 0.013
e = 13
f = 51.15

# Construct the equation: f = ln(x/a)/b - (c*x + d)/e
# To use the Lambert W function, we need to isolate the exponential term. We start by getting rid of the denominators.
equation = Eq(f * b * e, log(x/a) * e - (c*x + d) * b)

# Now we need to manipulate the equation into the form required for the Lambert W function
# which is: x * exp(x) = k. This typically involves isolating an exponential term and its coefficient.
# However, due to the complexity of the equation, this is not a straightforward task.

# Attempting to solve the equation directly might not give us a solution in terms of Lambert W,
# but let's try to solve it with sympy's solve function, which automatically applies Lambert W if possible.
solutions = solve(equation, x)

# If the solution involves the Lambert W function, it will be included in the solution.
solutions
````

I still need to run this myself and see if it works. I know there is at least a fixable import error.

# Conclusion

The Lambert W function is a nifty hack for tricky algebra problems.

ChatGPT still can't do algebra, but it seems to have relevant latent knowledge. It did fairly well at knowing its own limits and avoiding hallucinations. It also impressed me with its use of tools.

