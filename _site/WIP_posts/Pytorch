# Portrait of the ML Analyst as a Young Man

## 0.0) Introduction

This post is a goal to document some of my time experimenting with machine learning tools. Because I don't have the knowledge or skill to make this educational, I'm going to try and capture the subjective experience. Playing with machine learning software is an exciting and unique process for me. I'd like to try and share some of this.

I don't consider myself advanced in computer science. To be specific, I feel confident I can resolve most/all of my own personal problems using programming languages. I understand general concepts about how computers work. I have briefly studied more specific aspects, such as theory of operating systems.

What I'm trying to say is that I'm definitely hireable and you should give me a job, *but...* many facets of computer science don't feel effortless to me. Hardware is one of my weaknesses. I still don't know the correct design practices for more advanced code repos.

Trying to use very new software or hardware tools can be difficult for me. I am more comfortable clacking out code in C++ than I am diving in to the nightmarish world of "shoot, I have to downgrade this package?", "oh no, I deleted the uninstall program before uninstalling!", and "why are there five different sets of installation instructions?"

Don't get me wrong; I've had a lot of fun getting over this learning curve. I've built some simple neural networks, and I've appropriated more advanced networks like GPT2 for my own purposes. As we speak, I'm fine-tuning GPT2 on my Discord DMs with a friend of mine. It's "only" 7mb of text. A lot for me, but possibly not enough for GPT2. It's exciting, even if it's not particularly insightful or effective. I'm proud because I wasn't sure I'd even be able to try it myself.

Anyways, now that I've lowered your expectation, let's get to it. I'll try to keep it chronological unless I feel like adding some Quentin Tarantino flare.

## 1.0) Setting up Pytorch, Training on MNIST

It's exactly as boring as it sounds. I remembered attempting to program some ML algorithms with Tensorflow during my undergrad. I did not have a fantastic time. To Google's credit, I was young and naive. However, I decided to try the alternative, Pytorch. Thus, I set up a new Python environment and ran "pip install torch".

Great, I'm an ML expert now.

Oh, right, I actually have to program something. Well, conveniently [Pytorch offers an excellent tutorial][2] for cranking out your first neural net (or NN, as the cool kids say). So I was off to the races, typing lines of code word-for-word (but not copying!) and rephrasing all the comments (see?).

You can check out the code I pieced together [here][2]. Building the network was impressively simple. The tutorial basically said "copy this code," but the code itself was short and easy to comprehend. You build a simple convolutional neural network. The components, such as convolutional layers, pooling, activation functions, and linear layers, are easy to follow. I felt like I could easily modify the NN or build a different network from scratch.

I took some time to read up on the individual components. It was interesting to see how convolutional and pooling layers reformatted the dataset by adding or removing data. Convolutional layers created new datapoints representing the "neighborhoods" of pixels on an image. It helped the NN to learn spatial trends, like perceiving edges of objects. Pooling layers condensed datapoints in a region to the most significant values. This helps filter less relevant data to keep learning efficient.

The tutorial was going well. Then, I got to the second page. It was time to train our neural network. I thought to myself, "no way am I going to complete even a single tutorial about how to use this new package. I'm better than that. I can flail through this."

So I decided to find my own dataset for this NN rather than using the fancy shmancy "torchvision" tool. After some bushwhacking, I ended up at [the MNIST Database][1]. I'll tell you what, formatting this data took me quite a while. In the spirit of things, I'm going to make reading about it take a while too.

### 1.1) Formatting MNIST Data

We'll talk about the "shape" of the data, and then we'll talk about my code for parsing it. Isn't this fun?!

#### 1.1a) The IDX File Format

My first observation was that the data isn't in a format ready for "out-of-the-box" use. Very cool. They use a file format called IDX, which is apparently convenient for vector or matrix data. Let's talk a little about what this is.

Generally speaking, what are files? Well, they're a collections of 1's and 0's. Generally we assume the 1's and 0's are grouped into sets of 8, called bytes.

WARNING: the MNIST authors warned the data is "MSB first, high endian." This is telling you specifically how to parse bytes. You can google "high endian," but it's basically telling you whether to read right-to-left or left-to-right. I was nervous about this, but addressing it in the code took very little effort.

