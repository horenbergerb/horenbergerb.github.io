---
custom_excerpt: |
  "...This paper presents a weakly-supervised machine learning algorithm for video segmentation. By making certain assumptions, this algorithm reduces the problem of video segmentation to a problem of many low-resolution image classifications. The associated training data can be collected easily for certain video games by using an automated procedure. This is demonstrated for the video game "Old School Runescape."..."
tag: blog
---

# Weakly Supervised Video Segmentation In Runescape

* TOC
{:toc}

This post is actually an old project of mine from grad school. The goal was to find a way to automatically generate training data for a computer vision algorithm specifically in the context of Old School Runescape. You can find the original paper [here](https://drive.google.com/file/d/14LsWzqAO1FZIG-KbWYlGT2TAjHHjzMLX/view) and the source code [here](https://github.com/horenbergerb/OSRS_Optical_Recognition).

# Abstract

Collecting training data for niche applications of computer vision is difficult. We propose a method for performing video segmentation which is tailored point-and-click video games featuring tooltips. We focus specifically on Old School Runescape.

The method is "weakly-supervised" in that it does not need to be trained on complete segmentation masks. Instead, a model is trained to produce classifications for 32x32 subregions of the full image.

Segmenting by classifying a grid of subregions has costs and benefits. Some spatial and temporal information is lost. The resolution of the segmentation mask is low. On the other hand, we will show that the training data can be automatically generated in large quantities for certain games. Additionally, the segmentation is fast and can be done in real time.

We also show that segmentation masks can be postprocessed to reincorporate lost information or induce desirable qualities.

Finally, we make use of the segmentation masks by attempting to predict future segmentation masks in Runescape. We find that it is possible to marginally outperform baseline methods for future prediction for the time scale of about 0.75 seconds into the future.

|![](/images/2023-01-03-runescapesegmentation/segmentedscreen.png)|
|:--:|
| *A segmentation mask for identifying cows in Old School Runescape* |

# Introduction

Video segmentation is a highly nontrivial problem with many applications. The goal of video segmentation is to divide video into regions in a way that distinguishes objects or areas of interest. It is a notoriously difficult problem, due largely to its high dimensionality.

|![](https://upload.wikimedia.org/wikipedia/commons/d/d4/Image_segmentation.png)|
|:--:|
| *Example image segmentation from Wikimedia Commons* |

It is difficult to apply machine learning to video segmentation since labeled training data requires an exceptional amount of preparation. This is especially problematic when publicly-available training datasets do not exist, which is the case for many tailored use cases.

This paper presents a weakly-supervised machine learning algorithm for video segmentation. By making certain assumptions, this algorithm reduces the problem of video segmentation to a problem of many low-resolution image classifications.

The associated training data can be collected easily for certain video games by using an automated procedure. This is demonstrated for the video game "Old School Runescape."

The design of the model comes at a cost. The model assumes that segmentation masks can be generated in a region using only local spatial information. Additionally, region membership is assumed constant within 32x32 regions, and thus the segmentation masks have low resolution.

These assumptions restrict the applications of the model compared to other video segmentation method. However, this model performs well when regions are distinguishable based on local properties and fine-grained segmentation is not essential. Additionally, postprocessing can relax the assumptions of locality by reincorporating information from other regions.

Finally, the question is raised whether one can use the low-dimension segmentation masks for tasks such as future frame prediction. This is investigated in the case of training data from Old School Runescape, and the results are tentatively affirmative, although further investigation is necessary.

# Related Work

Some of the oldest image segmentation algorithms relied on the detection of edges. [Canny edge detection](https://ieeexplore.ieee.org/document/4767851) and the [Harris corner and edge detector](http://www.bmva.org/bmvc/1988/avc-88-023.pdf) both use intensity gradients to detect edges. Edges forming closed loops or spanning the image can be used as divisors between regions, thus providing a simple model for image segmentation.

|![](/images/2023-01-03-runescapesegmentation/Pasted image 20230103144534.png)|
|:--:|
| *Example of the Canny edge detector [from Wikipedia](https://en.wikipedia.org/wiki/Canny_edge_detector)* |

[Region-based methods](http://library.isical.ac.in:8080/xmlui/bitstream/handle/10263/5304/A%20review%20on%20image%20segmentation%20techniques-PR-26-9-1993-%20p%201277-1294.pdf?sequence=1&isAllowed=y) such as region growing begin by placing seed points and allowing regions to expand based on the properties of marginal pixels, such as intensity, texture, or color.

Another popular technique for image segmentation is [histogram thresholding](https://ijcset.net/docs/Volumes/volume2issue1/ijcset2012020103.pdf), in which the histogram of a black-and-white image is partitioned by some threshold in order to determine to classify each pixel based on intensity.

|![](/images/2023-01-03-runescapesegmentation/Pasted image 20230103144634.png)|
|:--:|
| *Intensity histograms of goblins tend to be similar and can be used for classification* |

Regarding data-driven approaches to image segmentation, convolutional neural networks (CNNs) are a natural choice. [Convolutional neural networks](https://arxiv.org/pdf/1512.07108.pdf) use feature extraction to perform a variety of tasks including object detection, region of interest proposal, and image segmentation.

There exists [weakly-supervised approaches](https://arxiv.org/abs/1502.02734) to image segmentation which use only information such as bounding boxes around objects or image-level labels to train a CNN paired with a conditional random field. 

One of the more successful approaches to video segmentation is the [Mask R-CNN](https://openaccess.thecvf.com/content_ICCV_2017/papers/He_Mask_R-CNN_ICCV_2017_paper.pdf), which performs object instance segmentation. The underlying premise is dividing an image into regions of interest (ROIs) and simultaneously producing masks for image segmentation within each ROI.

Presently, it is not known to the authors whether there exists work on low-resolution image or video segmentation.

# Problem Statement and Implementation

The problem at hand is to perform video segmentation on a video game with "tooltips." The tooltip indicates the actions available to the player based on cursor position. In the game which we have chosen to focus on, Runescape, most all actions are performed by moving the cursor to objects and clicking them.

|![](/images/2023-01-03-runescapesegmentation/tooltip_example.png)|
|:--:|
| *The tooltip describes what the mouse is currently hovering over* |

In the initialization phase of the algorithm, the tooltip and the mouse position will be used to generate training data automatically for a classifier which can classify small 32x32 regions of the image.

After the training data is collected and parsed, the CNN will be trained, completing the initialization.

|![](/images/2023-01-03-runescapesegmentation/overviewflowchart.png)|
|:--:|
| *The schematic for our segmentation algorithm, including data collection and training* |

During the video segmentation phase, the CNN is used to generate a segmentation mask. The mask is then postprocessed to its final form. Lastly, we use the segmentation masks to perform future frame prediction.

We discuss these two phases in detail below.

## Initialization and Data Collection

The initialization procedure is illustrated below. Initialization begins by capturing raw data from Runescape gameplay. While the user plays, automated Python software performs screencaptures and simultaneously records the mouse position. This is achieved using the [MSS](https://python-mss.readthedocs.io/) and [PyAutoGUI](https://pyautogui.readthedocs.io/en/latest/) Python packages.

|![](/images/2023-01-03-runescapesegmentation/initializationflowchart.png)|
|:--:|
| *Overview of the initialization procedure* |

The pairs of screenshots and cursor coordinates are then parsed into training data. To achieve this, color filtering is used on the tooltip to extract keywords. In particular, Runescape denotes the object of the tooltip's verb in clustered shades of yellow.

We use samples of these yellow shades to develop a mask based on color similarity. The resulting masks can be used to perform optical character recognition using [PyTesseract](https://pypi.org/project/pytesseract/), a Python package which is a wrapper for Google's [Tesseract](https://opensource.google/projects/tesseract). All image processing in this project was performed using the [OpenCV Python package](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html).

Finally, a 32x32 region is cropped from the screenshot centered on the user's cursor position. In this way, the parsed tooltip is now a text label for the noun pictured in the 32x32 image.

These images and text labels together are sufficient information to train the small CNN classifier pictured below, which can predict the label associated with a given 32x32 image. Every convolutional layer of the CNN was followed by an ReLU activation function and a batch normalization layer. All machine learning in this project was performed using the [PyTorch Python package](https://pytorch.org/).

|![](/images/2023-01-03-runescapesegmentation/cnnarchitecture.png)|
|:--:|
| *The CNN architecture used to classify the 32x32 subregions of the screen* |

This CNN is sufficient to perform basic video segmentation which can then be further postprocessed. We discuss this further in the next section.

## Video Segmentation

With the trained CNN from the initialization phase, we can perform basic video segmentation.

To achieve this, each frame of the video is broken into a grid of 32x32 regions. Then, each region is independently classified by the CNN. These classifications determine region membership. Consequently, the collective classifications of the entire grid determine a low-resolution segmentation mask for the frame.

|![](/images/2023-01-03-runescapesegmentation/segmentationdiagram.png)|
|:--:|
| *Each 32x32 subregion is separately classified to create the segmentation mask* |

### Postprocessing

The calculated segmentation mask is then postprocessed to reincorporate lost information. We implemented two methodologies for postprocessing.

The first is spatial diffusion, which uses the Gauss-Seidel method to iteratively update neighboring probabilities. In particular, if $P[\mathbf{x},t]$ indicates the probabilities in grid region $\mathbf{x}$ at time $t$, and if $\eta(\mathbf{x})$ indicates the neighborhood of $\mathbf{x}$, then over each frame we iteratively apply

$$P[\mathbf{x},t] = \frac{1}{4}\sum_{\mathbf{y}\in\eta(\mathbf{x})} P[\mathbf{y},t]$$

to every grid region until the process converges. In this way, some global spatial information is reincorporated into the segmentation by diffusing probabilities outward into their neighboring regions.

The other postprocessing method is temporal averaging, in which each frame's probabilities are recomputed as

$$P[\mathbf{x},t] = \frac{1}{2}(P[\mathbf{x},t]+P[\mathbf{x},t-1])$$

This reincorporates temporal information into the segmentation mask and smooths temporal anomalies.

Certainly many other possible filters or postprocessing methods exist, such as spatiotemporal filtering. However, these are left as an exercise to the reader.

|![](/images/2023-01-03-runescapesegmentation/videosegmentationoverview.png)|
|:--:|
| *Overview of the actual segmentation and future frame prediction* |

### Future Frame Prediction

The final phase of the video segmentation is utilization, in which we attempt to predict future segmentation masks given a set of past segmentation masks. This task was performed using a 3DCNN architecture detailed below.

We used three frames as inputs and predicted one future frame as output. Different future distances and intervals between input frames were tested to find the regimes in which future frame prediction was most viable.

|![](/images/2023-01-03-runescapesegmentation/3dcnndiagram.png)|
|:--:|
| *Architecture of the 3DCNN used for future frame prediction* |

# Experimental Results

## CNN Training

The CNN for 32x32 image classification was trained on two labels, "cow" and "none." Each label had approximately 900 training images and 100 validation images.

The model converged very quickly and achieved accuracy of approximately 95\%. It was also attempted to train the model on 7 different labels, including "goblin," "tree," and "chicken." Each label had between 300 to 500 images.

In this case, accuracy was much lower at around 60\%, possibly suggesting the need for more training data or a more elaborate architecture. For this reason the project was limited to the case of "cow" vs. "none" labels.

|![](/images/2023-01-03-runescapesegmentation/cnntraining.png)|
|:--:|
| *The validation accuracy rapidly converged when segmenting with classes "cow" and "not cow"* |

## Basic Segmentation

One difficulty of the project was the unavailability of validation data. As a result, there is no easy way to compare segmentation results to ground truth.

Due to time constraints, we were not able to annotate a ground truth for comparison. We illustrate here a typical output of segmentation and discuss the properties of the segmentation mask.

|![](/images/2023-01-03-runescapesegmentation/origscreen.png)|
|:--:|
| *A screenshot of the game before segmentation is performed* |

|![](/images/2023-01-03-runescapesegmentation/segmentedscreen.png)|
|:--:|
| *The same screenshot with a segmentation mask applied distinguishing "cow" and "not cow"* |

One obvious shortcoming was the mislabeling of the GUI elements in the corners of the play screen. This was due in part to the data collection process. 

Particularly, there is a sampling bias based on where users tend to place their cursor. Additionally, samples were only kept if the 32x32 region surrounding the mouse were located entirely in the play screen, so it was relatively unlikely for the edges of the screen to be sampled compared to the center of the screen.

There are other quirks of the dataset which could also contribute to some of the misclassifications.

The player character is labeled as "none" by the sampling process, so it is likely they would have been included in the training dataset. However, objects which had labels such as "farmer" or "goblin" were not included in the training data.

This means many objects from the game were excluded during training, and thus the data set is not as diverse as the actual playscreen. This issue is easily corrected with better data preparation procedures.

## Postprocessing

The lack of validation data makes empirical analysis of the effects of postprocessing impossible at this time. However, it can be subjectively verified that each postprocessing method induces certain qualities.

### Spatial Diffusion

Small regions are smoothed out after spatial diffusion, and convex areas tend to be filled in. This smoothing could be effective when regions are expected to be large and rounded.

However, if the ground truth data contains small isolated regions, then this filter is likely to cause incorrect classifications. Spatial diffusion is thus contextual, and it may be worth investigating whether it could be applied situationally.

In this demo, the left-hand side shows the original segmentation mask while the right-hand side shows the mask after applying spatial diffusion.

<iframe width="560" height="315" src="https://www.youtube.com/embed/uYBu1VAFKXU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


### Temporal Diffusion

Temporal diffusion reduces temporally anomalous classifications, but it also induces a lag in segmentation updates when motion is occuring. This is somewhat apparent in the video.

As the camera rotated counterclockwise about the player, the cows are approximately translating on the screen. With temporal averaging, the segmentation mask lags behind the cows.

In this demo, the left-hand side shows the original segmentation mask while the right-hand side shows the mask after applying temporal diffusion.

<iframe width="560" height="315" src="https://www.youtube.com/embed/7GvkrOqumgg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Future Frame Prediction

Future frame prediction was first tested using 3 successive segmentation masks sampled at times $t-2,t-1,t$ to predict a segmentation mask 6 frames into the future at time $t+6$. 6 frames is approximately 1/7 of a second.

|![](/images/2023-01-03-runescapesegmentation/futureframepredictiondiagram.png)|
|:--:|
| *Illustration of the future prediction inputs and outputs* |

The distance of 6 frames into the future was chosen based on preliminary subjective analysis. It was approximately the distance which appeared to have the best performance, although this claim needs further verification. Every model was compared to a baseline naive model which assumes no motion occurs. 

The training was performed with approximately 7200 frames of continuous video while validation was performed on a separate 1600 frames of continuous video.

As seen in the training graphs, the model reaches peak performance on the validation set very early and then begins overfitting. This trend continues at least up to 30 epochs.

At peak performance, the model achieved a top tile classification accuracy of 86.608% on the validation data, while the baseline naive model achieved 86.231%. Thus, the performance is at best only a marginal improvement upon basic assumptions.

|![](/images/2023-01-03-runescapesegmentation/futureframetraining.png)|
|:--:|
| *Overfitting begins after very few epochs, and the best performance only marginally outperforms naive future prediction methods* |

However, a second model was attempted using not successive frames as inputs but instead using a step size of 5 frames, as depicted in Figure~\ref{futureframediagram2}. In this case, the predictions were much further into the future at 30 frames, or approximately 3/4 of a second.

|![](/images/2023-01-03-runescapesegmentation/futureframediagram2.png)|
|:--:|
| *Illustration of the future prediction inputs and outputs* |

With this new model, training appeared subjectively similar. Although the validation accuracy was lower at 75.560%, the model performed notably better than the naive approach, which had an accuracy of 71.672%.

|![](/images/2023-01-03-runescapesegmentation/futureframetraining2.png)|
|:--:|
| *Although overfitting still occurs, the model outperforms naive methods when predicting further into the future* |

Although these results are promising, more research is needed. Particularly, it is worth investigating whether the performance can be improved by the inclusion of more training data.

Additionally, many future frame prediction models use an attention mechanism such as long short-term memory. The effects of including an attention mechanism should be investigated.

# Conclusion

This project has demonstrated that it is possible to collect the necessary data for performing video segmentation on a video game such as Runescape. In addition, the video segmentation can be augmented with postprocessing methods, and the segmentation masks can be utilized to perform tasks such as future frame prediction.

There are many remaining questions which deserve further investigation. For example, only two simple postprocessing filters were examined. Spatiotemporal filters might offer better performance, or perhaps there is an opportunity to apply machine learning in the postprocessing step.

Additionally, our future frame prediction model has many obvious extensions. It also remains to detail the performance over different time scales and with varying amounts of input information.

Finally, it may be of interest to extend these methodologies to other games with different graphics engines. The methods presented here serve as a springboard for more comprehensive investigations.

# Retrospective

I wrote this paper about a year ago. I was very proud of this project at the time. I still am. I felt like this was a viable solution to a real problem I was facing at the time (i.e. how to make Runescape bots).

There are a few things I didn't really explore in this paper which I would like to revisit some time. 

For one, I think I naively thresholded classifications at 0.5. I now know that one should experimentally determine how to threshold the classifier outputs.

I'd also like to really document the speed of this system. I know it was generating multiple masks per second, but how much time is really left over for other processing? Do we have enough spare compute power to beef up the classifier's architecture?

For that matter, should I look into using a more typical classifier architecture, such as YOLO or something faster maybe?

Lastly, I would like to work on the future frame prediction. I think one of the major issues is that the future frame prediction has no fully connected layers. What's up with that?? I would also be interested in using transformers instead of 3DConv layers.

Anyways, I really liked this project, so I wanted to show it off on my blog. I'm sure it's not my most exciting work, but you're going to have to deal with it. 

Thanks for reading!