"use strict";

/******************************************************************************
Where's Sausage Dog Plus
Modified by Yichen Wang

An algorithmic version of a Where's Wally/Waldo searching game where you
need to click on the sausage dog you're searching for in amongst all
the visual noise of other animals.

Animal images from:
https://creativenerds.co.uk/freebies/80-free-wildlife-icons-the-best-ever-animal-icon-set/
******************************************************************************/

// Position and image of the sausage dog we're searching for
let targetX;
let targetY;
let targetImage;

// move position variables for dog
let moveX;
let moveY;
let speed = 25; // speed
let v = speed; // velocity
// possibility
let p;

// the image size
let size = 125;
// The ten decoy images
let decoyImage1;
let decoyImage2;
let decoyImage3;
let decoyImage4;
let decoyImage5;
let decoyImage6;
let decoyImage7;
let decoyImage8;
let decoyImage9;
let decoyImage10;

// The number of decoys to show on the screen, randomly
// chosen from the decoy images
let numDecoys = 100;

// allow player to start from main menu
let gameStart = false;

// variable for setting up animals once
let runOnce = true;

// Keep track of whether they've won
let gameOver = false;

let dogRuns = false;

// count for dog found
let dogFound = 0;

// colors
let DARK_BLUE = "#2b3f4f";
let GREEN = "#8effbd";
let RED = "#ff7474";

// preload()
//
// Loads the target and decoy images before the program starts
function preload() {
  targetImage = loadImage("assets/images/animals-target.png");

  decoyImage1 = loadImage("assets/images/animals-01.png");
  decoyImage2 = loadImage("assets/images/animals-02.png");
  decoyImage3 = loadImage("assets/images/animals-03.png");
  decoyImage4 = loadImage("assets/images/animals-04.png");
  decoyImage5 = loadImage("assets/images/animals-05.png");
  decoyImage6 = loadImage("assets/images/animals-06.png");
  decoyImage7 = loadImage("assets/images/animals-07.png");
  decoyImage8 = loadImage("assets/images/animals-08.png");
  decoyImage9 = loadImage("assets/images/animals-09.png");
  decoyImage10 = loadImage("assets/images/animals-10.png");
}

// setup()
//
// Creates the canvas, sets basic modes, draws correct number
// of decoys in random positions, then the target
function setup() {
  createCanvas(windowWidth,windowHeight);
  background(GREEN);
  imageMode(CENTER);

  // Main menu
  textFont("Futura");
  textAlign(CENTER,CENTER);
  textStyle(BOLD);
  fill(RED);
  textSize(40);
  text("WHERE'S SAUSAGE DOG?",width/2,height/2-80); // Title
  fill(DARK_BLUE);
  textSize(32);
  textStyle(BOLD);
  text("PLAY",width/2,height/2); // easy button
  textSize(20);
  textStyle(ITALIC);
  text("Find and click the sausage dog!",width/2,height/2+80);
  image(targetImage,width/2,height/2+150,size,size);
}

// draw()
//
// Displays the game over screen if the player has won,
// otherwise nothing (all the gameplay stuff is in mousePressed())
function draw() {
  // check play button
  check_MainMenu_Buttons();
  // if a game is over
  if (gameOver) {
    background(GREEN);
    // Draw a circle around the sausage dog to show where it is (even though
    // they already know because they found it!)
    noFill();
    stroke(random(135,255),random(135,255),random(135,255));
    strokeWeight(10);
    ellipse(targetX,targetY,size,size);

    // Prepare our typography
    textSize(128);
    textAlign(CENTER,CENTER);
    noStroke();

    // Tell them they won!
    fill(RED);
    text("YOU WON!",width/2,height/2);
    fill(255);
    textSize(32);
    // continue button
    text("CONTINUE",width/2+200,37.5);

    // move the dog!
    dogRunsOff();

    // check continue button
    check_Continue_Button();
    }else{
    // reset the game graphics
    if (gameStart && runOnce){
      setup_Animals();
      runOnce = false;
      setup_Stats();
    }
  }
}

// mousePressed()
//
// Checks if the player clicked on the target and if so tells them they won
function mousePressed() {
  // The mouse was clicked!
  // Check if the cursor is in the x range of the target
  // (We're subtracting the image's width/2 because we're using imageMode(CENTER) -
  // the key is we want to determine the left and right edges of the image.)
  if (mouseX > targetX - size/2 && mouseX < targetX + size/2) {
    // Check if the cursor is also in the y range of the target
    // i.e. check if it's within the top and bottom of the image
    if (mouseY > targetY - size/2 && mouseY < targetY + size/2) {
      gameOver = true;
      // clear all the animals except the dog
      background(GREEN);
      setup_Stats();
      image(targetImage,targetX,targetY,size,size);
      // allow the dog to move
      dogRuns = true;
    }
  }
}

