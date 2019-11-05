// Tree
//
// A background element object

class Tree {
  // constructor
  //
  // takes in x y positions, radius, and image
  constructor(x, y, radius, texture) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.texture = texture;
  }

  // display
  //
  // display the tree
  display() {
    push();
    imageMode(CENTER);
    image(this.texture, this.x, this.y, this.radius, this.radius);
    pop();
  }
}
