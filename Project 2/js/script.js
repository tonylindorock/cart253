// Predator-Prey Sim
// by Yichen Wang
//
// Creates a predator or two and three prey (of different sizes and speeds)
// The predator chases the prey using the arrow keys or WASD and consumes them.
// The predator loses health over time, so must keep eating to survive.

// Our predators
let player1;
let player2;

// player colors
let player1Color;
let player2Color;

// if single player
let singlePlayer = true;

// colors for player strokes
let GREEN = "#b0ff6b";
let RED = "#ff4545";
let ORANGE = "#ffb545";
let YELLOW = "#fff945";
let CYAN = "#45ffb8";
let BLUE = "#45d1ff";
let PURPLE = "#f345ff";

// a color array
let COLORS = [GREEN, RED, ORANGE, YELLOW, CYAN, BLUE, PURPLE];

// color for the prey
let preyColor;

// The three prey
let antelope;
let zebra;
let bee;

// game state
let playing = false;
let gameOver = false;

// setup()
//
// Sets up a canvas
// Creates objects for the predator and three prey
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont("Arial");
  ellipseMode(CENTER);

  setRandomPlayerColor();

  // create player1 object
  player1 = new Predator(100, 100, 5, player1Color, 40, 87, 83, 65, 68, 70);

  // set up prey objects
  setUpPrey();
}

// setRandomPlayerColor()
//
// give players two random but different colored strokes
function setRandomPlayerColor() {
  player1Color = COLORS[int(random(0, 7))];
  player2Color = COLORS[int(random(0, 7))];
  while (player2Color === player1Color) {
    player2Color = COLORS[int(random(0, 7))];
  }
}

// setRandomPreyColor()
//
// set or reset prey color randomly
function setRandomPreyColor() {
  preyColor = color(random(128, 255), random(128, 255), random(128, 255));
}

// setUpPrey()
//
// set up the prey objects with different random colors
function setUpPrey() {
  setRandomPreyColor();
  antelope = new Prey(random(0, width), random(0, height), 10, preyColor, 50);
  setRandomPreyColor();
  zebra = new Prey(random(0, width), random(0, height), 8, preyColor, 60);
  setRandomPreyColor();
  bee = new Prey(random(0, width), random(0, height), 20, preyColor, 10);
}

// draw()
//
// Handles input, movement, eating, and displaying for the system's objects
function draw() {
  // Clear the background to black
  background(100);
  if (!playing && !gameOver) {
    antelope.move();
    zebra.move();
    bee.move();

    antelope.display();
    zebra.display();
    bee.display();

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
        player1.handleEating(zebra);
        player1.handleEating(bee);
      }
      // leave player's score on the screen
      player1.display();
    } else {
      if (!player1.dead) {
        player1.handleInput();
        player1.move();
        player1.handleEating(antelope);
        player1.handleEating(zebra);
        player1.handleEating(bee);
      }
      if (!singlePlayer) {
        if (!player2.dead) {
          player2.handleInput();
          player2.move();
          player2.handleEating(antelope);
          player2.handleEating(zebra);
          player2.handleEating(bee);
        }
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
  text("player 1", width / 2 - 100, height / 2 + 100);
  text("WASD KEYS", width / 2 - 100, height / 2 + 150);
  textAlign(LEFT, CENTER);
  text("player 2", width / 2 + 100, height / 2 + 100);
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
  textStyle(BOLD);
  if (mouseX < width / 2) {
    fill(255);
    textAlign(RIGHT, CENTER);
    text("player 1", width / 2 - 100, height / 2 + 100);
    fill(255);
    stroke(player1Color);
    strokeWeight(8);
    ellipse(width / 2, height / 2 + 250, player1.radius * 2);
    noStroke();
    fill(0);
    textAlign(LEFT, CENTER);
    text("player 2", width / 2 + 100, height / 2 + 100);
    // reset all colors of prey and player
    // reset game stats
    if (mouseIsPressed) {
      background(100);
      setRandomPlayerColor();
      player1 = new Predator(100, 100, 5, player1Color, 40, 87, 83, 65, 68, 70);
      setUpPrey();
      gameOver = false;
      singlePlayer = true;
    }
  } else {
    fill(0);
    textAlign(RIGHT, CENTER);
    text("player 1", width / 2 - 100, height / 2 + 100);
    fill(255);
    textAlign(LEFT, CENTER);
    text("player 2", width / 2 + 100, height / 2 + 100);
    fill(255);
    stroke(player1Color);
    strokeWeight(8);
    ellipse(width / 2 - 50, height / 2 + 250, player1.radius * 2);
    fill(255);
    stroke(player2Color);
    ellipse(width / 2 + 50, height / 2 + 250, player1.radius * 2);
    noStroke();
    // reset all colors of prey and two players
    // reset game stats
    if (mouseIsPressed) {
      setRandomPlayerColor();
      player1 = new Predator(100, 100, 5, player1Color, 40, 87, 83, 65, 68, 70);
      player2 = new Predator(width - 100, 100, 5, player2Color, 40, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 76);
      setUpPrey();
      gameOver = false;
      singlePlayer = false;
    }
  }
}

// showMainMenu()
//
// display the main menu before the game
function showMainMenu() {
  push();
  fill(255);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("You are the predator(s)\nEat those preys to stay alive", width / 2, height / 2 - 150);
  fill(0);
  textSize(64);
  text("PREDATOR-PREY SIM", width / 2, height / 2);
  textSize(32);
  textAlign(RIGHT, CENTER);
  text("player 1", width / 2 - 100, height / 2 + 100);
  text("WASD KEYS", width / 2 - 100, height / 2 + 150);
  textAlign(LEFT, CENTER);
  text("player 2", width / 2 + 100, height / 2 + 100);
  text("ARROWKEYS", width / 2 + 100, height / 2 + 150);
  pop();
}

// checkMainMenuButtons()
//
// check the buttons in main menu
// handle whether the game is started in single player
function checkMainMenuButtons() {
  push();
  textSize(32);
  textStyle(BOLD);
  // single player
  if (mouseX < width / 2) {
    fill(255);
    textAlign(RIGHT, CENTER);
    text("player 1", width / 2 - 100, height / 2 + 100);
    fill(255);
    stroke(player1Color);
    strokeWeight(8);
    ellipse(width / 2, height / 2 + 250, player1.radius * 2);
    noStroke();
    fill(0);
    textAlign(LEFT, CENTER);
    text("player 2", width / 2 + 100, height / 2 + 100);
    if (mouseIsPressed) {
      playing = true;
      singlePlayer = true;
    }
    // two players
  } else {
    fill(0);
    textAlign(RIGHT, CENTER);
    text("player 1", width / 2 - 100, height / 2 + 100);
    fill(255);
    textAlign(LEFT, CENTER);
    text("player 2", width / 2 + 100, height / 2 + 100);
    fill(255);
    stroke(player1Color);
    strokeWeight(8);
    ellipse(width / 2 - 50, height / 2 + 250, player1.radius * 2);
    fill(255);
    stroke(player2Color);
    ellipse(width / 2 + 50, height / 2 + 250, player1.radius * 2);
    noStroke();
    if (mouseIsPressed) {
      playing = true;
      singlePlayer = false;
      player2 = new Predator(width - 100, 100, 5, player2Color, 40, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 76);
    }
  }
}
