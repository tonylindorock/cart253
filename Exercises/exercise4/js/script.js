"use strict";

// Pong PLUS
// Modified by Yichen Wang
//
// A "simple" implementation of Pong with no scoring system
// just the ability to play the game with the keyboard.
// By catching the ball, the player will gain 1 bullet to shoot at the component.
// Get hit by the bullet will disable the player's mobility temporarily.
// The first player reaches 25 points win.
//
// Up, down, left, right keys control the right hand paddle, W A S D keys control
// the left hand paddle
// F to fire for the left player while L to fire for the right player
//
// Click in starting or restarting screen starts the game in Normal Mode
// Holding Q while clicking will enable Quick Mode
//
// Normal Mode
// The player gets 1 point each time
//
// Quick Mode
// The player gets 5 points each time


// Whether the game has started
let playing = false;

// colors RGB for background
let r;
let g;
let b;

// paddle score rank (colors)
let FINE = "#FFFFFF"; // white
let GOOD = "#45ff4e"; // green
let GREAT = "#00eaff"; // blue
let EXCEL = " #ffde38"; // gold
let PERFECT = "#ff7373"; // red

// BALL

// A ball object with the properties of
// position, size, velocity, and speed
let ball = {
  x: 0,
  y: 0,
  size: 20,
  vx: 0,
  vy: 0,
  speed: 5
}

// PADDLES

// Basic definition of a left paddle object with its key properties of
// position, size, velocity, and speed
// ammo, getHit, score counts, lastScored, and id
let leftPaddle = {
  x: 0,
  y: 0,
  w: 20,
  h: 70,
  vx: 0,
  vy: 0,
  speed: 5,
  upKey: 87,
  downKey: 83,
  leftKey: 65,
  rightKey: 68,
  fireKey: 70,
  ammo: 0,
  getHit: false,
  score: 0,
  lastScored: false,
  id: 0
}

// bullet object for left player
// position, radius, velocity, and id
let leftBullet = {
  x: 0,
  y: 0,
  r: 12,
  vx: 20,
  ID: 0
}

// RIGHT PADDLE

// Basic definition of a left paddle object with its key properties of
// position, size, velocity, and speed
// ammo, getHit, score counts, lastScored, and id
let rightPaddle = {
  x: 0,
  y: 0,
  w: 20,
  h: 70,
  vx: 0,
  vy: 0,
  speed: 5,
  upKey: 38,
  downKey: 40,
  leftKey: 37,
  rightKey: 39,
  fireKey: 76,
  ammo: 0,
  getHit: false,
  score: 0,
  lastScored: false,
  id: 1
}

// bullet object for right player
// position, radius, velocity, and id
let rightBullet = {
  x: 0,
  y: 0,
  r: 12,
  vx: -20,
  ID: 1
}

// remember which side fires
let fireLeft = false;
let fireRight = false;

// if the game is in quick mode
let quickMode = false;

// record the winner
let winner = "";
let winnerDir = "";
// if the game is over
let gameOver = false;

// A variable to hold the beep sound we will play on bouncing
let beepSFX;
// other sound effects
let fire_SFX;
let cheer_SFX;
let fail_SFX;

// let the sound play only once
let playOnce = true;

// preload()
//
// load the sounds
function preload() {
  // Loads the beep audio for the sound of bouncing
  beepSFX = loadSound("assets/sounds/beep.wav");
  beepSFX.setVolume(0.25);

  // the sound to play when the player fires
  fire_SFX = loadSound("assets/sounds/laser.wav");
  fire_SFX.setVolume(1);

  // the sound to play when the game is over
  cheer_SFX = loadSound("assets/sounds/cheer.wav");
  cheer_SFX.setVolume(1);

  // the sound to play when the ball goes off the edge
  fail_SFX = loadSound("assets/sounds/fail.wav");
  fail_SFX.setVolume(0.5);
}

// setup()
//
// Creates the canvas, sets up the drawing modes,
// Sets initial values for paddle and ball positions
// and velocities.
function setup() {
  // Create canvas and set drawing modes
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();
  fill(255);
  textFont("Arial");

  // give r, g, b random values and set them as background
  setColor();
  background(r, g, b);

  // setup objects
  setupPaddles();
  resetBall();
  prepareBullet();
}