The IDX file format told me that the first four bytes collectively describe an integer, which they call the *magic number*.

File formats often include a magic number at the top which encodes information about the rest of the file. In our case, they tell us:

> The magic number is an integer (MSB first). The first 2 bytes are always 0...
> The third byte codes the type of the data...
> The 4th byte codes the number of dimensions of the vector/matrix: 1 for vectors, 2 for matrices...

So although the four bytes of the magic number collectively describe an integer, we'd want to parse it one byte at a time to obtain all this information.

Okay, so what came after the magic number?

Well, I read from the magic number that there are $N$ dimensions to each data point. The next $N$ lines would each have four bytes that tell us the integer size of a dimension.

After these came the actual data. Each line is one value within one vector/matrix. I started at the first value of the first vector/matrix, and I iterated over the dimensions in a nested loop, with the innermost loop being the last specified dimension. You can check out the specifics yourself.

Wow, machine learning is awesome.

#### 1.1b) Parsing the MNIST Code With Python

So now we know the general details. How did I parse the files for the MNIST data? Well, you can view the complete code in *MNIST_Parser.py* [here.][2] 

The parser was pretty straight-forward given the information from the previous section. I skipped processing the magic number data. Instead, the MNIST site gave specific dimensions, and I hard-coded those.

I used struct.unpack, which is designed to read out bytes, and I made sure to tell it we'll be using big endian by including the exclamation points in the parameters.

So now this code spat out a few steaming hot Numpy arrays. I was ready to train my net.

### 1.2) I'll Learn You To Read



## 2.0) Implementation and Neural Nets

### 2.1) Sketching the Infrastructure

I'm not trying to build a marketable product, but I do want to make this code flexible and modular. I've decided that the goal of this code is to compare and contrast the performance of multiple neural nets on the MNIST data.

In order to do this, I thought that it might be best to break the code into a few parts:

1. A collection of neural nets
2. A universal training regime
3. A universal testing procedure
4. Graphing and analysis tools
5. A master file to coordinate all of these

The neural nets are located in *Neural_Nets.py*. The training regime is located in *Training.py*. The testing procedure is in *Testing.py*. Analysis tools are in the *Analysis* folder. Finally, the testing procedure is in *Arena.py*. I know that "Arena" is not a very descriptive name, but it's my code and I'll do what I want.

There are a couple fine points about design I'm considering before we move on. Firstly, I think each net will be trained many times with systematically-varying parameters. We'll vary epochs, batch size, and total samples.

Secondly, I'd like to save both the trained neural nets and the measurements for reuse. I'll build a file system to hold all of these. Neural nets will be held in "./Saved_Nets/". Data will be saved in "./Analysis/".

Between starting the first paragraph of this section and the last paragraph, I mostly created and organized this code as described. Just go look at it.

Arena could be cleaner, for sure. I'd also like to record the time taken per training effort. That is important data to have. Although you could probably deduce it from the number of epochs, samples, and batches...

Eh, let's move on to neural nets.

### 2.2) The Convolutional Net

Okay, so we want to build a neural net to feed through our training routine! I've taken heavy inspiration from [this source] for the first net I put together, the Convolutional Net.

What is this thing? How does it work? You can find the class Conv_Net in *Neural_Nets.py*. The method "forward" illustrates how inputs are fed through the net.

It has about 3 distinct parts. Firstly, convolution layers which are fed into a pooling function. Secondly, a view which flattens the input array. Finally, two linear layers fed into the relu function, then one more linear layer.

Can we break this down further?

We feed the neural net a batch of samples in a four-dimensional array indexed as follows:

> inputs[sample][channel][pixelrow][pixelcolumn] = greyscale_value

In our data, the total samples varies, there is only one channel (black/white), and there are 32 rows/columns.

The first layers are convolution layers. We mentioned earlier that our base data is 1 channel, corresponding to the greyscale value. The convolutional layer adds more channels, except the values of these channels at each point are determined by the region of nearby points. One point on the new channel has train-able weights connecting it to the corresponding point in channel 1 along with that point's neighbors.

