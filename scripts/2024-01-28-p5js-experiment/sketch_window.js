

var s1 = function( sketch ) {
    function buttonPressed() {
      sketch.clear()
      sketch.line(0, 0, 399, 0)
      sketch.line(0, 0, 0, 399)
      sketch.line(0, 399, 399, 399)
      sketch.line(399, 0, 399, 399)
    }

    sketch.setup = function() {
      let canvas1 = sketch.createCanvas(400, 400);
      canvas1.parent('simple-sketch-holder');
      sketch.line(0, 0, 399, 0)
      sketch.line(0, 0, 0, 399)
      sketch.line(0, 399, 399, 399)
      sketch.line(399, 0, 399, 399)

      let button = sketch.createButton("Reset")
      button.parent('simple-sketch-holder');
      button.position(200 - (button.size().width / 2), 400, 'relative')
      button.mousePressed(buttonPressed)

    }
  
    sketch.draw = function() {
      if (sketch.mouseIsPressed) {
        sketch.line(sketch.mouseX, sketch.mouseY, sketch.pmouseX, sketch.pmouseY);
      }
    } 
  };
  
  // create a new instance of p5 and pass in the function for sketch 1
  new p5(s1);