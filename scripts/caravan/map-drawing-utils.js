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


export function drawGraphNodes(sketch, world, userMode, radius) {
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
        sketch.ellipse(node.coords.x, node.coords.y, radius * 2); // Draw circle
    }
}


export function drawNodeLabels(sketch, world, camera, userMode, radius, selectedNode) {
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
        let emphasizeNode = sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y) < radius;
        emphasizeNode = emphasizeNode || (selectedNode != null && selectedNode.id === node.id && userMode == 0)
        let textSize = (emphasizeNode) ? 12 : 8;
            sketch.fill(0, 0, 0, (emphasizeNode) ? 255 : alpha);
            sketch.textSize(textSize);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text(node.name, node.coords.x, node.coords.y - radius - 2); // Text above the node
    }
}

export function drawImages(sketch, world, camera, userMode, radius, selectedNode) {
    if (userMode == 0) {
        for (let node of world.nodes){
            if (node.status == 0)
                continue;
            
            // Calculate distance from mouse to node
            let mouseXTransformed = (sketch.mouseX - camera.panX) / camera.zoom;
            let mouseYTransformed = (sketch.mouseY - camera.panY) / camera.zoom;
            let emphasizeNode = sketch.dist(mouseXTransformed, mouseYTransformed, node.coords.x, node.coords.y) < radius;
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

export function drawMap(sketch, world, camera, userMode, radius, selectedNode, selectedRegion) {

    drawPolygons(sketch, world, userMode);

    drawGraphEdges(sketch, world, userMode);

    drawGraphNodes(sketch, world, userMode, radius);

    drawNodeLabels(sketch, world, camera, userMode, radius, selectedNode);

    drawRegionLabels(sketch, world, camera, userMode, selectedRegion);

    drawImages(sketch, world, camera, userMode, radius, selectedNode);
};