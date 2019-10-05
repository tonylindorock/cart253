"use strict";

/******************************************************

Game - The Cheser
Yichen Wang

A "simple" game of mouse and cheese. The player is a mouse and can move with keys,
if they overlap the (randomly moving) cheese they "eat it" by sucking out its life
and adding it to their own. The player "dies" slowly over time so they have to keep
eating to stay alive. The player also need to avoid eating poisoned cheese because
them make the mouse sick and die faster.

Includes: Physics-based movement, keyboard controls, health/stamina,
random movement, screen wrap.

Font downloaded from https://www.wfonts.com/font/futura
******************************************************/

// Player position, size, velocity
let playerX;
let playerY;
let playerRadius = 25;
let playerVX = 0;
let playerVY = 0;
let playerMaxSpeed = 4;
let speedUp = 2;
// Player health
let playerHealth;
let playerMaxHealth = 255; // default 255

// if the player can sprint
let sprintable = true;

// possibility
let p;
// Prey position, size, velocity
let preyX;
let preyY;
let preyRadius = 25;
let preySpeedUp = 1;
// Prey health
let preyHealth;
let preyMaxHealth = 100;

// for noise()
let tx;
let ty;

// poisoned cheese pos & velocity
let pCheeseX;
let pCheeseY;
let pCheeseVX;
let pCheeseVY;
let pCheeseSpeed = 5;

// Amount of health obtained per frame of "eating" (overlapping) the prey
let eatHealth = 10;
// Number of prey eaten during the game (the "score")
let preyEaten = 0;

// Track whether the game is over
let gameOver = false;
// whether the game is started
let gameStart = false;

// BG color
let ORANGE = "#efbb3f";
let BLUE = "#5bb9c4";
let RED = "#ef3f3f";

// custom font variable
let Futura_Heavy;

// images
let cheeseImage0;
let cheeseImage1;
let cheeseImage2;
let cheesePImage0;
let cheesePImage1;
let cheesePImage2;
let mouseImage;

function preload(){
  // font downloaded from https://www.wfonts.com/font/futura
  Futura_Heavy = loadFont("assets/futura heavy font.ttf");

  // load images for the cheese and mouse
  cheeseImage0 = loadImage("assets/images/Cheese0.png");
  cheeseImage1 = loadImage("assets/images/Cheese1.png");
  cheeseImage2 = loadImage("assets/images/Cheese2.png");
  cheesePImage0 = loadImage("assets/images/CheeseP0.png");
  cheesePImage1 = loadImage("assets/images/CheeseP1.png");
  cheesePImage2 = loadImage("assets/images/CheeseP2.png");

  mouseImage = loadImage("assets/images/Mouse.png")
}
// setup()
//
// Sets up the basic elements of the game
function setup() {
  rectMode(CORNER);
  imageMode(CENTER);
  // choose font
  textFont(Futura_Heavy);
  createCanvas(windowWidth,windowHeight);
  background(ORANGE);

  // set up the main menu
  setupMainMenu();

  noStroke();
}

// everything for setting up the main menu
// including the title, start button, and the rule
function setupMainMenu(){
  image(cheeseImage0,width/2-424,height/2-164,150,150);
  image(cheeseImage1,width/2-296,height/2-164,150,150);
  image(cheeseImage2,width/2-168,height/2-164,150,150);
  image(mouseImage,width/2,height/2-164,150,150);
  image(cheesePImage2,width/2+168,height/2-164,150,150);
  image(cheesePImage1,width/2+296,height/2-164,150,150);
  image(cheesePImage0,width/2+424,height/2-164,150,150);
  textAlign(CENTER,CENTER);
  fill(0);// black
  textSize(84);
  text("?",width/2,height/2-272);
  fill(255); // white
  // title
  textSize(128);
  text("THE CHESER",width/2,height/2-64);
  // start button
  textSize(64);
  text("START",width/2,height/2+64);
  // rule
  textSize(20);
  fill(0);
  let rule = "You have to 'chese' & eat the running cheese to survive!\nAnd avoid the poisoned ones because humans are evil!\n\nControls: WASD or ARROWKEYS"
  text(rule,width/2,height/2+172);
}

