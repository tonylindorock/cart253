class Mushroom extends Tree{
  constructor(x, y, radius, texture){
    super(x, y, radius, texture);
    this.inEffect = false;
    this.effectPlayerId = 0;
    this.effectId = 0;
    this.prevScore = 0;
  }

  reset(){
    this.x = random(0, width);
    this.y = random(0, height);
  }
}
