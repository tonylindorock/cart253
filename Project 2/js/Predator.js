// Predator
//
// A class representing the predator controlled by the player
// can eat prey and attack human and will get stronger over time

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
    this.maxHealth = this.radius;
    this.health = this.maxHealth; // Must be AFTER defining this.maxHealth
    this.healthLossPerMove = 0.15;
    this.originalHealthPerEat = 0.5;
    this.healthGainPerEat = this.originalHealthPerEat;
    // textures
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

    this.score = 0; // record score
    this.dead = false;
  }

  // handleInput
  //
  // Checks if a contorl key is pressed and sets the predator's
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
      this.health -= this.healthLossPerMove*1.5;
    }
    this.health = constrain(this.health, 0, this.maxHealth);

    // if no health, player dies
    if (this.health <= 0) {
      this.dead = true;
    }
    // Handle wrapping
    this.handleWrapping();
  }

  // collide
  //
  // collide with trees in the game
  // generate an invisible, gentle force field around the tree
  // However, it won't stop the player of course!
  collide(tree) {
    let d = dist(this.x, this.y, tree.x, tree.y);
    let dx = tree.x - this.x;
    let dy = tree.y - this.y;
    let angle = atan2(dy, dx); // get the angle
    // if get close to the tree, move away from it
    if (d < this.radius + tree.radius / 2) {
      this.x -= this.speed / 3.5 * Math.cos(angle);
      this.y -= this.speed / 3.5 * Math.sin(angle);
    }
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
    let dx = prey.x - this.x;
    let dy = prey.y - this.y;
    let angle = atan2(dy, dx);
    // let the prey keep a distance from the player
    if (d <= 100 && !this.dead) {
      prey.x += prey.speed / 3.5 * Math.cos(angle);
      prey.y += prey.speed / 3.5 * Math.sin(angle);


      // Check if the distance is less than their two radii (an overlap)
      if (d < this.radius + prey.radius) {
        // Increase predator health and constrain it to its possible range
        this.health += this.healthGainPerEat;
        this.health = constrain(this.health, 0, this.maxHealth);
        // Decrease prey health by the same amount
        prey.health -= this.healthGainPerEat;

        // if the prey is hurt (<50% health), slow it down
        if (prey.health < prey.maxHealth / 2) {
          if (prey.speed > prey.originalSpeed / 4) {
            prey.speed = prey.speed / 2;
          }
        }
        // Check if the prey died and reset it if so
        if (prey.health <= 0) {
          prey.reset();
          this.score += 0.5; // 0.5 point per prey
          // if gets 10 points, player will be stronger
          if (this.score % 10 === 0 && this.score >= 10) {
            this.healthLossPerMove -= 0.005;
            this.healthLossPerMove = constrain(this.healthLossPerMove, 0.1, 0.15)
          }
        }
      }
    } else {
      prey.speed = prey.originalSpeed; // reset prey speed to let them get away
    }
  }

  // attacking
  //
  // handle attacking human
  // if human dies, it will be reseted
  attacking(human) {
    // Calculate distance from this predator to the human
    let d = dist(this.x, this.y, human.x, human.y);
    // Check if the distance is less than their two radii (an overlap)
    if (d < this.radius + human.radius) {
      // Increase predator health and constrain it to its possible range
      this.health += this.healthGainPerEat;
      this.health = constrain(this.health, 0, this.maxHealth);
      // Decrease human health
      human.health -= 0.75; // a fair fight
      // Check if the human died and reset it if so
      if (human.health <= 0) {
        human.reset();
        this.score++; // 1 point per human
        if (this.score % 10 === 0 && this.score >= 10) {
          this.healthLossPerMove -= 0.015;
          this.healthLossPerMove = constrain(this.healthLossPerMove, 0.1, 0.15)
        }
      }
    }
  }

  // display
  //
  // Draw the predator and its white health bar
  display() {
    push();
    rectMode(CORNER);
    imageMode(CENTER);
    noStroke();
    // display if the player is not dead
    if (!this.dead) {
      if (this.faceLeft) {
        image(this.texture, this.x, this.y, this.radius * 2, this.radius * 2);
      } else {
        image(this.texture_flipped, this.x, this.y, this.radius * 2, this.radius * 2);
      }
      // health bar
      fill(100);
      rect(this.x - this.radius, this.y - 40, this.radius * 2, 5);
      fill(255); // white
      rect(this.x - this.radius, this.y - 40, this.health * 2, 5);
    }
    pop();
  }
}
