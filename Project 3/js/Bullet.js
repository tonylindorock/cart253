// Bullet
//
// A child class of CircleShooter class.
// Used to be fired at the enemy unit and hurt them
// Each bullet will respawn to be shot again after it reaches over 250 distance units

class Bullet extends CircleShooter {
  constructor(x, y, targetX, targetY, playerId, uniqueId) {
    super(x, y, playerId, -1, uniqueId);
    // bullet position
    this.bulletX = x;
    this.bulletY = y;
    // start position
    this.startX = this.bulletX;
    this.startY = this.bulletY;
    // target position
    this.targetX = targetX;
    this.targetY = targetY;
    // sizes
    this.size = 10;
    this.innerSize = this.size;

    this.speed = 5;
    this.damage = 7;
    this.hit = false; // whether it's hit or miss

    this.dead = false; // if the bullet fly out of range, it dies

    this.displayBullet = true;
    this.runOnce = true; // run only once

    this.playerId = playerId; // id
    // color
    if (this.playerId == 0) {
      this.color = "#4fc7fb"; // blue
    } else if (this.playerId == 1) {
      this.color = "#FB524F"; // red
    }
  }

  // moveTo(target)
  //
  // fly to the enemy to hurt them
  // or fly out of range
  moveTo(target) {
    // distance to target
    let d = dist(this.bulletX, this.bulletY, target.x, target.y);
    // distance to start point
    let d2 = dist(this.bulletX, this.bulletY, this.startX, this.startY);
    let dx = this.targetX - this.startX;
    let dy = this.targetY - this.startY;
    let angle = atan2(dy, dx);
    // move to target
    this.bulletX += this.speed * cos(angle);
    this.bulletY += this.speed * sin(angle);
    // if the distance to start point greater than 250
    // make the bullet disappear
    if (d2 >= 250) {
      this.dead = true;
    }
    // if hit, damage the enemy
    if (d < target.size / 2 && this.runOnce) {
      target.health -= this.damage;
      target.health = constrain(target.health, 0, target.maxHealth);
      this.runOnce = false;
      this.hit = true;
    }
    this.display();
  }

  // display()
  //
  // display the bullet
  display() {
    if (this.displayBullet) {
      push();
      ellipseMode(CENTER);
      rectMode(CENTER)
      angleMode(DEGREES);
      noStroke();
      fill(255);
      // if hit play an animation
      if (this.hit) {
        this.speed = 0;
        this.size += 1;
        this.innerSize -= 1;
        if (this.size >= 20 && this.uniqueId != -1) {
          this.displayBullet = false;
          this.speed = 5;
        }else if (this.size >= 30){
          this.displayBullet = false;
          this.speed = 10;
        }
        ellipse(this.bulletX, this.bulletY, this.innerSize);
        stroke(255);
        strokeWeight(2);
        fill(255, 0);
      }
      ellipse(this.bulletX, this.bulletY, this.size);
      pop();
    }
  }

  // reset()
  //
  // might be useful
  reset() {
    this.bulletX = this.x;
    this.bulletY = this.y;
    this.hit = false;
  }
}
