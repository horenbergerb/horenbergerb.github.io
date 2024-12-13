var mapSketch = function(sketch) {
    // Variables relating to the world data
    let worldData = null;
    let nodes = [];
    let regions = [];
    let subregions = [];
    let edges = [];
    let currentNode = 8;
    
    let canvasWidth = 500;
    let canvasHeight = 500;

    // Node radius, variables for selecting nodes/regions/subregions
    let radius = 5;
    let selectedNode = null;
    let selectedRegion = null;
    let currentRegion = null;

    let descriptionDiv;
    let buttonPressed = false;
    let isCollapsed = true;

    // Modes. 0 = destinations, 1 = subregions, 2 = regions
    let userMode = 0;

    // Variables for camera movement
    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let mouseStart = { x: 0, y: 0 };
    let lastTouchDist = null;
    let isTouchPanning = false;

    let isAutoPanning = true;
    let isAutoPanningToHome = false;

    sketch.preload = function() {
        // Load and parse the YAML file
        const yamlContent = sketch.loadStrings('/scripts/2024-12-11-world-map-exploration/nemo_world_graph.yaml', result => {
          const yamlString = result.join('\n');
          worldData = jsyaml.load(yamlString);
        });
      };

    function traverseWorldData(cur, depth=0) {
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
                if (depth == 1) {
                    regions.push(polygonCopy);
                }
                if (depth == 2) {
                    subregions.push(polygonCopy);
                }
            }

            cur.children.forEach((child, index) => {
                if (!child) {
                    console.warn(`Child at index ${index} is undefined or null in node:`, cur);
                }
                traverseWorldData(child, depth+1);
            });
        } else {
            // Leaf nodes have node coords
            // Scale (0,1) coord values to (0, canvasWidth) or (0, canvasHeight)
            if (cur.coords) {
                cur.coords = {
                    x: cur.coords[0] * canvasWidth,
                    y: cur.coords[1] * canvasHeight
                };
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

        let collapseButton = sketch.createButton('+');
        collapseButton.parent(descriptionDiv); // Attach it to the description div
        collapseButton.style('float', 'right');
        collapseButton.style('background', 'none');
        collapseButton.style('border', 'none');
        collapseButton.style('font-size', '16px');
        collapseButton.style('cursor', 'pointer');
        collapseButton.style('color', '#000');
        collapseButton.id('collapse-button')

        let titleText = sketch.createDiv(`<b>${worldData.name}:</b> ${worldData.summary}`);
        titleText.parent(descriptionDiv);
        titleText.id('title-text');

        let descriptionText = sketch.createDiv(`<b>${worldData.name}:</b> ${worldData.description}`);
        descriptionText.parent(descriptionDiv);
        descriptionText.id('description-text');

        collapseDescriptionBox();

        collapseButton.mousePressed(() => {
            buttonPressed = true;
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                collapseDescriptionBox();
            } else {
                expandDescriptionBox();
            }
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
            isAutoPanningToHome = true;
            collapseDescriptionBox();
            buttonPressed = true;
        });

        let worldButton = sketch.createButton('World');
        worldButton.position(70, canvasHeight - 40);
        worldButton.style('background', '#ffffff');
        worldButton.style('color', '#000');
        worldButton.style('border', '1px solid #000');
        worldButton.style('padding', '5px');
        worldButton.style('font-size', '12px');
        worldButton.style('cursor', 'pointer');
        worldButton.mousePressed(() => {
            isAutoPanningToHome = true;
            let descriptionText = sketch.select('#description-text');
            descriptionText.html(`<b>${worldData.name}:</b> ${worldData.description}`);
            let titleText = sketch.select('#title-text');
            titleText.html(`<b>${worldData.name}:</b> ${worldData.summary}`);
            buttonPressed = true;
        });

        let regionsButton = sketch.createButton('Regions');
        regionsButton.position(130, canvasHeight - 40);
        regionsButton.style('background', '#ffffff');
        regionsButton.style('color', '#000');
        regionsButton.style('border', '1px solid #000');
        regionsButton.style('padding', '5px');
        regionsButton.style('font-size', '12px');
        regionsButton.style('cursor', 'pointer');
        regionsButton.mousePressed(() => {
            isAutoPanningToHome = true;
            collapseDescriptionBox();
            if (userMode != 2) {
                subregionsButton.style('background', '#ffffff');
                regionsButton.style('background', '#fc032c');
                userMode = 2;
            }
            else {
                userMode = 0;
                regionsButton.style('background', '#ffffff');
            }
            buttonPressed = true;
        });

        let subregionsButton = sketch.createButton('Subregions');
        subregionsButton.position(200, canvasHeight - 40);
        subregionsButton.style('background', '#ffffff');
        subregionsButton.style('color', '#000');
        subregionsButton.style('border', '1px solid #000');
        subregionsButton.style('padding', '5px');
        subregionsButton.style('font-size', '12px');
        subregionsButton.style('cursor', 'pointer');
        subregionsButton.mousePressed(() => {
            isAutoPanningToHome = true;
            collapseDescriptionBox();
            if (userMode != 1) {
                regionsButton.style('background', '#ffffff');
                subregionsButton.style('background', '#fc032c');
                userMode = 1;
            }
            else {
                userMode = 0;
                subregionsButton.style('background', '#ffffff');
            }
            buttonPressed = true;
        });

        // Prepare all the data for the map
        traverseWorldData(worldData);
        populateEdges();

        // Randomly select a node and set it as the starting node (status = 3)
        let randomIndex = Math.floor(Math.random() * nodes.length);
        nodes[randomIndex].status = 3;
        currentNode = nodes[randomIndex].id;

        updateNeighbors()

        descriptionText.html(`<b>${nodes[currentNode].name}:</b> ${nodes[currentNode].description}`);
        titleText.html(`<b>${nodes[currentNode].name}:</b> ${nodes[currentNode].summary}`);

        buttonPressed = true;

        drawMap();      
      };

      function collapseDescriptionBox() {
        const titleText = sketch.select('#title-text');
        titleText.show();
        const descriptionText = sketch.select('#description-text');
        descriptionText.hide();
        collapseButton = sketch.select('#collapse-button')
        collapseButton.html('+');
    }    

    function expandDescriptionBox() {
        const titleText = sketch.select('#title-text');
        titleText.hide();
        const descriptionText = sketch.select('#description-text');
        descriptionText.show();
        collapseButton = sketch.select('#collapse-button')
        collapseButton.html('-');
    }

      sketch.draw = function() {
        sketch.clear();

        // Smoothly interpolate panX and panY towards targetPanX and targetPanY
        if (isAutoPanningToHome){
            panX = sketch.lerp(panX, 0, 0.1);
            panY = sketch.lerp(panY, 0, 0.1);
            zoom = sketch.lerp(zoom, 1.0, 0.1);
            // Stop panning if close to the target
            if (Math.abs(panX - 0) < 1 && Math.abs(panY - 0) < 1) {
                isAutoPanningToHome = false;
            }
        }
        if (isAutoPanning) {
            if (userMode == 0) {
                targetPanX = canvasWidth / 2 - nodes[currentNode].coords.x * zoom;
                targetPanY = canvasHeight / 2 - nodes[currentNode].coords.y * zoom;
            } else {
                let centroid = { x: 0, y: 0 };
                let n = currentRegion.polygon.length;
            
                for (let vertex of currentRegion.polygon) {
                    centroid.x += vertex.x;
                    centroid.y += vertex.y;
                }
            
                centroid.x /= n;
                centroid.y /= n;
            
                // Set TargetPanX and TargetPanY to the center of the selected region
                targetPanX = canvasWidth / 2 - centroid.x * zoom;
                targetPanY = canvasHeight / 2 - centroid.y * zoom;
            }            
            let lerpFactor = 0.1; // Adjust for smoothness (0.1 = slow, 1 = immediate)
            let targetZoom = userMode === 0 ? 1.7 : 1.1;
            panX = sketch.lerp(panX, targetPanX, lerpFactor);
            panY = sketch.lerp(panY, targetPanY, lerpFactor);
            zoom = sketch.lerp(zoom, targetZoom, lerpFactor);

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

    function isPointInPolygon(x, y, polygon) {
        let inside = false;
    
        // Loop through each edge of the polygon
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let xi = polygon[i].x, yi = polygon[i].y;
            let xj = polygon[j].x, yj = polygon[j].y;
    
            // Check if the point is on the edge of the polygon
            let intersect = ((yi > y) != (yj > y)) &&
                            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
    
        return inside;
    }    

    function updateSelectedRegion() {
        let mouseXTransformed = (sketch.mouseX - panX) / zoom;
        let mouseYTransformed = (sketch.mouseY - panY) / zoom;
    
        let candidates = userMode == 1 ? subregions : regions;
    
        for (let candidate of candidates) {
            if (isPointInPolygon(mouseXTransformed, mouseYTransformed, candidate.polygon)) {
                selectedRegion = candidate;
                break;
            }
        }
    }
    
    function finalizeSelectRegion() {
        if (selectedRegion) {
            if (buttonPressed) {
                selectedRegion = null;
                buttonPressed = false;
                return;
            }

            if (sketch.dist(mouseStart.x, mouseStart.y, sketch.mouseX, sketch.mouseY) > 2) {
                selectedRegion = null;
                return;
            }

            let descriptionText = sketch.select('#description-text');
            let titleText = sketch.select('#title-text');

            if (selectedRegion.description) {
                descriptionText.html(`<b>${selectedRegion.name}:</b> ${selectedRegion.description}`);
                titleText.html(`<b>${selectedRegion.name}:</b> ${selectedRegion.summary}`);
            } else {
                descriptionText.html(`<b>${selectedRegion.name}:</b> No description available.`);
                titleText.html(`<b>${selectedRegion.name}</b>`);
            }

            isAutoPanning = true;

            currentRegion = selectedRegion;

            selectedRegion = null; // Stop dragging
        }
        else {
            if (buttonPressed)
                buttonPressed = false;
            else
                collapseDescriptionBox();
        }
    }

    function finalizeSelectNode() {
        if (selectedNode && selectedNode.status > 0) {
            if (buttonPressed) {
                selectedNode = null;
                buttonPressed = false;
                return;
            }

            if (sketch.dist(mouseStart.x, mouseStart.y, sketch.mouseX, sketch.mouseY) > 2) {
                selectedNode = null;
                return;
            }

            let descriptionText = sketch.select('#description-text');
            let titleText = sketch.select('#title-text');

            if (selectedNode.description) {
                descriptionText.html(`<b>${selectedNode.name}:</b> ${selectedNode.description}`);
                titleText.html(`<b>${selectedNode.name}:</b> ${selectedNode.summary}`);
            } else {
                descriptionText.html(`<b>${selectedNode.name}:</b> No description available.`);
                titleText.html(`<b>${selectedNode.name}</b>`);
            }

            isAutoPanning = true;

            nodes[currentNode].status = 2;
            currentNode = selectedNode.id;
            nodes[selectedNode.id].status = 3;
            updateNeighbors();

            selectedNode = null; // Stop dragging
        }
        else {
            if (buttonPressed)
                buttonPressed = false;
            else
                collapseDescriptionBox();
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

        if (userMode == 0)
            updateSelectedNode();
        else
            updateSelectedRegion();

        isDragging = true;
        dragStart.x = sketch.mouseX - panX;
        dragStart.y = sketch.mouseY - panY;
        mouseStart.x = sketch.mouseX;
        mouseStart.y = sketch.mouseY;
    };
    
    sketch.mouseDragged = function () {
        if (isDragging) {
            panX = sketch.mouseX - dragStart.x;
            panY = sketch.mouseY - dragStart.y;
        }
    };

    sketch.mouseReleased = function () {
        isDragging = false;
        if (userMode == 0)
            finalizeSelectNode();
        else
            finalizeSelectRegion();
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
            if (userMode == 0)
                updateSelectedNode();
            else
                updateSelectedRegion();

            isTouchPanning = true;
            dragStart.x = sketch.mouseX - panX;
            dragStart.y = sketch.mouseY - panY;
            mouseStart.x = sketch.mouseX;
            mouseStart.y = sketch.mouseY;    
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
        if (userMode == 0)
            finalizeSelectNode();
        else
            finalizeSelectRegion();

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

    function drawPolygons() {
        //Determine whether to draw the regions or the subregions
        let polygons = subregions;
        if (userMode == 2)
            polygons = regions;
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
        edgeAlpha = 255;
        if (userMode != 0)
            edgeAlpha = 64;

        sketch.strokeWeight(0.5);
        for (let edge of edges){
            // Only draw edges when both nodes are visible
            if (nodes[edge[0]].status > 0 && nodes[edge[1]].status > 0){
                sketch.stroke(0, 0, 0, edgeAlpha);
                sketch.line(nodes[edge[0]].coords.x, nodes[edge[0]].coords.y, nodes[edge[1]].coords.x, nodes[edge[1]].coords.y);
            }
        }
    }

    function drawGraphNodes() {
        nodeAlpha = 255;
        if (userMode != 0)
            nodeAlpha = 64;
        for (let node of nodes){
            if (node.status == 0)
                continue;
            if (node.status == 1) {
                sketch.fill(192, 192, 192, nodeAlpha); // Hollow outline
                sketch.stroke(0, 0, 0, nodeAlpha); // Set stroke color
            } else if (node.status == 2) {
                sketch.stroke(0, 0, 0, nodeAlpha);
                sketch.fill(114, 245, 66, nodeAlpha);
            } else if (node.status == 3) {
                sketch.stroke(0, 0, 0, nodeAlpha); // Set stroke color
                sketch.fill(174, 52, 235, nodeAlpha);
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

    function drawRegionLabels() {
        // Don't draw region labels unless we're in region/subregion mode or zoomed out
        if (userMode == 0 && zoom > 1.1)
            return;
    
        let candidates = userMode == 2 ? regions : subregions;
    
        for (let candidate of candidates) {
            sketch.noStroke();
    
            // Calculate mouse position in world coordinates
            let mouseXTransformed = (sketch.mouseX - panX) / zoom;
            let mouseYTransformed = (sketch.mouseY - panY) / zoom;
    
            // Calculate polygon center
            let centroid = { x: 0, y: 0 };
            let n = candidate.polygon.length;
            for (let vertex of candidate.polygon) {
                centroid.x += vertex.x;
                centroid.y += vertex.y;
            }
            centroid.x /= n;
            centroid.y /= n;
    
            // Calculate distance from mouse to polygon center
            let distance = sketch.dist(mouseXTransformed, mouseYTransformed, centroid.x, centroid.y);
    
            // Map the distance to an alpha value (closer = more opaque, farther = more transparent)
            let alpha = sketch.map(distance, 0, sketch.width / 2, 255, 64);
            alpha = sketch.constrain(alpha, 64, 255); // Ensure alpha stays between 0 and 255
    
            // Set text properties and draw text at the polygon center
            sketch.fill(0, 0, 0, alpha);
            sketch.textSize(15);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text(candidate.name, centroid.x, centroid.y);
        }
    }
    
    function drawMap() {

        sketch.background(0);

        drawPolygons();

        drawGraphEdges();

        drawGraphNodes();
    
        drawNodeLabels();

        drawRegionLabels();
      }
    };
  
  // Attach the sketch to a specific DOM element
  let myMapSketch = new p5(mapSketch, 'simple-example-holder');
  