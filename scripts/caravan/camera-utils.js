
/*
Handles pinch zooming
*/

export function updateZoomMouse(sketch, camera, delta) {
    let zoomAmount = 0.1; // Adjust the sensitivity of zoom
    let newZoom = camera.zoom + (delta > 0 ? -zoomAmount : zoomAmount);

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
}

export function updateZoomTouch(sketch, camera, touch1, touch2, currentDist) {
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

export function panCamera(sketch, camera) {
    camera.panX = sketch.mouseX - camera.dragStart.x;
    camera.panY = sketch.mouseY - camera.dragStart.y;
}

export function updateDragStart(sketch, camera) {
    camera.dragStart.x = sketch.mouseX - camera.panX;
    camera.dragStart.y = sketch.mouseY - camera.panY;
}

export function updateMouseStart(sketch, camera) {
    camera.mouseStart.x = sketch.mouseX;
    camera.mouseStart.y = sketch.mouseY;
}

export function setAutoCameraToHome(sketch, autoCamera) {
    autoCamera.rawTargetPanX = sketch.width / 2;
    autoCamera.rawTargetPanY = sketch.height / 2;
    autoCamera.targetZoom = 0.8;
    autoCamera.isAutoPanning = true;
}

export function setAutoCamera(autoCamera, rawTargetPanX, rawTargetPanY, targetZoom) {
    autoCamera.rawTargetPanX = rawTargetPanX;
    autoCamera.rawTargetPanY = rawTargetPanY;
    autoCamera.targetZoom = targetZoom;
    autoCamera.isAutoPanning = true;
}

export function handleAutoCamera(sketch, camera, autoCamera) {
    // Smoothly interpolate panX and panY towards targetPanX and targetPanY
    if (autoCamera.isAutoPanning) {
        let targetPanX = sketch.width / 2 - autoCamera.rawTargetPanX * camera.zoom;
        let targetPanY = sketch.height / 2 - autoCamera.rawTargetPanY * camera.zoom;

        let lerpFactor = 0.1; // Adjust for smoothness (0.1 = slow, 1 = immediate)
        camera.panX = sketch.lerp(camera.panX, targetPanX, lerpFactor);
        camera.panY = sketch.lerp(camera.panY, targetPanY, lerpFactor);
        camera.zoom = sketch.lerp(camera.zoom, autoCamera.targetZoom, lerpFactor);

        // Stop panning if close to the target
        if (Math.abs(camera.panX - targetPanX) < 1 && Math.abs(camera.panY - targetPanY) < 1) {
            autoCamera.isAutoPanning = false;
        }
    }
}