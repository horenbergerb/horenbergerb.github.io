import { isPointInPolygon, calculateCentroid } from './geometry-utils.js';

export function drawPolygons(sketch, world, userMode) {
    //Determine whether to draw the regions or the subregions
    let regionAlpha = 255;
    let subregionAlpha = 255;
    if (userMode != 1)
        subregionAlpha = 32;
    else
        regionAlpha = 64;

    sketch.strokeWeight(1);
    sketch.noFill();

    sketch.stroke(64, 64, 64, regionAlpha)
    for (let polygon of world.regions) {
        sketch.beginShape();
        for (let vertex of polygon.polygon) {
            sketch.vertex(vertex.x, vertex.y);
        }
        sketch.endShape(sketch.CLOSE);
    }

    sketch.noFill();
    sketch.stroke(64, 64, 64, subregionAlpha)
    for (let polygon of world.subregions) {
        sketch.beginShape();
        for (let vertex of polygon.polygon) {
            sketch.vertex(vertex.x, vertex.y);
        }
        sketch.endShape(sketch.CLOSE);
    }

}


export function drawGraphEdges(sketch, world, userMode) {
    let edgeAlpha = 255;
    if (userMode != 0)
        edgeAlpha = 64;

    sketch.strokeWeight(0.5);
    for (let edge of world.edges){
        // Only draw edges when both nodes are visible
        if (world.nodes[edge[0]].status > 0 && world.nodes[edge[1]].status > 0){
            sketch.stroke(0, 0, 0, edgeAlpha);
            sketch.line(world.nodes[edge[0]].coords.x, world.nodes[edge[0]].coords.y, world.nodes[edge[1]].coords.x, world.nodes[edge[1]].coords.y);
        }
    }
}


export function drawGraphNodes(sketch, world, config, userMode) {
    let nodeAlpha = 255;
    if (userMode != 0)
        nodeAlpha = 64;
    for (let node of world.nodes){
        if (node.status == 0)
            continue;
        if (node.status == 1) {
            sketch.fill(192, 192, 192, nodeAlpha); // Hollow outline
            sketch.stroke(0, 0, 0, nodeAlpha); // Set stroke color
        } else if (node.status == 2) {
            sketch.stroke(0, 0, 0, nodeAlpha);
            sketch.fill(114, 245, 66, nodeAlpha);
        }
        sketch.ellipse(node.coords.x, node.coords.y, config.radius * 2); // Draw circle
    }
}


export function drawNodeLabels(sketch, world, config, camera, userMode, selectedNode) {
    for (let node of world.nodes){
        if (node.status == 0)
            continue;

        sketch.noStroke();
        
        // Calculate distance from mouse to node
        let mouseXTransformed = (sketch.mouseX - camera.panX) / camera.zoom;
        let mouseYTransformed = (sketch.mouseY - camera.panY) / camera.zoom;
        let distance = sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y);

        // Map the distance to an alpha value (closer = more opaque, farther = more transparent)
        let alpha = sketch.map(distance, 0, sketch.width / 8, 255, 0);
        alpha = sketch.constrain(alpha, 0, 255);

        // If the mouse is hovering over the node, make the text bigger and white
        let emphasizeNode = sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y) < config.radius;
        emphasizeNode = emphasizeNode || (selectedNode != null && selectedNode.id === node.id && userMode == 0)
        if (!config.showAllNodeLabels && !emphasizeNode)
            continue;
        let textSize = (emphasizeNode) ? 12 : 8;
            sketch.fill(0, 0, 0, (emphasizeNode) ? 255 : alpha);
            sketch.textSize(textSize);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text(node.name, node.coords.x, node.coords.y - config.radius - 2); // Text above the node
    }
}

