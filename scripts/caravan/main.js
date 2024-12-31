import { traverseWorldData, loadWorldAsync, populateEdges, loadConfigAsync } from './data-loader.js';
import { drawMap } from './map-drawing-utils.js';
import { isPointInPolygon, calculateCentroid, isMouseInsideCanvas } from './geometry-utils.js';
import { updateZoomTouch, panCamera, updateDragStart, updateZoomMouse, updateMouseStart, setAutoCamera, handleAutoCamera } from './camera-utils.js';
import { createCollapseButton, createDescriptionDiv, createDescriptionDivText, createHomeButton, collapseDescriptionBox, updateDescriptionDivContents, createAldreonbutton, createVesperCitybutton } from './map-gui-utils.js'

var mapSketch = function(sketch) {
    const gameState = {
        isLoading: true,
        configPath: null,
        selectedRegion: null,
        selectedNode: null,
        buttonPressed: false,
        isDescriptionDivCollapsed: true,
        // Modes. 0 = destinations, 1 = subregions, 2 = regions
        userMode: 0,
        narratorAudio: null,
        backgroundAudio: null,
        volumeSlider: null
    }

    const config = {};

    // Holds the image used for the background
    let background;

    // World information loaded from YAML
    const world = {
        worldDict: null,
        nodes: [],
        regions: [],
        subregions: [],
        edges: []
    }

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

    sketch.preload = async function () {

    };

    function enableAudioContextOnUserGesture() {
        const audioContext = sketch.getAudioContext();
        if (audioContext.state !== 'running') {
            const resume = () => {
                audioContext.resume().then(() => {
                    window.removeEventListener('click', resume); // Remove listener after resuming
                });
            };
            window.addEventListener('click', resume);
        }
    }    

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


    sketch.setup = async function() {
        let container = document.getElementById('simple-example-holder'); // Get the container element
        let canvasWidth = Math.min(800, container.offsetWidth); // Set width based on the container
        let canvasHeight = Math.min(600, sketch.windowHeight * 0.8); // Set height based on the container

        let canvas = sketch.createCanvas(canvasWidth, canvasHeight);
        sketch.clear();
        canvas.parent('simple-example-holder');

        sketch.getAudioContext().suspend();
        enableAudioContextOnUserGesture();

        let titleScreenPath = 'scripts/caravan/data/assets/title_page_wide.png';
        if (sketch.width < sketch.height)
            titleScreenPath = 'scripts/caravan/data/assets/title_page_tall.png';

        let titleScreen = await new Promise((resolve, reject) => {
            sketch.loadImage(titleScreenPath, resolve, reject);
        });
        sketch.noSmooth();
        sketch.image(titleScreen, 0, 0, sketch.width, sketch.height);

        let aldreonButton = createAldreonbutton(sketch, gameState);
        let vesperCityButton = createVesperCitybutton(sketch, gameState);

        await loadConfigAsync(sketch, gameState, config);

        if (gameState.backgroundAudio) {
            gameState.backgroundAudio.stop(); // Stop any currently playing audio
        }

        gameState.backgroundAudio = new p5.SoundFile(config.backgroundAudio, () => {
            gameState.backgroundAudio.setVolume(0.01);
            gameState.backgroundAudio.loop(); // Play the audio file once it has loaded
        });


        await loadWorldAsync(sketch, world, config.worldPath);
        background = await new Promise((resolve, reject) => {
            sketch.loadImage(config.background, resolve, reject);
        });

        gameState.isLoading = false;

        let homeButton = createHomeButton(sketch, world, config, gameState, autoCamera);

        let descriptionDiv = createDescriptionDiv(sketch, camera, gameState);

        let collapseButton = createCollapseButton(sketch);

        let { titleText, descriptionText } = createDescriptionDivText(sketch, world);

        collapseDescriptionBox(sketch);

        // Prepare all the data for the map
        traverseWorldData(sketch, config, world.worldDict, world.nodes, world.regions, world.subregions);
        populateEdges(world);

        // Randomly select a node and set it as the starting node (status = 2)
        let randomIndex = Math.floor(Math.random() * world.nodes.length);
        world.nodes[randomIndex].status = 2;
        let startingNodeId = world.nodes[randomIndex].id;

        gameState.selectedNode = world.nodes[startingNodeId];

        setAutoCamera(autoCamera, world.nodes[startingNodeId].coords.x, world.nodes[startingNodeId].coords.y, 2.4);

        updateNeighbors(startingNodeId);

        updateDescriptionDivContents(sketch, config, world.nodes[startingNodeId]);

        drawMap(sketch, world, config, camera, gameState, background);
        
        // Create a slider (min: 0, max: 1, default: 0.5, step: 0.01)
        gameState.volumeSlider = sketch.createSlider(0, 0.3, 0.15, 0.01);
        gameState.volumeSlider.position(sketch.width-150, sketch.height+10); // Position it on the canvas

        let volumeLabel = sketch.createP('Volume:');
        volumeLabel.position(gameState.volumeSlider.x - 63, gameState.volumeSlider.y - 5); // Position it next to the slider
    };

      sketch.draw = function() {

        if (!gameState.configPath)
            return;
        
        if (gameState.isLoading) {
            sketch.background(0);
            sketch.fill(255);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text("Loading...", sketch.width / 2, sketch.height / 2);
            return;
        }

        sketch.clear();

        handleAutoCamera(sketch, camera, autoCamera);

        if (camera.zoom <= 1.0)
            gameState.userMode = 2;
        else if (camera.zoom > 1.5)
            gameState.userMode = 0;
        else
            gameState.userMode = 1;

        sketch.push(); // Save the current transformation matrix
        sketch.translate(camera.panX, camera.panY); // Apply panning
        sketch.scale(camera.zoom); // Apply zoom
        //Draw the rest of the map
        drawMap(sketch, world, config, camera, gameState, background);
        sketch.pop();

        let volume = gameState.volumeSlider.value();
        if (gameState.backgroundAudio)
            gameState.backgroundAudio.setVolume(volume*config.backgroundAudioMultiplier);
        if (gameState.narratorAudio)
            gameState.narratorAudio.setVolume(volume);

        sketch.textSize(16);
        sketch.fill(0);
        sketch.text('Volume: ', sketch.width - 190, sketch.height + 19);
    };
    
    function finalizeSelectRegion() {
        let mouseXTransformed = (sketch.mouseX - camera.panX) / camera.zoom;
        let mouseYTransformed = (sketch.mouseY - camera.panY) / camera.zoom;
    
        let candidates = gameState.userMode == 1 ? world.subregions : world.regions;
    
        for (let candidate of candidates) {
            if (isPointInPolygon(mouseXTransformed, mouseYTransformed, candidate.polygon)) {
                gameState.selectedRegion = candidate;
                break;
            }
        }

        if (gameState.narratorAudio) {
            gameState.narratorAudio.stop(); // Stop any currently playing audio
        }

        if (!gameState.selectedRegion)
            return;

        updateDescriptionDivContents(sketch, config, gameState.selectedRegion);

        // Replace `.png` with `.mp3` in the selected region's image file path
        let audioFilePath = config.descriptionAudioDirectory + gameState.selectedRegion.image.replace(".png", ".mp3");
        gameState.narratorAudio = new p5.SoundFile(audioFilePath, () => {
            gameState.narratorAudio.setVolume(0.1);
            gameState.narratorAudio.play(); // Play the audio file once it has loaded
        });


        let centroid = calculateCentroid(gameState.selectedRegion.polygon)

        setAutoCamera(autoCamera, centroid.x, centroid.y, gameState.userMode == 1 ? 1.3 : 0.9);
    }

    function finalizeSelectNode() {
            let mouseXTransformed = (sketch.mouseX - camera.panX) / camera.zoom;
            let mouseYTransformed = (sketch.mouseY - camera.panY) / camera.zoom;    
            for (let node of world.nodes) {
                if (node.status == 0)
                    continue;
                if (sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y) < config.radius) {
                    gameState.selectedNode = node;
                    break;
                }
            }

            if (gameState.narratorAudio) {
                gameState.narratorAudio.stop(); // Stop any currently playing audio
            }

            if (!gameState.selectedNode)
                return;

            updateDescriptionDivContents(sketch, config, gameState.selectedNode);

            // Replace `.png` with `.mp3` in the selected node's image file path
            let audioFilePath = config.descriptionAudioDirectory + gameState.selectedNode.image.replace(".png", ".mp3");
            gameState.narratorAudio = new p5.SoundFile(audioFilePath, () => {
                gameState.narratorAudio.setVolume(0.1);
                gameState.narratorAudio.play(); // Play the audio file once it has loaded
            });

            setAutoCamera(autoCamera, world.nodes[gameState.selectedNode.id].coords.x, world.nodes[gameState.selectedNode.id].coords.y, 2.4);

            world.nodes[gameState.selectedNode.id].status = 2;
            updateNeighbors(gameState.selectedNode.id);
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
        if (!isMouseInsideCanvas(sketch) || gameState.buttonPressed) {
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
        if (!isMouseInsideCanvas(sketch) || gameState.buttonPressed) {
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
        if (gameState.buttonPressed){
            gameState.buttonPressed = false;
            return false;
        }
        camera.isDragging = false;
    
        collapseDescriptionBox(sketch);
    
        if (sketch.touches.length < 2)
            camera.lastTouchDist = null; // Reset pinch zoom tracking
    
        if (sketch.touches.length != 1)
            camera.isTouchPanning = false; // Stop panning
    
        if (sketch.dist(camera.mouseStart.x, camera.mouseStart.y, sketch.mouseX, sketch.mouseY) > 2)
            return false;
    
        gameState.selectedRegion = null;
        gameState.selectedNode = null;

        if (gameState.userMode == 0)
            finalizeSelectNode();
        else
            finalizeSelectRegion();

        return false;
    };
};

  // Attach the sketch to a specific DOM element
  let myMapSketch = new p5(mapSketch, 'simple-example-holder');