# Modular Forms: Why Does Anyone Care?

## Introduction

I hope that you, the reader, have no idea what a modular form is. This is not only to hide my own ineptitude, but also because I want to share more than just the mathematics behind modular forms. I want to motivate theoretical mathematics. I want to make you view mathematicians not as dull, spreadsheet-loving, pencil-pushing nerds, but instead as pioneering, adventure-loving, pencil-pushing nerds.

If explorers like Marco Polo or Meriwether Lewis came back and said, "you need to see this!" then mathematicians like Isaac Newton and Bernhard Riemann would have finished their theories and said, "you need glasses." They showed us that there are new ways to perceive the common experience.

To expand on this, we'll start this article by exploring how math fits into our society. We'll briefly look at who used it and how throughout history. On this go-around, we'll try to focus on why math was so pervasive rather than on the genealogy of nerds, but we will inevitably discuss some nerds.

Then, we'll set up some simple mathematical foundations. We'll use this to explain one of the main historical problems motivating modular forms.

Finally, I'll ramble a little bit about modular forms themselves. I make no guarantees about the quality of this content, and I offer no refunds. Let's get to it!

## History of Math: The Highlight Reel

### The Early Days

[*The Number Sense*, by Stanislas Dehaene][1], offers an interesting question: "How can a 5-month-old baby know that 1 plus 1 equals 2?" Stanislas goes even further by showing that many animals have some kind of "number sense," or an ability to compare quantities. For example, rats know that "2 is less than 7," and they can apply this knowledge to many situations, such as counting auditory beeps or flashes of light. Some animals can even perform simple arithmetic, and chimpanzees appear to be capable of adding fractions!

All of this is to say that math is old. It appears that 10,000 years ago creatures may have thought, "oh no, that's three wolves!" This is evolutionarily feasible; knowing approximately how many meals, friends, or enemies you have is a valuable skill.

It's not until after the invention of writing--itself a few thousand years after organized agriculture and civilization--that we see a more nuanced picture of mathematics.

In [*The History of the Ancient World*][2], Susan Bauer describes the earliest use of tally marks in society. "These counters had been used for as long as farmers owned cows: perhaps for centuries. But sometime before 3000 BC, the richest Sumerians (those with many, many counters to keep track of) laid their counters out on a thin sheet of clay, folded the sheet up around them, and placed a seal on the seam. When the clay dried, it formed a kind of envelope."

The development of numbers seemed intertwined with the intricacies of a growing society. Individuals had more property to keep track of, more trade deals to negotiate, and more taxes to pay (or collect). Written numerals helped to verify and communicate quantities.

There was also a blossoming awareness of geometry. The great pyramids, built around 2600BC by the Egyptians, show an awareness of simple geometrical shapes, such as the square and the triangle. These shapes (and a few others) were easy to work with, since area and volume calculations involved simple multiplication. This would let farmers approximate the yield of their plot of land and architects approximate the material cost of their monuments.

Keep in mind that while architects designed buildings or monuments using geometry, the physics appears to have been guess-and-check. According to Bauer,

"The pyramid was to have smooth and very steep sides—but partway through the construction, Snefru and his chief of works seemed to realize that their measurements were off. If the pyramid continued up at its current steep angle, the weight of the stones over the relatively narrow base would likely collapse it. So they made a quick alteration in the angle, with the result that the pyramid turned out hunch-shouldered; one of its sides makes a right-hand turn."

Finally, our last stop in the earliest history of mathematics is [Babylonia, circa 1800-1600BC][3]. This age is notable for having the first widespread occurence of nerds. Mathematical problems were not just being solved to appease an angry trading partner. In fact, there's not a clear motive at all for much of the mathematical work.

Solving the length of the hypotenuse of a right triangle led to approximations of $\sqrt{2}$. Additionally, one could find problems like "I added twice the side to the square; the result is 1300. What is the side?" This is the same as finding the solutions for $x^2+2x=1300$. Why did this interest them? It's not clear that this problem had any practical application.

