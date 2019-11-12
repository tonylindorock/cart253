// Base
//
// The class which is the base of the player
// Handles declaration of other Soldier classes

class Base{
  constructor(playerId, mapId, modeId){
    // size
    this.size = 50;
    // health
    this.maxHealth = 100;
    this.health = this.maxHealth;
    // id
    this.playerId = playerId;
    // color
    if (this.playerId === 0){
      this.color = "#599cff";
    }else if(this.playerId === 1){
      this.color = "#ff5959";
    }
    // position
    this.margin = 100;
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
  }

  display(){
    push();
    fill(this.color);
    // base
    rectMode(CENTER);
    /*
    stroke(255);
    strokeWeight(4); */
    rect(this.x,this.y,this.size,this.size);
    // base health bar
    noStroke();
    this.barHeight = map(this.health,0,this.maxHealth,0,height);
    if(this.playerId===0){
      rect(5,height/2,10,this.barHeight);
    }else if (this.playerId===1){
      rect(width-5,height/2,10,this.barHeight);
    }
    pop();
  }
}
