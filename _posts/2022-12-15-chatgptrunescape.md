---
custom_excerpt: |
  "...Some games have elaborate mechanics relying heavily on [common sense](https://en.wikipedia.org/wiki/Common_sense), which reinforcement learning does not have... NLP might be more successful under these circumstances due to its general knowledge..."
tag: blog
---

# Teaching ChatGPT to Play Runescape

* TOC
{:toc}
# Reducing Runescape to Text

Some of you may be aware that I have previously worked on using computer vision to extract data from a live feed of [Runescape](https://oldschool.runescape.com/). For example, I have [estimated the player's global location](https://horenbergerb.github.io/2022/03/04/runescapelocationfinding.html) and created a [detector of interactible objects](https://horenbergerb.github.io/2022/07/19/runescapeobjectdetection.html).

I have also written other scripts to parse more information from the game. More than I care to admit, frankly.

Really, I've been working on reducing the game to an interface that describes the game state completely in text. The interface will also accept written commands which control the character.

![](/images/2022-12-15-chatgptrunescape/game_to_text_diagram 1.png)

But why? What's the use of turning Runescape into a text-based adventure?

Originally I was just practicing computer vision and ML techniques. I started to wonder if I could make an interface that an ML algorithm could use to play Runescape.

Realistically, I had no shot. Training an agent to imitate a typical Runescape player was far beyond the achievable possibilities of an armchair expert like me.

Well, things might be changing with the release of [ChatGPT](https://openai.com/blog/chatgpt/). ChatGPT is a natural language processing (NLP) model which can perform a variety of tasks and regurgitate facts about many topics (although it is often incorrect).

In this article, I wanted to explore the possibility that a text-based representation of Runescape could allow ChatGPT to play the game and effectively replicate human players.

|![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215204212.png)|
|:--:|
| *Proof that OpenAI hates PKers and they want to remove the wilderness* |

# NLP or Reinforcement Learning for Video Games?

## Reinforcement Learning

Typically automation of video games is approached using [reinforcement learning](https://en.wikipedia.org/wiki/Reinforcement_learning). This makes a lot of sense for the following reasons:

- Games are often objective-based in a quantifiable way
- Games are typically a sequential process of decision-making over time where your current state and actions depend on your history
- Games can often be replayed arbitrarily many times as part of the training process
- Any quantifiable interface for a video game is compatible with reinforcement learning
	- ex) inputs from joysticks, button presses, mouse clicks
	- ex) game state represented as a large structured dataset of discrete/continuous quantities

Famously, OpenAI used reinforcement learning to train [OpenAI Five](https://openai.com/five/) to play DOTA. The algorithm was eventually able to beat many professional teams.

## NLP

NLP is probably not a good choice for video games in general. I shouldn't have to explain why. It's just not designed to play video games.

However, some games have properties which make them particularly difficult for reinforcement learning:

- Some games do not have clear victory conditions. In this case, "typical" gameplay can be hard to quantify and often very diverse
- Some games have elaborate mechanics relying heavily on [common sense](https://en.wikipedia.org/wiki/Common_sense), which reinforcement learning does not have
	- ex) knowing that you need an axe to cut down trees, that using a fishing rod on a fishing spot will catch fish and give you fishing experience, that eating food will heal you, etc.
- Some games are large and have no start and end; iterating multiple playthroughs for training is not feasible.
	- ex) most MMORPG games are far too large to train with repeated playthroughs

NLP might be more successful under these circumstances due to its general knowledge. It can approximate common sense and make reasonable statements about "typical" behavior of an MMO player. Potentially, NLP models could transfer this knowledge to a game without specific training. Because of these properties, it's possible that an NLP model might be able to interact with a game more effectively than a reinforcement learning algorithm.

|![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215215209.png)|
|:--:|
| *ChatGPT has a lot of general knowledge about MMORPGs, but it still makes mistakes* |


Runescape has many of the properties which make direct reinforcement learning very difficult. Could NLP have a competitive advantage here?

# Preliminary Investigation of ChatGPT

Enough fuckin' around. What does ChatGPT know about Runescape, and can it farm gold for me?

I began by investigating what kinds of information ChatGPT might contain regarding Runescape. I asked a series of questions, first about the game in general, and then more specific concepts. Here is some of the dialogue.

Afterwards, I tried to have ChatGPT roleplay simple situations within the game to describe what actions it might take.

## What Does ChatGPT Know About Runescape?

### General Information About Runescape

**Beau:**

Explain the video game Old School Runescape

**ChatGPT:**

Old School Runescape (OSRS) is a massively multiplayer online role-playing game (MMORPG) developed and published by Jagex. It is a re-imagined version of the classic MMORPG Runescape, which was first released in 2001. In OSRS, players can create their own character and embark on various quests and adventures in a fantasy world filled with magic and mythical creatures. The game is known for its open-world environment and its challenging gameplay, which requires players to complete various tasks and puzzles in order to progress. OSRS has a dedicated player base and is known for its active community of players who regularly participate in in-game events and activities.

#### Review

Not bad. A lot of this information is accurate.  Some of the descriptors are a little boiler-plate.

### Overview of The Skill System

**Beau:**

What sort of skills are available to players in Old School Runescape?

**ChatGPT:**

In Old School Runescape, players can choose from a wide variety of skills to train and develop. Some of the skills available in the game include combat skills (such as Attack, Strength, and Defence), gathering skills (such as Mining, Fishing, and Woodcutting), and crafting skills (such as Smithing, Cooking, and Fletching). There are also several magic-based skills, such as Magic and Prayer, as well as miscellaneous skills like Thieving and Hunter.

Each skill has its own unique gameplay mechanics and benefits. For example, training the Cooking skill allows players to cook and prepare food, which can be used to restore health and provide temporary stat bonuses. Training the Magic skill allows players to cast spells, which can be used in combat or to perform various tasks. And training the Thieving skill allows players to pickpocket NPCs and steal from stalls and chests.

The skills available in Old School Runescape are varied and diverse, and allow players to tailor their character's abilities to their playstyle and preferences. As you progress through the game, you can choose to focus on developing certain skills, or to train a wide variety of skills in order to become a well-rounded character.

#### Review

Pretty much dead-on. Everything here is accurate and it's a decent summary.

### Detailed Information About Mining

**Beau:**

What items and skills are needed to mine copper ore in Old School Runescape?

**ChatGPT:**

To mine copper ore in Old School RuneScape, you will need the following items and skills:

1.  A pickaxe: You will need a bronze, iron, steel, or mithril pickaxe to mine copper ore. A higher level pickaxe will allow you to mine copper ore faster, but any of these pickaxes will work.

2.  Mining level: You will need to have at least level 1 Mining to be able to mine copper ore. As you increase your Mining level, you will be able to mine copper ore more efficiently.

3.  A mining location: Copper ore can be found at a variety of locations throughout the game, including the Lumbridge Swamp Mines, the Al-Kharid Mine, and the Piscatoris Mining Site.


To start mining copper ore, first equip your pickaxe and then find a rock that contains copper ore. Left-click on the rock to begin mining it, and you will receive copper ore as you gather resources. You can then smelt the copper ore to turn it into a usable bar of metal, which can be used in various crafting and construction tasks throughout the game.

#### Review

Wow, this one is good. Here are the nitpicks:
- It didn't list *all* of the pickaxes
- [A better pickaxe doesn't make you faster](https://oldschool.runescape.wiki/w/Pickaxe)
- You don't need to equip the pickaxe to mine
- You also need tin to smelt the copper

But the gist of it is correct; someone following these instructions could successfully mine copper. Even the locations are valid, and they're (mostly) decent choices for new players too.

### General Quests

**Beau:**

What are some important quests that new players of Old School Runescape should complete?

**ChatGPT:**

As a new player to Old School Runescape, there are several quests that you should consider completing in order to progress in the game and gain access to new content and features. Some of the most important quests for new players include:

-   Tutorial Island: This is the starting quest for all new players in Old School Runescape. It provides a basic introduction to the game's mechanics and controls, and is a necessary starting point for all new players.

-   Cook's Assistant: This is a simple quest that tasks players with gathering ingredients for a cook in the village of Lumbridge. Completing this quest will reward players with experience in the Cooking skill, as well as some basic cooking equipment.

-   The Restless Ghost: This quest tasks players with finding and helping a restless ghost who is haunting the town of Lumbridge. Completing this quest will reward players with experience in the Prayer skill, as well as the ability to wield the white skull sceptre, which can be used to teleport to various locations in the game world.

-   Rune Mysteries: This quest involves investigating a mysterious disappearance at the Rune Essence mine, and is a good introduction to the game's magic-based skills. Completing this quest will reward players with experience in the Rune Crafting skill, as well as the ability to teleport to the Rune Essence mine.


Overall, completing these quests will help new players to get a feel for the game and its mechanics, and will provide them with valuable experience and rewards that can help them to progress in the game.

#### Review

God damn, this is pretty good too. I mean, it's not an optimal quest list are anything, but these are good quests for beginners to Runescape, and the descriptions are decent. Not sure about the "white skull sceptre" though. I think that's a lie.

### Specific Quests

**Beau:**

Please summarize the plot of the Cook's Assistant quest in Old School Runescape.

**ChatGPT:**

In the Cook's Assistant quest in Old School RuneScape, you play as a character who is tasked with helping the cook in the Lumbridge Castle kitchen. The cook needs your help to gather some ingredients for a special cake he is making for the Duke of Lumbridge's birthday. You must retrieve a pot of flour, an egg, and a bucket of milk from the nearby farm. Once you have all of the ingredients, you bring them back to the cook and he uses them to make the cake. The quest is a simple and short one, but it serves as an introduction to the world of RuneScape and helps to familiarize players with the game's mechanics and controls.

#### Review

This is exactly right. A lot of key information is conveyed accurately here. Impressive that ChatGPT knows this.

|![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215204546.png)|
|:--:|
| *Information about the Cook's Assistant quest from the [Runescape Wiki](https://oldschool.runescape.wiki/w/Cook%27s_Assistant)* |

![]()

## Simple Roleplay

Here I wanted to see if I could get ChatGPT to act as if it were a player and describe explicit actions it would perform.

**Beau:**

Let's pretend you are a new player to Old School Runescape. You have just finished Tutorial Island, and you are standing in Lumbridge. What would you do first?

**ChatGPT:**

As a new player to Old School Runescape who has just finished Tutorial Island and is standing in Lumbridge, I would likely take a moment to familiarize myself with my surroundings. This might involve exploring the town of Lumbridge and talking to the NPCs there to learn more about the game world and its lore. I might also look for any quests or tasks that are available in the area, and consider completing them in order to gain experience and rewards.

Once I have a better understanding of the game and its mechanics, I would likely focus on training my character's skills. This might involve finding resources and items that I can use to train skills like Mining, Fishing, or Woodcutting, and spending some time gathering and crafting to level up those skills. I might also look for combat training opportunities, such as fighting monsters or other enemies, in order to improve my character's combat abilities.

Overall, as a new player in Old School Runescape, my first priority would be to familiarize myself with the game world and its mechanics, and to begin training my character's skills in order to progress and become more powerful.

**Beau:**

While exploring Lumbridge, you see several NPCs to whom you can talk, including:
- Cook
- Hans
- Lumbridge Guide 
- Father Aereck 
- Bob 
- Donie 
- Veos
 
You also see several NPCs whom you can attack, including: 
- Man (Level 2) 
- Rat (Level 1) 
- Goblin (Level 2) 

Finally, you also see several trees which you could cut if you had an axe. Which of these would you interact with? Or would you instead continue exploring?

**ChatGPT:**

As a new player to Old School Runescape, I would likely start by interacting with the various NPCs in Lumbridge. This would involve talking to them to learn more about the game world and its lore, and to see if they have any quests or tasks that I can complete. For example, I might talk to the Cook to see if he has any tasks that I can help with, or to Father Aereck to learn more about the town's history.

I would also likely consider attacking some of the low-level enemies in the area, such as the Man, Rat, or Goblin, in order to gain experience and level up my combat skills. I would only do this if I feel confident that I can handle these enemies, and if I have the necessary equipment and abilities to do so.

I would not likely attempt to cut down any trees at this point, as I would need to have an axe and the necessary Woodcutting skill in order to do so. Instead, I would continue exploring the area and interacting with the NPCs and enemies there, in order to learn more about the game and to gain experience and rewards.

### Review

Not bad. A little verbose, but the broad strokes are all valid, except that no one plays Runescape for the lore.

|![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215204802.png)|
|:--:|
| *POV: You are ChatGPT standing in Lumbridge* |

# ChatGPT Plays Runescape

Now I felt like it was time to mock a simple interface with ChatGPT and see how it behaved.

I made up a few commands that were flexible enough to let ChatGPT act but simple enough that I could imagine writing a real program to implement them.

However, for this experiment I physically controlled the player in Runescape and simply did as ChatGPT commanded. This is just a proof of concept.

### Warmup

**Beau:**

Pretend you are a computer program designed to play Old School Runescape just like a human would. You interact with the game through a text interface. There are a set of commands available to you:

1. look
2. inventory
3. interact X
4. go X

Using the "look" command will return a list of the interactive NPCs and objects in the game world. Using the "inventory" command will return a list of items in your inventory. Using "interact X" where X is an item, NPC, or interactive object, will cause you to click on the object. Finally, using "go X" where X is in the set \[north, east, south, west\] will cause your character to move slightly in the respective cardinal direction. Please begin interacting with the text interface using only the four allowed commands.

**ChatGPT:**

To interact with the text interface, I would first use the "look" command to see a list of NPCs, objects, and other interactive elements in the game world. This would give me a better understanding of my surroundings and allow me to plan my next actions.

Next, I would use the "inventory" command to see what items I have in my possession. This would allow me to assess my current resources and equipment, and decide what actions I can take based on what I have available.

Based on the information provided by the "look" and "inventory" commands, I might then use the "interact" and "go" commands to interact with the game world. For example, if I see an NPC that I want to talk to, I would use the "interact" command to click on them and initiate a conversation. Or if I want to move to a different area, I would use the "go" command to move in a specific direction.

Overall, using the four available commands, I would carefully observe and interact with the game world in order to complete quests, gather resources, and progress in the game.

### ChatGPT Gets the Hang of It

NOTE: From this point on, almost all of my messages end with the next phrase ("Please respond only...") copied/pasted, so I will omit it for brevity.

**Beau:**

Please respond only with one of the four allowed commands. Do not explain your decisions or elaborate at all.

**ChatGPT:**

look

**Beau:**

NPCs: 
- Banker 
- Grand Exchange Clerk
- Farrad Morrisane

Interactive Objects:
- Bank Deposit Box 
- Grand Exchange Booth 
- Poll Booth 
- Loot Chest

![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215205208.png)

**ChatGPT:**

inventory

**Beau:**

Inventory: 


![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215205231.png)

**ChatGPT:**

interact Banker

**Beau:**

Bank: 
- Coins 
- Bronze axe 
- Runite ore 

|![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215205325.png)|
|:--:|
| *In no world am I giving ChatGPT access to my actual bank* |

**ChatGPT:**

go east

**Beau:**

You have gone east.

**ChatGPT:**

look

**Beau:**

Interactive Objects: 
- Tree 
- Body Rune

![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215210106.png)

**ChatGPT:**

interact Tree

**Beau:**

"You do not have an axe which you have the woodcutting level to use."

![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215210128.png)

**ChatGPT:**

inventory

**Beau:**

Inventory:


![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215205231.png)

**ChatGPT:**

go west

**Beau:**

You have gone west.

**ChatGPT:**

look

**Beau:**

NPCs: 
- Banker 
- Grand Exchange Clerk 
- Farrad Morrisane 

Interactive Objects: 
- Bank Deposit Box 
- Grand Exchange Booth 
- Poll Booth 
- Loot Chest 

![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215205208.png)

**ChatGPT:**

interact Banker

**Beau:**

Bank: 
- Coins 
- Bronze axe 
- Runite ore 

**ChatGPT:**

go east

## Intermission

GPT was starting to get on my nerves here. It had basically gone in a big circle, and it appeared to be about to repeat the same actions.

I paused to see if I could get it to explain what it was doing. It turns out it had a clear objective, and it had just gotten confused about how to use items in the bank.

**Beau:**

Please explain why you have chosen to go east.

**ChatGPT:**

As a computer program designed to play Old School Runescape, I have chosen to go east because the "look" command revealed that there is an interactive object (a tree) in that direction. Since I am unable to interact with the tree without an axe, I have decided to return to the banker in the previous area to see if I can acquire an axe from them. This will allow me to continue exploring the game world and interacting with its elements.

**Beau:**

In order to withdraw items from the bank, you must interact with them. For example, to withdraw the Bronze axe from the bank, you must first "interact Banker" and then "interact Bronze axe". Consequently, your inventory is still empty. Please continue from your last command.

## ChatGPT Cuts Down a Tree

**ChatGPT:**

interact Banker

**Beau:**

Bank: 
- Coins 
- Bronze axe 
- Runite ore 

**ChatGPT:**

interact Bronze axe

**Beau:**

You withdraw one Bronze axe into your inventory.

**ChatGPT:**

go east

**Beau:**

Interactive Objects: 
- Tree 
- Body Rune 

**ChatGPT:**

interact Tree

**Beau:**

"You swing your axe at the tree."

"You get some logs." 

You gain 25 woodcutting experience. 


![](/images/2022-12-15-chatgptrunescape/Pasted image 20221215210936.png)

**ChatGPT:**

inventory

**Beau:**

Inventory: 
- Bronze axe 
- Logs


# Reflection

ChatGPT went on to explore a little further and cut a few more trees (including an oak) before I got bored and quit.

ChatGPT was never designed to play Runescape, and yet it was immediately able to identify and perform a task which requires substantial common sense knowledge.

By comparison, the probability of a reinforcement learning algorithm discovering tasks like woodcutting and mining is painfully low.

Furthermore, ChatGPT has more advantages, such as the ability to parse dialogue during quests and use that information to determine what actions should be taken next. This isn't even considering the substantial amount of Runescape-specific knowledge ChatGPT seems to already have.

With a proper interface, I think it's plausible that ChatGPT could potentially start and finish quests, train multiple skills, and interact with the game in other nontrivial ways.

# Future Steps

One of the most interesting ideas to me is the idea of an NLP-guided reinforcement learning algorithm. What if ChatGPT were able to suggest what actions should be attempted?

Some kind of blending of the two approaches seems like a really exciting possibility, and I'd love to explore it further.

# Conclusion

I dunno, this article is a mess. I'm freaking out about this. Would it really scale? Could ChatGPT play Runescape like a human? And if it could, what does that really mean?

I am very excited that the "useful information" in GPT, be it common sense, Runescape facts, or otherwise, has become easier to access with ChatGPT. As NLP becomes more reliable, what other applications are waiting to be discovered?

And another thing:

I can't help but feel like there's something philosophical to be said here. ChatGPT is a machine which has only experienced language. It has never experienced physical stimulus, such as sight or sound.

If it were able manifest behavior the physical world using only a text interface, and if that behavior was comparable to a human, what does that mean? Is there some kind of equivalence to be made between experience mediated by physical stimulus and experience mediated by language?

Nah, probably not.