// Base
//
// The class which is the base of the player
// Handles creating of other Soldier classes

class Base {
  // constructor
  //
  // takes in player id, map id, and mode id to determine player's base position and keys
  constructor(playerId, mapId, modeId) {
    // size
    this.size = 50;
    this.outerSize = 50;
    // health
    this.maxHealth = 300;
    this.health = this.maxHealth;
    // capacity
    this.maxCap = 50;
    this.capacity = 0;
    // ids
    this.playerId = playerId;
    this.modeId = modeId;
    // color for different ids
    if (this.playerId === 0) {
      this.color = "#4fc7fb"; // blue
    } else if (this.playerId === 1) {
      this.color = "#FB524F"; // red
    }
    this.UpkeyColor = color(255, 0);
    this.LeftkeyColor = color(255, 0);
    this.DownkeyColor = color(255, 0);
    this.RightkeyColor = color(255, 0);
    // positions for different maps and ids
    this.margin = 100; // distance to the edge of the window
    if (this.playerId === 0) {
      if (mapId === 0) {
        this.x = this.margin;
        this.y = height / 2;
      } else if (mapId === 1) {
        this.x = this.margin;
        this.y = this.margin;
      } else if (mapId === 2) {
        this.x = this.margin;
        this.y = height - this.margin;
      } else if (mapId === 3) {
        this.x = width / 2;
        this.y = this.margin;
      }
    } else if (this.playerId === 1) {
      if (mapId === 0) {
        this.x = width - this.margin;
        this.y = height / 2;
      } else if (mapId === 1) {
        this.x = width - this.margin;
        this.y = height - this.margin;
      } else if (mapId === 2) {
        this.x = width - this.margin;
        this.y = this.margin;
      } else if (mapId === 3) {
        this.x = width / 2;
        this.y = height - this.margin;
      }
    }
    // resource
    this.resource = 32;

    this.underAttack = false;

    this.animationFinished = false;
    this.playOnce = true;

    this.squaresNum = 0;
    this.circleShootersNum = 0;
    this.circleDemosNum = 0;

    // soldier arrays
    this.squares = [];
    this.squareXL = null;
    this.circleShooters = [];
    this.circleDemos = [];
  }

  // hasActiveSoldiers()
  //
  // return if the base has anysoldiers alive
  hasActiveSoldiers() {
    let check = false;
    for (let i = 0; i < this.squares.length; i++) {
      if (this.squares[i].dead != true) {
        check = true;
      }else{
        if (this.squares[i].animationFinished){
          let temp = this.squares[0];
          this.squares[0] = this.squares[i];
          this.squares[i] = temp;
          this.squares.shift();
          this.capacity--;
        }
      }
    }
    if (this.squareXL != null) {
      check = true;
    }
    for (let i = 0; i < this.circleShooters.length; i++) {
      if (this.circleShooters[i].dead != true) {
        check = true;
      }else{
        if (this.circleShooters[i].animationFinished){
          let temp = this.circleShooters[0];
          this.circleShooters[0] = this.circleShooters[i];
          this.circleShooters[i] = temp;
          this.circleShooters.shift();
          this.capacity--;
        }
      }
    }
    for (let i = 0; i < this.circleDemos.length; i++) {
      if (this.circleDemos[i].dead != true) {
        check = true;
      }else{
        if (this.circleDemos[i].animationFinished){
          let temp = this.circleDemos[0];
          this.circleDemos[0] = this.circleDemos[i];
          this.circleDemos[i] = temp;
          this.circleDemos.shift();
          this.capacity--;
        }
      }
    }
    return check;
  }

  // gainResources()
  //
  // each second the base will gain 1 resource
  gainResources() {
    let currentSec = frameCount;
    if (currentSec % 60 === 0 && currentSec != 0) {
      this.resource += 1;
    }
  }

