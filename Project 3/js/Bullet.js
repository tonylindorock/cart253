class Bullet extends CircleShooter{
  constructor(x, y,targetX,targetY,playerId,uniqueId){
    super(x,y,playerId,-1,uniqueId);
    this.bulletX = x;
    this.bulletY = y;

    this.startX=this.bulletX;
    this.startY=this.bulletY;

    this.targetX = targetX;
    this.targetY = targetY;

    this.size = 10;

    this.speed = 5;
    this.damage = 20 + random(-5, 5);

    this.playerId = playerId;
    // color
    if(this.playerId==0){
      this.color="#4fc7fb"; // blue
    }else if(this.playerId==1){
      this.color="#FB524F"; // red
    }
  }

  moveTo(target){
    let d = dist(this.bulletX, this.bulletY, target.x, target.y);
    let dx = this.targetX - this.startX;
    let dy = this.targetY - this.startY;
    let angle = atan2(dy, dx);

    this.bulletX += this.speed * cos(angle);
    this.bulletY += this.speed * sin(angle);

    if(d<5+target.size/2){
      target.health-=this.damage;
      this.reset();
    }
    this.display();
  }


  display(){
    push();
    ellipseMode(CENTER);
    fill(255);
    ellipse(this.bulletX,this.bulletY,this.size);
    pop();
  }

  reset() {
    this.bulletX = this.x;
    this.bulletY = this.y;
    this.bulletFired = false;
  }
}
