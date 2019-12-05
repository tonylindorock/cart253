// CircleDemo
//
// An unique class extended from the soldier class
// Circle demo is a powerful class. It can destroy most of the classes.
// However, it will die when it comes in contact with any enemy.
// It can kill any sqaure, circleShooter, circleDemo units instantly.
// It has a decent health.

class CircleDemo extends Soldier {
  constructor(x, y, playerId, mapId, uniqueId) {
    super(x, y, playerId, mapId, uniqueId);
    this.innerSize = this.size;
    // health
    this.maxHealth = 35;
    this.health = this.maxHealth;
    // cost
    this.cost = 20;
    // speed
    this.originalSpeed = 2;
    this.speed = this.originalSpeed + random(-0.5, 0.5);
    this.vx = 0;
    this.vy = 0;
    this.tx = random(0, 1000); // To make x and y noise different
    this.ty = random(0, 1000); // we use random starting values
    // damage
    this.damage = 40;

    this.obtainedTarget = false;
    this.targeted = 0; // how many enemies are after it
    this.targetId = -1; // targeted enemy id
    this.attacking = false; // if attacking

    this.runOnce = true;
    this.animationFinished = false;

    this.theEnemyBase = null;
  }

  // attackBase(enemyBase)
//
// approach and attack the enemy base
  attackBase(enemyBase) {
    let d = dist(this.x, this.y, this.enemyBaseX, this.enemyBaseY);
    let dx = this.enemyBaseX - this.x;
    let dy = this.enemyBaseY - this.y;
    let angle = atan2(dy, dx);
    if (enemyBase.health>0){
      if (d >= 35) {
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
      } else {
        enemyBase.health -= this.damage;
        enemyBase.health = constrain(enemyBase.health, 0, enemyBase.maxHealth);
        this.dead = true;
        enemyBase.underAttack = true;
        this.theEnemyBase = enemyBase;
      }
    }
    this.handleWrapping();
  }

  // attack(enemy)
  //
  // select an enemy and keep attacking it until it dies
  attack(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    if (d < 300 && this.targetId < 0 && (enemy.health >= enemy.maxHealth/2 || enemy.uniqueId === 100) && !this.dead && !enemy.dead) {
      this.targetId = enemy.uniqueId;
      this.obtainedTarget = true;
      this.attacking = true;
    }
    let dx = enemy.x - this.x;
    let dy = enemy.y - this.y;
    let angle = atan2(dy, dx);
    if (this.targetId === enemy.uniqueId) {
      if (d > 15) {
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
      }
      if (d < 30) {
        if (!this.dead && !enemy.dead) {
          enemy.health -= this.damage;
          this.dead = true;
        }
      }
      if (this.dead && !enemy.dead && this.obtainedTarget) {
        if (enemy.targetId === this.uniqueId) {
          enemy.targetId = -1;
        }
      }
      if (enemy.dead) {
        this.targetId = -1;
        this.obtainedTarget = false;
        this.attacking = false;
      }
    }

    // Set velocity via noise()
    this.vx = map(noise(this.tx), 0, 1, -0.05, 0.05);
    this.vy = map(noise(this.ty), 0, 1, -0.05, 0.05);
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    // Update time properties
    this.tx += 0.0001;
    this.ty += 0.0001;

    this.handleWrapping();
  }

  // display()
  //
  // display the circleDemo
  // play an animation when explodes
  display() {
    if (this.show){
      push();
      rectMode(CENTER);
      ellipseMode(CENTER);
      angleMode(DEGREES);
      stroke(255);
      strokeWeight(2);
      fill(this.color);
      if (this.dead) {
        fill(255);
        ellipse(this.x, this.y, this.innerSize);
        fill(255, 0);
        this.size += 3;
        this.innerSize -= 1;
        this.innerSize = constrain(this.innerSize, 0, 30);
        this.speed = 0;
        if (this.playOnce){
          Explode.play();
          this.playOnce = false;
        }
        if (this.innerSize <= 0) {
          this.animationFinished = true;
          this.show = false;
          if (this.theEnemyBase!=null){
            this.theEnemyBase.underAttack = false;
          }
        }
      }
      ellipse(this.x, this.y, this.size);
      pop();
    }
  }

  // reset()
  //
  // might be useful
  reset() {
    this.x = this.baseX;
    this.y = this.baseY;
    this.size = 0;
  }

  respawn(){
    this.size = this.originalSize;
    this.innerSize = this.size;
    this.health = this.maxHealth;
    this.targeted = 0;
    this.targetId = -1;
    this.obtainedTarget = false;
    this.attacking = false;
    this.speed = this.originalSpeed + random(-0.5, 0.5);
    this.tx = random(0, 1000);
    this.ty = random(0, 1000);
    this.dead = false;
    this.runOnce = true;
  }
}
