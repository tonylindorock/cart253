// Prey
//
// A class that represents a simple prey that moves
// on screen based on a noise() function. It can move around
// the screen and be consumed by Predator objects.

class Prey {

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
    this.originalSpeed = speed;
    this.speed = this.originalSpeed;
    // Time properties for noise() function
    this.tx = random(0, 1000); // To make x and y noise different
    this.ty = random(0, 1000); // we use random starting values
    // Health properties
    this.maxHealth = radius;
    this.health = this.maxHealth; // Must be AFTER defining this.maxHealth
    this.healthLossPerMove = 0.01;
    this.healthGainPerEat = 0.025;
    // Display properties
    this.texture = texture;
    this.texture_flipped = texture_flipped;
    this.faceLeft = true;

    this.radius = radius;
  }

  // move
  //
  // Sets velocity based on the noise() function and the Prey's speed
  // Moves based on the resulting velocity and handles wrapping
  move() {
    // Set velocity via noise()
    this.vx = map(noise(this.tx), 0, 1, -this.speed, this.speed);
    this.vy = map(noise(this.ty), 0, 1, -this.speed, this.speed);
    if (this.vx < 0) {
      this.faceLeft = true;
    }
    if (this.vx > 0) {
      this.faceLeft = false;
    }
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
    if (this.health<=0){
      this.reset();
    }
  }

  collide(tree){
    let d = dist(this.x, this.y, tree.x, tree.y);
    let dx = tree.x-this.x;
    let dy = tree.y-this.y;
    let angle = atan2(dy, dx);
    if (d<this.radius+tree.radius/2){
      this.x -= this.speed/3.5 * Math.cos(angle);
      this.y -= this.speed/3.5 * Math.sin(angle);
    }
  }

  // handleWrapping
  //
  // Checks if the prey has gone off the canvas and
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

  handleEating(plant){
    // Calculate distance from this predator to the prey
    let d = dist(this.x, this.y, plant.x, plant.y);
    // Check if the distance is less than their two radii (an overlap)
    if (d < 100 && this.health<=this.maxHealth/2){
      this.x = lerp(this.x, plant.x, 0.01);
      this.y = lerp(this.y, plant.y, 0.01);
    }
    if (d < this.radius + plant.radius) {
      this.health += this.healthGainPerEat;
      this.health = constrain(this.health, 0, this.maxHealth);
      // Decrease prey health by the same amount
      plant.health -= this.healthGainPerEat;
      // Check if the prey died and reset it if so
      if (plant.health <= 0) {
        plant.reset();
      }
    }

  }

  // display
  //
  // Draw the prey as an ellipse on the canvas
  // with a radius the same size as its current health.
  display(inGame) {
    push();
    rectMode(CORNER);
    noStroke();
    imageMode(CENTER);
    //ellipse(this.x,this.y,100);
    if (this.faceLeft) {
      image(this.texture, this.x, this.y, this.radius * 2, this.radius * 2);
    } else {
      image(this.texture_flipped, this.x, this.y, this.radius * 2, this.radius * 2);
    }
    if (inGame) {
      fill(100);
      rect(this.x - this.radius, this.y - 40, this.radius * 2, 5);
      fill(0, 255, 0);
      rect(this.x - this.radius, this.y - 40, this.health * 2, 5);
    }
    pop();
  }

  // reset
  //
  // Set the position to a random location and reset health
  // and radius back to default
  reset() {
    // Random position
    this.x = random(0, width);
    this.y = random(0, height);

    this.speed = this.originalSpeed;
    // Default health
    this.health = this.maxHealth;
  }
}
