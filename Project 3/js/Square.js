// Square
//
// An unique class extended from the soldier class

class Square extends Soldier{
  constructor(x,y,playerId,mapId,uniqueId){
    super(x,y,playerId,mapId,uniqueId);
    // health
    this.maxHealth = 40;
    this.health = this.maxHealth;

    this.obtainedTarget = false;
    this.targeted=false;
    this.targetId=-1;

    this.rotation=0;
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
  }

  attack(enemy){
    let d = dist(this.x,this.y,enemy.x,enemy.y);
    if (this.targetId<0 && !enemy.targeted){
      this.targetId = enemy.uniqueId;
      enemy.targeted = true;
      this.obtainedTarget = true;
    }
    let dx = enemy.x-this.x;
    let dy = enemy.y-this.y;
    let angle = atan2(dy, dx);

    if(this.targetId === enemy.uniqueId){
      if(d>30){
        this.x += this.speed * cos(angle);
        this.y += this.speed * sin(angle);
      }else{
        enemy.health -= this.damage;
        if (enemy.health<=0){
          enemy.reset();
          this.targetId = -1;
          this.obtainedTarget=false;
        }
      }
    }
  }

  display(){
    push();
    rectMode(CENTER);
    ellipseMode(CENTER);
    angleMode(DEGREES);
    stroke(255);
    strokeWeight(2);
    fill(this.color);
    translate(this.x,this.y);
    rotate(this.rotation);
    rect(0,0,this.size,this.size);
    if (this.rotation<90){
      this.rotation+=5;
    }else{
      this.rotation=5;
    }
    pop();
  }

  reset(){
    this.x = this.baseX;
    this.y = this.baseY;
    this.health=this.maxHealth;
    this.targeted = false;
  }
}
