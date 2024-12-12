var mapSketch = function(sketch) {
    // Variables relating to the world data
    let worldData = null;
    let nodes = [];
    let polygons = [];
    let edges = [];
    let currentNode = 8;
    
    let canvasWidth = 500;
    let canvasHeight = 500;

    // Node radius, variables for selecting a node
    let radius = 5;
    let selectedNode = null;

    let descriptionDiv;

    // Variables for camera movement
    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let lastTouchDist = null;
    let isTouchPanning = false;

    isAutoPanning = true;

    sketch.preload = function() {
        // Load and parse the YAML file
        const yamlContent = sketch.loadStrings('/scripts/2024-12-11-world-map-exploration/nemo_world_graph.yaml', result => {
          const yamlString = result.join('\n');
          worldData = jsyaml.load(yamlString);
        });
      };

    function traverseWorldData(cur) {
        // Traverses recursively through the tree of world info and parses into nodes, polygons, edges

        // Non-leaf nodes have children and polygons
        if (Array.isArray(cur.children) && cur.children.length > 0) {
            // Scale (0,1) polygon values to (0, canvasWidth) or (0, canvasHeight)
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

            cur.children.forEach((child, index) => {
                if (!child) {
                    console.warn(`Child at index ${index} is undefined or null in node:`, cur);
                }
                traverseWorldData(child, polygons, nodes, canvasWidth, canvasHeight);
            });
        } else {
            // Leaf nodes have node coords
            // Scale (0,1) coord values to (0, canvasWidth) or (0, canvasHeight)
            if (cur.coords) {
                cur.coords = {
                    x: cur.coords[0] * canvasWidth,
                    y: cur.coords[1] * canvasHeight
                };
                if (cur.name === "Fallen Maple Hollow")
                    // Status: 0 = unvisited, 1 = visible, 2 = visited, 3 = current
                    cur.status = 3;
                else
                    cur.status = 0;
                // Append a copy without children to nodes
                const nodeCopy = { ...cur, children: undefined };
                nodes.push(nodeCopy);
            } else {
                console.warn("Node without coords found:", cur);
            }
        }
    }

    function updateNeighbors() {
        // Make new neighbor nodes visible (i.e. status=1) after moving.
        for (let edge of edges) {
            if (edge.includes(currentNode)){
                other_node = edge[0] == currentNode ? edge[1] : edge[0]
                if (nodes[other_node].status < 1)
                    nodes[other_node].status = 1;
            }
        }
    }

    function populateEdges() {
        //Move edge data out of WorldData and into edges
        if (worldData.edges) {
            worldData.edges.forEach(edge => {
                edges.push(edge);
            });
        }
    }

      sketch.setup = function() {
        let container = document.getElementById('simple-example-holder'); // Get the container element
        canvasWidth = container.offsetWidth; // Set width based on the container
        canvasHeight = sketch.windowHeight * 0.8; // Set height based on the container

        let canvas = sketch.createCanvas(canvasWidth, canvasHeight);
        sketch.clear();
        canvas.parent('simple-example-holder');
    
        descriptionDiv = sketch.createDiv('');
        descriptionDiv.position(10, 10);
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
        descriptionText.id('description-text');

        closeButton.mousePressed(() => {
            descriptionDiv.hide();
        });

        let homeButton = sketch.createButton('Home');
        homeButton.position(10, canvasHeight - 40);
        homeButton.style('background', '#ffffff');
        homeButton.style('color', '#000');
        homeButton.style('border', '1px solid #000');
        homeButton.style('padding', '5px');
        homeButton.style('font-size', '12px');
        homeButton.style('cursor', 'pointer');

        // Home button resets pan and zoom
        homeButton.mousePressed(() => {
            panX = 0;
            panY = 0;
            zoom = 1;
        });

        // Prepare all the data for the map
        traverseWorldData(worldData);
        populateEdges();
        updateNeighbors()

        drawMap();      
      };

      sketch.draw = function() {
        sketch.clear();

        // Smoothly interpolate panX and panY towards targetPanX and targetPanY
        if (isAutoPanning) {
            targetPanX = canvasWidth / 2 - nodes[currentNode].coords.x * zoom;
            targetPanY = canvasHeight / 2 - nodes[currentNode].coords.y * zoom;
            let lerpFactor = 0.1; // Adjust for smoothness (0.1 = slow, 1 = immediate)
            panX = sketch.lerp(panX, targetPanX, lerpFactor);
            panY = sketch.lerp(panY, targetPanY, lerpFactor);
            zoom = sketch.lerp(zoom, 2.0, lerpFactor);

            // Stop panning if close to the target
            if (Math.abs(panX - targetPanX) < 1 && Math.abs(panY - targetPanY) < 1) {
                isAutoPanning = false;
            }
        }

        sketch.push(); // Save the current transformation matrix
        sketch.translate(panX, panY); // Apply panning
        sketch.scale(zoom); // Apply zoom
        drawMap(); // Draw the graph with transformations applied
        sketch.pop(); // Restore the transformation matrix
    };

    function updateSelectedNode() {
        let mouseXTransformed = (sketch.mouseX - panX) / zoom;
        let mouseYTransformed = (sketch.mouseY - panY) / zoom;    

        for (let node of nodes) {
            if (sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y) < radius) {
                selectedNode = node;
                break;
            }
        }
    }

    function finalizeSelectnode() {
        if (selectedNode && selectedNode.status > 0) {
            let descriptionText = sketch.select('#description-text');
            if (selectedNode.description) {
                descriptionText.html(`<b>${selectedNode.name}:</b> ${selectedNode.description}`);
            } else {
                descriptionText.html(`<b>${selectedNode.name}:</b> No description available.`);
            }
            descriptionDiv.show();

            isAutoPanning = true;

            nodes[currentNode].status = 2;
            currentNode = selectedNode.id;
            nodes[selectedNode.id].status = 3;
            updateNeighbors();

            selectedNode = null; // Stop dragging
        }
        else {
            descriptionDiv.hide();
        }
    }

    sketch.mouseWheel = function (event) {
        if (!isActionInsideCanvas()) {
            return;
        }

        let zoomAmount = 0.05; // Adjust the sensitivity of zoom
        let newZoom = zoom + (event.delta > 0 ? -zoomAmount : zoomAmount);
    
        // Constrain zoom to avoid flipping or excessive zooming
        newZoom = sketch.constrain(newZoom, 0.5, 5);
    
        // Calculate the position of the mouse in world coordinates before zooming
        let mouseXWorld = (sketch.mouseX - panX) / zoom;
        let mouseYWorld = (sketch.mouseY - panY) / zoom;
    
        // Update zoom level
        let zoomChange = newZoom / zoom;
        zoom = newZoom;
    
        // Adjust pan to keep the zoom centered on the mouse
        panX -= (mouseXWorld * zoomChange - mouseXWorld) * zoom;
        panY -= (mouseYWorld * zoomChange - mouseYWorld) * zoom;
    
        return false; // Prevent default scroll behavior when inside the canvas
    };
    
    sketch.mousePressed = function() {
        if (!isActionInsideCanvas()) {
            return;
        }

        isAutoPanning = false;

        if (!isDragging) {
            updateSelectedNode();
        }
        // If the user isn't selecting a node, they're panning
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
        finalizeSelectnode();
    };

    sketch.touchStarted = function(event) {
        if (!isActionInsideCanvas()) {
            return True; // Ignore touches outside the canvas
        }

        isAutoPanning = false;

        if (sketch.touches.length === 2) {
            // Pinch zoom: Store the initial distance between two touch points
            const touch1 = sketch.touches[0];
            const touch2 = sketch.touches[1];
            lastTouchDist = sketch.dist(touch1.x, touch1.y, touch2.x, touch2.y);
            isTouchPanning = false;
        } else if (sketch.touches.length === 1) {
            if (!isTouchPanning){
                updateSelectedNode();
            }

            // If the user isn't selecting a node, they're panning
            if (!selectedNode) {
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
                let newZoom = zoom + (currentDist - lastTouchDist) * zoomFactor;

                // Constrain zoom level
                newZoom = sketch.constrain(newZoom, 0.5, 5);

                // Calculate midpoint of two touch points in world coordinates
                let midX = (touch1.x + touch2.x) / 2;
                let midY = (touch1.y + touch2.y) / 2;
                let midXWorld = (midX - panX) / zoom;
                let midYWorld = (midY - panY) / zoom;

                // Update zoom level
                let zoomChange = newZoom / zoom;
                zoom = newZoom;

                // Adjust pan to keep the zoom centered on the midpoint
                panX -= (midXWorld * zoomChange - midXWorld) * zoom;
                panY -= (midYWorld * zoomChange - midYWorld) * zoom;
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

        finalizeSelectnode();

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

    function drawRegionPolygons() {
        for (let polygon of polygons) {
            sketch.stroke(128); // Gray outline
            sketch.strokeWeight(1);
            sketch.fill(192);
            sketch.beginShape();
            for (let vertex of polygon.polygon) {
                sketch.vertex(vertex.x, vertex.y);
            }
            sketch.endShape(sketch.CLOSE);
        }
    }

    function drawGraphEdges() {
        sketch.strokeWeight(0.5);
        for (let edge of edges){
            // Only draw edges when both nodes are visible
            if (nodes[edge[0]].status > 0 && nodes[edge[1]].status > 0){
                sketch.stroke(0);
                sketch.line(nodes[edge[0]].coords.x, nodes[edge[0]].coords.y, nodes[edge[1]].coords.x, nodes[edge[1]].coords.y);
            }
        }
    }

    function drawGraphNodes() {
        for (let node of nodes){
            if (node.status == 0)
                continue;
            if (node.status == 1) {
                sketch.fill(192); // Hollow outline
                sketch.stroke(0); // Set stroke color
            } else if (node.status == 2) {
                sketch.stroke(0);
                sketch.fill(114, 245, 66);
            } else if (node.status == 3) {
                sketch.stroke(0); // Set stroke color
                sketch.fill(174, 52, 235);
            }
            sketch.ellipse(node.coords.x, node.coords.y, radius * 2); // Draw circle
        }
    }

    function drawNodeLabels() {
        for (let node of nodes){
            if (node.status == 0)
                continue;

            sketch.noStroke();
            
            // Calculate distance from mouse to node
            let mouseXTransformed = (sketch.mouseX - panX) / zoom;
            let mouseYTransformed = (sketch.mouseY - panY) / zoom;
            let distance = sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y);

            // Map the distance to an alpha value (closer = more opaque, farther = more transparent)
            let alpha = sketch.map(distance, 0, sketch.width / 8, 255, 0);
            alpha = sketch.constrain(alpha, 0, 255); // Ensure alpha stays between 50 and 255

            // If the mouse is hovering over the node, make the text bigger
            let textSize = sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y) < radius ? 12 : 8;
                sketch.fill(0, 0, 0, alpha);
                sketch.textSize(textSize);
                sketch.textAlign(sketch.CENTER, sketch.CENTER);
                sketch.text(node.name, node.coords.x, node.coords.y - radius - 2); // Text above the node
        }
    }

    function drawMap() {

        sketch.background(0);

        drawRegionPolygons();

        drawGraphEdges();

        drawGraphNodes();
    
        drawGraphNodes();

        drawNodeLabels();
      }
    };
  
  // Attach the sketch to a specific DOM element
  let myMapSketch = new p5(mapSketch, 'simple-example-holder');
  