// PredatorPro
//
// A class that represents a simple predator controlled by the computer
//

class PredatorPro {

  // constructor
  //
  // Sets the initial values for the Predator's properties
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

    this.radius = radius;
    this.dead = false;
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
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    // Update time properties
    this.tx += 0.01;
    this.ty += 0.01;
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
  handleEating(predator) {
    // Calculate distance from this predator to the prey
    let d = dist(this.x, this.y, predator.x, predator.y);
    // Check if the distance is less than their two radii (an overlap)
    if (d < this.radius + predator.radius) {
      // Increase predator health and constrain it to its possible range
      this.health += this.healthGainPerEat;
      this.health = constrain(this.health, 0, this.maxHealth);
      // Decrease prey health by the same amount
      predator.health -= this.healthGainPerEat;
    }
  }

  // display
  //
  // Draw the predator as an ellipse on the canvas
  // with a radius the same size as its current health.
  display(inGame) {
    push();
    fill(255);
    rectMode(CORNER);
    this.radius = this.health;
    if (this.faceLeft) {
      image(this.texture, this.x, this.y, this.radius * 2, this.radius * 2);
    } else {
      image(this.texture_flipped, this.x, this.y, this.radius * 2, this.radius * 2);
    }
    if (inGame) {
      fill(100);
      rect(this.x - this.radius, this.y - 40, this.radius * 2, 5);
      fill(255, 0, 0);
      rect(this.x - this.radius, this.y - 40, this.health * 2, 5);
    }
    pop();
  }
}