// setupPaddles()
//
// Sets the starting positions of the two paddles
function setupPaddles() {
  // Initialise the left paddle position
  leftPaddle.x = 0 + leftPaddle.w;
  leftPaddle.y = height / 2;

  // Initialise the right paddle position
  rightPaddle.x = width - rightPaddle.w;
  rightPaddle.y = height / 2;
}

// prepareBullet()
//
// set up the bullets in their positions
function prepareBullet() {
  leftBullet.x = leftPaddle.x;
  leftBullet.y = leftPaddle.y;
  rightBullet.x = rightPaddle.x;
  rightBullet.y = rightPaddle.y;
}

// draw()
//
// Calls the appropriate functions to run the game
// See how tidy it looks?!
function draw() {
  // Fill the background
  background(r, g, b);

  if (playing && !gameOver) {
    // If the game is in play, we handle input and move the elements around
    handleInput(leftPaddle);
    handleInput(rightPaddle);

    fireBullet();
    moveBullet(leftBullet);
    moveBullet(rightBullet);

    updatePaddle(leftPaddle);
    updatePaddle(rightPaddle);

    updateBall();

    checkBulletPath(leftBullet, rightPaddle);
    checkBulletPath(rightBullet, leftPaddle);

    checkBallWallCollision();
    checkBallPaddleCollision(leftPaddle);
    checkBallPaddleCollision(rightPaddle);

    // Check if the ball went out of bounds and respond if so
    // (Note how we can use a function that returns a truth value
    // inside a conditional!)
    if (ballIsOutOfBounds()) {
      // If it went off either side, reset it
      resetBall();
      // This is where we would likely count points, depending on which side
      // the ball went off...
      checkWinner(leftPaddle);
      checkWinner(rightPaddle);
    }
    // show UI of ammo
    showUI(leftPaddle);
    showUI(rightPaddle);
  } else {
    // Otherwise we display the message to start the game
    displayStartMessage();
  }

  // We always display the paddles and ball so it looks like Pong!
  push();
  displayPaddleRank(leftPaddle);
  displayPaddle(leftPaddle);
  pop();
  push();
  displayPaddleRank(rightPaddle);
  displayPaddle(rightPaddle);
  pop();
  displayBall();

  // if game is over, display this
  if (gameOver) {
    background(r, g, b);
    gameOverScreen();

    setupPaddles();
    push();
    displayPaddleRank(leftPaddle);
    displayPaddle(leftPaddle);
    pop();
    push();
    displayPaddleRank(rightPaddle);
    displayPaddle(rightPaddle);
    pop();
  }
}

// setColor()
//
// set r, g, b randomly in a range for the background color
function setColor() {
  // 74 - 161 gives nice slightly dark color
  r = random(74, 161);
  g = random(74, 161);
  b = random(74, 161);
}

// handleInput()
//
// Checks the mouse and keyboard input to set the velocities of the
// left and right paddles respectively.
function handleInput(paddle) {
  // Move the paddle based on its up and down keys
  // If the up key is being pressed
  if (keyIsDown(paddle.upKey) && !paddle.getHit) {
    // Move up
    paddle.vy = -paddle.speed;
  }
  // Otherwise if the down key is being pressed
  else if (keyIsDown(paddle.downKey) && !paddle.getHit) {
    // Move down
    paddle.vy = paddle.speed;
  } else if (keyIsDown(paddle.leftKey) && !paddle.getHit) {
    paddle.vx = -paddle.speed;
  } else if (keyIsDown(paddle.rightKey) && !paddle.getHit) {
    paddle.vx = paddle.speed;
  } else {
    // Otherwise stop moving
    paddle.vx = 0;
    paddle.vy = 0;
  }
}

// keyPressed()
//
// handle firing from both players
// set position of bullet to the center of paddle
// record ammo counts
function keyPressed() {
  // left player
  if (keyCode === leftPaddle.fireKey) {
    if (!fireLeft && leftPaddle.ammo != 0) {
      leftBullet.x = leftPaddle.x;
      leftBullet.y = leftPaddle.y;

      fireLeft = true;
      leftPaddle.ammo--;
      leftPaddle.ammo = constrain(leftPaddle.ammo, 0, 5);

      fire_SFX.play();
    }
  }
  // right player
  if (keyCode === rightPaddle.fireKey) {
    if (!fireRight && rightPaddle.ammo != 0) {
      rightBullet.x = rightPaddle.x;
      rightBullet.y = rightPaddle.y;

      fireRight = true;
      rightPaddle.ammo--;
      rightPaddle.ammo = constrain(rightPaddle.ammo, 0, 5);

      fire_SFX.play();
    }
  }
}

