---
tag: diary
---

# RSS news feeds in Obsidian and new LLMs

* TOC
{:toc}


# Gettings my news in Obsidian

I created a simple implementation which pulls a list of RSS feeds and formats them into a nice markdown file:

![Pasted image 20231130214125.png](/images/obsidian/Pasted%20image%2020231130214125.png)

I've got a couple todos to make this nicer.

1. Work on logistics, like how frequently to update and (if it's more frequent than daily) how to handle updating the news file.
1. Collect more sources
1. Make a pipeline for marking news articles for publication. Then at the end of the day, the news articles of interest go onto my blog.
1. Use an LLM (Maybe Orca 2 13B?) to summarize and/or filter news. Summarization is straightforward, but filtering is not. What kind of criteria should I set? I think it would be easier to make it filter my Twitter feed than to filter, say, Hacker News.

I'm happy with this though. It's a pretty clean way to render a limited amount of news. I don't want an endlessly scrolling feed, and I don't want links to comment sections. I just want small set of articles that I can choose to read.

# Local LLMs are catching up to GPT fast. How?

First day perusing my RSS feed, I noticed [this article about the gap between open source LLMs and GPT.](https://arxiv.org/abs/2311.16989) It's actually nice how it breaks down the best open source models per dataset, but I suspect it's already out of date; the new [Qwen](https://github.com/QwenLM/Qwen) and [Deepseek](https://github.com/deepseek-ai/DeepSeek-LLM) ~70B models are supposed to be the new open source champs on datasets like MMLU. They may even be better than GPT3.5. The gap is getting pretty narrow.

I want to look into these models more. There were some interesting tweets about them. One comment of interest regarded the training schedule:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">imo the most interesting part of DeepSeek 67B is the learning rate scheduler that might allow them to keep continue training the model on more tokens:<br><br>&quot;We employ a multi-step learning rate schedule in our training process. The learning rate begins with 2000 warmup steps, and… <a href="https://t.co/84TX7J6Woj">https://t.co/84TX7J6Woj</a> <a href="https://t.co/tAwFIdi0YL">pic.twitter.com/tAwFIdi0YL</a></p>&mdash; Johannes Hagemann (@johannes_hage) <a href="https://twitter.com/johannes_hage/status/1730075189428494842?ref_src=twsrc%5Etfw">November 30, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The more interesting comment to me was about the dataset.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Deepseek-67B, trained on 2T tokens, confirms just how suboptimal the llama-2/code data mixture was.<br>Mistral confirms this is true even if you only use open datasets – nevermind OpenAI&#39;s dirty secrets.<br>But how do you use them? <br>Contribute to the data lore: <a href="https://t.co/FNwU6o17mj">https://t.co/FNwU6o17mj</a> <a href="https://t.co/s2UgSbft7R">pic.twitter.com/s2UgSbft7R</a></p>&mdash; Teortaxes▶️ (@teortaxesTex) <a href="https://twitter.com/teortaxesTex/status/1730279452192489798?ref_src=twsrc%5Etfw">November 30, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Anyways, I might try these out once the gguf quantizations are available, but I'm not rushing. There's always the possibility they are overbaked or otherwise not as good as the evals lead us to believe. Usually the local model community figures it out fast. If they are good, I expect we'll see some better finetunes coming shortly.

