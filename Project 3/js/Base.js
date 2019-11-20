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
    // health
    this.maxHealth = 200;
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
    this.resource = 1000;

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
      }
    }
    if (this.squareXL.dead != true) {
      check = true;
    }
    for (let i = 0; i < this.circleShooters.length; i++) {
      if (this.circleShooters[i].dead != true) {
        check = true;
      }
    }
    for (let i = 0; i < this.circleDemos.length; i++) {
      if (this.circleDemos[i].dead != true) {
        check = true;
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

  // display
  //
  // display the base and its health on the side of the window
  display() {
    this.gainResources();

    push();
    fill(this.color);
    // base
    rectMode(CENTER);
    ellipseMode(CENTER);
    stroke(255);
    strokeWeight(4);
    rect(this.x, this.y, this.size, this.size);
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
      stroke(255);
      fill(this.UpkeyColor);
      rect(this.x, this.y - 50, 30, 30, 4);
      fill(this.LeftkeyColor);
      rect(this.x - 50, this.y, 30, 30, 4);
      fill(this.DownkeyColor);
      rect(this.x, this.y + 50, 30, 30, 4);
      fill(this.RightkeyColor);
      rect(this.x + 50, this.y, 30, 30, 4);
      // keys
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(16);
      // up key
      fill(255);
      text("W", this.x, this.y - 50);
      fill(255, 150);
      text(this.squares.length, this.x, this.y - 75);
      // left key
      fill(255);
      text("A", this.x - 50, this.y);
      fill(255, 150);
      text(this.circleShooters.length, this.x - 50, this.y - 25);
      // down key
      fill(255);
      text("S", this.x, this.y + 50);
      // right key
      text("D", this.x + 50, this.y);
      fill(255, 150);
      text(this.circleDemos.length, this.x + 50, this.y - 25);
    } else if (this.playerId === 1) {
      fill(50);
      rect(width - 5, height / 2, 10, height);
      fill(this.color);
      rect(width - 5, height / 2, 10, this.barHeight);
      if (this.modeId === 1) {
        textAlign(RIGHT, CENTER);
        textSize(32);
        fill(255, 150);
        text(this.resource, this.x - 35, this.y + 50);
        // key squares
        stroke(255);
        fill(this.UpkeyColor);
        rect(this.x, this.y - 50, 30, 30, 4);
        fill(this.LeftkeyColor);
        rect(this.x - 50, this.y, 30, 30, 4);
        fill(this.DownkeyColor);
        rect(this.x, this.y + 50, 30, 30, 4);
        fill(this.RightkeyColor);
        rect(this.x + 50, this.y, 30, 30, 4);
        // keys
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(16);
        // up key
        fill(255);
        text("↑", this.x, this.y - 50);
        fill(255, 150);
        text(this.squares.length, this.x, this.y - 75);
        // left key
        fill(255);
        text("←", this.x - 50, this.y);
        fill(255, 150);
        text(this.circleShooters.length, this.x - 50, this.y - 25);
        // down key
        fill(255);
        text("↓", this.x, this.y + 50);
        // right key
        text("→", this.x + 50, this.y);
        fill(255, 150);
        text(this.circleDemos.length, this.x + 50, this.y - 25);
      }
    }
    pop();
  }
}
