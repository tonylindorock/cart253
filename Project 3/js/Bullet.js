class Bullet extends CircleShooter{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.targetX=-1;
    this.targetY=-1;
    this.speed = 10;

    this.hit = false;
  }

  moveTo(target){
    let d = dist(this.x,this.y,target.x,target.y);
    if (this.targetX===-1 && this.targetY===-1){
      this.targetX=target.x;
      this.targetY=target.y;
    }
    let dx = this.targetX-this.x;
    let dy = this.targetY-this.y;
    let angle = atan2(dy, dx);
    this.x += this.speed * cos(angle);
    this.y += this.speed * sin(angle);

    if(d<5+target.size){
      this.hit = true;
    }
  }

  display(){
    push();
    ellipseMode(CENTER)
    fill(this.color);
    ellipse(this.x,this.y,10);
    pop();
  }
}
