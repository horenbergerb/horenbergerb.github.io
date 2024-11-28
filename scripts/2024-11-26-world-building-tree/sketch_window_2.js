var treeSketch = function(sketch) {
    let treeData = null;
    let tree = {};
    let positions = {};
    let levels = {};
    let radius = 10;
    let selectedDescription = "";
    let draggedNode = null;

    let descriptionDiv;

    sketch.preload = function() {
        // Load and parse the YAML file
        const yamlContent = sketch.loadStrings('/scripts/2024-11-26-world-building-tree/vesper_world.yaml', result => {
          const yamlString = result.join('\n');
          treeData = jsyaml.load(yamlString);
        });
      };

      sketch.setup = function() {
        let canvas = sketch.createCanvas(500, 650);
        sketch.clear();
        canvas.parent('simple-example-holder-2');
    
        descriptionDiv = sketch.createDiv('');
        descriptionDiv.position(10, 10); // Place it above the canvas
        descriptionDiv.style('font-size', '14px');
        descriptionDiv.style('color', '#000');
        descriptionDiv.style('background-color', 'rgba(255, 255, 255, 0.8)');
        descriptionDiv.style('padding', '10px');
        descriptionDiv.style('border', '1px solid #ccc');
        descriptionDiv.style('max-width', '1180px');
        descriptionDiv.style('overflow-wrap', 'break-word');

        let closeButton = sketch.createButton('x');
        closeButton.parent(descriptionDiv); // Attach it to the description div
        closeButton.style('float', 'right');
        closeButton.style('background', 'none');
        closeButton.style('border', 'none');
        closeButton.style('font-size', '16px');
        closeButton.style('cursor', 'pointer');
        closeButton.style('color', '#000');

        let descriptionText = sketch.createDiv(`<b>${treeData.name}:</b> ${treeData.description}`);
        descriptionText.parent(descriptionDiv);
        descriptionText.id('description-text-2'); // Assign an ID for easy selection
    
        closeButton.mousePressed(() => {
            descriptionDiv.hide(); // Hide the div when the button is clicked
        });

        let root = treeData; // The top-level object is the root
        calculateLevels(root, 0); // Calculate levels of the nodes
        calculatePositions(root, 20, 2*(sketch.height / 3), 1*(sketch.height / 3)); // Assign positions
      
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
            const node = findNode(treeData, draggedNode);
            let descriptionText = sketch.select('#description-text-2');
            if (node && node.description) {
                descriptionText.html(`<b>${node.name}:</b> ${node.description}`);
            } else {
                descriptionText.html(`<b>${nodeName}:</b> No description available.`);
            }
            descriptionDiv.show();
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
                calculatePositions(node.children[i], x + 100, startY + i * spacing, verticalSpacing / 2);
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
  let myTreeSketch2 = new p5(treeSketch, 'simple-example-holder-2');
  