// fireBullet()
//
// draw the bullet
function fireBullet() {
  push();
  fill(0);
  if (fireLeft) {
    ellipse(leftBullet.x, leftBullet.y, leftBullet.r);
  }
  if (fireRight) {
    ellipse(rightBullet.x, rightBullet.y, rightBullet.r);
  }
  pop();
}

// moveBullet(bullet)
//
// shoot the bullet
function moveBullet(bullet) {
  if (fireLeft || fireRight) {
    bullet.x += bullet.vx;
  }
}

// checkBulletPath(bullet,paddle)
//
// check if the bullet goes off the screen or hit the player
function checkBulletPath(bullet, paddle) {
  let bulletTop = bullet.y - bullet.r / 2;
  let bulletBottom = bullet.y + bullet.r / 2;
  let bulletLeft = bullet.x - bullet.r / 2;
  let bulletRight = bullet.x + bullet.r / 2;

  let paddleTop = paddle.y - paddle.h / 2;
  let paddleBottom = paddle.y + paddle.h / 2;
  let paddleLeft = paddle.x - paddle.w / 2;
  let paddleRight = paddle.x + paddle.w / 2;

  // left player's bullet
  if (bullet.ID === 0 && fireLeft) {
    // go off the screen
    if (bullet.x - bullet.r > width) {
      fireLeft = false;
      resetBullet("LEFT");
      // hit the right player
    } else if (bulletBottom > paddleTop && bulletTop < paddleBottom) {
      if (bulletRight > paddleLeft) {
        fireLeft = false;
        resetBullet("LEFT");

        rightPaddle.getHit = true;
        console.log("right got hit");
      }
    }
  }
  // right player's bullet
  if (bullet.ID === 1 && fireRight) {
    // go off the screen
    if (bullet.x + bullet.r < 0) {
      fireRight = false;
      resetBullet("RIGHT");
      // hit the left player
    } else if (bulletBottom > paddleTop && bulletTop < paddleBottom) {
      if (bulletLeft < paddleRight) {
        fireRight = false;
        resetBullet("RIGHT");

        leftPaddle.getHit = true;
        console.log("left got hit");
      }
    }
  }
}

// resetBullet(side)
//
// reset bullet position with specified side
function resetBullet(side) {
  if (side === "LEFT") {
    leftBullet.x = leftPaddle.x;
    leftBullet.y = leftPaddle.y;
  } else if (side === "RIGHT") {
    rightBullet.x = rightPaddle.x;
    rightBullet.y = rightPaddle.y;
  }
}

// updatePositions()
//
// Sets the positions of the paddles and ball based on their velocities
function updatePaddle(paddle) {
  // Update the paddle position based on its velocity
  // paddle x movement will be limited
  paddle.x += paddle.vx;
  if (paddle.id === 0) {
    paddle.x = constrain(paddle.x, 20, 80);
  } else if (paddle.id === 1) {
    paddle.x = constrain(paddle.x, width - 80, width - 20);
  }
  paddle.y += paddle.vy;
}

// updateBall()
//
// Sets the position of the ball based on its velocity
function updateBall() {
  // Update the ball's position based on velocity
  ball.x += ball.vx;
  ball.y += ball.vy;
}

// ballIsOutOfBounds()
//
// Checks if the ball has gone off the left or right
// Returns true if so, false otherwise
function ballIsOutOfBounds() {
  // Check for ball going off the sides
  if (ball.x < 0 || ball.x > width) {
    fail_SFX.play();
    if (ball.x < 0) {
      if (quickMode) {
        rightPaddle.score += 5;
      } else {
        rightPaddle.score += 1;
      }
      rightPaddle.lastScored = true;
      leftPaddle.lastScored = false;

      leftPaddle.getHit = false;
    } else if (ball.x > width) {
      if (quickMode) {
        leftPaddle.score += 5;
      } else {
        leftPaddle.score += 1;
      }
      leftPaddle.lastScored = true;
      rightPaddle.lastScored = false;

      rightPaddle.getHit = false;
    }
    console.log("left: " + leftPaddle.score + "\nright: " + rightPaddle.score);
    return true;
  } else {
    return false;
  }
}

