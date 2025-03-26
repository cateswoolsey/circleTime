//Cate Woolsey
//Project01

let ripples = [];

//track previous time variables (for when time changes)
let lastSecond = -1;
let lastMinute = -1;
let lastHour = -1;

//array of hue ranges (6 colors of rainbow)
//exclude violet to use 6 colors (to show a minute went by after cycle through rainbow)
let rainbowCycle = [
  [0, 13],  //red 
  [18, 42],  //orange
  [48, 72],  //yellow
  [78, 162], //green
  [168, 237], //blue
  [243, 267]  //purple
];
let currentHue = rainbowCycle[0]; //begin with red

function setup() {
  createCanvas(800, 400); //canvas = size of computer screen
  colorMode(HSB, 360, 100, 100, 255); //HSB mode
  noFill();
  strokeWeight(3);
}

function draw() {
  background(0, 0, 0); //black background

  //track time using seconds/hours
  let currentSecond = second();
  let currentHour = hour();


//   //console log to track hour
//   if (currentHour !== lastHour) {
//     console.log("Current Hour: " + currentHour);  // Log the current hour to the console
//     lastHour = currentHour;
//   }


  //scale radius based on current hour
  let minSize = .5; //min ripple size
  let maxSize = 1.7; //max ripple size

  //size starts at minSize + difference between two ripple sizes * how far into day it is (hourly)
  let hourScale = minSize + (maxSize - minSize) * (currentHour / 24);  //size change is preportional


  //color based on seconds (every 10 seconds ripples change hue)
  let ten_hue = floor(currentSecond / 10) % rainbowCycle.length;  //change every 10 seconds
  currentHue = rainbowCycle[ten_hue];  

  //create new ripple every second
  if (currentSecond !== lastSecond) {

    //randomly generated x and y coordinates
    //width/height of canvs (using -50 for padding)
    let x = random(width - 50);
    let y = random(height - 50);

    //within current color range, randomize which hue is used
    let randomHue = random(currentHue[0], currentHue[1]);
    
    //randomize saturation
    let randomSaturation = random(40, 100); 

    //randomize brightness
    let randomBrightness = random(50, 100); 

    //create new ripple object and pushes it to ripples array
    //passes coordinates and randomzied hue/saturaiton/brightness/scale as parameters
    ripples.push(new Ripple(x, y, randomHue, randomSaturation, randomBrightness, hourScale)); 

    //console.log("Current Second: " + currentSecond + ", Random Hue: " + randomHue);

    lastSecond = currentSecond; //update previous second
  }

  //iterates over all ripples from the end of array to beginning
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update(); //for current ripple, call update() -- defined below
    ripples[i].display(); //for current ripple, call display() -- defined blow

    if (ripples[i].isGone()) { //if current ripple is not there (disappeared), .isGone() returns boolean
      ripples.splice(i, 1); //remove ripple from ripples array
    }
  }
}

class Ripple {
//initialization of ripple class 
  constructor(x, y, hueValue, saturationValue, brightnessValue, scaleFactor) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.opacity = 255;
    this.speed = .5;  
    this.glowIntensity = 100;
    this.hue = hueValue;  
    this.saturation = saturationValue; 
    this.brightness = brightnessValue; 
    this.scaleFactor = scaleFactor; 
  }

  //update helper function
  //responsible for fade/expansion effect of ripple
  update() {
    this.radius += this.speed * this.scaleFactor; //increase the ripple's radius 
    this.opacity -= 0.8;  //reduces opacity by 0.8
    this.glowIntensity -= 0.6; //reduces glow by 0.6
  }

  //display helper function
  //responsible for glow effect and surrounding ellipses/rings
  display() {
    //layering several ellipses and decrease opacity
    for (let glow = 30; glow > 0; glow--) { //for loop, 30 iterations

      let glowOpacity = this.opacity / (glow * 1); //outer ellipses appear fainter than inner ones, reduce opacity
      let glowRadius = this.radius + glow * 10; //outer ellipses drawn before inner ones, reduce radius until reaching standard radius

      stroke(this.hue, this.saturation, this.brightness, glowOpacity); 
      ellipse(this.x, this.y, glowRadius * 2); //create ripples, *2 gives diameter
    }

    //create main ellipse
    stroke(this.hue, this.saturation, this.brightness, this.opacity);
    ellipse(this.x, this.y, this.radius * 2); //create ripple, *2 gives diameter
  }

  //isGone helper function
  //to determine if ripple has completely faded
  //to determine if ripple is too big for canvas
  isGone() {
    return this.opacity <= 0 || this.radius > min(width, height); 
  }
}
