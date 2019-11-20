// CircleShooter
//
// An unique class extended from the soldier class.
// CircleShooter shoots Bullet to harm enemy units
// It can do decent damage but has a lower health

class CircleShooter extends Soldier {
  constructor(x, y, playerId, mapId, uniqueId) {
    super(x, y, playerId, mapId, uniqueId);
    // health
    this.maxHealth = 20;
    this.health = this.maxHealth;
    // cost
    this.cost = 8;
    // speed
    this.originalSpeed = 1;
    this.speed = this.originalSpeed + random(-0.5, 0.5);
    this.vx = 0;
    this.vy = 0;
    this.tx = random(0, 1000); // To make x and y noise different
    this.ty = random(0, 1000); // we use random starting values

    this.bullet = null;

    this.obtainedTarget = false;
    this.targetId = -1;
    this.attacking = false;

    this.bulletFired = false;
  }

  attackBase(enemyBase) {
    let d = dist(this.x, this.y, this.enemyBaseX, this.enemyBaseY);
    let dx = this.enemyBaseX - this.x;
    let dy = this.enemyBaseY - this.y;
    let angle = atan2(dy, dx);
    if (d >= 100) {
      this.x += this.speed * cos(angle);
      this.y += this.speed * sin(angle);
    }
    if (d < 200 && !this.bulletFired && !this.dead) {
      this.bullet = new Bullet(this.x, this.y, enemyBase.x, enemyBase.y, this.playerId, this.uniqueId);
      this.bulletFired = true;
    }
    if (this.bulletFired && !this.dead) {
      this.bullet.moveTo(enemyBase);
      if (this.bullet.dead) {
        this.bulletFired = false;
        this.bullet = null;
      }
    }
    /*
    // Set velocity via noise()
    this.vx = map(noise(this.tx), 0, 1, -0.1, 0.1);
    this.vy = map(noise(this.ty), 0, 1, -0.1, 0.1);
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    // Update time properties
    this.tx += 0.0001;
    this.ty += 0.0001; */

    this.handleWrapping();
  }

  attack(enemy) {
    let sec = second();
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    if (d < 300 && this.targetId < 0 && !this.dead && !enemy.dead) {
      this.targetId = enemy.uniqueId;
      this.obtainedTarget = true;
    }
    let dx = enemy.x - this.x;
    let dy = enemy.y - this.y;
    let angle = atan2(dy, dx);

    if (this.targetId === enemy.uniqueId) {
      if (d >= 150) {
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
      } else {
        this.x -= this.speed * cos(angle);
        this.y -= this.speed * sin(angle);
      }
      if (d < 200 && !this.bulletFired && !this.dead) {
        this.bullet = new Bullet(this.x, this.y, enemy.x, enemy.y, this.playerId, this.uniqueId);
        this.bulletFired = true;
        this.attacking = true;
      }else{
        this.attacking = false;
      }
      if (this.bulletFired && !this.dead) {
        this.attacking = true;
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

  display() {
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
    if (this.dead) {
      this.size -= 0.5;
      this.speed = 0;
      if (this.size <= 0) {
        this.reset();
      }
    }
    pop();
  }

  reset() {
    this.x = this.baseX;
    this.y = this.baseY;
    this.size = this.originalSize;
    this.health = this.maxHealth;
    this.targetId = -1;
    this.attacking = false;
    this.speed = this.originalSpeed + random(-0.5, 0.5);
    this.tx = random(0, 1000);
    this.ty = random(0, 1000);
    this.dead = false;
    this.bullet = null;
    this.bulletFired = false;
  }
}
