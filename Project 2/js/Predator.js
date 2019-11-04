// Predator
//
// A class that represents a simple predator
// controlled by the arrow keys. It can move around
// the screen and consume Prey objects to maintain its health.

class Predator {
  // constructor
  //
  // Sets the initial values for the Predator's properties
  // Either sets default values or uses the arguments provided
  constructor(x, y, speed, radius, texture, texture_flipped, upKey, downKey, leftKey, rightKey, sprintKey) {
    // Position
    this.x = x;
    this.y = y;
    // Velocity and speed
    this.vx = 0;
    this.vy = 0;
    this.originalSpeed = speed;
    this.speed = this.originalSpeed;
    this.speedUp = 2; // when sprint

    this.radius = radius;
    // Health properties
    this.maxHealth = radius;
    this.health = this.maxHealth; // Must be AFTER defining this.maxHealth
    this.healthLossPerMove = 0.2;
    this.originalHealthPerEat = 0.5;
    this.healthGainPerEat = this.originalHealthPerEat;
    this.texture = texture;
    this.texture_flipped = texture_flipped;
    this.faceLeft = true;
    // Input properties
    this.upKey = upKey;
    this.downKey = downKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.sprintKey = sprintKey;

    this.sprinting = false;
    // record score
    this.score = 0;
    this.dead = false;
  }

  // handleInput
  //
  // Checks if an arrow key is pressed and sets the predator's
  // velocity appropriately.
  handleInput() {
    // Horizontal movement
    if (keyIsDown(this.sprintKey)) { // when sprinting multiply speedUp to the speed
      this.sprinting = true;
      if (keyIsDown(this.leftKey)) {
        this.faceLeft = true;
        this.vx = -this.speed * this.speedUp;
      } else if (keyIsDown(this.rightKey)) {
        this.faceLeft = false;
        this.vx = this.speed * this.speedUp;
      } else {
        this.vx = 0;
      }
      // Vertical movement
      if (keyIsDown(this.upKey)) {
        this.vy = -this.speed * this.speedUp;
      } else if (keyIsDown(this.downKey)) {
        this.vy = this.speed * this.speedUp;
      } else {
        this.vy = 0;
      }
    } else {
      this.sprinting = false;
      if (keyIsDown(this.leftKey)) {
        this.faceLeft = true;
        this.vx = -this.speed;
      } else if (keyIsDown(this.rightKey)) {
        this.faceLeft = false;
        this.vx = this.speed;
      } else {
        this.vx = 0;
      }
      // Vertical movement
      if (keyIsDown(this.upKey)) {
        this.vy = -this.speed;
      } else if (keyIsDown(this.downKey)) {
        this.vy = this.speed;
      } else {
        this.vy = 0;
      }
    }
  }

  // move
  //
  // Updates the position according to velocity
  // Lowers health (as a cost of living)
  // Handles wrapping
  move() {
    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Update health
    this.health -= this.healthLossPerMove;
    if (this.sprinting) {
      this.health -= this.healthLossPerMove * 1.5;
    }
    this.health = constrain(this.health, 0, this.maxHealth);

    if (this.health <= 0) {
      this.dead = true;
    }
    // Handle wrapping
    this.handleWrapping();
  }

  // handleWrapping
  //
  // Checks if the predator has gone off the canvas and
  // wraps it to the other side if so
  handleWrapping() {
    // Off the left or right
    if (this.x < 0) {
      this.x += width;
    } else if (this.x > width) {
      this.x -= width;
    }
    // Off the top or bottom
    if (this.y < 0) {
      this.y += height;
    } else if (this.y > height) {
      this.y -= height;
    }
  }

  // handleEating
  //
  // Takes a Prey object as an argument and checks if the predator
  // overlaps it. If so, reduces the prey's health and increases
  // the predator's. If the prey dies, it gets reset.
  handleEating(prey) {
    // Calculate distance from this predator to the prey
    let d = dist(this.x, this.y, prey.x, prey.y);
    // Check if the distance is less than their two radii (an overlap)
    if (d < this.radius + prey.radius) {
      // Increase predator health and constrain it to its possible range
      this.health += this.healthGainPerEat;
      this.health = constrain(this.health, 0, this.maxHealth);
      // Decrease prey health by the same amount
      prey.health -= this.healthGainPerEat;

      if (prey.health < prey.maxHealth / 2) {
        if (prey.speed > prey.originalSpeed / 4) {
          prey.speed = prey.speed / 2;
        }
      }
      // Check if the prey died and reset it if so
      if (prey.health < 2) {
        prey.reset();
        this.score+=0.5;
        if (this.score % 10 === 0 && this.score >= 10) {
          this.healthLossPerMove -= 0.005;
          this.healthLossPerMove = constrain(this.healthLossPerMove, 0.05, 0.2)
        }
      }
    }
}

  attacking(human){
    // Calculate distance from this predator to the prey
    let d = dist(this.x, this.y, human.x, human.y);
    // Check if the distance is less than their two radii (an overlap)
    if (d < this.radius + human.radius) {
      // Increase predator health and constrain it to its possible range
      this.health += this.healthGainPerEat;
      this.health = constrain(this.health, 0, this.maxHealth);
      // Decrease prey health by the same amount
      human.health -= 0.75;
      // Check if the prey died and reset it if so
      if (human.health < 2) {
        human.reset();
        this.score++;
        if (this.score % 10 === 0 && this.score >= 10) {
          this.healthLossPerMove -= 0.015;
          this.healthLossPerMove = constrain(this.healthLossPerMove, 0.05, 0.2)
        }
      }
    }
  }

  // display
  //
  // Draw the predator as an ellipse on the canvas
  // with a radius the same size as its current health.
  display() {
    push();
    rectMode(CORNER);
    imageMode(CENTER);
    noStroke();
    if (!this.dead) {
      if (this.faceLeft) {
        image(this.texture, this.x, this.y, this.radius * 2, this.radius * 2);
      } else {
        image(this.texture_flipped, this.x, this.y, this.radius * 2, this.radius * 2);
      }
      fill(100);
      rect(this.x - this.radius, this.y - 40, this.radius * 2, 5);
      fill(255);
      rect(this.x - this.radius, this.y - 40, this.health * 2, 5);
    }
    pop();
  }
}
