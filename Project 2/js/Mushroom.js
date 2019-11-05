// Mushroom
// extends from the Tree
//
// Mushroom object for the player to eat
// Gives the player advantages when escaping from or fighting with the human

class Mushroom extends Tree {
  // constructor
  constructor(x, y, radius, texture) {
    // call tree constructor
    super(x, y, radius, texture);

    // other mushroom attributes
    this.inEffect = false;
    this.effectPlayerId = 0;
    this.effectId = 0;
    this.prevScore = 0;
  }

  // reset
  //
  // put the mushroom somewhere randomly
  reset() {
    this.x = random(0, width);
    this.y = random(0, height);
  }
}
