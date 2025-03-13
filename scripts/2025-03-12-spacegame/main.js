import { MapBackground } from './background.js'
import { Camera } from './camera.js';
import { mouseDragged, mousePressed, mouseReleased, mouseWheel, touchStarted,  touchMoved } from './controls.js';
import { MapStars } from './map-stars.js'
import { Spaceship } from './spaceship.js';

let mapBackground = null;
let mapStars = null;
let spaceship = null;
let camera = null;

var mapSketch = function(sketch) {
    sketch.preload = function() {
        mapBackground = new MapBackground(sketch);
        mapStars = new MapStars();
        spaceship = new Spaceship(sketch);
        camera = new Camera(sketch);

        spaceship.preload();
    };

    sketch.setup = async function() {
        let sketchHolder = document.getElementById('simple-example-holder'); // Get the container
        let w = sketchHolder.clientWidth;
        sketch.createCanvas(w, sketch.windowHeight*0.7);

        camera.applyCameraTransform();

        mapBackground.initializeBackground(camera);
        mapStars.initializeMapStars(sketch);

        camera.endCameraTransform();

        // Start at a random star and configure the camera to autopan to it
        spaceship.setOrbitStar(mapStars.getRandomStar(), false);
        camera.setAutoCamera(spaceship.orbitStar.baseX, spaceship.orbitStar.baseY, 1.0);
    }

    sketch.draw = function() {

        camera.handleAutoCamera();

        // Background is drawn without camera transform
        // since it needs weird logic to preserve parallax
        mapBackground.drawBackground();

        // Todo: make this take a function and create a draw function?
        // Same for initialize logic above
        camera.applyCameraTransform();

        mapStars.drawMapStars();
        spaceship.drawSpaceship();

        camera.endCameraTransform();
    }

    // Attach event listeners
    sketch.mousePressed = function() { mousePressed(camera); };
    sketch.mouseReleased = function() { mouseReleased(sketch, camera, mapStars, spaceship); };
    sketch.mouseDragged = function() { return mouseDragged(camera); };
    sketch.mouseWheel = function(event) { return mouseWheel(event, camera); };
    sketch.touchStarted = function() { return touchStarted(camera); };
    sketch.touchMoved = function() { return touchMoved(camera); };

};

// Attach the sketch to a specific DOM element
let myMapSketch = new p5(mapSketch, 'simple-example-holder');