// checkBallWallCollision()
//
// Check if the ball has hit the top or bottom of the canvas
// Bounce off if it has by reversing velocity
// Play a sound
function checkBallWallCollision() {
  // Check for collisions with top or bottom...
  if (ball.y < 0 || ball.y > height) {
    // It hit so reverse velocity
    ball.vy = -ball.vy;
    // Play our bouncing sound effect by rewinding and then playing
    beepSFX.currentTime = 0;
    beepSFX.play();
  }
}

// checkBallPaddleCollision(paddle)
//
// Checks for collisions between the ball and the specified paddle
function checkBallPaddleCollision(paddle) {
  // VARIABLES FOR CHECKING COLLISIONS

  // We will calculate the top, bottom, left, and right of the
  // paddle and the ball to make our conditionals easier to read...
  let ballTop = ball.y - ball.size / 2;
  let ballBottom = ball.y + ball.size / 2;
  let ballLeft = ball.x - ball.size / 2;
  let ballRight = ball.x + ball.size / 2;

  let paddleTop = paddle.y - paddle.h / 2;
  let paddleBottom = paddle.y + paddle.h / 2;
  let paddleLeft = paddle.x - paddle.w / 2;
  let paddleRight = paddle.x + paddle.w / 2;

  // First check the ball is in the vertical range of the paddle
  if (ballBottom > paddleTop && ballTop < paddleBottom) {
    // Then check if it is touching the paddle horizontally
    if (ballLeft < paddleRight && ballRight > paddleLeft) {
      // Then the ball is touching the paddle
      // Reverse its vx so it starts travelling in the opposite direction
      ball.vx = -ball.vx;
      // Play our bouncing sound effect by rewinding and then playing
      if (!beepSFX.isPlaying()) {
        beepSFX.currentTime = 0;
        beepSFX.play();
      }
      // give the player 1 ammo if ammo isn't full
      if (paddle.ammo < 5) {
        paddle.ammo++;
      }
      // player mobility will be enabled after the ball goes off their side
      if (paddle.id === 0) {
        leftPaddle.getHit = false;
      }
      if (paddle.id === 1) {
        rightPaddle.getHit = false;
      }
    }
  }
}

// displayPaddle(paddle)
//
// Draws the specified paddle
function displayPaddle(paddle) {
  // Draw the paddles
  push();
  stroke(255);
  strokeWeight(4);
  rect(paddle.x, paddle.y, paddle.w, paddle.h, 32, 32, 32, 32);
  pop();
}

// displayPaddleRank(paddle)
//
// give players colors to show their ranks/scores
// white is FINE, green is GOOD, blue is GREAT, yellow is EXCEL, red is PERFECT
function displayPaddleRank(paddle) {
  if (paddle.score < 5) {
    fill(FINE);
  } else if (paddle.score >= 5 && paddle.score < 10) {
    fill(GOOD);
  } else if (paddle.score >= 10 && paddle.score < 15) {
    fill(GREAT);
  } else if (paddle.score >= 15 && paddle.score < 20) {
    fill(EXCEL);
  } else if (paddle.score >= 20) {
    fill(PERFECT);
  }
}

// checkWinner(paddle)
//
// check who is the winner with 25 points
// handle if the game is over
function checkWinner(paddle) {
  if (paddle.score >= 25) {
    if (paddle.id === 0) {
      winner = "LEFT";
      winnerDir = "<==";
    } else if (paddle.id === 1) {
      winner = "RIGHT";
      winnerDir = "==>";
    }
    gameOver = true;
    playing = false;
  }
}

// displayBall()
//
// Draws the ball on screen as a square
function displayBall() {
  // Draw the ball
  ellipse(ball.x, ball.y, ball.size);
}

