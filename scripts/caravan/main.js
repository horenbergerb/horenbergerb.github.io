import { traverseWorldData, loadYaml, populateEdges } from './data-loader.js';
import { drawPolygons, drawGraphEdges, drawGraphNodes, drawNodeLabels, drawRegionLabels, drawImages, drawMap } from './map-drawing-utils.js';
import { isPointInPolygon, calculateCentroid, isMouseInsideCanvas } from './geometry-utils.js';
import { updateZoomTouch, panCamera, updateDragStart, updateZoomMouse, updateMouseStart, setAutoCameraToHome, setAutoCamera, handleAutoCamera } from './camera-utils.js';

var mapSketch = function(sketch) {
    let canvasWidth = 500;
    let canvasHeight = 500;
    // Radius of nodes
    let radius = 5;

    // Holds the image used for the background
    let background;

    let selectedRegion = null;
    let selectedNode = null;

    // World information loaded from YAML
    const world = {
        worldDict: null,
        nodes: [],
        regions: [],
        subregions: [],
        edges: []
    }

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
        background = sketch.loadImage(`scripts/caravan/data/background/background.png`);
      };

    function updateNeighbors(currentNodeId) {
        // Make new neighbor nodes visible (i.e. status=1) after moving.
        for (let edge of world.edges) {
            if (edge.includes(currentNodeId)){
                let other_node = edge[0] == currentNodeId ? edge[1] : edge[0]
                if (world.nodes[other_node].status < 1)
                    world.nodes[other_node].status = 1;
            }
        }
    }


    sketch.setup = function() {
        let container = document.getElementById('simple-example-holder'); // Get the container element
        canvasWidth = Math.min(800, container.offsetWidth); // Set width based on the container
        canvasHeight = Math.min(600, sketch.windowHeight * 0.8); // Set height based on the container

        let canvas = sketch.createCanvas(canvasWidth, canvasHeight);
        sketch.clear();
        canvas.parent('simple-example-holder');
    
        let homeButton = sketch.createButton('Home');
        homeButton.position(10, canvasHeight - 40);
        homeButton.style('background', '#ffffff');
        homeButton.style('color', '#000');
        homeButton.style('border', '1px solid #000');
        homeButton.style('padding', '5px');
        homeButton.style('font-size', '12px');
        homeButton.style('cursor', 'pointer');

        function homeButtonPressed(){
            setAutoCameraToHome(autoCamera, canvasWidth, canvasHeight);
            let descriptionText = sketch.select('#description-text');
            descriptionText.html(`<div>
                    <b>${world.worldDict.name}:</b> ${world.worldDict.description}<br>
                    <img src="scripts/caravan/data/image/${world.worldDict.image}" style="
                        width: 50%; 
                        height: auto; 
                        max-width: 300px; 
                        image-rendering: pixelated; 
                        margin: 10px auto; 
                        display: block;">
                    </div>`);
            let titleText = sketch.select('#title-text');
            titleText.html(`<b>${world.worldDict.name}:</b> ${world.worldDict.summary}`);
            buttonPressed = true;
        };

        homeButton.elt.addEventListener('pointerdown', (event) => {
            homeButtonPressed();
        });

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
        };

        function descriptionDivReleased() {
            if (sketch.dist(camera.mouseStart.x, camera.mouseStart.y, sketch.mouseX, sketch.mouseY) > 2) {
                return;
            }
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                collapseDescriptionBox();
            } else {
                expandDescriptionBox();
            }
        }

        descriptionDiv.elt.addEventListener('pointerdown', (event) => {
            descriptionDivPressed();
        });
        descriptionDiv.elt.addEventListener('pointerup', (event) => {
            descriptionDivReleased();
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

        // Prepare all the data for the map
        traverseWorldData(sketch, world.worldDict, world.nodes, world.regions, world.subregions, canvasWidth, canvasHeight);
        populateEdges(world);

        // Randomly select a node and set it as the starting node (status = 2)
        let randomIndex = Math.floor(Math.random() * world.nodes.length);
        world.nodes[randomIndex].status = 2;
        let startingNodeId = world.nodes[randomIndex].id;

        selectedNode = world.nodes[startingNodeId];

        setAutoCamera(autoCamera, world.nodes[startingNodeId].coords.x, world.nodes[startingNodeId].coords.y, 2.4);

        updateNeighbors(startingNodeId);

        descriptionText.html(`<div>
                    <b>${world.nodes[startingNodeId].name}:</b> ${world.nodes[startingNodeId].description}<br>
                    <img src="scripts/caravan/data/image/${world.nodes[startingNodeId].image}" style="
                        width: 50%; 
                        height: auto; 
                        max-width: 300px; 
                        image-rendering: pixelated; 
                        margin: 10px auto; 
                        display: block;">
                    </div>`);
        titleText.html(`<b>${world.nodes[startingNodeId].name}:</b> ${world.nodes[startingNodeId].summary}`);

        buttonPressed = true;

        drawMap(sketch, world, camera, userMode, radius, selectedNode, selectedRegion);    
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

        handleAutoCamera(sketch, camera, autoCamera, canvasWidth, canvasHeight);

        if (camera.zoom <= 1.0)
            userMode = 2;
        else if (camera.zoom > 1.5)
            userMode = 0;
        else
            userMode = 1;

        sketch.push(); // Save the current transformation matrix
        sketch.translate(camera.panX, camera.panY); // Apply panning
        sketch.scale(camera.zoom); // Apply zoom

        //Rotate the background if you're on a phone or a tall screen
        sketch.noSmooth();
        sketch.background(0);
        if (sketch.width < sketch.height) {
            sketch.push();
            sketch.imageMode(sketch.CENTER);
            sketch.translate(sketch.width / 2, sketch.height / 2);
            sketch.rotate(sketch.PI / 2); // Rotate by 90 degrees
            sketch.image(background, 0, 0, sketch.height+(sketch.height*.8), sketch.width+(sketch.width*.8) )
            sketch.pop();
        }
        else {
            sketch.image(background, -1*(sketch.width*.4), -1*(sketch.height*.4), sketch.width+(sketch.width*.8), sketch.height+(sketch.height*.8))
        }
        //Draw the rest of the map
        drawMap(sketch, world, camera, userMode, radius, selectedNode, selectedRegion);
        sketch.pop();
    };
    
    function finalizeSelectRegion() {
        let mouseXTransformed = (sketch.mouseX - camera.panX) / camera.zoom;
        let mouseYTransformed = (sketch.mouseY - camera.panY) / camera.zoom;
    
        let candidates = userMode == 1 ? world.subregions : world.regions;
    
        for (let candidate of candidates) {
            if (isPointInPolygon(mouseXTransformed, mouseYTransformed, candidate.polygon)) {
                selectedRegion = candidate;
                break;
            }
        }

        if (!selectedRegion)
            return;

        let descriptionText = sketch.select('#description-text');
        let titleText = sketch.select('#title-text');

        if (selectedRegion.description) {
            descriptionText.html(`<div>
                <b>${selectedRegion.name}:</b> ${selectedRegion.description}<br>
                <img src="scripts/caravan/data/image/${selectedRegion.image}" style="
                    width: 50%; 
                    height: auto; 
                    max-width: 300px; 
                    image-rendering: pixelated; 
                    margin: 10px auto; 
                    display: block;">
                </div>`);
            titleText.html(`<b>${selectedRegion.name}:</b> ${selectedRegion.summary}`);
        } else {
            descriptionText.html(`<b>${selectedRegion.name}:</b> No description available.`);
            titleText.html(`<b>${selectedRegion.name}</b>`);
        }

        let centroid = calculateCentroid(selectedRegion.polygon)

        setAutoCamera(autoCamera, centroid.x, centroid.y, userMode == 1 ? 1.3 : 0.9);
    }

    function finalizeSelectNode() {
            let mouseXTransformed = (sketch.mouseX - camera.panX) / camera.zoom;
            let mouseYTransformed = (sketch.mouseY - camera.panY) / camera.zoom;    
            for (let node of world.nodes) {
                if (node.status == 0)
                    continue;
                if (sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y) < radius) {
                    selectedNode = node;
                    break;
                }
            }

            if (!selectedNode)
                return;

            let descriptionText = sketch.select('#description-text');
            let titleText = sketch.select('#title-text');

            if (selectedNode.description) {
                descriptionText.html(`<div>
                    <b>${selectedNode.name}:</b> ${selectedNode.description}<br>
                    <img src="scripts/caravan/data/image/${selectedNode.image}" style="
                        width: 50%; 
                        height: auto; 
                        max-width: 300px; 
                        image-rendering: pixelated; 
                        margin: 10px auto; 
                        display: block;">
                    </div>`);
                titleText.html(`<b>${selectedNode.name}:</b> ${selectedNode.summary}`);
            } else {
                descriptionText.html(`<b>${selectedNode.name}:</b> No description available.`);
                titleText.html(`<b>${selectedNode.name}</b>`);
            }

            setAutoCamera(autoCamera, world.nodes[selectedNode.id].coords.x, world.nodes[selectedNode.id].coords.y, 2.4);

            world.nodes[selectedNode.id].status = 2;
            updateNeighbors(selectedNode.id);
    }

    sketch.mouseWheel = function (event) {
        if (!isMouseInsideCanvas(sketch)) {
            return;
        }
        // Interrupt autocamera
        autoCamera.isAutoPanning = false;
        updateZoomMouse(sketch, camera, event.delta);
        return false;
    };
    
    sketch.mousePressed = function() {
        updateMouseStart(sketch, camera);
        if (!isMouseInsideCanvas(sketch) || buttonPressed) {
            return;
        }
        // Interrupt autocamera
        autoCamera.isAutoPanning = false;
        camera.isDragging = true;
        updateDragStart(sketch, camera);
    };
    
    sketch.mouseDragged = function () {
        if (camera.isDragging) {
            panCamera(sketch, camera);
        }
    };

    sketch.mouseReleased = function () {
        return handleTouchEndedOrMouseReleased();
    };

    sketch.touchStarted = function(event) {
        updateMouseStart(sketch, camera);
        if (!isMouseInsideCanvas(sketch) || buttonPressed) {
            return;
        }
        // Interrupt autocamera
        autoCamera.isAutoPanning = false;

        if (sketch.touches.length === 2) {
            // Pinch zoom: Store the initial distance between two touch points
            const touch1 = sketch.touches[0];
            const touch2 = sketch.touches[1];
            camera.lastTouchDist = sketch.dist(touch1.x, touch1.y, touch2.x, touch2.y);
            camera.isTouchPanning = false;
        } else if (sketch.touches.length === 1) {
            camera.isTouchPanning = true;
            updateDragStart(sketch, camera);
        }
        return false;
    };
    
    sketch.touchMoved = function(event) {
        if (!isMouseInsideCanvas(sketch)) {
            return; // Ignore touches outside the canvas
        }
        if (sketch.touches.length === 2) {
            // Pinch zoom
            const touch1 = sketch.touches[0];
            const touch2 = sketch.touches[1];
            const currentDist = sketch.dist(touch1.x, touch1.y, touch2.x, touch2.y);
    
            if (camera.lastTouchDist)
                updateZoomTouch(sketch, camera, touch1, touch2, currentDist);

            camera.lastTouchDist = currentDist; // Update the last distance
        } else if (camera.isTouchPanning && sketch.touches.length === 1) {
            panCamera(sketch, camera);
        }

        return false; // Prevent scrolling
    };

    sketch.touchEnded = function (event) {
        if (!isMouseInsideCanvas(sketch)) {
            return; // Ignore touches outside the canvas
        }
        return handleTouchEndedOrMouseReleased();
    };

    function handleTouchEndedOrMouseReleased() {
        if (buttonPressed){
            buttonPressed = false;
            return false;
        }
        camera.isDragging = false;
    
        collapseDescriptionBox();
    
        if (sketch.touches.length < 2)
            camera.lastTouchDist = null; // Reset pinch zoom tracking
    
        if (sketch.touches.length != 1)
            camera.isTouchPanning = false; // Stop panning
    
        if (sketch.dist(camera.mouseStart.x, camera.mouseStart.y, sketch.mouseX, sketch.mouseY) > 2)
            return false;
    
        selectedRegion = null;
        selectedNode = null;

        if (userMode == 0)
            finalizeSelectNode();
        else
            finalizeSelectRegion();

        return false;
    };
};

  // Attach the sketch to a specific DOM element
  let myMapSketch = new p5(mapSketch, 'simple-example-holder');
  