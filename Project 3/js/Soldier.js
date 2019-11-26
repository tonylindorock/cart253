// Soldier
//
// a generic soldier class

class Soldier {
  constructor(x, y, playerId, mapId, uniqueId) {
    // spawn position
    this.baseX = x;
    this.baseY = y;
    // position
    this.x = x;
    this.y = y;
    // size
    this.originalSize = 30;
    this.size = this.originalSize;
    // speed
    this.originalSpeed = 2;
    this.speed = this.originalSpeed;
    this.vx = 0;
    this.vy = 0;

    this.damage = 0.2; // damage
    // ids
    this.playerId = playerId;
    this.mapId = mapId;
    // color
    if (this.playerId == 0) {
      this.color = "#4fc7fb"; // blue
    } else if (this.playerId == 1) {
      this.color = "#FB524F"; // red
    }
    // dead or alive
    this.dead = false;
    // health
    this.maxHealth = 25;
    this.health = this.maxHealth;
    // cost
    this.cost = 8;
    // knowing the location of enemy base
    if (this.playerId === 0) {
      if (this.mapId === 0) {
        this.enemyBaseX = width - 100;
        this.enemyBaseY = height / 2;
      } else if (this.mapId === 1) {
        this.enemyBaseX = width - 100;
        this.enemyBaseY = height - 100;
      } else if (this.mapId === 2) {
        this.enemyBaseX = width - 100;
        this.enemyBaseY = 100;
      } else if (this.mapId === 3) {
        this.enemyBaseX = width / 2;
        this.enemyBaseY = height - 100;
      }
    } else if (this.playerId === 1) {
      if (this.mapId === 0) {
        this.enemyBaseX = 100;
        this.enemyBaseY = height / 2;
      } else if (this.mapId === 1) {
        this.enemyBaseX = 100;
        this.enemyBaseY = 100;
      } else if (this.mapId === 2) {
        this.enemyBaseX = 100;
        this.enemyBaseY = height - 100;
      } else if (this.mapId === 3) {
        this.enemyBaseX = width / 2;
        this.enemyBaseY = 100;
      }
    }
    this.uniqueId = uniqueId;
  }

  // empty functions
  attackBase(enemyBase) {}

  attack(enemy) {}

  display() {}

  // handleWrapping()
  //
  // all soldier units cannot go off the edge
  handleWrapping() {
    if (this.health <= 0) {
      this.dead = true;
    }
    // Off the left or right
    if (this.x < this.size / 2) {
      this.x = this.size / 2;
    } else if (this.x > width - this.size / 2) {
      this.x = width - this.size / 2;
    }
    // Off the top or bottom
    if (this.y < this.size / 2) {
      this.y = this.size / 2;
    } else if (this.y > height - this.size / 2) {
      this.y = height - this.size / 2;
    }
  }
}