  displayUnitsMenu(){
    push();
    rectMode(CENTER);
    ellipseMode(CENTER);
    textAlign(CENTER,CENTER);
    fill(255,150);
    textSize(12);
    text("square", this.x, this.y - 95);
    text("shooter", this.x - 50, this.y - 45);
    text("demo", this.x + 50, this.y - 45);
    text("tank", this.x, this.y+95);
    // square
    stroke(255);
    strokeWeight(2);
    fill(this.color);
    rect(this.x, this.y - 50, 30, 30);
    noStroke();
    fill(255);
    rect(this.x, this.y - 50, 30/4,30/4);

    //circleShooter
    stroke(255);
    strokeWeight(2);
    fill(this.color);
    ellipse(this.x-50, this.y, 30);
    noStroke();
    fill(255);
    ellipse(this.x-50, this.y, 30 / 4);

    // circleDemo
    stroke(255);
    strokeWeight(2);
    fill(this.color);
    ellipse(this.x+50, this.y, 30);

    // squareXL
    stroke(255);
    rect(this.x, this.y+50, 30, 30, 4);
    line(this.x-5, this.y+55, this.x+5, this.y+45);
    line(this.x+5, this.y+55, this.x-5, this.y+45);
    pop();
  }

  displayAnimation(){
    push();
    fill(this.color);
    // base
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size);
    fill(255,0);
    stroke(255);
    strokeWeight(4);
    rect(this.x, this.y, this.outerSize, this.outerSize);
    if (this.size > 0){
      this.size -= 1;
      this.outerSize += 1;
      stroke(255);
      strokeWeight(4);
      line(this.x, this.y + 5, this.x, this.y - 5);
      line(this.x - 5, this.y, this.x + 5, this.y);
      if (this.playOnce){
        Defeated.play();
        this.playOnce = false;
      }
    }
    if (this.size <= 0){
      this.animationFinished = true;
      this.underAttack = false;
    }
    noStroke();
    // map the health into window height
    this.barHeight = map(this.health, 0, this.maxHealth, 0, height);
    strokeWeight(2);
    if (this.playerId === 0) {
      fill(50);
      rect(5, height / 2, 10, height);
      fill(this.color);
      rect(5, height / 2, 10, this.barHeight);
    }else if (this.playerId === 1){
      fill(50);
      rect(width - 5, height / 2, 10, height);
      fill(this.color);
      rect(width - 5, height / 2, 10, this.barHeight);
    }
    pop();
  }

  // display
  //
  // display the base and its health on the side of the window
  display() {
    this.gainResources();
    this.hasActiveSoldiers();

    if (this.underAttack && !Alarm.isPlaying()){
      Alarm.play();
    }

    push();
    fill(this.color);
    // base
    rectMode(CENTER);
    ellipseMode(CENTER);
    rect(this.x, this.y, this.size, this.size);
    stroke(255);
    strokeWeight(4);
    line(this.x, this.y + 5, this.x, this.y - 5);
    line(this.x - 5, this.y, this.x + 5, this.y);
    // base health bar
    noStroke();
    // map the health into window height
    this.barHeight = map(this.health, 0, this.maxHealth, 0, height);
    strokeWeight(2);
    if (this.playerId === 0) {
      fill(50);
      rect(5, height / 2, 10, height);
      fill(this.color);
      rect(5, height / 2, 10, this.barHeight);

      textAlign(LEFT, CENTER);
      textSize(32);
      fill(255, 150);
      text(this.resource, this.x + 35, this.y + 50);
      // key squares
      if(this.resource >= 16 && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
        stroke(255);
      }else{
        stroke(255,100);
      }
      fill(this.UpkeyColor);
      rect(this.x, this.y - 50, 30, 30, 4);
      // shooter
      if(this.resource >= 28  && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
        stroke(255);
      }else{
        stroke(255,100);
      }
      fill(this.LeftkeyColor);
      rect(this.x - 50, this.y, 30, 30, 4);
      // squareXL
      if(this.resource >= 42  && this.squareXL===null){
        stroke(255);
      }else{
        stroke(255,100);
      }
      fill(this.DownkeyColor);
      rect(this.x, this.y + 50, 30, 30, 4);
      // demo
      if(this.resource >= 20  && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
        stroke(255);
      }else{
        stroke(255,100);
      }
      fill(this.RightkeyColor);
      rect(this.x + 50, this.y, 30, 30, 4);
      // keys
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(16);
      // up key square
      if(this.resource >= 16 && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
        fill(255);
      }else{
        fill(255,100);
      }
      text("W", this.x, this.y - 50);
      // left key shooter
      if(this.resource >= 28 && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
        fill(255);
      }else{
        fill(255,100);
      }
      text("A", this.x - 50, this.y);
      // down key squareXL
      if(this.resource >= 42 && this.squareXL===null){
        fill(255);
      }else{
        fill(255,100);
      }
      text("S", this.x, this.y + 50);
      // right key demo
      if(this.resource >= 20 && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
        fill(255);
      }else{
        fill(255,100);
      }
      text("D", this.x + 50, this.y);
    } else if (this.playerId === 1) {
      fill(50);
      rect(width - 5, height / 2, 10, height);
      fill(this.color);
      rect(width - 5, height / 2, 10, this.barHeight);

      textAlign(RIGHT, CENTER);
      textSize(32);
      fill(255, 150);
      text(this.resource, this.x - 35, this.y + 50);
      if (this.modeId === 1) {
        // key squares
        if(this.resource >= 16  && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
          stroke(255);
        }else{
          stroke(255,100);
        }
        fill(this.UpkeyColor);
        rect(this.x, this.y - 50, 30, 30, 4);
        // shooter
        if(this.resource >= 28  && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
          stroke(255);
        }else{
          stroke(255,100);
        }
        fill(this.LeftkeyColor);
        rect(this.x - 50, this.y, 30, 30, 4);
        // squareXL
        if(this.resource >= 42  && this.squareXL===null){
          stroke(255);
        }else{
          stroke(255,100);
        }
        fill(this.DownkeyColor);
        rect(this.x, this.y + 50, 30, 30, 4);
        // demo
        if(this.resource >= 20 && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
          stroke(255);
        }else{
          stroke(255,100);
        }
        fill(this.RightkeyColor);
        rect(this.x + 50, this.y, 30, 30, 4);
        // keys
        textAlign(CENTER, CENTER);
        textSize(16);
        noStroke();
        // up key square
        if(this.resource >= 16 && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
          fill(255);
        }else{
          fill(255,100);
        }
        text("↑", this.x, this.y - 50);
        // left key shooter
        if(this.resource >= 28 && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
          fill(255);
        }else{
          fill(255,100);
        }
        text("←", this.x - 50, this.y);
        // down key squarexl
        if(this.resource >= 42 && this.squareXL===null){
          fill(255);
        }else{
          fill(255,100);
        }
        text("↓", this.x, this.y + 50);
        // right key demo
        if(this.resource >= 20 && this.squares.length+this.circleShooters.length+this.circleDemos.length < 50){
          fill(255);
        }else{
          fill(255,100);
        }
        text("→", this.x + 50, this.y);
      }
    }
    // costs
    if (this.modeId === 1 || (this.modeId === 0 && this.playerId === 0)){
      fill(255, 206, 43);
      textSize(12);
      text("$16", this.x, this.y - 80);
      text("$28", this.x - 50, this.y - 30);
      text("$20", this.x + 50, this.y - 30);
      text("$42", this.x, this.y + 80);
      // number of units
      textAlign(CENTER, CENTER);
      rectMode(CENTER);
      fill(255);
      textSize(16);
      rect(this.x+20,this.y-65, 30, 20, 32);
      rect(this.x-30,this.y-15, 30, 20, 32);
      rect(this.x+65,this.y-15, 30, 20, 32);
      rect(this.x+20,this.y+35, 30, 20, 32);
      fill(this.color);
      text(this.squaresNum,this.x+20,this.y-65);
      text(this.circleShootersNum,this.x-30,this.y-15);
      text(this.circleDemosNum,this.x+65,this.y-15);
      text(int(this.squareXL!=null),this.x+20,this.y+35);
    }
    pop();
  }
}
