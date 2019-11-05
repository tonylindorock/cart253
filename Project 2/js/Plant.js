// Plant
// extends from Tree
//
// A Plant object is the food for the prey
// When it is consumed, it will re-grow somewhere else

class Plant extends Tree {
  // constructor
  constructor(x, y, radius, texture) {
    // call tree constructor
    super(x, y, radius, texture);
    // health
    this.maxHealth = 100;
    this.health = this.maxHealth;
  }

  //reset
  //
  // reset its health and put it somewhere randomly
  reset() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.health = this.maxHealth;
  }
}