export function drawImages(sketch, world, config, camera, userMode, selectedNode) {
    if (userMode == 0) {
        for (let node of world.nodes){
            if (node.status == 0)
                continue;
            
            // Calculate distance from mouse to node
            let mouseXTransformed = (sketch.mouseX - camera.panX) / camera.zoom;
            let mouseYTransformed = (sketch.mouseY - camera.panY) / camera.zoom;
            let emphasizeNode = sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y) < config.radius;
            emphasizeNode = emphasizeNode || (selectedNode != null && selectedNode.id === node.id)
    
            sketch.noSmooth();
            if (emphasizeNode) {
                sketch.image(node.image_loaded, node.coords.x - (node.image_loaded.width)/2, node.coords.y + 10, node.image_loaded.width, node.image_loaded.height);
            }
        }
    }
    else {

    }
}

export function drawRegionLabels(sketch, world, camera, userMode, selectedRegion) {
    // Don't draw region labels unless we're in region/subregion mode
    if (userMode == 0)
        return;

    let candidates = userMode == 2 ? world.regions : world.subregions;
    let textSize = userMode == 2 ? 20 : 12;

    for (let candidate of candidates) {
        labelPolygon(sketch, camera, candidate.name, candidate.polygon, textSize, candidate.image_loaded, selectedRegion);
    }
}

function labelPolygon(sketch, camera, label, polygon, textSize=15, image=null, selectedRegion){
    // Calculate mouse position in world coordinates
    let mouseXTransformed = (sketch.mouseX - camera.panX) / camera.zoom;
    let mouseYTransformed = (sketch.mouseY - camera.panY) / camera.zoom;

    let centroid = calculateCentroid(polygon);

    let emphasizeRegion = isPointInPolygon(mouseXTransformed, mouseYTransformed, polygon);
    emphasizeRegion = emphasizeRegion || (selectedRegion != null && selectedRegion.name === label)

    // Calculate distance from mouse to polygon center
    let distance = sketch.dist(mouseXTransformed, mouseYTransformed, centroid.x, centroid.y);

    // Map the distance to an alpha value (closer = more opaque, farther = more transparent)
    let alpha = sketch.map(distance, 0, Math.max(sketch.width, sketch.height) / 2, 255, 64);
    alpha = sketch.constrain(alpha, 128, 255); // Ensure alpha stays between 0 and 255

    // Set text properties and draw text at the polygon center
    sketch.fill(0, 0, 0, alpha);
    sketch.textSize(emphasizeRegion ? textSize + 5 : textSize);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.text(label, centroid.x, centroid.y);

    // Todo: get this image code out of the label function
    if (image != null) {
        sketch.noSmooth();
        if (emphasizeRegion) {
            sketch.image(image, centroid.x - (image.width)/2, centroid.y + 10, image.width, image.height);
        }
    }
}

export function drawMapBackground(sketch, config, background) {
    //Rotate the background if you're on a phone or a tall screen
    sketch.noSmooth();
    sketch.background(0);
    if (sketch.width < sketch.height) {
        sketch.push();
        sketch.imageMode(sketch.CENTER);
        sketch.translate(sketch.width / 2, sketch.height / 2);
        sketch.rotate(sketch.PI / 2); // Rotate by 90 degrees
        sketch.image(background, 0, 0, sketch.height+(sketch.height*config.playableAreaHeight), sketch.width+(sketch.width*config.playableAreaWidth) )
        sketch.pop();
    }
    else {
        sketch.image(background, -1*(sketch.width*config.playableAreaWidth/2), -1*(sketch.height*config.playableAreaHeight/2), sketch.width+(sketch.width*config.playableAreaWidth), sketch.height+(sketch.height*config.playableAreaHeight))
    }    
}

export function drawMap(sketch, world, config, camera, gameState, background) {

    drawMapBackground(sketch, config, background);
    
    drawPolygons(sketch, world, gameState.userMode);

    drawGraphEdges(sketch, world, gameState.userMode);

    drawGraphNodes(sketch, world, config, gameState.userMode);

    drawNodeLabels(sketch, world, config, camera, gameState.userMode, gameState.selectedNode);

    drawRegionLabels(sketch, world, camera, gameState.userMode, gameState.selectedRegion);

    drawImages(sketch, world, camera, config, gameState.userMode, gameState.selectedNode);
};