// Square
//
// An unique class extended from the soldier class
// Square (scout) is a common but reliable soldier type. It harms enemies with melee damage.
// It must get close to the enemies to harm them.
// It can do standard damage and has a great health.

class Square extends Soldier {
  constructor(x, y, playerId, mapId, uniqueId) {
    super(x, y, playerId, mapId, uniqueId);
    // health
    this.maxHealth = 40;
    this.health = this.maxHealth;
    // speed
    this.speed += random(-0.5, 0.5);
    this.vx = 0;
    this.vy = 0;
    this.tx = random(0, 1000); // To make x and y noise different
    this.ty = random(0, 1000); // we use random starting values
    // damage
    this.damage = 0.3;

    this.obtainedTarget = false;
    this.targeted = 0; // how many enemies are after it
    this.targetId = -1; // targeted enemy id
    this.attacking = false; // if attacking

    // rotations for animation
    this.rotation = 0;
    this.originalRotationSpeed = 5;
    this.rotationSpeed = this.originalRotationSpeed;

    this.runOnce = true; // for sound
    this.animationFinished = false; // animation
    // store the enemy base object
    this.theEnemyBase = null;
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
    if (enemyBase.health>0){
      // move to it
      if (d >= 35) {
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
      // attack
      } else {
        this.rotationSpeed = 10; // faster rotation
        enemyBase.health -= this.damage;
        enemyBase.health = constrain(enemyBase.health, 0, enemyBase.maxHealth);
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
    // if within range, no target acquired, alive, and enemy is not dead
    // TARGET THE ENEMY
    if (d < 300 && this.targetId < 0 && !this.dead && !enemy.dead) {
      this.targetId = enemy.uniqueId;
      this.obtainedTarget = true;
    }
    let dx = enemy.x - this.x;
    let dy = enemy.y - this.y;
    let angle = atan2(dy, dx);
    // kill the targeted enemy
    if (this.targetId === enemy.uniqueId) {
      // move to it
      if (d > 15) {
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
      }
      // attack
      if (d < 30) {
        if (!this.dead) {
          enemy.health -= this.damage;
          this.rotationSpeed = 10;
          this.attacking = true;
          // if the enemy is not attacking, it will fight back
          if (!enemy.attacking) {
            enemy.targetId = this.uniqueId;
          }
        }
      // if not, change rotation speed to normal
      } else {
        this.rotationSpeed = this.originalRotationSpeed;
        this.attacking = false;
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
        this.rotationSpeed = this.originalRotationSpeed;

      }
      // if it dies before kills the enemy
      // and the enemy also targets it
      // reset the enemy target
      if (this.dead && !enemy.dead && this.obtainedTarget) {
        if (enemy.targetId === this.uniqueId) {
          enemy.targetId = -1;
        }
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
  // display the rotating square
  // play an animation when dies
  display() {
    if (this.show){
      push();
      rectMode(CENTER);
      ellipseMode(CENTER);
      angleMode(DEGREES);
      translate(this.x, this.y);
      rotate(this.rotation);
      stroke(255);
      strokeWeight(2);
      fill(this.color);
      rect(0, 0, this.size, this.size);
      noStroke();
      fill(255);
      rect(0, 0, this.size / 4, this.size / 4);
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
      // if dies, it will shrink
      if (this.dead) {
        this.size -= 0.5;
        this.speed = 0;
        this.size = constrain(this.size,0,this.originalSize);
        if (this.playOnce){
          Die.play();
          this.playOnce = false;
        }
        if (this.size <= 0) {
          this.animationFinished = true;
          this.show = false;
          // if dies, the enemy base is no longer under attack
          if (this.theEnemyBase!=null){
            this.theEnemyBase.underAttack = false;
          }
        }
      }
      pop();
    }
  }
}
