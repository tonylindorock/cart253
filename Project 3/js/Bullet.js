class Bullet{
  constructor(x, y,targetX,targetY,playerId){
    this.x = x;
    this.y = y;
    this.size = 10;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = 5;
    this.damage = 20 + random(-5, 5);
    this.playerId = playerId;
    // color
    if(this.playerId==0){
      this.color="#4fc7fb"; // blue
    }else if(this.playerId==1){
      this.color="#FB524F"; // red
    }

    this.hit = false;
  }

  moveTo(target){
    let d = dist(this.x,this.y,this.targetX,this.targetX);
    let dx = this.targetX-this.x;
    let dy = this.targetY-this.y;
    let angle = atan2(dy, dx);
    this.x += this.speed * cos(angle);
    this.y += this.speed * sin(angle);

    if(d<5+target.size){
      console.log("It's a hit");
      this.hit = true;
      target.health=-this.damage;
      target.health = constrain(target.health,0,target.maxHealth);
    }
  }

  handleWrapping(){
    // Off the left or right
    if (this.x < this.size/2) {

    } else if (this.x > width-this.size/2) {

    }
    // Off the top or bottom
    if (this.y < this.size/2) {

    } else if (this.y > height-this.size/2) {

    }
  }

  display(){
    push();
    ellipseMode(CENTER);
    fill(this.color);
    ellipse(this.x,this.y,this.size);
    pop();
  }
}
