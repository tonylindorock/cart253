// Earth
// by Yichen Wang
//
//

// Our players
let player1;
let player2;
let player1_texture;
let player2_texture;

// if single player
let singlePlayer = true;

// game state
let playing = false;
let gameOver = false;

let SELECTED = "#ffd342";
// grass colors for different seasons
const SPRING = "#a0cc83";
const SUMMER = "#6fa36a";
const FALL = "#dbbf72";
const WINTER = "#a8bab4";

const SEASONS = [SPRING, SUMMER, FALL, WINTER];
// index for SEASONS array
let currentSeason;

// BG objects locations
let ElementsPosX = [];
let ElementsPosY = [];

const RULES = "You are the predator of the Earth." +
  "\nYou are constantly hungry so you must feast." +
  "\nEat as much prey as you can before human hunt you down.";

// all the images
let rabbit_white;
let rabbit_brown;
let boar;
let zebra;
let antelope;
let bison;
let lion;
let wolf;
let leopard;
let human;
let rabbit_white_flipped;
let rabbit_brown_flipped;
let boar_flipped;
let zebra_flipped;
let antelope_flipped;
let bison_flipped;
let lion_flipped;
let wolf_flipped;
let leopard_flipped;
let human_flipped;

let prey = [];
let players = [];
let predatorPro = [];

let tree_spring;
let tree_summer;
let tree_fall;
let tree_winter;

// preload()
//
// Load all the image and sound sources
function preload() {
  rabbit_white = loadImage("assets/images/Rabbit_W.png");
  rabbit_brown = loadImage("assets/images/Rabbit_B.png");
  boar = loadImage("assets/images/Boar.png");
  zebra = loadImage("assets/images/Zebra.png");
  antelope = loadImage("assets/images/Antelope.png");
  bison = loadImage("assets/images/Bison.png");
  lion = loadImage("assets/images/Lion.png");
  wolf = loadImage("assets/images/Wolf.png");
  leopard = loadImage("assets/images/Leopard.png");
  human = loadImage("assets/images/Man.png");
  tree_spring = loadImage("assets/images/Tree_Spring.png");
  tree_summer = loadImage("assets/images/Tree_Summer.png");
  tree_fall = loadImage("assets/images/Tree_Fall.png");
  tree_winter = loadImage("assets/images/Tree_Winter.png");


}

// setup()
//
// Sets up a canvas
// Creates objects for the predator and three prey
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont('Helvetica');
  imageMode(CENTER);
  rectMode(CENTER);
  noStroke();

  currentSeason = int(random(0, 4));
  randomizeElementsPos();

  append(players,lion);
  append(players,wolf);
  append(players,leopard);
  append(players,lion_flipped);
  append(players,wolf_flipped);
  append(players,leopard_flipped);
  setupPlayer();
  // create player1 object
  player1 = new Predator(100, 100, 5, 30, player1_texture,player1_texture_flipped, 87, 83, 65, 68, 70);

  // set up prey objects
  setUpPrey();
}

// setUpPrey()
//
// set up the prey objects with different random colors
function setUpPrey() {

}

function setupPlayer(){
  let randomIndex=int(random(0,3));
  player1_texture = players[randomIndex];
  player1_texture_flipped = players[randomIndex+3];
  randomIndex=int(random(0,3));
  player2_texture = players[randomIndex];
  player2_texture_flipped = players[randomIndex+3];
}

// setupBG()
//
// set up the background of the game by randomly selecting a season in an array
// and display certain other BG elements
function setupBG() {
  background(SEASONS[currentSeason]);
  if (currentSeason === 0) {
    for (let i = 0; i < 10; i++) {
      image(tree_spring, ElementsPosX[i], ElementsPosY[i], 60, 60);
    }
  } else if (currentSeason === 1) {
    for (let i = 0; i < 10; i++) {
      image(tree_summer, ElementsPosX[i], ElementsPosY[i], 60, 60);
    }
  } else if (currentSeason === 2) {
    for (let i = 0; i < 10; i++) {
      image(tree_fall, ElementsPosX[i], ElementsPosY[i], 60, 60);
    }
  } else if (currentSeason === 3) {
    for (let i = 0; i < 10; i++) {
      image(tree_winter, ElementsPosX[i], ElementsPosY[i], 60, 60);
    }
  }
}

function nextSeason() {
  currentSeason += 1;
  if (currentSeason > 3) {
    currentSeason = 0;
  }
}

function randomizeElementsPos() {
  for (let i = 0; i < 10; i++) {
    ElementsPosX[i] = random(0, width);
    ElementsPosY[i] = random(0, height);
  }
}

