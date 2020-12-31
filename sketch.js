const { ipcRenderer } = require('electron').ipcRenderer;

let maxItersInput;
let coloringAlgInput;
let plottingAlgInput;
let realLowerInput;
let realUpperInput;
let complexLowerInput;
let complexUpperInput;

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
        let maxItersVal = int(maxItersInput.value);
        let coloringAlgVal = coloringAlgInput.value;
        let plottingAlgVal = plottingAlgInput.value;
        let realLowerLimit = float(realLowerInput.value);
        let realUppperLimit = float(realUpperInput.value);
        let complexLowerVal = float(complexLowerInput.value);
        let complexUpperVal = float(complexUpperInput.value);
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