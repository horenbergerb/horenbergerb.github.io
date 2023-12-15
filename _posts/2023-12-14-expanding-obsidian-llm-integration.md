---
tag: diary
---

# Integrating LLMs with Obsidian

* TOC
{:toc}


Okay, so I have successfully plugged local models into Obsidian. Here's a summary of the functionality I implemented (stolen from my README):

 > 
 > The model is loaded via llama.cpp's built-in server functionality. A cron job periodically runs a Python script which parses all conversation files and looks for conversations marked for generation. It formats these conversations and sends a request to the llama.cpp server for chat completion. Then, it updates the markdown file with the new response.

Here are some of the features I want to implement:

### Optional settings header

Basically lets you preface a conversation with settings, i.e.

````
#### Settings
temp: 0.6
top_p: 0.93
system_prompt: Be a monkey
#### User
Do you like bananas?
#### Assistant
*monkey sounds*
````

This should be optional for convenience; these values only override default settings under the hood. Possibly I could also have a repository of pre-written system prompts that can be retrieved here.

### Retrieval-augmented generation within Obsidian

Retrieve relevant document segments to augment LLM responses. Possibly trigger this with a flag when requesting generation, like using `#g` to signify normal generation and `#ag` to signify augmented generation.

There's not a huge rush on this because I don't intend to integrate this into my own personal notes any time soon. In my little sandbox Obsidian Vault, there's not a lot of material that RAG would be useful for.

### Retrieval-augmented generation specifically for news

This is more interesting because I want it to retrieve not only the news from the Obsidian articles, but also potentially parse the web-pages associated with that news. I could also do some kind of LLM preprocessing of news? Like, all news articles automatically receive an LLM-generated summary.

I think there's a lot of wiggle room here for making a pretty elaborate system of news organization and presentation. The hard part is figuring out where to start. What can I do that's simple and scalable?

I was kind of fantasizing about something like this:

1. Model parses news feed and summarizes articles, saving each summarization with the article.
1. Model ranks each article based on its relevance to you.
1. Model can conversationally discuss news, recalling recent articles randomly and weighting articles that are relevant to you.
1. Model interprets preferences from your discussions and update its rankings for different articles

### Webcrawler steered by LLM

What if I tried a less directed approach of generating news, namely letting an LLM browse the web in search of interesting content? So rather than having feeds that an LLM curates, the LLM actively pursues new sources of information.

This seems kind of crazy, but it's a really fun idea. I am curious how it would work... Practically speaking, you'd either need to condense the webpage information (maybe letting the LLM use Python directly to interface?) or have a massive context.

Preliminary attempts at this are mixed. I think I would need to engineer a very friendly way for the model to explore before I'd have a shot at doing this. I think if I could gamify it some how or make a simplified UI for the LLM to interact with then I'd have a shot.

### LLM integration with browser history

I was wondering if something like this might be nice for making the model more contextually aware; it knows what you've been thinking about recently. The catch being the same as my other ideas: it needs to be able to parse webpages

# Parsing webpages with LLMs

How can I condense a webpage to the most meaningful content?

Supposing I start with like BeautifulSoup, how do I approach this? Asking the model to consume the whole page at once is probably futile; webpages can be massive.

Maybe I could start by trimming content? Identifying irrelevant bits and removing them? The LLM could assist with this. It's hard, though, since you need a "big picture" idea of the page to know what's junk and what matters...

I should start picking apart some websites with beautifulsoup to see if any methodologies pop out.

