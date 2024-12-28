
import { setAutoCameraToHome } from './camera-utils.js';

export function createAldreonbutton(sketch, gameState) {
    let aldreonButton = sketch.createButton('Aldreon');
    aldreonButton.style('background', '#ffffff');
    aldreonButton.style('color', '#000');
    aldreonButton.style('border', '1px solid #000');
    aldreonButton.style('padding', '5px');
    aldreonButton.style('font-size', '12px');
    aldreonButton.style('cursor', 'pointer');
    aldreonButton.id('aldreon-button');

    const buttonWidth = aldreonButton.elt.offsetWidth;
    const buttonHeight = aldreonButton.elt.offsetHeight;

    let buttonVertPosition = 3*(sketch.height / 4) - buttonHeight/2;
    if (sketch.width < sketch.height)
        buttonVertPosition = 1*(sketch.height / 2) - buttonHeight/2
    aldreonButton.position(2*(sketch.width / 3) - buttonWidth/2, buttonVertPosition);

    function aldreonButtonPressed(){
        gameState.configPath = "scripts/caravan/data/config/aldreon_config.yaml";
        gameState.buttonPressed = true;
    };

    aldreonButton.elt.addEventListener('pointerdown', (event) => {
        aldreonButtonPressed();
    });

    return aldreonButton;
}

export function createVesperCitybutton(sketch, gameState) {
    let vesperCityButton = sketch.createButton('Vesper City');
    vesperCityButton.style('background', '#ffffff');
    vesperCityButton.style('color', '#000');
    vesperCityButton.style('border', '1px solid #000');
    vesperCityButton.style('padding', '5px');
    vesperCityButton.style('font-size', '12px');
    vesperCityButton.style('cursor', 'pointer');
    vesperCityButton.id('vesper-city-button');

    const buttonWidth = vesperCityButton.elt.offsetWidth;
    const buttonHeight = vesperCityButton.elt.offsetHeight;

    let buttonVertPosition = 3*(sketch.height / 4) - buttonHeight/2;
    if (sketch.width < sketch.height)
        buttonVertPosition = 1*(sketch.height / 2) - buttonHeight/2
    vesperCityButton.position(1*(sketch.width / 3) - buttonWidth/2, buttonVertPosition);

    function vesperCityButtonPressed(){
        gameState.configPath = "scripts/caravan/data/config/vesper_city_config.yaml";
        gameState.buttonPressed = true;
    };

    vesperCityButton.elt.addEventListener('pointerdown', (event) => {
        vesperCityButtonPressed();
    });

    return vesperCityButton;
}

export function createHomeButton(sketch, world, config, gameState, autoCamera) {
    let homeButton = sketch.createButton('Home');
    homeButton.position(10, sketch.height - 40);
    homeButton.style('background', '#ffffff');
    homeButton.style('color', '#000');
    homeButton.style('border', '1px solid #000');
    homeButton.style('padding', '5px');
    homeButton.style('font-size', '12px');
    homeButton.style('cursor', 'pointer');

    function homeButtonPressed(){
        setAutoCameraToHome(sketch, autoCamera);
        let descriptionText = sketch.select('#description-text');
        descriptionText.html(`<div>
                <b>${world.worldDict.name}:</b> ${world.worldDict.description}<br>
                <img src="${config.imageDirectory}${world.worldDict.image}" style="
                    width: 50%; 
                    height: auto; 
                    max-width: 300px; 
                    image-rendering: pixelated; 
                    margin: 10px auto; 
                    display: block;">
                </div>`);
        let titleText = sketch.select('#title-text');
        titleText.html(`<b>${world.worldDict.name}:</b> ${world.worldDict.summary}`);
        gameState.buttonPressed = true;
    };

    homeButton.elt.addEventListener('pointerdown', (event) => {
        homeButtonPressed();
    });

    return homeButton;
}

export function createDescriptionDiv(sketch, camera, gameState) {
    let descriptionDiv = sketch.createDiv('');
    descriptionDiv.position(10, 10);
    descriptionDiv.style('font-size', '14px');
    descriptionDiv.style('color', '#000');
    descriptionDiv.style('background-color', 'rgba(255, 255, 255, 0.8)');
    descriptionDiv.style('padding', '10px');
    descriptionDiv.style('border', '1px solid #ccc');
    descriptionDiv.style('max-width', '1180px');
    descriptionDiv.style('overflow-wrap', 'break-word');
    
    descriptionDiv.id('description-div');

    function descriptionDivPressed() {
        gameState.buttonPressed = true;
    };

    function descriptionDivReleased() {
        if (sketch.dist(camera.mouseStart.x, camera.mouseStart.y, sketch.mouseX, sketch.mouseY) > 2) {
            return;
        }
        gameState.isDescriptionDivCollapsed = !gameState.isDescriptionDivCollapsed;
        if (gameState.isDescriptionDivCollapsed) {
            collapseDescriptionBox(sketch);
        } else {
            expandDescriptionBox(sketch);
        }
    }

    descriptionDiv.elt.addEventListener('pointerdown', (event) => {
        descriptionDivPressed();
    });
    descriptionDiv.elt.addEventListener('pointerup', (event) => {
        descriptionDivReleased();
    });

    return descriptionDiv;
}

export function createDescriptionDivText(sketch, world) {
    const descriptionDiv = sketch.select('#description-div');

    let titleText = sketch.createDiv(`<b>${world.worldDict.name}:</b> ${world.worldDict.summary}`);
    titleText.parent(descriptionDiv);
    titleText.id('title-text');

    let descriptionText = sketch.createDiv(`<b>${world.worldDict.name}:</b> ${world.worldDict.description}`);
    descriptionText.parent(descriptionDiv);
    descriptionText.id('description-text');

    return { titleText, descriptionText };
}

export function createCollapseButton(sketch){
    const descriptionDiv = sketch.select('#description-div');

    let collapseButton = sketch.createButton('+');
    collapseButton.parent(descriptionDiv); // Attach it to the description div
    collapseButton.style('float', 'right');
    collapseButton.style('background', 'none');
    collapseButton.style('border', 'none');
    collapseButton.style('font-size', '16px');
    collapseButton.style('cursor', 'pointer');
    collapseButton.style('color', '#000');
    collapseButton.id('collapse-button')

    return collapseButton;
}

export function collapseDescriptionBox(sketch) {
    const titleText = sketch.select('#title-text');
    titleText.show();
    const descriptionText = sketch.select('#description-text');
    descriptionText.hide();
    let collapseButton = sketch.select('#collapse-button')
    collapseButton.html('+');
}    

export function expandDescriptionBox(sketch) {
    const titleText = sketch.select('#title-text');
    titleText.hide();
    const descriptionText = sketch.select('#description-text');
    descriptionText.show();
    let collapseButton = sketch.select('#collapse-button')
    collapseButton.html('-');
}

export function updateDescriptionDivContents(sketch, config, chosen) {
    let descriptionText = sketch.select('#description-text');
    let titleText = sketch.select('#title-text');

    if (chosen.description) {
        descriptionText.html(`<div>
            <b>${chosen.name}:</b> ${chosen.description}<br>
            <img src="${config.imageDirectory}${chosen.image}" style="
                width: 50%; 
                height: auto; 
                max-width: 300px; 
                image-rendering: pixelated; 
                margin: 10px auto; 
                display: block;">
            </div>`);
        titleText.html(`<b>${chosen.name}:</b> ${chosen.summary}`);
    } else {
        descriptionText.html(`<b>${chosen.name}:</b> No description available.`);
        titleText.html(`<b>${chosen.name}</b>`);
    }
}