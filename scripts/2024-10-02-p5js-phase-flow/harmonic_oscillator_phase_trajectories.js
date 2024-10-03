let particles = [];
let k = 0.1; // Spring constant
let dt = 0.1; // Time step

var s1 = function( sketch ) {
  sketch.setup = function() {
    let canvas = sketch.createCanvas(600, 600);
    canvas.parent('simple-sketch-holder-1');
    
    // Initialize particles with random positions and velocities
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: sketch.random(-sketch.width/4, sketch.width/4),
        v: sketch.random(-3, 3)
      });
    }
  }

  sketch.draw = function() {
    sketch.background(240);
    
    // Translate to center of canvas
    sketch.translate(sketch.width/2, sketch.height/2);
    
    // Draw axes
    sketch.stroke(0);
    sketch.line(-sketch.width/2, 0, sketch.width/2, 0);
    sketch.line(0, -sketch.height/2, 0, sketch.height/2);
    
    // Label axes
    sketch.textAlign(sketch.CENTER);
    sketch.text("Position (x)", 0, sketch.height/2 - 20);
    sketch.push();
    sketch.rotate(-sketch.PI/2);
    sketch.text("Velocity (v)", 0, -sketch.width/2 + 20);
    sketch.pop();
      
    // Update and draw particles
    sketch.noStroke();
    sketch.fill(0, 100, 200);
    for (let p of particles) {
      // Update position and velocity
      let a = -k * p.x; // Acceleration (F = ma, where m = 1)
      p.v += a * dt;
      p.x += p.v * dt;
      
      // Draw particle
      sketch.ellipse(p.x, -p.v, 4, 4);
    }
  }
};  
  // create a new instance of p5 and pass in the function for sketch 1
  new p5(s1);