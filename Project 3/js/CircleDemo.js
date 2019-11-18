class CircleDemo extends Soldier{
  constructor(x, y, playerId, mapId, uniqueId){
    super(x, y, playerId, mapId, uniqueId);
    // health
    this.maxHealth = 30;
    this.health = this.maxHealth;
    // speed
    this.originalSpeed = 2;
    this.speed = this.originalSpeed + random(-0.5, 0.5);
    this.vx = 0;
    this.vy = 0;
    this.tx = random(0, 1000); // To make x and y noise different
    this.ty = random(0, 1000); // we use random starting values
    // damage
    this.damage = 40 + random(-5, 5);

    this.obtainedTarget = false;
    this.targeted = 0;
    this.targetId = -1;
    this.attacking = false;

    this.runOnce = true;
  }

    attackBase(enemyBase) {
      let d = dist(this.x, this.y, this.enemyBaseX, this.enemyBaseY);
      let dx = this.enemyBaseX - this.x;
      let dy = this.enemyBaseY - this.y;
      let angle = atan2(dy, dx);
      if (d >= 35) {
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
      } else {
        enemyBase.health -= this.damage;
        enemyBase.health = constrain(enemyBase.health, 0, enemyBase.maxHealth);
        this.dead=true;
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
      let d = dist(this.x, this.y, enemy.x, enemy.y);
      if (d < 300 && this.targetId < 0 && enemy.targeted < 2 && !this.dead) {
        this.targetId = enemy.uniqueId;
        enemy.targeted++;
        this.obtainedTarget = true;
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
            this.dead=true;
          }
          if (enemy.health <= 0) {
            enemy.dead = true;
            this.targetId = -1;
            this.obtainedTarget = false;
          }
        }
        if (this.dead && this.runOnce && this.targetId === enemy.uniqueId) {
          if (enemy.targeted != 0) {
            enemy.targeted--;
          }
          if (enemy.targetId === this.uniqueId) {
            enemy.targetId = -1;
          }
          this.runOnce = false;
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
      if (this.dead) {
        fill(255,0);
        this.size += 3;
        this.speed = 0;
        if (this.size >= 100) {
          this.reset();
        }
      }
      ellipse(this.x,this.y, this.size);
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
