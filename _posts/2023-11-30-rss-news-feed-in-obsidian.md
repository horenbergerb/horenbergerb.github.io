---
tag: diary
---

# RSS news feeds in Obsidian

I have been thinking about ways to augment/automate Obsidian and my website. Today I was thinking about pulling news into Obsidian via RSS feeds. I could also extend this with my other scripts to automatically push the feed to my website, which is cool.

I created a simple implementation which pulls a list of RSS feeds and formats them into a nice markdown file:

![Pasted image 20231130214125.png](/images/obsidian/Pasted%20image%2020231130214125.png)

I've got a couple todos to make this nicer.

1. Work on logistics, like how frequently to update and (if it's more frequent than daily) how to handle updating the news file.
1. Collect more sources
1. Make a pipeline for marking news articles for publication. Then at the end of the day, the news articles of interest go onto my blog.
1. Use an LLM (Maybe Orca 2 13B?) to summarize and/or filter news. Summarization is straightforward, but filtering is not. What kind of criteria should I set? I think it would be easier to make it filter my Twitter feed than to filter, say, Hacker News.

I'm happy with this though. It's a pretty clean way to render a limited amount of news. I don't want an endlessly scrolling feed, and I don't want links to comment sections. I just want small set of articles that I can choose to read.

