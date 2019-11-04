class Plant extends Tree{
  constructor(x, y, radius, texture){
    super(x, y, radius, texture);
    this.maxHealth = 100;
    this.health = this.maxHealth;
  }

  reset(){
    this.x = random(0, width);
    this.y = random(0, height);
    this.health = this.maxHealth;
  }
}
