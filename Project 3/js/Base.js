// Base
//
// The class which is the base of the player
// Handles creating of other Soldier classes

class Base{
  // constructor
  //
  // takes in player id, map id, and mode id to determine player's base position and keys
  constructor(playerId, mapId, modeId){
    // size
    this.size = 50;
    // health
    this.maxHealth = 200;
    this.health = this.maxHealth;
    // capacity
    this.maxCap = 50;
    this.capacity = 0;
    // id
    this.playerId = playerId;
    // color for different ids
    if (this.playerId === 0){
      this.color = "#4fc7fb"; // blue
    }else if(this.playerId === 1){
      this.color = "#FB524F"; // red
    }
    // positions for different maps and ids
    this.margin = 100; // distance to the edge of the window
    if (this.playerId === 0){
      if(mapId===0){
        this.x = this.margin;
        this.y = height/2;
      }else if(mapId===1){
        this.x = this.margin;
        this.y = this.margin;
      }else if(mapId===2){
        this.x = this.margin;
        this.y = height-this.margin;
      }else if(mapId===3){
        this.x = width/2;
        this.y = this.margin;
      }
    }else if(this.playerId === 1){
      if(mapId===0){
        this.x = width-this.margin;
        this.y = height/2;
      }else if(mapId===1){
        this.x = width-this.margin;
        this.y = height-this.margin;
      }else if(mapId===2){
        this.x = width-this.margin;
        this.y = this.margin;
      }else if(mapId===3){
        this.x = width/2;
        this.y = height-this.margin;
      }
    }
    // resource
    this.resource = 0;
    // soldier arrays
    this.squares=[];
    this.squareXL = null;
    this.circleShooters=[];
    this.circleDemos=[];
  }

  hasActiveSoldiers(){
    let check = false;
    for(let i=0;i<this.squares.length;i++){
      if (this.squares[i].dead!=true){
        check = true;
      }
    }
    if (this.squareXL.dead!=true){
      check = true;
    }
    for(let i=0;i<this.circleShooters.length;i++){
      if (this.circleShooters[i].dead!=true){
        check = true;
      }
    }
    for(let i=0;i<this.circleDemos.length;i++){
      if (this.circleDemos[i].dead!=true){
        check = true;
      }
    }
    return check;
  }

  // display
  //
  // display the base and its health on the side of the window
  display(){
    push();
    fill(this.color);
    // base
    rectMode(CENTER);
    stroke(255);
    strokeWeight(4);
    rect(this.x,this.y,this.size,this.size);
    line(this.x,this.y+5,this.x,this.y-5);
    line(this.x-5,this.y,this.x+5,this.y);
    // base health bar
    noStroke();
    // map the health into window height
    this.barHeight = map(this.health,0,this.maxHealth,0,height);
    if(this.playerId===0){
      fill(50);
      rect(5,height/2,10,height);
      fill(this.color);
      rect(5,height/2,10,this.barHeight);
    }else if (this.playerId===1){
      fill(50);
      rect(width-5,height/2,10,height);
      fill(this.color);
      rect(width-5,height/2,10,this.barHeight);
    }
    pop();
  }
}
