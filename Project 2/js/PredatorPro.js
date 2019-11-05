// PredatorPro
//
// A class that represents a simple predator (human) controlled by the computer
// Will hunt prey constantly
// When the player is close, it will follow and hunt the player instead
// Can be hurt by the player as well

class PredatorPro {
  // constructor
  //
  // Sets the initial values for the PredatorPro's properties
  // Either sets default values or uses the arguments provided
  constructor(x, y, speed, radius, texture, texture_flipped) {
    // Position
    this.x = x;
    this.y = y;
    // Velocity and speed
    this.vx = 0;
    this.vy = 0;
    this.speed = speed;
    // Time properties for noise() function
    this.tx = random(0, 1000); // To make x and y noise different
    this.ty = random(0, 1000); // we use random starting values
    // Display properties
    this.maxHealth = radius;
    this.health = this.maxHealth;
    this.texture = texture;
    this.texture_flipped = texture_flipped;
    this.faceLeft = true;
    // health
    this.healthLossPerMove = 0.05;
    this.healthGainPerEat = 0.5;

    this.radius = radius;
    this.campfirePosX = x;
    this.campfirePosY = y;
  }

  // move
  //
  // Updates the position according to velocity
  // Lowers health (as a cost of living)
  // Handles wrapping
  move() {
    // Set velocity via noise()
    this.vx = map(noise(this.tx), 0, 1, -this.speed, this.speed);
    this.vy = map(noise(this.ty), 0, 1, -this.speed, this.speed);

    if (this.vx < 0) {
      this.faceLeft = true;
    } else if (this.vx > 0) {
      this.faceLeft = false;
    }
    // lose health
    this.health -= this.healthLossPerMove;
    this.health = constrain(this.health, 0, this.maxHealth);
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    // Update time properties
    this.tx += 0.01;
    this.ty += 0.01;
    // Handle wrapping
    this.handleWrapping();
    // reset when dies
    if (this.health <= 0) {
      this.reset();
    }
  }
  // collide
  //
  // collide with trees in the game
  // generate an invisible, gentle force field around the tree
  // will stop the human from moving
  // but same as other collide functions
  collide(tree) {
    let d = dist(this.x, this.y, tree.x, tree.y);
    let dx = tree.x - this.x;
    let dy = tree.y - this.y;
    let angle = atan2(dy, dx);
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
  // hunt the prey
  handleEating(prey) {
    // Calculate distance from this human to the prey
    let d = dist(this.x, this.y, prey.x, prey.y);
    let dx = prey.x - this.x;
    let dy = prey.y - this.y;
    let angle = atan2(dy, dx);
    // if close enough
    if (d < 50) {
      // prey will keep a distance from the human
      if (d <= 45) {
        // move away from the human!
        prey.x += prey.speed / 3.5 * Math.cos(angle);
        prey.y += prey.speed / 3.5 * Math.sin(angle);
      }
      // approach the prey
      this.x = lerp(this.x, prey.x, 0.025);
      this.y = lerp(this.y, prey.y, 0.025);
      // if overlap
      if (d < this.radius + prey.radius) {
        // restore health
        this.health += this.healthGainPerEat;
        this.health = constrain(this.health, 0, this.maxHealth);
        // Decrease prey health by the same amount
        prey.health -= this.healthGainPerEat;
        // lower prey speed
        if (prey.health < prey.maxHealth / 2) {
          if (prey.speed > prey.originalSpeed / 4) {
            prey.speed = prey.speed / 2;
          }
        }
        // Check if the prey died and reset it if so
        if (prey.health <= 0) {
          prey.reset();
        }
      }
    } else {
      prey.speed = prey.originalSpeed; // reset prey speed
    }
  }
  // hunting
  //
  // hunt the player!
  hunting(predator) {
    // Calculate distance from this human to the player
    let d = dist(this.x, this.y, predator.x, predator.y);
    // winthin a radius
    if (d < 150) {
      // if human has over 50% health, chase the player
      if (this.health > this.maxHealth / 2) {
        this.x = lerp(this.x, predator.x, 0.025);
        this.y = lerp(this.y, predator.y, 0.025);
      }
      // if overlap, restore health
      if (d < this.radius + predator.radius) {
        this.health += (this.healthGainPerEat);
        this.health = constrain(this.health, 0, this.maxHealth);
        // Decrease player health
        predator.health -= 0.75;
      }
    }
  }

  // display
  //
  // Draw the human and its red health bar
  display(inGame) {
    push();
    fill(255);
    imageMode(CENTER);
    rectMode(CORNER);
    if (this.faceLeft) {
      image(this.texture, this.x, this.y, this.radius * 2, this.radius * 2);
    } else {
      image(this.texture_flipped, this.x, this.y, this.radius * 2, this.radius * 2);
    }
    // health bar
    if (inGame) {
      fill(100);
      rect(this.x - this.radius, this.y - 40, this.radius * 2, 5);
      fill(255, 0, 0);
      rect(this.x - this.radius, this.y - 40, this.health * 2, 5);
    }
    pop();
  }
  // reset
  //
  // respawn at the camp location
  reset() {
    // camp pos
    this.x = this.campfirePosX;
    this.y = this.campfirePosY;

    // Default health
    this.health = this.maxHealth;
  }
}
