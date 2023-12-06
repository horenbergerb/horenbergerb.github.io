---
tag: diary
---

# Anotha day making a news feed

* TOC
{:toc}


# Improvements to News Interface

## Using LLMs for filtering (TODO)

Okay, so the big challenge is a dataset. What if every day I skimmed the first paragraphs of ~10 articles on the Hacker News front page, and for each article, I write a brief summary of why I do or don't like it.

Then, I can finetune a model on the pairing of article content and my personal opinion. Could the model learn to reflect my opinions about articles? It's a fun idea, at least.

It's important that the articles I train on are randomly sampled. I can't just log the articles I choose to read or else it will only learn positive preference.

## Data structure for retrieved news (DONE)

Every time the script runs, it retrieves a list of news articles. How should I handle the addition of new articles and departure of old articles?

I ended up making a sqlite database that stores the articles. This gives more freedom on how to render news. Now, I only render the 10 most recent articles published on the Hacker News front page. I can also store additional information with the articles if I wanted to.

## Easier copy/pasting of news feed (DONE)

For some reason Obsidian mobile makes it difficult to highlight links when they are on their own line. I need to add characters to each line to make it easier to highlight. For now, I'm solving this by just including the time of publication:

![Pasted image 20231201203858.png](/images/obsidian/Pasted%20image%2020231201203858.png)

## Support for multiple feeds (TODO)

This is mostly already there except that I need to add feed labels in the database. I also need to prepare for the eventuality that feeds will be rendered differently. For example, I might apply different filters or sort criteria to arxiv feeds.

# Cool news

* [Unrolling Virtual Worlds for Immersive Experiences.](http://arxiv.org/abs/2311.17924)
  * Very short and simple, but a cool concept for rough and ready AI generated virtual experiences

