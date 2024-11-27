window.onload = function () {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const container = document.getElementById('simple-example-holder');
  if (container) {
      container.appendChild(renderer.domElement);
  } else {
      console.error("Element with ID 'simple-example-holder' not found.");
      return;
  }

  const controls = new THREE_ADDONS.OrbitControls(camera, renderer.domElement);

  // Define the function f(x, y)
  function f(x, y) {
      return Math.sin(Math.sqrt(x * x + y * y)); // Example: radial sine wave
  }

  // Create vertices and indices
  const size = 50;
  const step = 0.2;
  const gridSize = Math.floor((2 * size) / step) + 1;

  const vertices = [];
  for (let i = 0; i < gridSize; i++) {
      const x = -size + i * step;
      for (let j = 0; j < gridSize; j++) {
          const y = -size + j * step;
          const z = f(x, y);
          vertices.push(x, y, z);
      }
  }

  const indices = [];
  for (let i = 0; i < gridSize - 1; i++) {
      for (let j = 0; j < gridSize - 1; j++) {
          const a = i * gridSize + j;
          const b = i * gridSize + (j + 1);
          const c = (i + 1) * gridSize + j;
          const d = (i + 1) * gridSize + (j + 1);
          indices.push(a, b, d); // Triangle 1
          indices.push(a, d, c); // Triangle 2
      }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
      color: 0x0077ff,
      side: THREE.DoubleSide,
  });
  const surface = new THREE.Mesh(geometry, material);
  scene.add(surface);

  // Add lights
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  camera.position.z = 60;

  // Raycaster and mouse vector
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  console.log("Surface position:", surface.position);
  console.log("Surface rotation:", surface.rotation);
  console.log("Surface scale:", surface.scale);

  renderer.domElement.addEventListener('click', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();

    // Calculate mouse coordinates relative to the canvas
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Set raycaster from the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the surface
    const intersects = raycaster.intersectObject(surface);
    if (intersects.length > 0) {
        const intersectPoint = intersects[0].point;

        // Create a red dot at the intersection point
        const dotGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        dot.position.copy(intersectPoint);
        scene.add(dot);

        // Start marching outward and draw a line
        marchAlongSurface(intersectPoint);
    }
});

function dist(x1, y1, z1, x2, y2, z2) {
  console.log(`Inputs: x1=${x1}, y1=${y1}, z1=${z1}, x2=${x2}, y2=${y2}, z2=${z2}`);
  const result = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1));
  console.log(`Output: ${result}`);
  return result;
}

// Function to march along the surface
function marchAlongSurface(startPoint) {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const lineGeometry = new THREE.BufferGeometry();
    const points = []; // Array to store the points of the line

    let distTraveled = 0.0;
    let targetDist = 10;

    let currentPoint = startPoint.clone();
    const stepSize = 1; // Step size for marching
    const numSteps = 100; // Total number of steps to march
    const direction = new THREE.Vector2(1, 0).normalize(); // Marching direction (e.g., outward along the x-axis)

    for (let i = 0; i < numSteps; i++) {
        // Add the current point to the line
        points.push(new THREE.Vector3(currentPoint.x, currentPoint.y, currentPoint.z));

        // Compute the next x and y based on the direction
        const nextX = currentPoint.x + stepSize * direction.x;
        const nextY = currentPoint.y + stepSize * direction.y;

        // Evaluate z using the surface function f(x, y)
        const nextZ = f(nextX, nextY);

        distTraveled += dist(currentPoint.x, currentPoint.y, currentPoint.z, nextX, nextY, nextZ);

        // Update the current point
        currentPoint.set(nextX, nextY, nextZ);

        // Stop marching if the point goes out of bounds
        if (distTraveled >= targetDist|| Math.abs(nextX) > size || Math.abs(nextY) > size) {
            break;
        }
    }

    // Convert the points array into a geometry
    lineGeometry.setFromPoints(points);

    // Create the line and add it to the scene
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
}


  // Animation loop
  function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
  }
  animate();
};
