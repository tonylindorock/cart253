// Predator-Prey Sim
// by Yichen Wang
//
// Creates a predator and three prey (of different sizes and speeds)
// The predator chases the prey using the arrow keys and consumes them.
// The predator loses health over time, so must keep eating to survive.

// Our predators
let player1;
let player2;

let player1Color;
let player2Color;

let r;
let g;
let b;

// if single player
let singlePlayer = true;

// colors
let GREEN = "#b0ff6b";
let RED = "#ff4545";
let ORANGE = "#ffb545";
let YELLOW = "#fff945";
let CYAN = "#45ffb8";
let BLUE = "#45d1ff";
let PURPLE = "#f345ff";

let COLORS = [GREEN,RED,ORANGE,YELLOW,CYAN,BLUE,PURPLE];

let preyColor;

// The three prey
let antelope;
let zebra;
let bee;

let playing = false;
let gameOver = false;

// setup()
//
// Sets up a canvas
// Creates objects for the predator and three prey
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER,CENTER);
  textFont("Arial");
  ellipseMode(CENTER);

  player1Color = COLORS[int(random(0,7))];
  player2Color = COLORS[int(random(0,7))];
  while(player2Color === player1Color){
    player2Color = COLORS[int(random(0,7))];
  }

  preyColor = color(random(128,255),random(128,255),random(128,255));

  player1 = new Predator(100, 100, 5,player1Color, 40, 87, 83, 65, 68);
  antelope = new Prey(100, 100, 10, color(random(128,255),random(128,255),random(128,255)), 50);
  zebra = new Prey(100, 100, 8, color(random(128,255),random(128,255),random(128,255)), 60);
  bee = new Prey(100, 100, 20, color(random(128,255),random(128,255),random(128,255)), 10);
}

// draw()
//
// Handles input, movement, eating, and displaying for the system's objects
function draw() {
  // Clear the background to black
  background(100);
  if (!playing && !gameOver){
    antelope.move();
    zebra.move();
    bee.move();

    antelope.display();
    zebra.display();
    bee.display();

    showMainMenu();
    checkMainMenuButtons();

  }else if (playing && !gameOver){

    // Handle input for the tiger
    if (singlePlayer){
      player1.handleInput();
      player1.move();

      player1.handleEating(antelope);
      player1.handleEating(zebra);
      player1.handleEating(bee);

      player1.display();
    }else{
      player1.handleInput();
      player1.move();
      player2.handleInput();
      player2.move();

      player1.handleEating(antelope);
      player1.handleEating(zebra);
      player1.handleEating(bee);

      player2.handleEating(antelope);
      player2.handleEating(zebra);
      player2.handleEating(bee);

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
  }else if (gameOver){

  }
}

function showMainMenu(){
  push();
  fill(255);
  textStyle(BOLD);
  textAlign(CENTER,CENTER);
  textSize(32);
  text("You are the predator(s)\nEat those preys to stay alive\nand avoid black ones from eating you", width/2,height/2-150);
  fill(0);
  textSize(64);
  text("PREDATOR-PREY SIM", width/2,height/2);
  textSize(32);
  textAlign(RIGHT,CENTER);
  text("1 player",width/2-100,height/2+100);
  text("WASD KEYS",width/2-100,height/2+150);
  textAlign(LEFT,CENTER);
  text("2 players",width/2+100,height/2+100);
  text("ARROWKEYS",width/2+100,height/2+150);
  pop();
}

function checkMainMenuButtons(){
  push();
  textSize(32);
  textStyle(BOLD);
  if(mouseX<width/2){
    fill(255);
    textAlign(RIGHT,CENTER);
    text("1 player",width/2-100,height/2+100);
    fill(255);
    stroke(player1Color);
    strokeWeight(8);
    ellipse(width/2,height/2+250,player1.radius*2);
    noStroke();
    fill(0);
    textAlign(LEFT,CENTER);
    text("2 players",width/2+100,height/2+100);
    if (mouseIsPressed){
      playing = true;
    }
  }else{
    fill(0);
    textAlign(RIGHT,CENTER);
    text("1 player",width/2-100,height/2+100);
    fill(255);
    textAlign(LEFT,CENTER);
    text("2 players",width/2+100,height/2+100);
    fill(255);
    stroke(player1Color);
    strokeWeight(8);
    ellipse(width/2-50,height/2+250,player1.radius*2);
    fill(255);
    stroke(player2Color);
    ellipse(width/2+50,height/2+250,player1.radius*2);
    noStroke();
    if (mouseIsPressed){
      playing = true;
      singlePlayer = false;
      player2 = new Predator(width-100, 100, 5, player2Color, 40, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW);
    }
  }
}
