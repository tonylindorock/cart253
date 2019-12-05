// SquareXL
//
// An special class extended from the soldier class
// This unit will not harm any moving units
// It only will head to the enemy base
// It does a lot damage to the enemy base and has the highest health
// If it explodes or gets destroyed, the explosion will kill any nearby hostile units

class SquareXL extends Soldier {
  constructor(x, y, playerId, mapId, uniqueId) {
    super(x, y, playerId, mapId, uniqueId);
    // health
    this.maxHealth = 600;
    this.health = this.maxHealth;
    // sizes
    this.originalSize = 100;
    this.size = this.originalSize;
    this.innerSize = this.originalSize;
    // cost
    this.cost = 42;
    // speed
    this.originalSpeed = 0.75;
    this.speed = this.originalSpeed + random(-0.5, 0.5);
    this.vx = 0;
    this.vy = 0;
    this.tx = random(0, 1000); // To make x and y noise different
    this.ty = random(0, 1000); // we use random starting values

    this.targeted = 0; // how many enemies are after it

    this.damage = 100;
    // rotation properties for animation
    this.rotation = 0;
    this.originalRotationSpeed = 1;
    this.rotationSpeed = this.originalRotationSpeed;
    this.animationFinished = false;

    this.theEnemyBase = null; // store the enemy base object
  }

  // attackBase(enemyBase)
  //
  // approach and attack the enemy base
  attackBase(enemyBase) {
    // distance
    let d = dist(this.x, this.y, this.enemyBaseX, this.enemyBaseY);
    let dx = this.enemyBaseX - this.x;
    let dy = this.enemyBaseY - this.y;
    let angle = atan2(dy, dx);
    if (enemyBase.health > 0){
      // move to it
      if (d >= 35) {
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
        // if it is close to the enemy base, it is considered to be under attack
        if (d < 150){
          enemyBase.underAttack = true;
          this.theEnemyBase = enemyBase;
        }
      // attack
      } else {
        if (!this.dead) {
          enemyBase.health -= this.damage;
          enemyBase.health = constrain(enemyBase.health, 0, enemyBase.maxHealth);
          this.dead = true;
          enemyBase.underAttack = false;
        }
      }
    }
    // variation to the movement
    // Set velocity via noise()
    this.vx = map(noise(this.tx), 0, 1, -0.1, 0.1);
    this.vy = map(noise(this.ty), 0, 1, -0.1, 0.1);
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    // Update time properties
    this.tx += 0.0001;
    this.ty += 0.0001;

    this.handleWrapping();
  }

  // attack(enemy)
  //
  // squareXL does not attack other soldier units
  attack(enemy) {}

  // display()
  //
  // display the squareXL
  // play an animation when explodes
  display() {
    push();
    rectMode(CENTER);
    ellipseMode(CENTER);
    angleMode(DEGREES);
    translate(this.x, this.y);
    rotate(this.rotation);
    stroke(255);
    strokeWeight(4);
    fill(this.color);
    // if dies, it will explode
    if (this.dead) {
      fill(255);
      rect(0, 0, this.innerSize, this.innerSize, 8);
      fill(255, 0);
      this.size += 3;
      this.innerSize -= 3;
      this.innerSize = constrain(this.innerSize, 0, 100);
      this.speed = 0;
      if (this.playOnce){
        Explode.play();
        this.playOnce = false;
      }
      if (this.innerSize <= 0) {
        this.animationFinished = true;
        // if it dies, the enemy base is no longer under attack
        if (this.theEnemyBase!=null){
          this.theEnemyBase.underAttack = false;
        }
      }
    }
    rect(0, 0, this.size, this.size, 8);
    if (!this.dead) {
      line(-10, 10, 10, -10);
      line(10, 10, -10, -10);
    }
    // different rotation directions for blue and red
    if (this.playerId === 0) {
      if (this.rotation < 90) {
        this.rotation += this.rotationSpeed;
      } else {
        this.rotation = this.rotationSpeed;
      }
    } else {
      if (this.rotation > -90) {
        this.rotation -= this.rotationSpeed;
      } else {
        this.rotation = this.rotationSpeed;
      }
    }
    pop();
  }
}