// resetBall()
//
// Sets the starting position and velocity of the ball
function resetBall() {
  let randDir = random();
  // Initialise the ball's position and velocity
  ball.x = width / 2;
  ball.y = height / 2;
  ball.vx = ball.speed;
  // let the ball go towards the player who scores last
  if (leftPaddle.lastScored) {
    ball.vx = -ball.vx;
  } else if (rightPaddle.lastScored) {
    ball.vx = ball.vx;
  } else {
    // if the game just starts, give the ball a random direction
    if (0.5 <= randDir < 1) {
      ball.vx = -ball.vx;
    }
  }
  // random speed for the ball
  ball.vy = random(ball.speed, ball.speed * 1.5);
}

// showUI(paddle)
//
// display the game model and players' ammo counts
function showUI(paddle) {
  push();
  textStyle(BOLD);
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(25);
  if (!quickMode) {
    text("Normal Mode", width / 2, height / 2 - 300);
  } else {
    text("Quick Mode", width / 2, height / 2 - 300);
  }
  textSize(24);
  fill(255);
  if (paddle.id === 0) {
    textAlign(LEFT, CENTER);
    text("AMMO", width / 2 - 564, height / 2 - 300);
    textSize(48);
    text(paddle.ammo, width / 2 - 564, height / 2 - 264);
  } else if (paddle.id === 1) {
    textAlign(RIGHT, CENTER);
    text("AMMO", width / 2 + 564, height / 2 - 300);
    textSize(48);
    text(paddle.ammo, width / 2 + 564, height / 2 - 264);
  }
  pop();
}

// displayStartMessage()
//
// Shows a message about how to start the game
// Also shows title, rule, controls, and hints
function displayStartMessage() {
  push();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(48);
  text("PONG PLUS", width / 2, height / 2 - 300);
  textSize(32);
  text("try not to let the ball go off your side of the edge", width / 2, height / 2 - 256);
  textSize(28);
  fill(25);
  text("+\ncatch the ball to gain bullets to shoot at your component" +
    "\nget hit by a bullet will disable your mobility temporarily" +
    "\nthe first player reaches 25 points wins", width / 2, height / 2 - 164);
  fill(255);
  textSize(32);
  textAlign(LEFT, CENTER);
  text("WASD to move\nF to fire", width / 2 - 500, height / 2);
  textAlign(RIGHT, CENTER);
  text("ARROWKEYS to move\nL to fire", width / 2 + 500, height / 2);
  textAlign(CENTER, CENTER);
  fill(25);
  text("While pressing Q to play in Quick Mode (optional)", width / 2, height / 2 + 186);
  fill(255);
  textSize(100);
  text("CLICK TO START", width / 2, height / 2 + 256);
  pop();
}

// gameOverScreen()
//
// display who wins the game if the game is over
function gameOverScreen() {
  // play the sound only once
  if (!cheer_SFX.isPlaying() && playOnce) {
    cheer_SFX.play();
    playOnce = false;
  }
  push();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(48);
  text("PONG PLUS", width / 2, height / 2 - 300);
  textSize(32);
  text("one shall stand, one shall fall", width / 2, height / 2 - 256);
  textSize(48);
  text("THE PLAYER OF THE " + winner + " WON!\n" + winnerDir, width / 2, height / 2);
  textSize(32);
  fill(25);
  text("While pressing Q to play in Quick Mode (optional)", width / 2, height / 2 + 186);
  textSize(100);
  fill(255);
  text("CLICK TO RESTART", width / 2, height / 2 + 256);
  pop();
}

// mousePressed()
//
// Here to require a click to start playing the game
// Which will help us be allowed to play audio in the browser
function mousePressed() {
  if (!playing && !gameOver) {
    playing = true;
    // if Q is holding down while clicking, quick mode will be played
    if (keyIsDown(81)) {
      quickMode = true;
    }
  } else if (gameOver) {
    quickMode = false;
    if (keyIsDown(81)) {
      quickMode = true;
    }
    // reset
    playing = true;
    gameOver = false;
    playOnce = true;
    console.log("Game restarted");
    // reset player stats
    resetStats(leftPaddle);
    resetStats(rightPaddle);
  }
}

// resetStats(paddle)
//
// reset player stats
function resetStats(paddle) {
  paddle.score = 0;
  paddle.ammo = 0;
  paddle.getHit = false;
  paddle.lastScored = false;
}
