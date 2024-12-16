import { traverseWorldData, loadYaml, populateEdges } from './data-loader.js';
import { drawPolygons, drawGraphEdges, drawGraphNodes, drawNodeLabels, drawRegionLabels } from './map-drawing-utilities.js';

var mapSketch = function(sketch) {
    let canvasWidth = 500;
    let canvasHeight = 500;
    // Radius of nodes
    let radius = 6;

    // World information loaded from YAML
    const world = {
        worldDict: null,
        nodes: [],
        regions: [],
        subregions: [],
        edges: []
    }

    let currentNode = -1;

    // Variables for selecting nodes/regions/subregions

    let selectedNode = null;
    let selectedRegion = null;

    let descriptionDiv;
    let buttonPressed = false;
    let isCollapsed = true;

    // Modes. 0 = destinations, 1 = subregions, 2 = regions
    let userMode = 0;

    // Variables for camera movement
    const camera = {
        zoom: 1,
        panX: 0,
        panY: 0,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        mouseStart: { x: 0, y: 0 },
        lastTouchDist: null,
        isTouchPanning: false,
    }

    const autoCamera = {
        isAutoPanning: true,
        rawTargetPanX: 0,
        rawTargetPanY: 0,
        targetZoom: 1.0
    }

    sketch.preload = function() {
        loadYaml(sketch, world);
      };

    function updateNeighbors() {
        // Make new neighbor nodes visible (i.e. status=1) after moving.
        for (let edge of world.edges) {
            if (edge.includes(currentNode)){
                let other_node = edge[0] == currentNode ? edge[1] : edge[0]
                if (world.nodes[other_node].status < 1)
                    world.nodes[other_node].status = 1;
            }
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

        function descriptionDivPressed() {
            buttonPressed = true;
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                collapseDescriptionBox();
            } else {
                expandDescriptionBox();
            }
        };

        descriptionDiv.elt.addEventListener('pointerdown', (event) => {
            descriptionDivPressed();
        });


        let collapseButton = sketch.createButton('+');
        collapseButton.parent(descriptionDiv); // Attach it to the description div
        collapseButton.style('float', 'right');
        collapseButton.style('background', 'none');
        collapseButton.style('border', 'none');
        collapseButton.style('font-size', '16px');
        collapseButton.style('cursor', 'pointer');
        collapseButton.style('color', '#000');
        collapseButton.id('collapse-button')

        let titleText = sketch.createDiv(`<b>${world.worldDict.name}:</b> ${world.worldDict.summary}`);
        titleText.parent(descriptionDiv);
        titleText.id('title-text');

        let descriptionText = sketch.createDiv(`<b>${world.worldDict.name}:</b> ${world.worldDict.description}`);
        descriptionText.parent(descriptionDiv);
        descriptionText.id('description-text');

        collapseDescriptionBox();

        let homeButton = sketch.createButton('Home');
        homeButton.position(10, canvasHeight - 40);
        homeButton.style('background', '#ffffff');
        homeButton.style('color', '#000');
        homeButton.style('border', '1px solid #000');
        homeButton.style('padding', '5px');
        homeButton.style('font-size', '12px');
        homeButton.style('cursor', 'pointer');

        function homeButtonPressed(){
            autoCamera.rawTargetPanX = canvasWidth / 2;
            autoCamera.rawTargetPanY = canvasHeight / 2;
            autoCamera.targetZoom = 0.8;
            autoCamera.isAutoPanning = true;
            let descriptionText = sketch.select('#description-text');
            descriptionText.html(`<b>${world.worldDict.name}:</b> ${world.worldDict.description}`);
            let titleText = sketch.select('#title-text');
            titleText.html(`<b>${world.worldDict.name}:</b> ${world.worldDict.summary}`);
            buttonPressed = true;
        };

        homeButton.elt.addEventListener('pointerdown', (event) => {
            homeButtonPressed();
        });



        // Prepare all the data for the map
        traverseWorldData(world.worldDict, world.nodes, world.regions, world.subregions, canvasWidth, canvasHeight);
        populateEdges(world);

        // Randomly select a node and set it as the starting node (status = 3)
        let randomIndex = Math.floor(Math.random() * world.nodes.length);
        world.nodes[randomIndex].status = 3;
        currentNode = world.nodes[randomIndex].id;

        autoCamera.rawTargetPanX = world.nodes[currentNode].coords.x;
        autoCamera.rawTargetPanY = world.nodes[currentNode].coords.y;
        autoCamera.targetZoom = 2.4;

        updateNeighbors()

        descriptionText.html(`<b>${world.nodes[currentNode].name}:</b> ${world.nodes[currentNode].description}`);
        titleText.html(`<b>${world.nodes[currentNode].name}:</b> ${world.nodes[currentNode].summary}`);

        buttonPressed = true;

        drawMap();      
      };

      function collapseDescriptionBox() {
        const titleText = sketch.select('#title-text');
        titleText.show();
        const descriptionText = sketch.select('#description-text');
        descriptionText.hide();
        let collapseButton = sketch.select('#collapse-button')
        collapseButton.html('+');
    }    

    function expandDescriptionBox() {
        const titleText = sketch.select('#title-text');
        titleText.hide();
        const descriptionText = sketch.select('#description-text');
        descriptionText.show();
        let collapseButton = sketch.select('#collapse-button')
        collapseButton.html('-');
    }

      sketch.draw = function() {
        sketch.clear();

        // Smoothly interpolate panX and panY towards targetPanX and targetPanY
        if (autoCamera.isAutoPanning) {
            let targetPanX = canvasWidth / 2 - autoCamera.rawTargetPanX * camera.zoom;
            let targetPanY = canvasHeight / 2 - autoCamera.rawTargetPanY * camera.zoom;

            let lerpFactor = 0.1; // Adjust for smoothness (0.1 = slow, 1 = immediate)
            camera.panX = sketch.lerp(camera.panX, targetPanX, lerpFactor);
            camera.panY = sketch.lerp(camera.panY, targetPanY, lerpFactor);
            camera.zoom = sketch.lerp(camera.zoom, autoCamera.targetZoom, lerpFactor);

            // Stop panning if close to the target
            if (Math.abs(camera.panX - targetPanX) < 1 && Math.abs(camera.panY - targetPanY) < 1) {
                autoCamera.isAutoPanning = false;
            }
        }

        if (camera.zoom <= 1.0)
            userMode = 2;
        else if (camera.zoom > 1.5)
            userMode = 0;
        else
            userMode = 1;

        sketch.push(); // Save the current transformation matrix
        sketch.translate(camera.panX, camera.panY); // Apply panning
        sketch.scale(camera.zoom); // Apply zoom
        drawMap(); // Draw the graph with transformations applied
        sketch.pop(); // Restore the transformation matrix
    };

    function updateSelectedNode() {
        let mouseXTransformed = (sketch.mouseX - camera.panX) / camera.zoom;
        let mouseYTransformed = (sketch.mouseY - camera.panY) / camera.zoom;    

        for (let node of world.nodes) {
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
        let mouseXTransformed = (sketch.mouseX - camera.panX) / camera.zoom;
        let mouseYTransformed = (sketch.mouseY - camera.panY) / camera.zoom;
    
        let candidates = userMode == 1 ? world.subregions : world.regions;
    
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

            if (sketch.dist(camera.mouseStart.x, camera.mouseStart.y, sketch.mouseX, sketch.mouseY) > 2) {
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

            let centroid = { x: 0, y: 0 };
            let n = selectedRegion.polygon.length;
        
            for (let vertex of selectedRegion.polygon) {
                centroid.x += vertex.x;
                centroid.y += vertex.y;
            }
        
            centroid.x /= n;
            centroid.y /= n;

            autoCamera.isAutoPanning = true;

            autoCamera.rawTargetPanX = centroid.x;
            autoCamera.rawTargetPanY = centroid.y;
            autoCamera.targetZoom = userMode == 1 ? 1.3 : 0.9

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

            if (sketch.dist(camera.mouseStart.x, camera.mouseStart.y, sketch.mouseX, sketch.mouseY) > 2) {
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

            autoCamera.isAutoPanning = true;
            autoCamera.rawTargetPanX = world.nodes[selectedNode.id].coords.x;
            autoCamera.rawTargetPanY = world.nodes[selectedNode.id].coords.y;
            autoCamera.targetZoom = 2.4;

            world.nodes[currentNode].status = 2;
            currentNode = selectedNode.id;
            world.nodes[selectedNode.id].status = 3;
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

        autoCamera.isAutoPanning = false;

        let zoomAmount = 0.05; // Adjust the sensitivity of zoom
        let newZoom = camera.zoom + (event.delta > 0 ? -zoomAmount : zoomAmount);
    
        // Constrain zoom to avoid flipping or excessive zooming
        newZoom = sketch.constrain(newZoom, 0.5, 5);
    
        // Calculate the position of the mouse in world coordinates before zooming
        let mouseXWorld = (sketch.mouseX - camera.panX) / camera.zoom;
        let mouseYWorld = (sketch.mouseY - camera.panY) / camera.zoom;
    
        // Update zoom level
        let zoomChange = newZoom / camera.zoom;
        camera.zoom = newZoom;
    
        // Adjust pan to keep the zoom centered on the mouse
        camera.panX -= (mouseXWorld * zoomChange - mouseXWorld) * camera.zoom;
        camera.panY -= (mouseYWorld * zoomChange - mouseYWorld) * camera.zoom;
    
        return false; // Prevent default scroll behavior when inside the canvas
    };
    
    sketch.mousePressed = function() {
        if (!isActionInsideCanvas() || buttonPressed) {
            return true;
        }

        autoCamera.isAutoPanning = false;

        if (userMode == 0)
            updateSelectedNode();
        else
            updateSelectedRegion();

        camera.isDragging = true;
        camera.dragStart.x = sketch.mouseX - camera.panX;
        camera.dragStart.y = sketch.mouseY - camera.panY;
        camera.mouseStart.x = sketch.mouseX;
        camera.mouseStart.y = sketch.mouseY;
    };
    
    sketch.mouseDragged = function () {
        if (camera.isDragging) {
            camera.panX = sketch.mouseX - camera.dragStart.x;
            camera.panY = sketch.mouseY - camera.dragStart.y;
        }
    };

    sketch.mouseReleased = function () {
        if (buttonPressed){
            buttonPressed = false;
            return true;
        }
        camera.isDragging = false;
        if (userMode == 0)
            finalizeSelectNode();
        else
            finalizeSelectRegion();
    };

    sketch.touchStarted = function(event) {
        if (!isActionInsideCanvas() || buttonPressed) {
            return true;
        }

        autoCamera.isAutoPanning = false;

        if (sketch.touches.length === 2) {
            // Pinch zoom: Store the initial distance between two touch points
            const touch1 = sketch.touches[0];
            const touch2 = sketch.touches[1];
            camera.lastTouchDist = sketch.dist(touch1.x, touch1.y, touch2.x, touch2.y);
            camera.isTouchPanning = false;
        } else if (sketch.touches.length === 1) {
            if (userMode == 0)
                updateSelectedNode();
            else
                updateSelectedRegion();

            camera.isTouchPanning = true;
            camera.dragStart.x = sketch.mouseX - camera.panX;
            camera.dragStart.y = sketch.mouseY - camera.panY;
            camera.mouseStart.x = sketch.mouseX;
            camera.mouseStart.y = sketch.mouseY;    
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
    
            if (camera.lastTouchDist) {
                // Adjust zoom based on change in distance
                const zoomFactor = 0.01; // Adjust sensitivity
                let newZoom = camera.zoom + (currentDist - camera.lastTouchDist) * zoomFactor;

                // Constrain zoom level
                newZoom = sketch.constrain(newZoom, 0.5, 5);

                // Calculate midpoint of two touch points in world coordinates
                let midX = (touch1.x + touch2.x) / 2;
                let midY = (touch1.y + touch2.y) / 2;
                let midXWorld = (midX - camera.panX) / camera.zoom;
                let midYWorld = (midY - camera.panY) / camera.zoom;

                // Update zoom level
                let zoomChange = newZoom / camera.zoom;
                camera.zoom = newZoom;

                // Adjust pan to keep the zoom centered on the midpoint
                camera.panX -= (midXWorld * zoomChange - midXWorld) * camera.zoom;
                camera.panY -= (midYWorld * zoomChange - midYWorld) * camera.zoom;
            }
            camera.lastTouchDist = currentDist; // Update the last distance
        } else if (camera.isTouchPanning && sketch.touches.length === 1) {
            // Single-touch panning
            camera.panX = sketch.mouseX - camera.dragStart.x;
            camera.panY = sketch.mouseY - camera.dragStart.y;
        }

        return false; // Prevent scrolling
    };

    sketch.touchEnded = function (event) {
        if (buttonPressed){
            return True;
        }
        if (userMode == 0)
            finalizeSelectNode();
        else
            finalizeSelectRegion();

        if (sketch.touches.length < 2) {
            camera.lastTouchDist = null; // Reset pinch zoom tracking
        }
        if (sketch.touches.length != 1) {
            camera.isTouchPanning = false; // Stop panning
        }
        return false;
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

        sketch.background(0);

        drawPolygons(sketch, world, userMode);

        drawGraphEdges(sketch, world, userMode);

        drawGraphNodes(sketch, world, userMode, radius);
    
        drawNodeLabels(sketch, world, camera, radius);

        drawRegionLabels(sketch, world, camera, userMode);
      }
    };
  
  // Attach the sketch to a specific DOM element
  let myMapSketch = new p5(mapSketch, 'simple-example-holder');
  