The Babylonian nerds are not just a historical curiosity. Although they had no clear purpose at the time, many of their mathematical methods would be inherited by future cultures and find their practical niche. In fact, many of the early mathematical curiosities would eventually have utility once we found a better way to connect our experience to math. The culmination of this concept is the mathematical theory of physics developed by Newton.

### Short Survey of Most of Human History

I don't feel like getting particularly elaborate about the period between Babylonia and Newton. No one would argue this period is unimportant, but most people agree that I'm lazy. The Greeks were distinguished nerds due to their obsession with the compass and straightedge. The question "what can we do with these tools" caused them to create a system of axioms and logical deduction. They assumed a few concepts, like "I can extend a line as far as I want" and "I can draw a circle around a point," and then they proceeded fairly rigorously to conclude more elaborate constructions.

While the geometrical conclusions of the Greeks are quite interesting (to nerds), their logical rigor was arguably the most distinguishing innovation in comparison to earlier nerds. Babylonians didn't clearly distinguish between approximations and exact solutions; the difference didn't really matter to them. The Greeks' logical system let them ask more general questions with completely exact answers.

An example would be Euclid's proof of the Pythagorean theorem. For a right triangle with legs of length $a,b$ and hypotenuse of length $c$, it must be true that $a^2+b^2=c^2$. Euclid's proof by geometric argument was incontrovertable. If you accepted his (pretty reasonable) axioms, you could not deny this conclusion. This was a huge flex on the nerds of centuries past.

In the spirit of slandering the dead, I'd like to focus on the things that the Greeks did wrong. In particular, Plato's Platonic solids and Pythagoras's numerology. Plato (along with many others) thought the world was made of four elements, plus one: fire, earth, air, water, and the firmament. In *Timaeus*, Plato boldy claims that these five components of reality are each actually just geometric shapes. For example, fire is made of tetrahedra, because it feels pointy and hurts. I'll leave the other connections as an exercise to the reader.

As for Pythagoras's numerology, Pythagoras thought somewhat vaguely that all things were made of numbers. Pythagoras thought a lot of things, such as "you must not wear wool," "you must not poke fires with swords," "you must put the right sandal on before the left," and so on. He thought the firmament moved in accordance to mathematical equations that were equivalent to the sounds of a symphony, if only it could be decoded. He generally creeps me out a little bit, but we all have our quirks.

If these ideas are so obviously dated, why have I brought them up? To drag a deceased culture through the mud? Nay! I brought these up because they represent the revolutionary concept that there is a theory which connects experience to math. Our pacing, muttering ancestors were dancing with a mathematical theory of everything. While math was developing on its own thanks to the steady trickle of nerds, it was the hunt for a theory of everything that would eventually make mathematics into the powerhouse and commonplace annoyance we know today.

### Newton: Yes I Obviously Have A Crush

Don't get me wrong; there were many key players beside Newton. Newton himself said, "If I have seen further it is by standing on the shoulders of Giants." Maybe mathematicians don't typically evoke the image of "Giants" (although Plato was absolutely shredded), but Newton really did depend on the mathematical infrastructure built by those before him.

That being said, I can now comfortably misrepresent Newton as the sole creator of classical mathematical physics.

Newton's innovation was not unlike Plato's theory of Platonic solids. Fundamentally, Newton also claimed that all things were mathematical objects which behaved in a certain way. He claimed that all things were made of points or collections of points, and all points had a quantity of mass, a position vector, a velocity vector, and an acceleration vector. "Forces" were just a blanket term for "the things that change your velocity." The famous equation, $F=ma$, basically says that force and acceleration are the same thing.

Newton related the position, velocity, and acceleration of a point by calculus. Velocity is the derivative of position and acceleration is the derivative of velocity. Keep in mind that the derivative is the "rate of change at a point," or the slope of the tangent line:

