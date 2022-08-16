# The Mystery of the Frog Riddle
## Problem Statement: Suppose You Must Lick A Frog

Recently a friend of mine, Seong, posted an interesting video called "Can you solve the frog riddle? - Derek Abbot" in his [Discord server.](https://discord.gg/CywQETvt) The video describes a statistical puzzle:

<iframe width="560" height="315" src="https://www.youtube.com/embed/cpwSGsb-rTs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The problem statement is as follows:

>...You've eaten a poisonous mushroom. To save your life, you need the antidote excreted by a certain species of frog. Unfortunately, only the female of the species produces the antidote, and to make matters worse, the male and female occur in equal numbers and look identical, with no way for you to tell them apart, except that the male has a distinctive croak...
>
>To your left, you've spotted a frog on a tree stump, but before you start running to it, you're startled by the croak of a male frog coming from a clearing in the opposite direction. There, you see two frogs, but you can't tell which one made the sound... You only have time to go in one direction before you collapse.
>
>What are your chances of survival if you head for the clearing and lick both of the frogs there? What about if you go to the tree stump?

The video eventually gets around to describing the proposed solution:

> So here's the right answer: going for the clearing gives you a two in three chance of survival...
> 
> When we first see the two frogs, there are several possible combinations of male and female. If we write out the full list, we have what mathematicians call the sample space...

The sample space for the frogs in the clearing looks like this:

    Frog1 | Frog2
    -------------
    Male  | Male
    Male  | Female
    Female| Male
    Female| Female

Then,

>Out of the four possible combinations, only one has two males... The croak gives us additional information. As soon as we know that one of the frogs is male, that tells us there can't be a pair of females, which means we can eliminate that possibility from the sample space, leaving us with three possible combinations.
>
>Of them, one still has two males, giving us our two in three chance... of getting a female.

There you have it! It's all clear, right? We see that probability is mysterious and confusing and you can always solve your problems by appealing to the sample space. There's nothing left to talk about, case closed, see you later.

## The Marble Incident

It was late last night. I had just finished watching the frog video, and I was laying in bed feeling quite smug. Then, I received the following messages:

![](/images/2022-08-16-mysteryofthefrogriddle/Pasted image 20220816172519.png)

![](/images/2022-08-16-mysteryofthefrogriddle/Pasted image 20220816172544.png)

This made me feel bad.

Let's start with the base case. Suppose you have the bag with just one marble in it. Suppose this marble is equally likely to be red or black. If you were to draw the marble of the bag, it's a one out of two, i.e. 50%, chance that the marble is black. No mystery there.

Now, let's take the bag with the unknown marble again. This time, we drop a red marble into the bag and give it a good shake. When we dump both marbles out of the bag, what are the odds we find a black marble? Well, let's use the sample space approach from the frog video:

    Marble1 | Marble2
    -----------------
    Black   | Black
    Black   | Red
    Red     | Black
    Red     | Red

But we know one of the marbles must be red, so `Black Black` can be crossed off the list. This leaves three possibilities, and two of them involve a black marble, so... There's a two in three chance of finding a black marble?

To be extremely clear, the conclusion here is this: dropping a red marble in the bag *increases the chance that the unknown marble will be black*. You can extend this to show that as you add red marbles, the probability of the bag containing a black marble continues to rise.

So what, do we just lay down and take this? Is this the reality we live in?

![](/images/2022-08-16-mysteryofthefrogriddle/Pasted image 20220816180915.png)

I think not.

## Where Did We Go Wrong?

[We are not the first people to feel upset by this video.](https://stats.stackexchange.com/questions/201502/the-frog-riddle-conditional-probabilities) Additionally, [we are not the first people to take a whack at correcting it.](https://www.duckware.com/blog/the-ted-ed-frog-riddle-is-wrong/index.html) The cited attempt fixes the problem by assuming additional information. They assume males have a 50% chance of croaking, and females have a 0% chance of croaking. Then the probability of finding a female frog in the clearing matches the 2/3 from the original video. The catch, however, is that the probability of the frog on the stump being female is now also 2/3, so both directions offer the same probability.

I will take a different approach. Let's make the following assumptions to formulate the problem:

1. The genders of frogs are independent and identically distributed.
2. $p(M)=p(F)=0.5$ for an arbitrarily sampled frog.
3. If you go to the stump, you will sample one frog.
4. If you go to the clearing, you will sample one frog and additionally receive a male frog.
5. If you go the clearing, there is a 50% chance you will sample before receiving the male frog (and a 50% chance of the converse).

I chose these assumptions because, in my opinion, they most closely match the problem described by the original video. So what are the probabilities?

For the stump, it follows trivially from (2) and (3) that $p(M)=p(F)=0.5$, so you've got a 50% chance of getting a female frog.

How about the clearing? Well, using (1), (2), and (4), we see that the frog we will sample has probabilities $p(M)=p(F)=0.5$. So what do our outcomes look like? This is where we must use assumption (5).

- Sample first, Sample is male (MM): $50\%*50\%=25\%$
- Sample first, Sample is female (FM): $50\%*50\%=25\%$
- Sample second, Sample is male (MM): $50\%*50\%=25\%$
- Sample second, Sample is female (MF): $50\%*50\%=25\%$

Now, adding these up, we see that (MM) has a probability of 50% whereas (FM) and (MF) together have a probability of 50%.

Thus, it's clear that there is only a 50% chance that you will survive if you run to the clearing.

## Conclusion

It seems pretty fucking clear to me that this video sucks. At best, it leaves out essential assumptions. At worst, it's straight-up wrong. I stayed up until 2AM thinking about this, and I *almost* gave in to the belief that adding black marbles to the bag makes the red marble more likely. This video made me hit rock bottom.

![Credit to 16mhz from the TPM Discord server](/images/2022-08-16-mysteryofthefrogriddle/Pasted image 20220816183317.png)