// handle the start button behaviour
function check_MainMenu_Button(){
  // determine if the mouse is hovering the button
  let startIsHovering = (dist(mouseX,mouseY,width/2-32,height/2+64) < 50 ||
  dist(mouseX,mouseY,width/2+32,height/2+64) < 50 ||
  dist(mouseX,mouseY,width/2,height/2+64) < 25)

  // if the mouse is hovering, the text will change color
  if (startIsHovering && !gameStart){
    textSize(64);
    fill(0);
    text("START",width/2,height/2+64);
    // when the mouse is pressed on the button, the game will start
    if (mouseIsPressed){
      gameStart = true;
      // We're using simple functions to separate code out
      setupPrey();
      setupPlayer();
    }
  // if the mouse is not hovering, the button goes back to normal
  }else{
    fill(255);
    textSize(64);
    text("START",width/2,height/2+64);
  }
}

// setupPrey()
//
// Initialises prey's position, and health
function setupPrey() {
  tx = random(0,1000);
  ty = random(0,1000);
  preyX = random(0,width);
  preyY = random(0,height);

  preyHealth = preyMaxHealth;

  p = random(0,1);
}

function setup_PoisonedCheese(){
  pCheeseX = random();
  pCheeseY = random();
  pCheeseVX = -pCheeseSpeed;
  pCheeseVY = pCheeseSpeed;

  p = random(0,1);
}

// setupPlayer()
//
// Initialises player position and health
function setupPlayer() {
  playerX = 4*width/5;
  playerY = height/2;
  playerHealth = playerMaxHealth;
}

// draw()
//
// While the game is active, checks input
// updates positions of prey and player,
// checks health (dying), checks eating (overlaps)
// displays the two agents.
// When the game is over, shows the game over screen with restart button
// if restart button is clicked, the game will reset
function draw() {
  if (gameStart){
    background(ORANGE);
    if (!gameOver) {
      handleInput();

      movePlayer();
      movePrey();

      updateHealth();
      checkEating();

      drawPrey();
      drawPlayer();

      text(playerHealth+"\n"+preyEaten,width/2,height/2+64);
      showUI();
    }else{
      showGameOver();
      check_Restart_Button();
    }
  }else{
    check_MainMenu_Button();
  }
}

// handleInput()
//
// Checks arrow keys & WASD and adjusts player velocity accordingly
function handleInput() {
  // if the shift key is not holding down, player moves at normal speed
  if (!keyIsDown(SHIFT)){
    // Check for horizontal movement
    if (keyIsDown(LEFT_ARROW)||keyIsDown(65)) {
      playerVX = -playerMaxSpeed;
    }
    else if (keyIsDown(RIGHT_ARROW)||keyIsDown(68)) {
      playerVX = playerMaxSpeed;
    }
    else {
      playerVX = 0;
    }
    // Check for vertical movement
    if (keyIsDown(UP_ARROW)||keyIsDown(87)) {
      playerVY = -playerMaxSpeed;
    }
    else if (keyIsDown(DOWN_ARROW)||keyIsDown(83)) {
      playerVY = playerMaxSpeed;
    }
    else {
      playerVY = 0;
    }
  // if the shift key is holding down, the player will move faster
  }else{
    // if the player can sprint
    if (sprintable){
      // make health drop faster
      useHealth();
      if (keyIsDown(LEFT_ARROW)) {
        playerVX = -playerMaxSpeed*speedUp;
      }
      else if (keyIsDown(RIGHT_ARROW)) {
        playerVX = playerMaxSpeed*speedUp;
      }
      else {
        playerVX = 0;
      }
      if (keyIsDown(UP_ARROW)) {
        playerVY = -playerMaxSpeed*speedUp;
      }
      else if (keyIsDown(DOWN_ARROW)) {
        playerVY = playerMaxSpeed*speedUp;
      }
      else {
        playerVY = 0;
      }
    }
  }
}

// movePlayer()
//
// Updates player position based on velocity,
// wraps around the edges.
function movePlayer() {
  // Update position
  playerX += playerVX;
  playerY += playerVY;

  // Wrap when player goes off the canvas
  if (playerX < 0) {
    // Off the left side, so add the width to reset to the right
    playerX += width;
  }
  else if (playerX > width) {
    // Off the right side, so subtract the width to reset to the left
    playerX -= width;
  }

  if (playerY < 0) {
    // Off the top, so add the height to reset to the bottom
    playerY += height;
  }
  else if (playerY > height) {
    // Off the bottom, so subtract the height to reset to the top
    playerY -= height;
  }
}

// updateHealth()
//
// Reduce the player's health (happens every frame)
// Check if the player is dead
function updateHealth() {
  // Reduce player health
  playerHealth -= 0.5;
  // Constrain the result to a sensible range
  playerHealth = constrain(playerHealth,0,playerMaxHealth);
  // Check if the player is dead (0 health)
  if (playerHealth === 0) {
    // If so, the game is over
    gameOver = true;
  }
}