In other words, we are creating an opportunity to look for regional features rather than point-specific features. These new layers work as "filters" which detect more general trends in the image.

In the first layer, we're creating 6 channels from our 1 channel, and they're determined by $3\times 3$ regions.

But what is the pooling doing? Well, it essentially combines and condenses the information. Pooling takes a region surrounding some point and takes the highest-weighted value. There is no weighting in this process.

It's nice that you can see explicit formulas for the shape of the data after using one of these layers [in the Pytorch documentation.][3]

Now what's happening with the flattening?

Well, the previous layers used local data for points based on their position in the data structure. They needed the image to be represented as a $32\times 32$ network.

However, the next layers are linear. A linear function of points can't take advantage of regional information. Because of this, linear layers are only designed to take flat vectors of data.

As a result, we must flatten the channels of $32\times 32$ data points into one long vector. That's what this line does.

Finally, linear layers are simply weights on each of the values in our vector. We feed the output of the linear layers into the ReLU layer. This layer is an "activation function." Activation functions are included specifically because they are nonlinear processes. This makes the process of determing the output from the input explicitly nonlinear, thus more flexible.

So that's a nasty overview of a convolutional network. In summary, convolutional nets are encouraged to consider the spatial relations of the data. A standard linear neural net "forgets" how the matrix is organized, and it must relearn this entirely, but we force our net to look at locally-related points as an aggregate object.

## 3.0) A Simple Analysis

So now that we have a net up and running, what can we do with it? Well, the *Arena.py* routine creates a large space-delimited sheet of data points. We can compare and contrast the variables we've measured: number of epochs, number of samples, size of batches, and net accuracy.

I noticed right away that accuracy is practically constant when the number of samples is large. Drastic changes in number of epochs or size of batches seem to have no effect on accuracy.

As a result, decided first to investigate how the number of samples affects the net's accuracy.

### 3.1) Plotting Samples Vs. Accuracy

For this investigation, I wrote the code *SamplesVsAccuracy.py*. I held the batch size and number of epochs constant and then related the sample count and accuracy percentage. I decided to make a plot for each epoch quantity and review them all together. Let's look at the first plots:

![Samples vs Accuracy](/images/SamplesVsAccuracy.png)

You can see there are some fluctuations in the very low sample counts, and then there is a kind of logistic growth approaching 100% accuracy. When there is only one epoch of training, it looks like we don't reach the distinctly flattened curve even with 8000 samples. However, the learning rate looks nearly identical for any other quantity of epochs.

If you'd like, the code allows you to generate log-linear, linear-log, or log-log plots as well. log-log straightens the curve out a bit, but not totally. I'm not sure what that might mean. Log-log is certainly the most pleasant graph to look at.

### 3.2) Observations On Data

What kind of observations can we make here? Well, we can see that accuracy is volatile when the sample count is lowest, but as the sample count rises, the accuracies follow a more determinate path. This is fairly intuitive. What the model learns from a miniscule random sample could vary more since the sample itself can have more anomalies (missing digits, no examples of rotated digits, etc).

In addition, this curve seems insulated against variables such as number of epochs once the sample size increases. Although I haven't shown the plot here, the curve seems fairly independent of the batch size as well.

This analysis is not enough to make conclusions, but here are some speculations. The first is that the accuracy appears to be logistic with respect to the quantity of samples. This suggests that tuning a neural net to balance accuracy and efficiency may be difficult. It could be hard to guess how adding a few more samples will affect accuracy on the margin.

Another speculation is that quanity of epochs isn't a serious concern for similar data sets. However, if the quantity of samples is limited (in our case about <500), this is more important. In this range, increasing from 5 epochs to 7 epochs apparently caused our accuracy to jump from 20% to 40%.

## 4.0) Ideas for Futher Experimentation

## 5.0) Conclusion

[1]:http://yann.lecun.com/exdb/mnist/
[2]:https://github.com/horenbergerb/PytorchPractice
[3]:https://pytorch.org/docs/master/generated/torch.nn.MaxPool2d.html
[4]:https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html