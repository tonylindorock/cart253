class SquareXL extends Soldier{
  constructor(x,y,playerId,mapId,uniqueId){
    super(x,y,playerId,mapId,uniqueId);
    // health
    this.maxHealth = 200;
    this.health = this.maxHealth;
    this.originalSize = 100;
    this.size = this.originalSize;
    // speed
    this.originalSpeed = 0.5;
    this.speed = this.originalSpeed+random(-0.5, 0.5);
    this.vx = 0;
    this.vy = 0;
    this.tx = random(0, 1000); // To make x and y noise different
    this.ty = random(0, 1000); // we use random starting values

    this.targeted = 0;
    this.targetId = -1;

    this.animationFinished = false;
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
      if(!this.dead){
        enemyBase.health = enemyBase.health/2;
        enemyBase.health = constrain(enemyBase.health, 0, enemyBase.maxHealth);
      }
      this.dead = true;
    }

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

  attack(enemy){}

  display() {
    push();
    rectMode(CENTER);
    ellipseMode(CENTER);
    stroke(255);
    strokeWeight(2);
    fill(this.color);
    rect(this.x, this.y, this.size, this.size);
    noStroke();
    fill(255);
    rect(this.x, this.y, this.size / 4, this.size / 4);
    if (this.dead) {
      this.size -= 5;
      this.speed = 0;
      this.size = constrain(this.size,0,this.originalSize);
      if (this.size <= 0) {
        this.animationFinished = true;
      }
    }
    pop();
  }

  reset() {
    this.x = this.baseX;
    this.y = this.baseY;
    this.size = this.originalSize;
    this.speed = this.originalSpeed+random(-0.5, 0.5);
    this.health = this.maxHealth;
    this.tx = random(0, 1000);
    this.ty = random(0, 1000);
    this.dead = false;
    this.animationFinished = false;
  }
}
