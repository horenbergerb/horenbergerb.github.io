var treeSketch = function(sketch) {
    let treeData = null;
    let tree = {};
    let positions = {};
    let levels = {};
    let radius = 10;
    let selectedDescription = "";
    let draggedNode = null;

    sketch.preload = function() {
        // Load and parse the YAML file
        const yamlContent = sketch.loadStrings('/scripts/2024-11-26-world-building-tree/aldreon_world.yaml', result => {
          const yamlString = result.join('\n');
          treeData = jsyaml.load(yamlString);
        });
      };

      sketch.setup = function() {
        let canvas = sketch.createCanvas(500, 450);
        sketch.clear();
        canvas.parent('simple-example-holder');
    
        let root = treeData; // The top-level object is the root
        calculateLevels(root, 0); // Calculate levels of the nodes
        calculatePositions(root, 20, 3*(sketch.height / 4), 2*(sketch.height / 5)); // Assign positions
      
        drawTree(root); // Draw the tree
      };

      sketch.draw = function() {
        sketch.clear(); // Clear the canvas on each frame
        if (treeData) {
            drawTree(treeData);
        }

        // Display the selected node's description
        sketch.fill(0, 255);
        sketch.textSize(14);
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        sketch.text(selectedDescription, 10, 10, sketch.width - 20); // Wrap text
    };

    sketch.mousePressed = function() {
        // Check if a node was clicked
        for (let nodeName in positions) {
            let pos = positions[nodeName];
            if (sketch.dist(sketch.mouseX, sketch.mouseY, pos.x, pos.y) < radius) {
                // Find the node in the tree and get its description
                draggedNode = nodeName;
                const node = findNode(treeData, nodeName);
                if (node && node.description) {
                    selectedDescription = node.description;
                } else {
                    selectedDescription = "No description available.";
                }
                break;
            }
        }
    };
    
    sketch.mouseDragged = function () {
        if (draggedNode) {
            // Update the position of the dragged node
            positions[draggedNode] = { x: sketch.mouseX, y: sketch.mouseY };
        }
    };

    sketch.mouseReleased = function () {
        if (draggedNode) {
            draggedNode = null; // Stop dragging
        }
    };

    sketch.touchStarted = function(event) {
        if (isTouchNearNode()) {
            event.preventDefault(); // Prevent scrolling if within canvas
            sketch.mousePressed(); // Call the same logic as mousePressed
        }
    };
    
    sketch.touchMoved = function(event) {
        if (isTouchNearNode()) {
            event.preventDefault(); // Prevent scrolling if within canvas
            sketch.mouseDragged(); // Call the same logic as mousePressed
        }
    };

    function isTouchNearNode() {
        for (let nodeName in positions) {
            let pos = positions[nodeName];
            if (sketch.dist(sketch.mouseX, sketch.mouseY, pos.x, pos.y) < radius) {
                return true;
            }
        }
        return false;
    }

    function findNode(node, name) {
        if (node.name === name) {
            return node;
        }
        if (node.children) {
            for (let child of node.children) {
                const result = findNode(child, name);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

      function calculateLevels(node, level) {
        levels[node.name] = level; // Assign level to current node
        if (node.children) {
          for (let child of node.children) {
            calculateLevels(child, level + 1); // Recurse for child nodes
          }
        }
      }
      
      function calculatePositions(node, x, y, verticalSpacing) {
        positions[node.name] = { x: x, y: y }; // Assign position to current node
        if (node.children && node.children.length > 0) {
            let spacing = verticalSpacing / Math.max(1, node.children.length - 1);
            let startY = y - ((node.children.length - 1) * spacing) / 2;
    
            for (let i = 0; i < node.children.length; i++) {
                // Children are laid out to the right of the parent
                calculatePositions(node.children[i], x + 80, startY + i * spacing, verticalSpacing / 2);
            }
        }
    }
    

      function drawTree(node) {
        if (node.children) {
          for (let child of node.children) {
            let start = positions[node.name];
            let end = positions[child.name];
            sketch.stroke(0);
            sketch.line(start.x, start.y, end.x, end.y); // Draw edge
            drawTree(child); // Recurse for child nodes
          }
        }
    
        // Draw node
        let pos = positions[node.name];
        sketch.noStroke();
        sketch.fill(100, 200, 255);
        sketch.ellipse(pos.x, pos.y, radius * 2); // Draw circle

        // Check if the mouse is hovering over the node
        if (sketch.dist(sketch.mouseX, sketch.mouseY, pos.x, pos.y) < radius) {
            // Draw text only when hovering
            sketch.fill(0);
            sketch.textSize(12);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text(node.name, pos.x, pos.y - radius - 2); // Text above the node
        }
        else {
            // Draw text only when hovering
            sketch.fill(0);
            sketch.textSize(8);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text(node.name, pos.x, pos.y - radius - 2); // Text above the node
        }
      }
    };
  
  // Attach the sketch to a specific DOM element
  let myTreeSketch = new p5(treeSketch, 'simple-example-holder');
  