// Sprint will cost health function
function useHealth(){
  playerHealth -= 1;
  playerHealth = constrain(playerHealth,0,playerMaxHealth);
}

// checkEating()
//
// Check if the player overlaps the prey and updates health of both
function checkEating() {
  // Get distance of player to prey
  let d = dist(playerX,playerY,preyX,preyY);
  // Check if it's an overlap
  if (d < playerRadius + preyRadius) {
    // Increase the player health
    playerHealth += eatHealth;
    // Constrain to the possible range
    playerHealth = constrain(playerHealth,0,playerMaxHealth);

    // Reduce the prey health
    preyHealth -= eatHealth;
    // Constrain to the possible range
    preyHealth = constrain(preyHealth,0,preyMaxHealth);

    // Check if the prey died (health 0)
    if (preyHealth === 0) {
      // change cheese
      p = random(0,1);
      // Move the "new" prey to a random position
      tx = random(0,1000);
      ty = random(0,1000);
      preyX = noise(tx)*(width)*preySpeedUp;
      preyY = noise(ty)*(height)*preySpeedUp;
      // Give it full health
      preyHealth = preyMaxHealth;
      // Track how many prey were eaten
      preyEaten += 1;
    }
  }
}

// movePrey()
//
// Moves the prey based on random velocity changes
function movePrey() {
  // increment
  tx += 0.01;
  ty += 0.01;
  // Update prey position based on noise and speed up
  preyX = noise(tx)*width*preySpeedUp;
  preyY = noise(ty)*height*preySpeedUp;

  // Screen wrapping
  if (preyX < 0) {
    preyX += width;
  }
  else if (preyX > width) {
    preyX -= width;
  }
  if (preyY < 0) {
    preyY += height;
  }
  else if (preyY > height) {
    preyY -= height;
  }
}

// drawPrey()
//
// Draw the prey as an ellipse with alpha based on health
function drawPrey() {
  if (p < 0.3){
    image(cheeseImage2,preyX,preyY,preyRadius*6,preyRadius*6);
  }else if(p < 0.6 && p >= 0.3){
    image(cheeseImage1,preyX,preyY,preyRadius*6,preyRadius*6);
  }else if(p < 1 && p >= 0.6){
    image(cheeseImage0,preyX,preyY,preyRadius*6,preyRadius*6);
  }
}
function spawn_Poisoned_Cheese(){
  p = random(0,1);
}
// drawPlayer()
//
// Draw the player as an ellipse with alpha value based on health
function drawPlayer() {
  image(mouseImage,playerX,playerY,playerRadius*6,playerRadius*6);
}

// game UI
function showUI(){
  push();
  // health bar
  textAlign(LEFT,TOP);
  fill(255);
  textSize(32);
  text("HEALTH",width/10-96,height/10-36);
  fill(100);
  rect(width/10+48,height/10-32,playerMaxHealth*1.5,32,0,16,16,0);
  fill(RED);
  rect(width/10+48,height/10-32,playerHealth*1.5,32,0,16,16,0);
  // energy indicator

  // poisoned indicator

  // score
  pop();
}

// showGameOver()
//
// Display text about the game being over!
function showGameOver() {
  // Set up the font
  textAlign(CENTER,CENTER);
  fill(RED);
  // Set up the text to display
  textSize(128);
  text("GAME OVER",width/2,height/2-64);
  let achievement = `YOU ATE ${preyEaten} CHEESE\n`;
  achievement += `BEFORE YOU LEFT THIS WORLD`
  // Display it in the centre of the screen
  fill(255);
  textSize(32);
  text(achievement,width/2,height/2+64);
  textSize(64);
  text("RESTART",width/2,height/2+164);
}

// check if the restart button is hovered
function check_Restart_Button(){
  // determine whether the mouse is hovering the button
  let restartIsHovering = (dist(mouseX,mouseY,width/2,height/2+164)<25||
  dist(mouseX,mouseY,width/2+72,height/2+164)<50 ||
  dist(mouseX,mouseY,width/2-72,height/2+164)<50)
  // hovering state
  if (restartIsHovering && gameOver){
    textSize(64);
    fill(0);
    text("RESTART",width/2,height/2+164);
    // if the mouse is hovering and clicked, the game will restart
    if(mouseIsPressed){
      gameOver = false;
      restartGame();
    }
  // unhovering state
  }else{
    textSize(64);
    fill(255);
    text("RESTART",width/2,height/2+164);
  }
}

// restart function
// reset the game
function restartGame(){
  // reset player health
  playerHealth = playerMaxHealth;
  // reset score
  preyEaten = 0;
  // reset their positions
  setupPrey();
  setupPlayer();
}
