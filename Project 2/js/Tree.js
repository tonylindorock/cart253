class Tree{
  constructor(x,y,radius,texture){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.texture = texture;

  }

  display(){
    push();
    imageMode(CENTER);
    rectMode(CENTER);
    fill(255);
    image(this.texture, this.x, this.y, this.radius, this.radius);
    pop();
  }
}
