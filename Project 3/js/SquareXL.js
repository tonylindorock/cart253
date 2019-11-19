class SquareXL extends Soldier{
  constructor(x,y,playerId,mapId,uniqueId){
    super(x,y,playerId,mapId,uniqueId);
    // health
    this.maxHealth = 400;
    this.health = this.maxHealth;
    this.originalSize = 100;
    this.size = this.originalSize;
    this.innerSize = this.originalSize;
    // cost
    this.cost = 32;
    // speed
    this.originalSpeed = 0.75;
    this.speed = this.originalSpeed+random(-0.5, 0.5);
    this.vx = 0;
    this.vy = 0;
    this.tx = random(0, 1000); // To make x and y noise different
    this.ty = random(0, 1000); // we use random starting values

    this.targeted = 0;
    this.targetId = -1;

    this.rotation = 0;
    this.originalRotationSpeed = 1;
    this.rotationSpeed = this.originalRotationSpeed;
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
        this.dead = true;
      }
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
    angleMode(DEGREES);
    translate(this.x, this.y);
    rotate(this.rotation);
    stroke(255);
    strokeWeight(4);
    fill(this.color);
    if (this.dead) {
      fill(255);
      rect(0,0, this.innerSize,this.innerSize,8);
      fill(255, 0);
      this.size += 3;
      this.innerSize -= 3;
      this.innerSize = constrain(this.innerSize, 0, 100);
      this.speed = 0;
      if (this.innerSize <= 0) {
        this.animationFinished = true;
      }
    }
    rect(0,0, this.size, this.size,8);
    if(!this.dead){
      line(-10,10,10,-10);
      line(10,10,-10,-10);
    }
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

  reset() {
    this.x = this.baseX;
    this.y = this.baseY;
    this.size = this.originalSize;
    this.rotation = 0;
    this.rotationSpeed = this.originalRotationSpeed;
    this.speed = this.originalSpeed+random(-0.5, 0.5);
    this.health = this.maxHealth;
    this.tx = random(0, 1000);
    this.ty = random(0, 1000);
    this.dead = false;
    this.animationFinished = false;
  }
}
