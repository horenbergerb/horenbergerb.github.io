---
tag: diary
---

# Continued efforts with Obsidian RSS integration

* TOC
{:toc}


So I put in the legwork to abstract the pipeline for adding RSS feeds to Obsidian. I'm still not totally happy with my implementation, but I think it's sufficiently flexible for me to easily add new RSS feeds whenever I want.

All the heavy lifting is handled by the Feed class, which has some weird quirks. Here's the class header and a bit of documentation:

![Pasted image 20231211210726.png](/images/obsidian/Pasted%20image%2020231211210726.png)

So what's weird about this is that to get sufficient flexibility, I have to pass a bunch of weird shit including:

1. A map/dict to standardize fields among the various tables
1. A function for parsing to markdown
1. A SQL query for retrieving recent items which also needs to be formatted to add the SQL table name
1. A string representing the date format

It feels dirty, but it works for now. This is what instantiating a feed looks like:

![Pasted image 20231211210930.png](/images/obsidian/Pasted%20image%2020231211210930.png)

I dunno, it's weird, and it's certainly not a design I see frequently. It would be nice if I could break things apart so that a feed could be described neatly in a yaml file or something. Piping data from different sources is hard.

Oh well, for now this will do.

I should probably start thinking about unit tests or some kind of automated testing if I want to keep scaling up the functionality. Set up some Github Actions, etc.

