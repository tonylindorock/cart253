"use strict";

/******************************************************

Game - The Cheser
Yichen Wang

A "simple" game of mouse and cheese with original music and sound effects.
The player is a mouse and can move with keys, if they overlap the (randomly moving)
cheese they "eat it" by sucking out its life and adding it to their own.
The player "dies" slowly over time so they have to keep eating to stay alive.
The player also need to avoid eating poisoned cheese because they make the mouse
sick and die faster. By eating the REAL cheese, poison can be cured.
Player will get bigger, slower, and slightly stronger, but the running cheese will move
even faster with being more unpredictable.

"One bite of the cheese gives you strength, but one whole cheese gives you cure."

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
let playerSpeed;
let playerMaxSpeed = 4; // player initial speed
// speedup for sprint
let speedUp = 2;
// speeddown for eating too much or getting poisoned
let speedDown = 1;
// Player health
let playerHealth;
let playerInitialHealth = 255; // default 255

// if the player can sprint
let sprintable = true;
let poisoned = false;

// player moving direction for flipping the player image
let goingLeft = true;

// possibility for randomly deciding which cheese out of 3 to be drawn
let p;
// possibility for randomly deciding which poisoned cheese out of 3 to be drawn
let p1;

// Prey position, size, velocity
let preyX;
let preyY;
let preyRadius = 25;
// control the prey moving speed and behaviour
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
let pCheeseSpeed = 5;
let spawnPoisonedCheese = true;
let movePoisonedCheese = true;

// Amount of health obtained per frame of "eating" (overlapping) the prey
let eatHealth = 10;
// Number of prey eaten during the game (the "score")
let preyEaten = 0;
// the best score
let bestScore = 0;
// is the best score is beaten
let scoreBeaten = false;

// Track whether the game is over
let gameOver = false;
// whether the game is started
let gameStart = false;

// BG color
let ORANGE = "#efbb3f";
let DARK_BLUE = "#2b2f4f";
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
let mouseImageFlipped;

let sprintIndicator;
let notSprintIndicator;
let poisonIndicator;

// sounds
let bite_Sound;
let swallow_Sound;
let newRecord_Sound;
let gameOver_Sound;
let poisoned_Sound;
let bg_Music;

// to let the sound play once
let playOnce = true;

// preload()
//
// load all the images, sounds, and the font
function preload() {
  // soundFormats('ogg','wav');
  // font downloaded from https://www.wfonts.com/font/futura
  Futura_Heavy = loadFont("assets/futura heavy font.ttf");

  // load images for the cheese, mouse, and other UI elements
  cheeseImage0 = loadImage("assets/images/Cheese0.png");
  cheeseImage1 = loadImage("assets/images/Cheese1.png");
  cheeseImage2 = loadImage("assets/images/Cheese2.png");
  cheesePImage0 = loadImage("assets/images/CheeseP0.png");
  cheesePImage1 = loadImage("assets/images/CheeseP1.png");
  cheesePImage2 = loadImage("assets/images/CheeseP2.png");

  mouseImage = loadImage("assets/images/Mouse.png");
  mouseImageFlipped = loadImage("assets/images/Mouse (flipped).png");

  sprintIndicator = loadImage("assets/images/Indicator_sprint.png");
  notSprintIndicator = loadImage("assets/images/Indicator_notSpring.png");
  poisonIndicator = loadImage("assets/images/Indicator_poisoned.png");

  // load sounds
  bite_Sound = loadSound("assets/sounds/Bite.wav");
  swallow_Sound = loadSound("assets/sounds/Swallow.wav");
  newRecord_Sound = loadSound("assets/sounds/New Record.wav");
  gameOver_Sound = loadSound("assets/sounds/Game Over.wav");
  poisoned_Sound = loadSound("assets/sounds/Poisoned.wav");
  bg_Music = loadSound("assets/sounds/Chesing.wav");
}
// setup()
//
// Sets up the basic elements of the game
function setup() {
  rectMode(CORNER);
  imageMode(CENTER);
  // choose font
  textFont(Futura_Heavy);
  createCanvas(windowWidth, windowHeight);
  background(ORANGE);

  // set up the main menu
  setupMainMenu();

  noStroke();
}

// setupMainMenu()
//
// everything for setting up the main menu
// including the title, start button, and the rule
function setupMainMenu() {
  // decorations for the menu
  image(cheeseImage0, width / 2 - 424, height / 2 - 164, 150, 150);
  image(cheeseImage1, width / 2 - 296, height / 2 - 164, 150, 150);
  image(cheeseImage2, width / 2 - 168, height / 2 - 164, 150, 150);
  image(mouseImage, width / 2, height / 2 - 164, 150, 150);
  image(cheesePImage2, width / 2 + 168, height / 2 - 164, 150, 150);
  image(cheesePImage1, width / 2 + 296, height / 2 - 164, 150, 150);
  image(cheesePImage0, width / 2 + 424, height / 2 - 164, 150, 150);
  textAlign(CENTER, CENTER);
  fill(0); // black
  textSize(84);
  text("?", width / 2, height / 2 - 272);
  fill(255); // white
  // title
  textSize(128);
  text("THE CHESER", width / 2, height / 2 - 64);
  // start button
  textSize(64);
  text("START", width / 2, height / 2 + 64);
  // rule
  textSize(20);
  fill(0);
  let rule = "You have to 'chese' & eat the running cheese to survive!" +
    "\nAnd avoid the poisoned ones because humans are evil!" +
    "\nEat the REAL cheese to cure the poison before it's too late!" +
    "\n\nControls: WASD or ARROWKEYS to move\nSHIFT to sprint"
  text(rule, width / 2, height / 2 + 196);
}

// setupPrey()
//
// Initialises prey's position, and health
function setupPrey() {
  tx = random(0, 1000);
  ty = random(0, 1000);
  preyX = random(0, width);
  preyY = random(0, height);

  preyHealth = preyMaxHealth;
  // decides which cheese out of 3
  p = random(0, 1);
}

// setup_PosionedCheese()
//
// set up the poisoned cheese
// spawn it above the window and a random y position
function setup_PosionedCheese() {
  // possibility which poisoned cheese out of 3
  p1 = random(0, 1);
  pCheeseX = random(0, width);
  pCheeseY = -150;
}

// setupPlayer()
//
// Initialises player position and health
function setupPlayer() {
  playerX = 4 * width / 5;
  playerY = height / 2;
  playerHealth = playerInitialHealth;
  playerSpeed = playerMaxSpeed;
}

// draw()
//
// Main menu waiting for player to start the game
// While the game is active, checks input
// updates positions of prey and player,
// checks health (dying), checks eating (overlaps)
// displays the two agents.
// When the game is over, shows the game over screen with restart button
// if restart button is clicked, the game will reset
function draw() {
  if (gameStart) {
    background(ORANGE);
    if (!gameOver) {
      handleInput();

      movePlayer();
      movePrey();

      updateHealth();
      checkEating();

      drawPrey();
      drawPlayer();

      spawn_PoisonedCheese();
      move_PoisonedCheese();

      showUI();
    } else {
      showGameOver();
      check_RestartButton();
    }
  } else {
    check_MainMenuButton();
  }
}

// check_MainMenuButton()
//
// handle the start button behaviour
function check_MainMenuButton() {
  // determine if the mouse is hovering the button
  let startIsHovering = (dist(mouseX, mouseY, width / 2 - 32, height / 2 + 64) < 50 ||
    dist(mouseX, mouseY, width / 2 + 32, height / 2 + 64) < 50 ||
    dist(mouseX, mouseY, width / 2, height / 2 + 64) < 25)

  // if the mouse is hovering, the text will change color
  if (startIsHovering && !gameStart) {
    textSize(64);
    fill(0);
    text("START", width / 2, height / 2 + 64);
    // when the mouse is pressed on the button, the game will start
    if (mouseIsPressed) {
      gameStart = true;

      // set the Backgroud music volume and loop it
      bg_Music.setVolume(0.5);
      bg_Music.playMode('restart')
      bg_Music.loop();
      // We're using simple functions to separate code out
      setupPrey();
      setupPlayer();
      setup_PosionedCheese();
    }
    // if the mouse is not hovering, the button goes back to normal
  } else {
    fill(255);
    textSize(64);
    text("START", width / 2, height / 2 + 64);
  }
}

// handleInput()
//
// Checks arrow keys & WASD and adjusts player velocity accordingly
function handleInput() {
  // if the shift key is not holding down, player moves at normal speed
  if (!keyIsDown(SHIFT)) {
    // Check for horizontal movement
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      // speedDown will be applied when player is poisoned
      playerVX = -playerSpeed * speedDown;
      // determining which direction the player is going to change the direction of the player image
      goingLeft = true;
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      playerVX = playerSpeed * speedDown;
      // change player image direction
      goingLeft = false;
    } else {
      playerVX = 0;
    }
    // Check for vertical movement
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      playerVY = -playerSpeed * speedDown;
    } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      playerVY = playerSpeed * speedDown;
    } else {
      playerVY = 0;
    }
    // if the shift key is holding down, the player will move faster
  } else {
    // the player can sprint when not poisoned
    if (sprintable) {
      // make health drop faster
      useHealth();
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        // speedUp increases player's speed when sprinting
        playerVX = -playerSpeed * speedUp * speedDown;
        goingLeft = true;
      } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        playerVX = playerSpeed * speedUp * speedDown;
        goingLeft = false;
      } else {
        playerVX = 0;
      }
      if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        playerVY = -playerSpeed * speedUp * speedDown;
      } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        playerVY = playerSpeed * speedUp * speedDown;
      } else {
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
  } else if (playerX > width) {
    // Off the right side, so subtract the width to reset to the left
    playerX -= width;
  }

  if (playerY < 0) {
    // Off the top, so add the height to reset to the bottom
    playerY += height;
  } else if (playerY > height) {
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
  if (!poisoned) {
    playerHealth -= 0.5;
  } else {
    playerHealth -= 0.75;
  }
  // Constrain the result to a sensible range
  playerHealth = constrain(playerHealth, 0, playerInitialHealth);
  // Check if the player is dead (0 health)
  if (playerHealth === 0) {
    // If so, the game is over
    gameOver = true;
  }
}

// useHealth()
//
// Sprint will cost health
function useHealth() {
  playerHealth -= 1;
  playerHealth = constrain(playerHealth, 0, playerInitialHealth);
}

// checkEating()
//
// Check if the player overlaps the prey and updates health of both
function checkEating() {
  // Get distance of player to prey
  let d = dist(playerX, playerY, preyX, preyY);
  // get distance from player to poisoned cheese
  let d2 = dist(playerX, playerY, pCheeseX, pCheeseY);

  // if player eat the poisoned cheese
  if (d2 < playerRadius + preyRadius) {
    // play the swallow sound after eating the poisoned cheese
    if (!swallow_Sound.isPlaying()) {
      swallow_Sound.play();
      swallow_Sound.setVolume(1);
    }
    // reset poisoned cheese
    setup_PosionedCheese();

    // play the poison warning sound
    if (!poisoned_Sound.isPlaying() && !poisoned) {
      poisoned_Sound.play();
      poisoned_Sound.setVolume(1);
    }
    // get poisoned, slower speed, and unable to sprint
    poisoned = true;
    sprintable = false;
    speedDown = 0.65;

    // lose some health for eating the poisoned cheese
    playerHealth -= 5;
    playerHealth = constrain(playerHealth, 0, playerInitialHealth);
  }

  // Check if it's an overlap
  if (d < playerRadius + preyRadius) {
    // play the biting sound when each time touch the cheese
    if (!bite_Sound.isPlaying()) {
      bite_Sound.play();
      bite_Sound.setVolume(0.25);
    }
    // Increase the player health
    playerHealth += eatHealth;
    // Constrain to the possible range
    playerHealth = constrain(playerHealth, 0, playerInitialHealth);

    // Reduce the prey health
    preyHealth -= eatHealth;
    // Constrain to the possible range
    preyHealth = constrain(preyHealth, 0, preyMaxHealth);

    // Check if the prey died (health 0)
    if (preyHealth === 0) {
      // change cheese
      p = random(0, 1);
      // Move the "new" prey to a random position
      tx = random(0, 1000);
      ty = random(0, 1000);
      preyX = noise(tx) * (width) * preySpeedUp;
      preyY = noise(ty) * (height) * preySpeedUp;
      // Give it full health
      preyHealth = preyMaxHealth;
      // Track how many prey were eaten
      preyEaten += 1;

      // play the swallow sound after eating the cheese
      if (!swallow_Sound.isPlaying()) {
        swallow_Sound.play();
        swallow_Sound.setVolume(1);
      }

      // after eating one cheese, poison will be cured
      // be able to sprint again and move normally
      poisoned = false;
      sprintable = true;
      speedDown = 1;

      // for each 10 points earned, the prey moving speed will increase and more unpredictable
      // player will have slower speed and bigger body but slightly more health
      // poisoned cheese will also have faster speed
      if (preyEaten % 10 === 0 && preyEaten >= 10) {
        preySpeedUp += 0.07;
        pCheeseSpeed += 0.25;
        playerSpeed -= 0.05;
        playerRadius += 1;
        playerInitialHealth += 10;
      }
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
  preyX = noise(tx) * width * preySpeedUp;
  preyY = noise(ty) * height * preySpeedUp;

  // Screen wrapping
  if (preyX < 0) {
    preyX += width;
  } else if (preyX > width) {
    preyX -= width;
  }
  if (preyY < 0) {
    preyY += height;
  } else if (preyY > height) {
    preyY -= height;
  }
}

// spawn_PoisonedCheese()
//
// spawn the poisoned cheese with randomly decided p1 value
function spawn_PoisonedCheese() {
  if (p1 < 0.3) {
    image(cheesePImage2, pCheeseX, pCheeseY, preyRadius * 6, preyRadius * 6);
  } else if (p1 < 0.6 && p1 >= 0.3) {
    image(cheesePImage1, pCheeseX, pCheeseY, preyRadius * 6, preyRadius * 6);
  } else if (p1 < 1 && p1 >= 0.6) {
    image(cheesePImage0, pCheeseX, pCheeseY, preyRadius * 6, preyRadius * 6);
  }
}

// move_PoisonedCheese()
//
// move the poisoned cheese from the top to the bottom of the screen
function move_PoisonedCheese() {
  pCheeseY += pCheeseSpeed;
  if (pCheeseY > windowHeight + 150) {
    // if the cheese moves out of the screen, reset the poisoned cheese
    setup_PosionedCheese();
  }
}

// drawPrey()
//
// Draw the prey as an ellipse with alpha based on health
// with the randomly decided p value
function drawPrey() {
  if (p < 0.3) {
    image(cheeseImage2, preyX, preyY, preyRadius * 6, preyRadius * 6);
  } else if (p < 0.6 && p >= 0.3) {
    image(cheeseImage1, preyX, preyY, preyRadius * 6, preyRadius * 6);
  } else if (p < 1 && p >= 0.6) {
    image(cheeseImage0, preyX, preyY, preyRadius * 6, preyRadius * 6);
  }
}

// drawPlayer()
//
// Draw the player as an ellipse with alpha value based on health
function drawPlayer() {
  if (goingLeft) {
    image(mouseImage, playerX, playerY, playerRadius * 6, playerRadius * 6);
  } else {
    image(mouseImageFlipped, playerX, playerY, playerRadius * 6, playerRadius * 6);
  }
}

// showUI()
//
// draw the game UI when the gameplay
function showUI() {
  push();
  // health bar
  textAlign(LEFT, TOP);
  fill(255);
  textSize(32);
  text("HEALTH", width / 10 - 96, height / 10 - 36);
  // BG of health bar
  fill(100);
  rect(width / 10 + 48, height / 10 - 32, playerInitialHealth * 1.5, 32, 0, 16, 16, 0);
  // content of health bar
  fill(RED);
  rect(width / 10 + 48, height / 10 - 32, playerHealth * 1.5, 32, 0, 16, 16, 0);
  // frame of health bar
  stroke(255);
  strokeWeight(4);
  fill(100, 0);
  rect(width / 10 + 48, height / 10 - 32, playerInitialHealth * 1.5, 32, 0, 16, 16, 0);
  noStroke();
  // sprint indicator
  // if SHIFT is pressed down the icon will be lighted up, otherwise it will be dimmed
  imageMode(CORNER);
  if (keyIsDown(SHIFT) && !poisoned) {
    image(sprintIndicator, width / 10 - 105, height / 10, playerRadius * 4, playerRadius * 4);
  } else {
    image(notSprintIndicator, width / 10 - 105, height / 10, playerRadius * 4, playerRadius * 4);
  }
  // poisoned indicator will appear when the player is poisoned
  if (poisoned) {
    image(poisonIndicator, width / 10, height / 10, playerRadius * 4, playerRadius * 4)
  }
  // score
  fill(DARK_BLUE);
  text(`SCORE\n${preyEaten}`, width - 136, height / 10 - 48);
  pop();
}

// showGameOver()
//
// Display text about the game being over!
function showGameOver() {
  // stop the background music
  bg_Music.setVolume(0);
  push();
  // Set up the font
  textAlign(CENTER, CENTER);
  fill(DARK_BLUE);
  textSize(32);
  text(`YOUR BEST: ${bestScore}`, width / 2, height / 2 - 200);
  textSize(24);
  // record the best score and whether the player beats their best scores
  if (preyEaten > bestScore) {
    bestScore = preyEaten;
    scoreBeaten = true;
  }
  // having 2 different msgs whether the player beats their best scores
  if (scoreBeaten) {
    text("You beat your previous best score!", width / 2, height / 2 - 156);
  } else {
    text("You can do better! Believe in yourself.", width / 2, height / 2 - 156);
  }
  // if the player beats their records, play this once
  if (scoreBeaten && playOnce) {
    newRecord_Sound.play();
    newRecord_Sound.setVolume(0.75);
    playOnce = false;
    // if the player does not beat the record, play this once
  } else if (playOnce) {
    gameOver_Sound.play();
    gameOver_Sound.setVolume(0.75);
    playOnce = false;
  }
  fill(RED);
  // Set up the text
  textSize(128);
  text("GAME OVER", width / 2, height / 2 - 64);
  let achievement = `YOU ATE ${preyEaten} CHEESE\n`;
  achievement += `BEFORE YOU LEFT THIS WORLD`
  // Display it in the centre of the screen
  fill(255);
  textSize(32);
  text(achievement, width / 2, height / 2 + 64);
  textSize(64);
  text("RESTART", width / 2, height / 2 + 164);
  pop();
}

// check_RestartButton()
//
// check if the restart button is hovered
function check_RestartButton() {
  // determine whether the mouse is hovering the button
  let restartIsHovering = (dist(mouseX, mouseY, width / 2, height / 2 + 164) < 25 ||
    dist(mouseX, mouseY, width / 2 + 72, height / 2 + 164) < 50 ||
    dist(mouseX, mouseY, width / 2 - 72, height / 2 + 164) < 50)
  // hovering state
  if (restartIsHovering && gameOver) {
    textSize(64);
    fill(0);
    text("RESTART", width / 2, height / 2 + 164);
    // if the mouse is hovering and clicked, the game will restart
    if (mouseIsPressed) {
      gameOver = false;
      restartGame();
    }
    // unhovering state
  } else {
    textSize(64);
    fill(255);
    text("RESTART", width / 2, height / 2 + 164);
  }
}

// restartGame()
//
// reset the game and reset all the stats
function restartGame() {
  // reset playOnce
  playOnce = true;

  // loop the background music after restarting the game
  bg_Music.setVolume(0.5);
  bg_Music.loop();

  // reset player stats
  playerInitialHealth = 255;
  playerHealth = playerInitialHealth;
  playerSpeed = playerMaxSpeed;
  playerRadius = 25;
  // reset poison & sprint stat
  poisoned = false;
  sprintable = true;
  // reset speed down for player
  speedDown = 1;

  // reset prey stat
  preySpeedUp = 1;
  // reset poisoned cheese moving speed
  pCheeseSpeed = 5;
  // reset score
  preyEaten = 0;
  scoreBeaten = false;
  // reset their positions
  setupPrey();
  setupPlayer();
  setup_PosionedCheese();
}
