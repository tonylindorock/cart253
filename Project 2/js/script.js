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

const NUM_TREE=10;
// the number of animals
const NUM_RABBIT = 20;
const NUM_BOAR = 10;
const NUM_ZEBRA = 10;
const NUM_ANTELOPE = 10;
const NUM_BISON = 10;
const NUM_ANIMALS = [NUM_RABBIT,NUM_BOAR,NUM_ZEBRA,NUM_ANTELOPE,NUM_BISON];
let num_human = 1;

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

let trees = [];
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
  rabbit_white_flipped = loadImage("assets/images/Rabbit_W_flipped.png");
  rabbit_brown_flipped = loadImage("assets/images/Rabbit_B_flipped.png");
  boar_flipped = loadImage("assets/images/Boar_flipped.png");
  zebra_flipped = loadImage("assets/images/Zebra_flipped.png");
  antelope_flipped = loadImage("assets/images/Antelope_flipped.png");
  bison_flipped = loadImage("assets/images/Bison_flipped.png");
  lion_flipped = loadImage("assets/images/Lion_flipped.png");
  wolf_flipped = loadImage("assets/images/Wolf_flipped.png");
  leopard_flipped = loadImage("assets/images/Leopard_flipped.png");
  human_flipped = loadImage("assets/images/Man_flipped.png");

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
  setupBG();

  append(players,lion);
  append(players,wolf);
  append(players,leopard);
  append(players,lion_flipped);
  append(players,wolf_flipped);
  append(players,leopard_flipped);
  setupPlayer();
  // create player1 object
  player1 = new Predator(100, 100, 3, 30, player1_texture,player1_texture_flipped, 87, 83, 65, 68, 70);

  // set up prey objects
  setUpPrey();
}

// setUpPrey()
//
// set up the prey objects
function setUpPrey() {
  prey=[];
  for(let i=0;i<5;i++){
    let num_animal = NUM_ANIMALS[i];
    let animal_id = i;
    for(let j=0;j<num_animal;j++){
      let preyX = random(0, width);
      let preyY = random(0, height);
      let preySpeed=0;
      let preyRadius=0;
      let texture;
      let texture_flipped;
      // rabbit
      if (animal_id===0){
        preySpeed = random(3,5);
        preyRadius = random(10,15);
        if (currentSeason===3){
          texture=rabbit_brown;
          texture_flipped=rabbit_brown_flipped;
        }else{
          texture=rabbit_white;
          texture_flipped=rabbit_white_flipped;
        }
      // boar
      }else if(animal_id===1){
        preySpeed = random(0.5,3);
        preyRadius = random(20,25);
        texture=boar;
        texture_flipped=boar_flipped;
      // zebra, antelope, and bison
      }else if(animal_id>=2){
        preySpeed = random(1,3);
        preyRadius = random(25,30);
        // zebra
        if (animal_id===2){
          texture=zebra;
          texture_flipped=zebra_flipped;
        // antelope
        }else if(animal_id===3){
          texture=antelope;
          texture_flipped=antelope_flipped;
        //bison
        }else if(animal_id===4){
          texture=bison;
          texture_flipped=bison_flipped;
        }
      }
      let preyObj = new Prey(preyX,preyY,preySpeed,preyRadius,texture, texture_flipped);
      prey.push(preyObj);
  }
}
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
  trees=[];
  if (currentSeason === 0) {
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(ElementsPosX[i], ElementsPosY[i], 60,tree_spring);
      trees.push(treeObj);
    }
  } else if (currentSeason === 1) {
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(ElementsPosX[i], ElementsPosY[i], 60,tree_summer);
      trees.push(treeObj);
    }
  } else if (currentSeason === 2) {
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(ElementsPosX[i], ElementsPosY[i], 60,tree_fall);
      trees.push(treeObj);
    }
  } else if (currentSeason === 3) {
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(ElementsPosX[i], ElementsPosY[i], 60,tree_winter);
      trees.push(treeObj);
    }
  }
}

function drawBG(){
  background(SEASONS[currentSeason]);
  for(let i=0;i<trees.length;i++){
    trees[i].display();
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
  drawBG();
  if (!playing && !gameOver) {

    for(let i=0;i<prey.length;i++){
      prey[i].move();
      prey[i].display();
    }

    fill(0,50);
    rect(width/2,height/2,width,height);
    showMainMenu();
    checkMainMenuButtons();

  } else if (playing) {
    checkGameOver();
    for(let i=0;i<prey.length;i++){
      prey[i].move();
      prey[i].display();
    }

    // Handle input for the tiger
    // if players are dead, they can not be able to move anymore
    if (singlePlayer) {
      if (!player1.dead) {
        player1.handleInput();
        player1.move();
      }
      // leave player's score on the screen
      player1.display();
    } else {
      if (!player1.dead) {
        player1.handleInput();
        player1.move();
      }
      if (!player2.dead) {
          player2.handleInput();
          player2.move();
      }

      player1.display();
      player2.display();
    }

    // Move all the "animals"


    // Display all the "animals"


    if (gameOver) {
      fill(0,50);
      rect(width/2,height/2,width,height);
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
  textSize(128);
  text("GAME OVER", width / 2, height / 2);
  textSize(32);
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
  fill(255);
  textStyle(BOLD);
  if (mouseX < width / 2) {
    textAlign(RIGHT, CENTER);
    fill(SELECTED);
    text("play as one", width / 2 - 100, height / 2 + 100);
    image(player1_texture,width / 2, height / 2 + 250, player1.radius * 2,player1.radius * 2);
    fill(255);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 100);
    // reset all colors of prey and player
    // reset game stats
    if (mouseIsPressed) {
      background(100);
      player1 = new Predator(100, 100, 3, 30, player1_texture,player1_texture_flipped, 87, 83, 65, 68, 70);
      setUpPrey();
      gameOver = false;
      singlePlayer = true;
    }
  } else {
    textAlign(RIGHT, CENTER);
    text("play as one", width / 2 - 100, height / 2 + 100);
    fill(SELECTED);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 100);
    image(player1_texture,width / 2 - 50, height / 2 + 250, player1.radius * 2,player1.radius * 2);
    image(player2_texture,width / 2 + 50, height / 2 + 250, player1.radius * 2,player1.radius * 2);
    // reset all colors of prey and two players
    // reset game stats
    if (mouseIsPressed) {
      player1 = new Predator(100, 100, 3, 30, player1_texture,player1_texture_flipped, 87, 83, 65, 68, 70);
      player2 = new Predator(width - 100, 100, 3, 30, player2_texture,player2_texture_flipped, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 76);
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
  text("WASD KEYS\nF to sprint", width / 2 - 100, height / 2 + 180);
  textAlign(LEFT, CENTER);
  text("play as two", width / 2 + 100, height / 2 + 120);
  text("ARROWKEYS\nL to sprint", width / 2 + 100, height / 2 + 180);
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
      player2 = new Predator(width - 100, 100, 3, 30,player2_texture,player2_texture_flipped, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 76);
    }
  }
  pop();
}