// Checking play button
function check_MainMenu_Buttons(){
  // if the mouse is hovering
  if (dist(mouseX,mouseY,width/2,height/2) < 25 && !gameStart){
    textAlign(CENTER,CENTER);
    fill(255);
    textSize(32);
    text("PLAY",width/2,height/2); // play button
    // If the mouse is pressed, the game will start
    if (mouseIsPressed){
      gameStart = true;
      setup_Animals();
      runOnce=false;
      setup_Stats();
    }
  // when the mouse is not hovering any buttons, the buttons go back to normal
  }else{
    if (!gameStart){
      textStyle(BOLD);
      fill(DARK_BLUE);
      textSize(32);
      text("PLAY",width/2,height/2); // play button
    }
  }
}

// checking continue button
// reset the game
function check_Continue_Button(){
  textAlign(CENTER,CENTER);
  // if mouth is hovering
  if (dist(mouseX,mouseY,width/2+200,37.5) < 25 && gameOver){
    fill(DARK_BLUE);
    textSize(32);
    text("CONTINUE",width/2+200,37.5);
    // If the mouse is pressed, the game will reset and continue
    if (mouseIsPressed){
      gameOver = false;
      gameStart = true;
      runOnce = true;

      //add the count
      dogFound++;
      // every 10 points is reached, decoy images will be added 50 more until after reaching 50 points
      if (dogFound%10==0 && dogFound>0 && dogFound<=50){
        numDecoys += 50;
        console.log("Number of dog found: "+dogFound+"\nNumber of decoys: "+numDecoys+"\nSize: "+size);
      }
      // after reaching 40 points, images will not be shrunk
      if (dogFound<40){
        size -= 2;
      }
    }
  // if the mouth is not hovering, it will go back to normal
  }else{
    if (gameOver){
      fill(255);
      textSize(32);
      text("CONTINUE",width/2+200,37.5);
    }
  }
}

// Draw the top stats
function setup_Stats(){
  // improved UI containing the target image and success count
  noStroke();
  fill(RED);
  rect(0,0,width,75);
  textStyle(BOLD);
  textAlign(LEFT,CENTER);
  textSize(32);
  fill(255);
  text(dogFound,width*0.94,37.5); // the number of found dog
  textSize(32);
  fill(255);
  text("WHERE IS THE SAUSAGE DOG?",25,37.5); // quest
  image(targetImage,width*0.90,40,100,100); // sample image
}

// Draw all the animals
function setup_Animals(){
  // it only runs once
  if (runOnce){
    background(GREEN);
    // Use a for loop to draw as many decoys as we need
    for (let i = 0; i < numDecoys; i++) {
      // Choose a random location on the canvas for this decoy
      let x = random(0,width);
      let y = random(90,height);
      // Generate a random number we can use for probability
      let r = random();
      // Use the random number to display one of the ten decoy
      // images, each with a 10% chance of being shown
      // We'll talk more about this nice quality of random soon enough.
      // But basically each "if" and "else if" has a 10% chance of being true
      if (r < 0.1) {
        image(decoyImage1,x,y,size,size);
      }
      else if (r < 0.2) {
        image(decoyImage2,x,y,size,size);
      }
      else if (r < 0.3) {
        image(decoyImage3,x,y,size,size);
      }
      else if (r < 0.4) {
        image(decoyImage4,x,y,size,size);
      }
      else if (r < 0.5) {
        image(decoyImage5,x,y,size,size);
      }
      else if (r < 0.6) {
        image(decoyImage6,x,y,size,size);
      }
      else if (r < 0.7) {
        image(decoyImage7,x,y,size,size);
      }
      else if (r < 0.8) {
        image(decoyImage8,x,y,size,size);
      }
      else if (r < 0.9) {
        image(decoyImage9,x,y,size,size);
      }
      else if (r < 1.0) {
        image(decoyImage10,x,y,size,size);
      }
    }

    // Once we've displayed all decoys, we choose a random location for the target
    targetX = random(0,width);
    targetY = random(100,height);

    // let the dog move without moving the cirle
    moveX = targetX;
    moveY = targetY;

    p = random(0,1); // decide possibility

    // And draw it (because it's the last thing drawn, it will always be on top)
    image(targetImage,targetX,targetY,size,size);
  }
}

// move the dog across the screen in randomly chosen 1 out of 4 directions
function dogRunsOff(){
  if (dogRuns){
    setup_Stats();
    // decide a movement direction
    if (p<0.25 && p>=0){
      moveX += v;
    }else if (p<0.5 && p>=0.25){
      moveX -= v;
    }else if (p<0.75 && p>=0.5){
      moveY += v;
    }else if (p<1 && p>= 0.75){
      moveY -= v;
    }
    // move the dog!
    image(targetImage,moveX,moveY,size,size);
  }
}
