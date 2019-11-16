// Soldier
//
// a generic soldier class

class Soldier{
  constructor(x,y,playerId){
    // spawn position
    this.x=x;
    this.y=y;
    // size
    this.size = 15;
    // id
    this.playerId=playerId;
  }

  move(){}

  attack(enemy){}

  display(){}
}
