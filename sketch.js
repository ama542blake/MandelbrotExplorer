const { ipcRenderer } = require('electron').ipcRenderer;

let maxItersInput;
let maxItersVal;
let coloringAlgInput;
let coloringAlgVal;
let plottingAlgInput;
let plottingAlgVal;
let realLowerInput;
let realLowerVal;
let realUpperInput;
let realUpperVal;
let complexLowerInput;
let complexLowerVal;
let complexUpperInput;
let complexUpperVal;

let canvasHolder;

function setup() {
    // TODO: allow user to input desired size
    var canvas = createCanvas(500, 500);
    
    // Move the canvas so it's inside our <div id="canvas-holder">.
    canvas.parent('canvas-holder');
    
    background(255, 0, 20);

    // delay drawing until button is pushed
    noLoop();
}

function draw() {
    if (canvasHolder && !canvasHolder.hidden) {
        // retrieve all necessary parameters
        maxItersVal = int(maxItersInput.value);
        coloringAlgVal = coloringAlgInput.value;
        plottingAlgVal = plottingAlgInput.value;
        realLowerLimit = float(realLowerInput.value);
        realUppperLimit = float(realUpperInput.value);
        complexLowerVal = float(complexLowerInput.value);
        complexUpperVal = float(complexUpperInput.value);
    }
    

    // we are done drawing
    noLoop();
}

document.addEventListener("DOMContentLoaded", function() {
    // get references to all inputs
    maxItersInput = document.getElementById('max-iters');
    coloringAlgInput = document.getElementById('coloring-algorithm');
    plottingAlgInput = document.getElementById('plotting-algorithm');
    realLowerInput = document.getElementById('real-lower-limit');
    realUpperInput = document.getElementById('real-upper-limit');
    complexLowerInput = document.getElementById('complex-lower-limit');
    complexUpperInput = document.getElementById('complex-upper-limit');

    // draw button is clicked
    document.getElementById('draw-btn').addEventListener('click', () => {
        canvasHolder = document.getElementById('canvas-holder');
        canvasHolder.hidden = false;

        loop(); // now perform the drawing
    });
});

class Complex {
    constructor(re, im) {
        this.re = re;
        this.im = im;
    }

    // adds two complex numbers
    add(other) {
        return new Complex(this.re + other.re, this.im + other.im);
    }

    // multipies two complex numbers
    mult(other) {
        // calculate the resulting read and imaginary components separately
        new_re = (this.re * other.re) + (-(this.im, other.im));
        new_im = (this.re * other.im) + (this.im * other.re);
        return new Complex(new_re, new_im);
    }

    // creates string representation of complex number
    toString() {
        var str = string(this.re);
        if (this.im < 0) {
            str = str + " - " + string(-this.im);  // mult by -1 to prevent printing double neg
        } else {
            str = str + " + " + string(this.im);
        }
        str += "i";
        
        return str;
    }

    // calculates the length (modulus) of a complex number
    modulus() {
        return Math.sqrt(Math.pow(this.re, 2), Math.pow(this.im, 2));
    }
}

// compute the number of iterations for a point (param c) to diverge
// z^2 + c
function mandelbrot(c) {
    let z = new Complex(0, 0);
    let iterCount = 0;

    while (iterCount < maxItersVal) {
        if (z.modulus < 2) {
            // continue caclulating
            z = c.add(z.multiply(z));
            iterCount++;
        } else {
            // point has escaped the set when |z| >= 2
            return iter_count;
        }
        return iter_count  // == MAX_ITERS when point is in Mandelbrot set
    }
}

// map density to a color based on given list of control points
function buildRandomLinearCmap(densities, controlPoints) {
    // maps density value to RGB color components
    cmap = new Map(); 
    // refers to the intervals between the control points
    numSubIntervals = controlPoints.length - 1;
    // defines the span of densities which fall in to a given subinterval
    subIntervalSize = 1.0 / numSubIntervals;
    
    // perform linear interpolation to find a color for each density in densities
    for (i = 0; i < densities.length; i++) {
        // find which subinterval the density falls in to, and where it is within the interval
        // upper/lower bounds indices are found to index in to the controlPoints list
        let intervalLowerBound = Math.floor(densities[i] / subIntervalSize);
        if (intervalLowerBound == numSubIntervals) intervalLowerBound--;  // edge case
        let intervalUpperBound = intervalLowerBound + 1;
        let intervalDepth = densities[i] - (intervalLowerBound * subIntervalSize);
        
        // find the new color
        let lowerColor = controlPoints[intervalLowerBound];
        let upperColor = controlPoints[intervalUpperBound];
        let newColor = []
        for (j = 0; j < 3; j++) {
            // perform linear interpretation
            newColor[j] = lowerColor[j] + ((upperColor[j] - lowerColor[j]) * intervalDepth);
        }
        
        cmap[densities[i]] = newColor;
    }
}