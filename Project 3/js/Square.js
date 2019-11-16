// Square
//
// An unique class extended from the soldier class

class Square extends Soldier{
  constructor(x,y,playerId,mapId){
    super(x,y,playerId,mapId);
    // health
    this.maxHealth = 40;
    this.health = this.maxHealth;

    this.rotation=0;
  }

  attackBase(){
    let d = dist(this.x,this.y,this.enemyBaseX,this.enemyBaseY);
    let dx = this.enemyBaseX-this.x;
    let dy = this.enemyBaseY-this.y;
    let angle = atan2(dy, dx);
    this.x += this.speed * cos(angle);
    this.y += this.speed * sin(angle);
  }

  attack(enemy){

  }

  display(){
    push();
    rectMode(CENTER);
    fill(255);
    angleMode(DEGREES);
    translate(this.x,this.y);
    rotate(this.rotation);
    rect(0,0,this.size,this.size);
    if (this.rotation<180){
      this.rotation+=5;
    }else{
      this.rotation=0;
    }
    pop();
  }
}
