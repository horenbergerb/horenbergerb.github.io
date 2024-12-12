var mapSketch = function(sketch) {
    let worldData = null;
    let nodes = [];
    let polygons = [];
    let edges = [];

    let canvasWidth = 500;
    let canvasHeight = 500;

    let radius = 5;
    let selectedDescription = "";
    let selectedNode = null;

    let descriptionDiv;

    let zoom = 1; // Default zoom level
    let panX = 0; // Pan offset in X direction
    let panY = 0; // Pan offset in Y direction
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };

    let lastTouchDist = null; // Stores the distance between two touch points
    let isTouchPanning = false; // Tracks if the user is panning via touch

    sketch.preload = function() {
        // Load and parse the YAML file
        const yamlContent = sketch.loadStrings('/scripts/2024-12-11-world-map-exploration/nemo_world_graph.yaml', result => {
          const yamlString = result.join('\n');
          worldData = jsyaml.load(yamlString);
        });
      };

    function traverseWorldData(cur) {
        // Validate current node
        if (!cur) {
            console.error("Invalid node encountered:", cur);
            return;
        }

        // Check if the current node has children
        if (Array.isArray(cur.children) && cur.children.length > 0) {
            // If children exist, scale the polygon (if defined)
            if (cur.polygon) {
                cur.polygon = cur.polygon.map(coord => {
                    return {
                        x: coord[0] * canvasWidth,
                        y: coord[1] * canvasHeight
                    };
                });
                // Append a copy without children to polygons
                const polygonCopy = { ...cur, children: undefined };
                polygons.push(polygonCopy);
            }

            // Recursively traverse children
            cur.children.forEach((child, index) => {
                if (!child) {
                    console.warn(`Child at index ${index} is undefined or null in node:`, cur);
                }
                traverseWorldData(child, polygons, nodes, canvasWidth, canvasHeight);
            });
        } else {
            // If no children, scale the node coords (if defined)
            if (cur.coords) {
                cur.coords = {
                    x: cur.coords[0] * canvasWidth,
                    y: cur.coords[1] * canvasHeight
                };
                // Append a copy without children to nodes
                const nodeCopy = { ...cur, children: undefined };
                nodes.push(nodeCopy);
            } else {
                console.warn("Node without coords found:", cur);
            }
        }
    }

    function populateEdges() {
        if (worldData.edges) {
            worldData.edges.forEach(edge => {
                edges.push(edge);
            });
        }
    }

      sketch.setup = function() {
        let canvas = sketch.createCanvas(canvasWidth, canvasHeight);
        sketch.clear();
        canvas.parent('simple-example-holder');
    
        descriptionDiv = sketch.createDiv('');
        descriptionDiv.position(10, 10); // Place it above the canvas
        descriptionDiv.style('font-size', '14px');
        descriptionDiv.style('color', '#000');
        descriptionDiv.style('background-color', 'rgba(255, 255, 255, 0.8)');
        descriptionDiv.style('padding', '10px');
        descriptionDiv.style('border', '1px solid #ccc');
        descriptionDiv.style('max-width', '1180px');
        descriptionDiv.style('overflow-wrap', 'break-word');

        let closeButton = sketch.createButton('x');
        closeButton.parent(descriptionDiv); // Attach it to the description div
        closeButton.style('float', 'right');
        closeButton.style('background', 'none');
        closeButton.style('border', 'none');
        closeButton.style('font-size', '16px');
        closeButton.style('cursor', 'pointer');
        closeButton.style('color', '#000');

        let descriptionText = sketch.createDiv(`<b>${worldData.name}:</b> ${worldData.description}`);
        descriptionText.parent(descriptionDiv);
        descriptionText.id('description-text'); // Assign an ID for easy selection
    
        closeButton.mousePressed(() => {
            descriptionDiv.hide(); // Hide the div when the button is clicked
        });

        // Traverse worldData tree
        // set cur = worldData to start
        // If children is not empty, we're not at a leaf. Add polygon to polygons. Then proceed into children.
        // If children is empty, plot a node at coords. Add node to nodes
        // You can make this a recursive function if it's more convenient
        traverseWorldData(worldData);
        populateEdges();
        // populate edges using worldData["edges"]

        drawMap();      
      };

      sketch.draw = function() {
        sketch.clear(); // Clear the canvas on each frame

        sketch.push(); // Save the current transformation matrix
        sketch.translate(panX, panY); // Apply panning
        sketch.scale(zoom); // Apply zoom
    
        drawMap(); // Draw the graph with transformations applied
        sketch.pop(); // Restore the transformation matrix

        // Display the selected node's description
        sketch.fill(0, 255);
        sketch.textSize(14);
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        sketch.text(selectedDescription, 10, 10, sketch.width - 20); // Wrap text
    };

    sketch.mouseWheel = function (event) {
        if (!isActionInsideCanvas()) {
            return;
        }

        let zoomAmount = 0.05; // Adjust the sensitivity of zoom
        zoom += event.delta > 0 ? -zoomAmount : zoomAmount;

        // Constrain zoom to avoid flipping or excessive zooming
        zoom = sketch.constrain(zoom, 0.5, 5); // Minimum 0.5x, Maximum 5x

        return false; // Prevent default scroll behavior when inside the canvas
    };
    
    sketch.mousePressed = function() {
        if (!isActionInsideCanvas()) {
            return;
        }

        if (!isDragging) {
            let mouseXTransformed = (sketch.mouseX - panX) / zoom;
            let mouseYTransformed = (sketch.mouseY - panY) / zoom;
    
            for (let node of nodes) {
                if (sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y) < radius) {
                    selectedNode = node;
                    break;
                }
            }
        }
        if (!selectedNode) {
            isDragging = true;
            dragStart.x = sketch.mouseX - panX;
            dragStart.y = sketch.mouseY - panY;
        }
    };
    
    sketch.mouseDragged = function () {
        if (isDragging) {
            panX = sketch.mouseX - dragStart.x;
            panY = sketch.mouseY - dragStart.y;
        }
    };

    sketch.mouseReleased = function () {
        isDragging = false;
        if (selectedNode) {
            let descriptionText = sketch.select('#description-text');
            if (selectedNode.description) {
                descriptionText.html(`<b>${selectedNode.name}:</b> ${selectedNode.description}`);
            } else {
                descriptionText.html(`<b>${selectedNode.name}:</b> No description available.`);
            }
            descriptionDiv.show();
            selectedNode = null; // Stop dragging
        }
    };

    sketch.touchStarted = function(event) {
        if (!isActionInsideCanvas()) {
            return True; // Ignore touches outside the canvas
        }
        if (sketch.touches.length === 2) {
            // Pinch zoom: Store the initial distance between two touch points
            const touch1 = sketch.touches[0];
            const touch2 = sketch.touches[1];
            lastTouchDist = sketch.dist(touch1.x, touch1.y, touch2.x, touch2.y);
            isTouchPanning = false;
        } else if (sketch.touches.length === 1) {
            if (!isTouchPanning){
                let mouseXTransformed = (sketch.mouseX - panX) / zoom;
                let mouseYTransformed = (sketch.mouseY - panY) / zoom;    
                for (let node of nodes) {
                    if (sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y) < radius) {
                        selectedNode = node;
                        break;
                    }
                }
            }

            if (!selectedNode) {
                // Pan: Begin tracking single-touch panning
                isTouchPanning = true;
                dragStart.x = sketch.mouseX - panX;
                dragStart.y = sketch.mouseY - panY;
            }
        }
        return false;
    };
    
    sketch.touchMoved = function(event) {
        if (!isActionInsideCanvas()) {
            return True; // Ignore touches outside the canvas
        }

        if (sketch.touches.length === 2) {
            // Pinch zoom
            const touch1 = sketch.touches[0];
            const touch2 = sketch.touches[1];
            const currentDist = sketch.dist(touch1.x, touch1.y, touch2.x, touch2.y);
    
            if (lastTouchDist) {
                // Adjust zoom based on change in distance
                const zoomFactor = 0.01; // Adjust sensitivity
                zoom += (currentDist - lastTouchDist) * zoomFactor;
                zoom = sketch.constrain(zoom, 0.5, 5); // Constrain zoom level
            }
    
            lastTouchDist = currentDist; // Update the last distance
        } else if (isTouchPanning && sketch.touches.length === 1) {
            // Single-touch panning
            panX = sketch.mouseX - dragStart.x;
            panY = sketch.mouseY - dragStart.y;
        }
    
        return false; // Prevent scrolling
    };

    sketch.touchEnded = function (event) {

        if (selectedNode) {
            let descriptionText = sketch.select('#description-text');
            if (selectedNode.description) {
                descriptionText.html(`<b>${selectedNode.name}:</b> ${selectedNode.description}`);
            } else {
                descriptionText.html(`<b>${selectedNode.name}:</b> No description available.`);
            }
            descriptionDiv.show();
            selectedNode = null; // Stop dragging
        }

        if (sketch.touches.length < 2) {
            lastTouchDist = null; // Reset pinch zoom tracking
        }
        if (sketch.touches.length != 1) {
            isTouchPanning = false; // Stop panning
        }
    };
    
    function isActionInsideCanvas() {
        return (
            sketch.mouseX >= 0 &&
            sketch.mouseX <= sketch.width &&
            sketch.mouseY >= 0 &&
            sketch.mouseY <= sketch.height
        );
    }

      function drawMap() {
        sketch.strokeWeight(0.5);
        for (let edge of edges){
            sketch.stroke(0);
            sketch.line(nodes[edge[0]].coords.x, nodes[edge[0]].coords.y, nodes[edge[1]].coords.x, nodes[edge[1]].coords.y);
        }
    
        // Draw node
        for (let node of nodes){
            sketch.noStroke();
            sketch.fill(100, 0, 255);
            sketch.ellipse(node.coords.x, node.coords.y, radius * 2); // Draw circle

            // Calculate distance from mouse to node
            let mouseXTransformed = (sketch.mouseX - panX) / zoom;
            let mouseYTransformed = (sketch.mouseY - panY) / zoom;
            let distance = sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y);

            // Map the distance to an alpha value (closer = more opaque, farther = more transparent)
            let alpha = sketch.map(distance, 0, sketch.width / 8, 255, 0); // Adjust the range as needed
            alpha = sketch.constrain(alpha, 0, 255); // Ensure alpha stays between 50 and 255    }

            // Check if the mouse is hovering over the node
            if (sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y) < radius) {
                // Set the text color with transparency
                sketch.fill(0, 0, 0, alpha);
                sketch.textSize(12);
                sketch.textAlign(sketch.CENTER, sketch.CENTER);
                sketch.text(node.name, node.coords.x, node.coords.y - radius - 2); // Text above the node
            }
            else {
                // Set the text color with transparency
                sketch.fill(0, 0, 0, alpha);
                sketch.textSize(8);
                sketch.textAlign(sketch.CENTER, sketch.CENTER);
                sketch.text(node.name, node.coords.x, node.coords.y - radius - 2); // Text above the node
            }
        }
      }
    };
  
  // Attach the sketch to a specific DOM element
  let myMapSketch = new p5(mapSketch, 'simple-example-holder');
  