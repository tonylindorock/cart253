class CircleShooter extends Soldier {
  constructor(x, y, playerId, mapId, uniqueId) {
    super(x, y, playerId, mapId, uniqueId);
    // health
    this.maxHealth = 25;
    this.health = this.maxHealth;
    // speed
    this.originalSpeed = 1;
    this.speed = this.originalSpeed + random(-0.5, 0.5);
    this.vx = 0;
    this.vy = 0;
    this.tx = random(0, 1000); // To make x and y noise different
    this.ty = random(0, 1000); // we use random starting values
    // damage
    this.damage = 20 + random(-5, 5);

    this.bullets=[-1,-1];

    this.obtainedTarget = false;
    this.targeted = 0;
    this.targetId = -1;
    this.attacking = false;

    this.runOnce = true;
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
    } else {

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
    let bullet;
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    if (d < 300 && this.targetId < 0 && (enemy.targeted < 3||enemy.uniqueId===-10) && !this.dead && !enemy.dead) {
      this.targetId = enemy.uniqueId;
      enemy.targeted++;
      this.obtainedTarget = true;
    }
    let dx = enemy.x - this.x;
    let dy = enemy.y - this.y;
    let angle = atan2(dy, dx);

    if (this.targetId === enemy.uniqueId) {
      if (d > 150) {
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
      }
      if(d < 200){

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

  display(){
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
    this.targeted = 0;
    this.targetId = -1;
    this.attacking = false;
    this.speed = this.originalSpeed + random(-0.5, 0.5);
    this.tx = random(0, 1000);
    this.ty = random(0, 1000);
    this.dead = false;
    this.runOnce = true;
  }
}