// draw()
//
// Handles input, movement, eating, and displaying for the system's objects
function draw() {
  // Clear the background to black
  setupBG();
  if (!playing && !gameOver) {
    fill(0,50);
    rect(width/2,height/2,width,height);
    showMainMenu();
    checkMainMenuButtons();

  } else if (playing) {
    checkGameOver();

    // Handle input for the tiger
    // if players are dead, they can not be able to move anymore
    if (singlePlayer) {
      if (!player1.dead) {
        player1.handleInput();
        player1.move();

        player1.handleEating(antelope);
      }
      // leave player's score on the screen
      player1.display();
    } else {
      if (!player1.dead) {
        player1.handleInput();
        player1.move();
        player1.handleEating(antelope);
      }
      if (!player2.dead) {
          player2.handleInput();
          player2.move();
          player2.handleEating(antelope);
      }

      player1.display();
      player2.display();
    }

    // Move all the "animals"
    antelope.move();
    zebra.move();
    bee.move();

    // Display all the "animals"
    antelope.display();
    zebra.display();
    bee.display();

    if (gameOver) {
      displayGameOver();
    }
  }

}

// checkGameOver()
//
// check if the players are dead
function checkGameOver() {
  if (singlePlayer) {
    if (player1.dead) {
      gameOver = true;
    }
  } else {
    if (player1.dead && player2.dead) {
      gameOver = true;
    }
  }
}

// displayGameOver()
//
// display game over text
function displayGameOver() {
  push();
  fill(255);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(64);
  text("GAME OVER", width / 2, height / 2);
  textSize(32);
  fill(0);
  textAlign(RIGHT, CENTER);
  text("play as one", width / 2 - 100, height / 2 + 100);
  text("WASD KEYS", width / 2 - 100, height / 2 + 150);
  textAlign(LEFT, CENTER);
  text("play as two", width / 2 + 100, height / 2 + 100);
  text("ARROWKEYS", width / 2 + 100, height / 2 + 150);
  pop();

  checkGameOverButtons();
}

// checkGameOverButtons()
//
// check buttons in game over screen
// handle game restart and reset all the objects
function checkGameOverButtons() {
  push();
  textSize(32);
  if (mouseX < width / 2) {
    fill(255);
    textAlign(RIGHT, CENTER);
    text("play as one", width / 2 - 100, height / 2 + 100);
    fill(255);
    image(player1_texture,width / 2, height / 2 + 250, player1.radius * 2);
    fill(0);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 100);
    // reset all colors of prey and player
    // reset game stats
    if (mouseIsPressed) {
      background(100);
      player1 = new Predator(100, 100, 5, 30, player1_texture,player1_texture_flipped, 87, 83, 65, 68, 70);
      setUpPrey();
      gameOver = false;
      singlePlayer = true;
    }
  } else {
    fill(0);
    textAlign(RIGHT, CENTER);
    text("play as one", width / 2 - 100, height / 2 + 100);
    fill(255);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 100);
    image(player1_texture,width / 2 - 50, height / 2 + 250, player1.radius * 2);
    image(player2_texture,width / 2 + 50, height / 2 + 250, player1.radius * 2);
    // reset all colors of prey and two players
    // reset game stats
    if (mouseIsPressed) {
      player1 = new Predator(100, 100, 5, 30, player1_texture,player1_texture_flipped, 87, 83, 65, 68, 70);
      player2 = new Predator(width - 100, 100, 5, 30, player2_texture,player2_texture_flipped, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 76);
      setUpPrey();
      gameOver = false;
      singlePlayer = false;
    }
  }
  pop();
}

// showMainMenu()
//
// display the main menu before the game
function showMainMenu() {
  push();
  fill(0);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(255);
  text(RULES, width / 2, height / 2 - 150);
  textSize(128);
  text("E A R T H", width / 2, height / 2);
  textSize(32);
  textAlign(RIGHT, CENTER);
  text("play as one", width / 2 - 100, height / 2 + 120);
  text("WASD KEYS", width / 2 - 100, height / 2 + 170);
  textAlign(LEFT, CENTER);
  text("play as two", width / 2 + 100, height / 2 + 120);
  text("ARROWKEYS", width / 2 + 100, height / 2 + 170);
  pop();
}

// checkMainMenuButtons()
//
// check the buttons in main menu
// handle whether the game is started in single player
function checkMainMenuButtons() {
  push();
  noStroke();
  textSize(32);
  textStyle(BOLD);
  // single player
  if (mouseX < width / 2) {
    fill(SELECTED);
    textAlign(RIGHT, CENTER);
    text("play as one", width / 2 - 100, height / 2 + 120);
    image(player1_texture, width / 2, height / 2 + 250, player1.radius*2,player1.radius*2);
    fill(255);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 120);
    if (mouseIsPressed) {
      playing = true;
      singlePlayer = true;
    }
    // two players
  } else {
    fill(255);
    textAlign(RIGHT, CENTER);
    text("play as one", width / 2 - 100, height / 2 + 120);
    fill(SELECTED);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 120);
    image(player1_texture,width / 2 - 50, height / 2 + 250, player1.radius*2,player1.radius*2);
    image(player2_texture,width / 2 + 50, height / 2 + 250, player1.radius*2,player1.radius*2);
    if (mouseIsPressed) {
      playing = true;
      singlePlayer = false;
      player2 = new Predator(width - 100, 100, 5, 30,player2_texture,player2_texture_flipped, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 76);
    }
  }
  pop();
}