[<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Tangent_to_a_curve.svg/440px-Tangent_to_a_curve.svg.png">](wikipedia.com)

This sounds pretty mathematical and abstract. If this is so similar to Plato and Pythagoras, why isn't Newton a quack? The reason is because Newton's theory was tractable.

The mathematical objects (points, velocities, accelerations, etc) defined in Newton's theory weren't just a thought experiment. At the time, people were performing experiments to collect data on the position, velocity, and acceleration of falling objects of a known mass. In other words, Newton constructed his theory with mathematical objects that were easily converted into things we can measure in reality. And yet, the theoretical objects were still so general that most physical situations could be converted into classical mechanics without much trouble.

This is one major distinction between Plato's Platonic solids and Newton's classical mechanics. Newton's theory was built specifically around practical questions. The general question was "how do things move?" The mathematical objects in Newton's theory was built to predict the data which people were recording in their experiments.

So Newton's theory is tractable in the sense that many questions can be rephrased in the language of classical mechanics. "Is my house going to collapse?" can be converted into an analysis of force vectors and masses. But there's another aspect of being tractable. Can we actually answer these questions? As it happens, Newton's theory allows us to answer many of the questions we might ask about the physical world.

### Why Classical Mechanics Can Answer Questions

Supposing we have some question about the world, and we've converted it into some combination of points, masses, position vectors, velocity vectors, and acceleration vectors, how do we go about answering our question? Well, let's think about the kinds of questions we might ask in the language of classical mechanics.

* "Given the velocity, what will the position of the plane be at time $t$?"
* "Given the acceleration and initial conditions, what is the fastest velocity the orbiting satellite will reach?"
* "Given the position, when will the ball reach its highest point?"
* "Given the acceleration and initial conditions, will the particle ever pass point $q$?"

There are a few flavors of problem here. The first is solving the properties at a specific time, i.e. calculating $v(t)$ or $x(t)$. Another flavor is finding extrema values and the time at which they occur. The second-to-last question is interesting. We can rephrase it slightly by asking "is the minimum distance between $x(t)$ and $q$ zero?" In that regard, it's another extrema problem.

Here are a few more complicated questions which will deeply relate to modular forms

* "What is the length of the path which the orbiting body followed between time $t_i$ and time $t_f$?
* "Given the position function, and length of the path which the orbiting body followed during some time segment, can we find suitable times $t_i$ and $t_f$?"

The last problem can be quite interesting, and as it happens, it will end up being related to modular forms later.

So, can we solve all these? As it turns out, we can frequently solve them, but there are also situations where an exact solution is impossible. In that case, we can often approximate the solution to an arbitrary precision!

To everyone's surprise, the process of solving these problems often brings us to exactly the same issues which nerds worked on thousands of years ago. As a matter of fact, Newton's calculus itself has echos of approximation methods used by the Greeks.

Some of these problems are solved simply by integrating or taking the derivative. Others are solved by finding the zeros of velocity or acceleration. A derivative of a function is the slope of the linear approximation at each point. The integral is the sum of these approximations times an infinitsmal volume. Finding zeros is done with the aid of the derivative or by algebraically factoring into a product of linear terms. Approximation methods also make use of linearity in similar ways.

There are two things I'd like you to take away from this trainwreck of a monologue. The first is that, like it or not, a ton of math that was once totally useless eventually became extremely practical and relevant. The second is that classical mechanics was useful because it was tractable, and it was tractable because the questions could be answered using linear tools.

## Modular Forms: What Were We Talking About Again?

### Historical Context: But Relevant This Time


[1]:https://books.google.com/books?hl=en&lr=&id=SPaapa4PMVEC&oi=fnd&pg=PR7&dq=number+sense+animals&ots=YBDB20ibFR&sig=tQX0xdThJDY461IK5WjDPKrcAS4#v=onepage&q&f=false
[2]:https://susanwisebauer.com/book/he-history-of-the-ancient-world-from-the-earliest-accounts-to-the-fall-of-rome/
[3]:https://www.math.tamu.edu/~dallen/masters/egypt_babylon/babylon.pdf