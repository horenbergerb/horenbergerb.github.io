function calculateQuadrilateralArea(points) {
  // Use the shoelace formula (also known as surveyor's formula)
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    let j = (i + 1) % points.length;
    area += points[i].x * points[j].v;
    area -= points[j].x * points[i].v;
  }
  return Math.abs(area / 2);
}

function calculateDistance(points) {
  x = (points[0].x - points[1].x)
  x_square = x*x
  v = (points[0].v - points[1].v)
  v_square = v*v
  return Math.sqrt(x_square + v_square)
}

var s2 = function( sketch ) {
  let particles = [];
  let corners = [];
  let k = 0.1; // Spring constant
  let dt = 0.05; // Time step
  sketch.setup = function() {
    let canvas = sketch.createCanvas(600, 600);
    canvas.parent('simple-sketch-holder-2');
    
    // Initialize particles in a rectangular grid
    let num_samples = 20;
    let x_min = -sketch.width/4;
    let v_min = -3;
    let x_step = 2;
    let v_step = 2;
    for (let i = 0; i < num_samples; i++) {
      for(let j = 0; j < num_samples; j++){
        particles.push({
          x: x_min + x_step * i,
          v: v_min + v_step * j
        });
      };
    };
    corners = [0, num_samples-1, num_samples*num_samples-1, (num_samples-1)*num_samples];
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
    for (let [index, p] of particles.entries()) {
      // Update position and velocity
      let a = -k * p.x; // Acceleration (F = ma, where m = 1)
      p.v += a * dt;
      p.x += p.v * dt;
      
      if (corners.includes(index)){
        sketch.fill(200, 100, 0);
        sketch.ellipse(p.x, -p.v, 8, 8);
      }
      else{
        sketch.fill(0, 100, 200);
        sketch.ellipse(p.x, -p.v, 3, 3);
      }
    }

    sketch.stroke(0);
    let area = calculateQuadrilateralArea([particles[corners[0]], particles[corners[1]], particles[corners[2]], particles[corners[3]]])

    sketch.text("Width: " + calculateDistance([particles[corners[0]],particles[corners[1]]]).toFixed(3).toString(), 0, sketch.height/3 - 50);
    sketch.text("Height: " + calculateDistance([particles[corners[1]],particles[corners[2]]]).toFixed(3).toString(), 0, sketch.height/3 - 30);
    sketch.text("Area: " + area.toFixed(3).toString(), 0, sketch.height/3 - 10);

  }
};  
  // create a new instance of p5 and pass in the function for sketch 1
  new p5(s2);