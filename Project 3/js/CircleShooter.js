// CircleShooter
//
// An unique class extended from the soldier class.
// CircleShooter shoots Bullet to harm enemy units
// It can do decent damage but has a lower health

class CircleShooter extends Soldier {
  constructor(x, y, playerId, mapId, uniqueId) {
    super(x, y, playerId, mapId, uniqueId);
    // health
    this.maxHealth = 30;
    this.health = this.maxHealth;
    // cost
    this.cost = 28;
    // speed
    this.originalSpeed = 1;
    this.speed = this.originalSpeed + random(-0.5, 0.5);
    this.vx = 0;
    this.vy = 0;
    this.tx = random(0, 1000); // To make x and y noise different
    this.ty = random(0, 1000); // we use random starting values

    this.bullet = null; // attribute to store a Bullet object

    this.obtainedTarget = false;
    this.targetId = -1; // targeted enemy id
    this.attacking = false; // if attacking

    this.bulletFired = false; // if a bullet is fired
    this.animationFinished = false;

    this.theEnemyBase = null; // store the enemy base object
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
      // move to it
      if (d >= 100) {
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
      }
      // if in range, FIRE
      if (d < 200 && !this.bulletFired && !this.dead) {
        // create and store a Bullet object
        this.bullet = new Bullet(this.x, this.y, enemyBase.x, enemyBase.y, this.playerId, this.uniqueId);
        this.bulletFired = true;
        Fire.play(); // sound
        // enemy base is under attack
        enemyBase.underAttack = true;
        this.theEnemyBase = enemyBase;
      }
      // make the bullet fly towards the target
      if (this.bulletFired && !this.dead) {
        this.bullet.moveTo(enemyBase);
        if (this.bullet.dead) {
          this.bulletFired = false;
          this.bullet = null;
        }
      }
    }
    this.handleWrapping();
  }

  // attack(enemy)
  //
  // select an enemy and keep attacking it until it dies
  attack(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    // if within range, no target acquired, not dead, and the enemy is alive
    // TARGET THE ENEMY
    if (d < 300 && this.targetId < 0 && !this.dead && !enemy.dead) {
      this.targetId = enemy.uniqueId;
      this.obtainedTarget = true;
    }
    let dx = enemy.x - this.x;
    let dy = enemy.y - this.y;
    let angle = atan2(dy, dx);

    if (this.targetId === enemy.uniqueId) {
      // get closer to the enemy
      if (d >= 150) {
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
      // also keep a distance from the enemy
      } else {
        this.x -= this.speed * cos(angle);
        this.y -= this.speed * sin(angle);
      }
      // if within range, FIRE
      if (d < 200 && !this.bulletFired && !this.dead) {
        this.bullet = new Bullet(this.x, this.y, enemy.x, enemy.y, this.playerId, this.uniqueId);
        this.bulletFired = true;
        this.attacking = true;
        Fire.play();
      } else {
        this.attacking = false;
      }
      if (this.bulletFired && !this.dead) {
        this.attacking = true;
        // if the enemy is not attacking, it will fight back
        if (!enemy.attacking) {
          enemy.targetId = this.uniqueId;
        }
        this.bullet.moveTo(enemy);
        if (this.bullet.dead) {
          this.bulletFired = false;
          this.bullet = null;
        }
      }
      if (enemy.dead) {
        // if the targeted enemy is tank / square XL
        // if the tank gets destroyed and this unit is close to it
        // the explosion kills this unit
        if (enemy.uniqueId === 100 && enemy.uniqueId === this.targetId && d < 100){
          this.health -= enemy.damage;
        }
        this.targetId = -1;
        this.obtainedTarget = false;
        this.attacking = false;
      }
    }
    // variation to the movement
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
  // display the circleShooter
  // play an animation when dies
  display() {
    if (this.show){
      push();
      rectMode(CENTER);
      ellipseMode(CENTER);
      angleMode(DEGREES);
      stroke(255);
      strokeWeight(2);
      fill(this.color);
      ellipse(this.x, this.y, this.size);
      noStroke();
      fill(255);
      ellipse(this.x, this.y, this.size / 4);
      // if dies, it will shrink
      if (this.dead) {
        this.size -= 0.5;
        this.speed = 0;
        if (this.playOnce){
          Die.play();
          this.playOnce = false;
        }
        if (this.size <= 0) {
          this.animationFinished = true;
          this.show = false;
          // if it dies, the enemy base is no longer under attack
          if (this.theEnemyBase!=null){
            this.theEnemyBase.underAttack = false;
          }
        }
      }
      pop();
    }
  }
}
