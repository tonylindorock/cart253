// Exercise 1 - Movement
// Yichen Wang
//
// Starter code for exercise 1.
// Draws a moving square and circle that intersect
// in the middle of the canvas.

// The current position and size of the circle
let circleX;
let circleY;
let circleSize = 100;

// The current position and size of the square
let squareX;
let squareY;
let squareSize = 100;

// The x position of the shape
let posX = 0;

// The position of the circle
let positionX = 0;
let positionY = 320;

// preload()
//
// Nothing here

function preload() {

}


// setup()
//
// Set up the canvas, position the images, set the image mode.

function setup() {
  // Create our canvas
  createCanvas(640,640);

  // Start the circle off screen to the bottom left
  // We divide the size by two because we're drawing from the center
  circleX = -circleSize/2;
  circleY = height + circleSize/2;

  // Start the square off screen to the bottom right
  // We divide the size by two because we're drawing from the center
  squareX = width + squareSize/2;
  squareY = height + squareSize/2;

  // We'll draw rectangles from the center
  rectMode(CENTER);
  // We won't have a stroke in this
  noStroke();
}


// draw()
//
// Change the circle and square's positions so they move
// Draw the circle and square on screen

function draw() {
  // We don't fill the background so we get a drawing effect

  // Move circle up and to the right
  circleX += 1;
  circleY -= 1;
  // Make the circle transparent red
  fill(255,0,0,10);
  // Display the circle
  ellipse(circleX,circleY,circleSize,circleSize);

  // Move square up and to the left
  squareX -= 1;
  squareY -= 1;
  // Make the square transparent blue
  fill(0,0,255,10);
  // Display the square
  rect(squareX,squareY,squareSize,squareSize);

  // draws a black circle per frame from left to right
  background(255);
  fill(0); // black
  ellipse(posX,320,75);
  posX += 4; // the speed is 4

  // adds a sqaure follows the mouse
  fill(120); // grey
  rect(mouseX,mouseY,75,75);

  // adds a shaking square follows the opposite direction of the mouse
  fill(100,100,180); // purple
  rect(640-(mouseX+random(50)),640-mouseY+random(50),75,75);

  // adds a yellow circle that moves "according" to a sine wave
  fill(255,216,110); // yellow
  ellipse(positionX,positionY,50);
  // to move like a sine wave, kinda of
  if ((positionX/60)%2==1){
    positionY+=30;
  }else if ((positionX/60)%2==0) {
    positionY-=30;
  }
  positionX+=2;
}
