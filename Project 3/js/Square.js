// Square
//
// An unique class extended from the soldier class

class Square extends Soldier{
  constructor(x,y,playerId,mapId,uniqueId){
    super(x,y,playerId,mapId,uniqueId);
    // health
    this.maxHealth = 40;
    this.health = this.maxHealth;
    // speed
    this.vx = 0;
    this.vy = 0;
    this.tx = random(0, 100); // To make x and y noise different
    this.ty = random(0, 100); // we use random starting values

    this.obtainedTarget = false;
    this.targeted=false;
    this.targetId=-1;

    this.rotation=0;
    this.originalRotationSpeed =5;
    this.rotationSpeed =this.originalRotationSpeed;
  }

  attackBase(enemyBase){
    let d = dist(this.x,this.y,this.enemyBaseX,this.enemyBaseY);
    let dx = this.enemyBaseX-this.x;
    let dy = this.enemyBaseY-this.y;
    let angle = atan2(dy, dx);
    if(d>=35){
      this.x += this.speed * cos(angle);
      this.y += this.speed * sin(angle);
    }else{
      enemyBase.health -= this.damage;
      enemyBase.health=constrain(enemyBase.health,0,enemyBase.maxHealth);
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

  attack(enemy){
    let d = dist(this.x,this.y,enemy.x,enemy.y);
    if (this.targetId<0 && !enemy.targeted && this.health>this.maxHealth/2){
      this.targetId = enemy.uniqueId;
      enemy.targeted = true;
      this.obtainedTarget = true;
    }
    let dx = enemy.x-this.x;
    let dy = enemy.y-this.y;
    let angle = atan2(dy, dx);

    if(this.targetId === enemy.uniqueId){
      if(d>15){
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
      }
      if(d<30){
        enemy.health -= this.damage;
        this.rotationSpeed = 10;
        if (enemy.health<=0){
          enemy.reset();
          this.targetId = -1;
          this.obtainedTarget=false;
          this.rotationSpeed=this.originalRotationSpeed;
        }
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

  display(){
    push();
    rectMode(CENTER);
    ellipseMode(CENTER);
    angleMode(DEGREES);
    translate(this.x,this.y);
    rotate(this.rotation);
    stroke(255);
    strokeWeight(2);
    fill(this.color);
    rect(0,0,this.size,this.size);
    noStroke();
    fill(255);
    rect(0,0,this.size/4,this.size/4);
    if(this.playerId===0){
      if (this.rotation<90){
        this.rotation+=this.rotationSpeed;
      }else{
        this.rotation=this.rotationSpeed;
      }
    }else{
      if (this.rotation>-90){
        this.rotation-=this.rotationSpeed;
      }else{
        this.rotation=this.rotationSpeed;
      }
    }
    pop();
  }

  reset(){
    this.x = this.baseX;
    this.y = this.baseY;
    this.health=this.maxHealth;
    this.targeted = false;
    this.rotationSpeed=this.originalRotationSpeed;
    this.tx = random(0, 100);
    this.ty = random(0, 100);
  }
}
