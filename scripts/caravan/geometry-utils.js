export function isPointInPolygon(x, y, polygon) {
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

export function calculateCentroid(polygon) {
    let centroid = { x: 0, y: 0 };
    let n = polygon.length;

    for (let vertex of polygon) {
        centroid.x += vertex.x;
        centroid.y += vertex.y;
    }

    centroid.x /= n;
    centroid.y /= n;

    return centroid;
}

export function isMouseInsideCanvas(sketch) {
    return (
        sketch.mouseX >= 0 &&
        sketch.mouseX <= sketch.width &&
        sketch.mouseY >= 0 &&
        sketch.mouseY <= sketch.height
    );
}