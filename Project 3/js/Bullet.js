// Bullet
//
// A child class of CircleShooter class.
// Used to be fired at the enemy unit and hurt them
// Each bullet will respawn to be shot again after it reaches over 250 distance units

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
    this.innerSize = this.size;

    this.speed = 5;
    this.damage = 5;
    this.dead = false;

    this.hit=false;
    this.maxRange = false;
    this.displayBullet = true;
    this.runOnce = true;

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
    let d2 = dist(this.bulletX, this.bulletY, this.startX, this.startY);
    let dx = this.targetX - this.startX;
    let dy = this.targetY - this.startY;
    let angle = atan2(dy, dx);

    this.bulletX += this.speed * cos(angle);
    this.bulletY += this.speed * sin(angle);
    if(d2>=250){
      this.dead=true;
    }
    if(d<target.size/2 && this.runOnce){
      target.health-=this.damage;
      target.health=constrain(target.health,0,target.maxHealth);
      this.runOnce = false;
      this.hit=true;
    }
    this.display();
  }

  display(){
    if(this.displayBullet){
      push();
      ellipseMode(CENTER);
      rectMode(CENTER)
      angleMode(DEGREES);
      noStroke();
      fill(255);
      // translate(this.bulletX,this.bulleßtY);
      // rotate(this.angle);
      // rect(0,0,this.size+10,this.size,16);
      if(this.hit){
        this.speed = 0;
        this.size += 1;
        this.innerSize -= 1;
        if (this.size >= 20){
          this.displayBullet = false;
          this.speed = 5;
        }
        ellipse(this.bulletX,this.bulletY,this.innerSize);
        stroke(255);
        strokeWeight(2);
        fill(255,0);
      }
      ellipse(this.bulletX,this.bulletY,this.size);
      pop();
    }
  }

  reset() {
    this.bulletX = this.x;
    this.bulletY = this.y;
    this.hit = false;
  }
}
