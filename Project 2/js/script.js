// Earth
// A game by Yichen Wang
//
// Modified from Predator-Prey Sim
//
// The Earth is a simple game but with a complexed simulated-ecosystem.
// Every animals will need to consume something.
// Rabbits, boars, antelopes, and bisons will eat plants on the ground.
// Lion, leopard, or wolf (the player) will eat prey (animals above).
// Humans will hunt all the other animals.
// Some will live, some will strave, and some will be eaten.
// So this is the Earth.

// Our players and player textures
let player1;
let player2;
let player1_texture;
let player2_texture;

// if single player
let singlePlayer = true;

const NUM_TREE = 10; // the number of trees in the game
let num_plant = 100; // the number of plants (grass)

// the number of animals and put them in an array
const NUM_RABBIT = 20;
const NUM_BOAR = 10;
const NUM_ZEBRA = 10;
const NUM_ANTELOPE = 10;
const NUM_BISON = 10;
const NUM_ANIMALS = [NUM_RABBIT, NUM_BOAR, NUM_ZEBRA, NUM_ANTELOPE, NUM_BISON];

let num_human = 1;

// game states
let playing = false;
let gameOver = false;

// scores
let bestScore = 0;
let totalScore = 0;
let runOnce = true; // run once for adding a new human

const SELECTED = "#ffd342"; // highlighted color
// ground colors for different seasons
const SPRING = "#a0cc83";
const SUMMER = "#61a65b";
const FALL = "#dbbf72";
const WINTER = "#a8bab4";
const SEASONS = [SPRING, SUMMER, FALL, WINTER]; // colors in an array
let currentSeason; // index for current season

// tree objects locations
let TreesPosX = [];
let TreesPosY = [];

// plant objects locations
let PlantsPosX = [];
let PlantsPosY = [];

// human camp location
let campfirePosX = 0;
let campfirePosY = 0;

// the rule
const RULES = "You are the predator of the Earth." +
  "\nYou are constantly hungry so you must feast." +
  "\nEat as much prey as you can before humans hunt you down." +
  "\n(eat the red mushroom to boost your chance of survival)";

// display when game ends
const STARTOVER = "This is not the end." +
  "\nYou may be dead, but your race lives on." +
  "\nYou can start over again.";

// all the images
let rabbit_white;
let rabbit_brown;
let boar;
let zebra;
let antelope;
let bison;
let lion;
let wolf;
let leopard;
let human;
let rabbit_white_flipped;
let rabbit_brown_flipped;
let boar_flipped;
let zebra_flipped;
let antelope_flipped;
let bison_flipped;
let lion_flipped;
let wolf_flipped;
let leopard_flipped;
let human_flipped;

let tree_spring;
let tree_summer;
let tree_fall;
let tree_winter;

let plant_spring;
let plant_summer;
let plant_fall;
let plant_winter;

let mushroomTexture;
let camp;

// arrays for containing objects
let trees = [];
let plants = [];
let prey = [];
let players = [];
let predatorPro = [];

// all the sounds
let spring_bg;
let summer_bg;
let fall_bg;
let winter_bg;
let bg_music = []; // sound array
let eaten_sound;
let newRecord_sound;
let noNewRecord_sound;

let playOnce = true; // play once for sound effect

// preload()
//
// Load all the image and sound resources
function preload() {
  rabbit_white = loadImage("assets/images/Rabbit_W.png");
  rabbit_brown = loadImage("assets/images/Rabbit_B.png");
  boar = loadImage("assets/images/Boar.png");
  zebra = loadImage("assets/images/Zebra.png");
  antelope = loadImage("assets/images/Antelope.png");
  bison = loadImage("assets/images/Bison.png");
  lion = loadImage("assets/images/Lion.png");
  wolf = loadImage("assets/images/Wolf.png");
  leopard = loadImage("assets/images/Leopard.png");
  human = loadImage("assets/images/Man.png");

  rabbit_white_flipped = loadImage("assets/images/Rabbit_W_flipped.png");
  rabbit_brown_flipped = loadImage("assets/images/Rabbit_B_flipped.png");
  boar_flipped = loadImage("assets/images/Boar_flipped.png");
  zebra_flipped = loadImage("assets/images/Zebra_flipped.png");
  antelope_flipped = loadImage("assets/images/Antelope_flipped.png");
  bison_flipped = loadImage("assets/images/Bison_flipped.png");
  lion_flipped = loadImage("assets/images/Lion_flipped.png");
  wolf_flipped = loadImage("assets/images/Wolf_flipped.png");
  leopard_flipped = loadImage("assets/images/Leopard_flipped.png");
  human_flipped = loadImage("assets/images/Man_flipped.png");

  tree_spring = loadImage("assets/images/Tree_Spring.png");
  tree_summer = loadImage("assets/images/Tree_Summer.png");
  tree_fall = loadImage("assets/images/Tree_Fall.png");
  tree_winter = loadImage("assets/images/Tree_Winter.png");

  plant_spring = loadImage("assets/images/Plant_Spring.png");
  plant_summer = loadImage("assets/images/Plant_Summer.png");
  plant_fall = loadImage("assets/images/Plant_Fall.png");
  plant_winter = loadImage("assets/images/Plant_Winter.png");

  mushroomTexture = loadImage("assets/images/Mushroom.png");
  camp = loadImage("assets/images/Camp.png");

  spring_bg = loadSound("assets/sounds/Spring.mp3");
  summer_bg = loadSound("assets/sounds/Summer.mp3");
  fall_bg = loadSound("assets/sounds/Fall.mp3");
  winter_bg = loadSound("assets/sounds/Winter.mp3");
  bg_music = [spring_bg, summer_bg, fall_bg, winter_bg]; // bg music in an array
  eaten_sound = loadSound("assets/sounds/Eaten.mp3");
  newRecord_sound = loadSound("assets/sounds/Lion_Roar.mp3");
  noNewRecord_sound = loadSound("assets/sounds/Wolf_Cry.mp3");
}

// setup()
//
// Set up a canvas
// Create an object for the player 1
// set up background, prey, and human (predatorPro)
function setup() {
  createCanvas(windowWidth, windowHeight);
  // overall UI style for the game
  textAlign(CENTER, CENTER);
  textFont('Helvetica');
  textStyle(BOLD);
  imageMode(CENTER);
  rectMode(CENTER);
  noStroke();

  // create a mushroom objects
  mushroom = new Mushroom(random(0, width), random(0, height), 30, mushroomTexture);
  currentSeason = int(random(0, 4)); // randomly set an index for season
  randomizeTreesPos(); // randomly set positions for trees
  randomizePlantsPos(); // randomly set positions for plants

  setupBG();

  // putting players textures in the players array
  append(players, lion);
  append(players, wolf);
  append(players, leopard);
  append(players, lion_flipped);
  append(players, wolf_flipped);
  append(players, leopard_flipped);
  setupPlayer(); // randomly set textures for players
  // create player1 object
  player1 = new Predator(100, 100, 3, 30, player1_texture, player1_texture_flipped, 87, 83, 65, 68, 70);

  setUpPrey();
  setupHuman();
}

// setUpPrey()
//
// set up the prey objects
// randomly select speed and radius within ranges
function setUpPrey() {
  prey = []; // empty the array
  // first loop for animal types
  for (let i = 0; i < 5; i++) {
    let num_animal = NUM_ANIMALS[i]; // get number of certain type
    let animal_id = i; // get id of certain type
    // second loop for animal objects and attributes
    for (let j = 0; j < num_animal; j++) {
      // declare attributes
      let preyX = random(0, width);
      let preyY = random(0, height);
      let preySpeed = 0;
      let preyRadius = 0;
      let texture;
      let texture_flipped;
      // white or brown rabbit
      if (animal_id === 0) {
        preySpeed = random(3, 4);
        preyRadius = random(10, 15);
        // if it's fall and winter, rabbits will be brown
        if (currentSeason === 2 || currentSeason === 3) {
          texture = rabbit_brown;
          texture_flipped = rabbit_brown_flipped;
        } else {
          texture = rabbit_white;
          texture_flipped = rabbit_white_flipped;
        }
        // boar
      } else if (animal_id === 1) {
        preySpeed = random(1, 2);
        preyRadius = random(20, 25);
        texture = boar;
        texture_flipped = boar_flipped;
        // zebra, antelope, and bison
      } else if (animal_id >= 2) {
        preySpeed = random(1, 3);
        preyRadius = random(25, 30);
        // zebra
        if (animal_id === 2) {
          texture = zebra;
          texture_flipped = zebra_flipped;
          // antelope
        } else if (animal_id === 3) {
          texture = antelope;
          texture_flipped = antelope_flipped;
          //bison
        } else if (animal_id === 4) {
          texture = bison;
          texture_flipped = bison_flipped;
        }
      }
      // create the animal object
      let preyObj = new Prey(preyX, preyY, preySpeed, preyRadius, texture, texture_flipped);
      prey.push(preyObj); // put the object in the prey array
    }
  }
}

// setupHuman()
//
// create the first human object
// randomly set a camp position for respawning humans
function setupHuman() {
  predatorPro = []; // empty the array
  for (let i = 0; i < num_human; i++) {
    let humanX = random(50, width - 50);
    let humanY = random(50, height - 50);
    // camp position
    campfirePosX = humanX;
    campfirePosY = humanY;
    // human attributes
    let humanSpeed = 3;
    let humanRadius = random(25, 30);
    // create human object
    let humanObj = new PredatorPro(humanX, humanY, humanSpeed, humanRadius, human, human_flipped);
    predatorPro.push(humanObj); // put human in the array
  }
}

// addHuman()
//
// create and add one human
function addHuman() {
  // max number for humans
  if (num_human < 25) {
    let humanSpeed = 3;
    let humanRadius = random(25, 30);
    let humanObj = new PredatorPro(campfirePosX, campfirePosY, humanSpeed, humanRadius, human, human_flipped);
    num_human++;
    predatorPro.push(humanObj);
  }
}

// setupPlayer()
//
// give player a random look
function setupPlayer() {
  // random texture index
  let randomIndex = int(random(0, 3));
  // record the texture
  player1_texture = players[randomIndex];
  player1_texture_flipped = players[randomIndex + 3];
  randomIndex = int(random(0, 3));
  player2_texture = players[randomIndex];
  player2_texture_flipped = players[randomIndex + 3];
}

// setupBG()
//
// set up the background of the game by randomly selecting a season in an array
// and display certain other BG elements
function setupBG() {
  // empty arrays
  trees = [];
  plants = [];
  num_plant = 100; // reset this
  // spring
  if (currentSeason === 0) {
    // loop for creating tree objects and put them in the array
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(TreesPosX[i], TreesPosY[i], 60, tree_spring);
      trees.push(treeObj);
    }
    // loop for creating the plants and put them in the array
    for (let j = 0; j < num_plant; j++) {
      let plantObj = new Plant(PlantsPosX[j], PlantsPosY[j], 30, plant_spring);
      plants.push(plantObj);
    }
    // summer
  } else if (currentSeason === 1) {
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(TreesPosX[i], TreesPosY[i], 60, tree_summer);
      trees.push(treeObj);
    }
    for (let j = 0; j < num_plant; j++) {
      let plantObj = new Plant(PlantsPosX[j], PlantsPosY[j], 30, plant_summer);
      plants.push(plantObj);
    }
    // fall
  } else if (currentSeason === 2) {
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(TreesPosX[i], TreesPosY[i], 60, tree_fall);
      trees.push(treeObj);
    }
    for (let j = 0; j < num_plant; j++) {
      let plantObj = new Plant(PlantsPosX[j], PlantsPosY[j], 30, plant_fall);
      plants.push(plantObj);
    }
    // winter
  } else if (currentSeason === 3) {
    num_plant = 50;
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(TreesPosX[i], TreesPosY[i], 60, tree_winter);
      trees.push(treeObj);
    }
    for (let j = 0; j < num_plant; j++) {
      let plantObj = new Plant(PlantsPosX[j], PlantsPosY[j], 30, plant_winter);
      plants.push(plantObj);
    }
  }
}

// drawBG()
//
// display the background, trees, plants, mushroom, and camp
function drawBG() {
  background(SEASONS[currentSeason]); // background
  // plants
  for (let j = 0; j < plants.length; j++) {
    plants[j].display();
  }
  // camp
  image(camp, campfirePosX, campfirePosY, 60, 60);
  // trees
  for (let i = 0; i < trees.length; i++) {
    trees[i].display();
  }
  mushroom.display();

}

// nextSeason()
//
// go to the next season
function nextSeason() {
  currentSeason += 1;
  if (currentSeason > 3) {
    currentSeason = 0;
  }
  setupBG(); // change background color, tree texture, and plant texture
}

// randomizeTreesPos()
//
// give each tree a random x,y position
function randomizeTreesPos() {
  for (let i = 0; i < NUM_TREE; i++) {
    TreesPosX[i] = random(0, width);
    TreesPosY[i] = random(0, height);
  }
}

// randomizePlantsPos()
//
// give each plant a random x,y position
function randomizePlantsPos() {
  for (let i = 0; i < num_plant; i++) {
    PlantsPosX[i] = random(0, width);
    PlantsPosY[i] = random(0, height);
  }
}

// draw()
//
// Handling input, movement, eating, and displaying for the system's objects
// also checking collison, playing music, determining game states
function draw() {
  drawBG(); // display background
  // if the game is not starting
  if (!playing && !gameOver) {
    // move all the animals and let humans hunt them
    for (let i = 0; i < prey.length; i++) {
      prey[i].move();
      prey[i].display(playing);
      predatorPro[0].handleEating(prey[i]);
      // animals eat plants
      for (let j = 0; j < num_plant; j++) {
        prey[i].handleEating(plants[j]);
      }
      // tree collison
      for (let j = 0; j < NUM_TREE; j++) {
        prey[i].collide(trees[j]);
      }
    }
    // move humans and check collison
    for (let j = 0; j < predatorPro.length; j++) {
      predatorPro[j].move();
      predatorPro[j].display(playing);
      for (let k = 0; k < NUM_TREE; k++) {
        predatorPro[j].collide(trees[k]);
      }
    }

    // darken the screen for more readable texts
    fill(0, 50);
    rect(width / 2, height / 2, width, height);
    // main menu
    showMainMenu();

    // if the player is playing
  } else if (playing) {
    // play the background music and change it according to the season
    if (!bg_music[currentSeason].isPlaying()) {
      if (currentSeason === 0) {
        bg_music[3].setVolume(0);
      } else {
        bg_music[(currentSeason - 1)].setVolume(0);
      }
      bg_music[currentSeason].setVolume(0.2);
      bg_music[currentSeason].play();
    }
    // check game states
    checkGameOver();
    checkScore();

    // control prey how they eat and how to be eaten
    for (let i = 0; i < prey.length; i++) {
      prey[i].move();
      prey[i].display(playing);
      for (let j = 0; j < num_plant; j++) {
        prey[i].handleEating(plants[j]);
      }
      // tree collison
      for (let j = 0; j < NUM_TREE; j++) {
        prey[i].collide(trees[j]);
      }
      // if the player is not dead, let them eat prey
      if (!player1.dead) {
        player1.handleEating(prey[i]);
      }
      if (!singlePlayer) {
        if (!player2.dead) {
          player2.handleEating(prey[i]);
        }
      }
      for (let j = 0; j < num_human; j++) {
        predatorPro[j].handleEating(prey[i]);
      }
    }
    // control humans how to attack and be attacked
    for (let j = 0; j < num_human; j++) {
      predatorPro[j].move();
      predatorPro[j].display(playing);
      // tree collison
      for (let k = 0; k < NUM_TREE; k++) {
        predatorPro[j].collide(trees[k]);
      }
      if (!player1.dead) {
        predatorPro[j].hunting(player1);
        player1.attacking(predatorPro[j]);
      }
      if (!singlePlayer) {
        if (!player2.dead) {
          predatorPro[j].hunting(player2);
          player2.attacking(predatorPro[j]);
        }
      }
    }
    // Handle input for the player and display them
    // single player
    if (singlePlayer) {
      displayScore(player1, null); // display score
      if (!player1.dead) {
        player1.handleInput();
        player1.move();
        for (let k = 0; k < NUM_TREE; k++) {
          player1.collide(trees[k]);
        }
      }
      player1.display();
      checkEatingMushroom(player1); // checking if mushroom is ok
      removeMushroomEffect(); // remove super ability
      // multi players
    } else {
      displayScore(player1, player2);
      if (!player1.dead) {
        player1.handleInput();
        player1.move();
        for (let k = 0; k < NUM_TREE; k++) {
          player1.collide(trees[k]);
        }
      }
      if (!player2.dead) {
        player2.handleInput();
        player2.move();
        for (let k = 0; k < NUM_TREE; k++) {
          player2.collide(trees[k]);
        }
      }

      player1.display();
      player2.display();
      checkEatingMushroom(player1);
      checkEatingMushroom(player2);
      removeMushroomEffect();
    }
    // game over!
    if (gameOver) {
      fill(0, 50);
      rect(width / 2, height / 2, width, height);
      displayGameOver();
    }
  }

}

// displayScore(player1, player2)
//
// get one or two players' score and display it
// also display what super ability they have
function displayScore(player1, player2) {
  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(64);
  let prevScore = totalScore;
  // calcualte and display the score
  if (singlePlayer) {
    totalScore = int(player1.score);
    text(totalScore, width / 2, 50);
  } else {
    totalScore = int(player1.score + player2.score);
    text(totalScore, width / 2, 50);
  }
  // if score changes, prepare to addHuman()
  if (prevScore < totalScore) {
    runOnce = true;
  }
  // display super ability
  if (mushroom.inEffect) {
    textSize(32);
    fill(random(56, 255), random(56, 255), random(56, 255)); // flashing!
    if (mushroom.effectId === 0) {
      text("SUPER RUNNER", width / 2, 100); // id: 0
    } else {
      text("SUPER HUNTER", width / 2, 100); // id: 1
    }
  }
  pop();
}

// checkScore()
//
// getting 10 points will add one human
// and getting 20 points will change the season
function checkScore() {
  if (totalScore % 10 === 0 && totalScore >= 10 && runOnce) {
    addHuman();
    if (totalScore % 20 === 0 && totalScore >= 20) {
      nextSeason();
    }
    runOnce = false; // let it run only once
  }
}

// checkEatingMushroom(player)
//
// see if the player eats the mushroom
function checkEatingMushroom(player) {
  let d = dist(player.x, player.y, mushroom.x, mushroom.y); // distance
  let playerId = 0;
  let p = 0; // possibility
  // check which player using their sprintKey value
  if (d < player.radius + 15) {
    if (player.sprintKey === 70) {
      playerId = 1;
    } else {
      playerId = 2;
    }
    // if no one has eaten the mushroom
    if (!mushroom.inEffect) {
      // play eaten sound
      if (!eaten_sound.isPlaying()) {
        eaten_sound.setVolume(0.35);
        eaten_sound.play();
      }
      // let mushroom appear in another location
      mushroom.reset();
      // set possibility result
      p = random(0, 1);
      // 50-50 chance for super speed and super strength
      if (p < 0.5) {
        player.speed *= 2;
        mushroom.effectId = 0;
      } else {
        player.healthGainPerEat *= 2;
        mushroom.effectId = 1;
      }
      mushroom.inEffect = true;
      mushroom.effectPlayerId = playerId;
      mushroom.prevScore = totalScore; // record the score when the mushroom is eaten
    }
  }
}

// removeMushroomEffect()
//
// if 5 points have reached after eating the mushroom, remove the ability
function removeMushroomEffect() {
  if (mushroom.prevScore === totalScore - 5 && mushroom.inEffect) {
    mushroom.inEffect = false;
    // which player
    if (mushroom.effectPlayerId === 1) {
      // reset their states
      player1.speed = player1.originalSpeed;
      player1.healthGainPerEat = player1.originalHealthPerEat;
    } else if (mushroom.effectPlayerId === 2) {
      player2.speed = player2.originalSpeed;
      player2.healthGainPerEat = player2.originalHealthPerEat;
    }
  }
}

// checkGameOver()
//
// check if the players are dead
function checkGameOver() {
  if (singlePlayer) {
    if (player1.dead) {
      gameOver = true;
      mushroom.inEffect = false; // when die, remove mushroom effect
    }
  } else {
    if (player1.dead && player2.dead) {
      gameOver = true;
      mushroom.inEffect = false;
    }
  }
}


// showMainMenu()
//
// display the main menu before the game
function showMainMenu() {
  push();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(255);
  text(RULES, width / 2, height / 2 - 150); // rules
  textSize(128);
  text("E A R T H", width / 2, height / 2); // title
  textSize(32);
  // button left
  textAlign(RIGHT, CENTER);
  text("play as one", width / 2 - 100, height / 2 + 120);
  text("WASD KEYS\nF to sprint", width / 2 - 100, height / 2 + 190);
  // button right
  textAlign(LEFT, CENTER);
  text("play as two", width / 2 + 100, height / 2 + 120);
  text("ARROWKEYS\nL to sprint", width / 2 + 100, height / 2 + 190);

  // show where the player 1 is
  fill(255, 100);
  ellipse(100, 100, 120);
  textAlign(CENTER, CENTER);
  textSize(16);
  fill(255);
  text("YOU ARE HERE", 100, 175);
  image(player1_texture, 100, 100, player1.radius * 2, player1.radius * 2);
  pop();

  checkMainMenuButtons();
}

// checkMainMenuButtons()
//
// check the buttons in main menu
// handle whether the game is started in single player
function checkMainMenuButtons() {
  push();
  noStroke();
  textSize(32);
  // single player
  if (mouseX < width / 2) {
    fill(SELECTED);
    textAlign(RIGHT, CENTER);
    text("play as one", width / 2 - 100, height / 2 + 120);
    fill(255);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 120);
    if (mouseIsPressed) {
      playing = true;
      singlePlayer = true;
    }
    // multi players
  } else {
    // show where the player 2 is
    fill(255, 100);
    ellipse(width - 100, 100, 120);
    textAlign(CENTER, CENTER);
    textSize(16);
    fill(255);
    text("YOU ARE HERE", width - 100, 175);
    image(player2_texture, width - 100, 100, player1.radius * 2, player1.radius * 2);
    fill(255);
    textSize(32);
    textAlign(RIGHT, CENTER);
    text("play as one", width / 2 - 100, height / 2 + 120);
    fill(SELECTED);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 120);
    if (mouseIsPressed) {
      playing = true;
      singlePlayer = false;
      // add the second human
      player2 = new Predator(width - 100, 100, 3, 30, player2_texture, player2_texture_flipped, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 76);
      addHuman();
    }
  }
  pop();
}

// displayGameOver()
//
// display game over text
function displayGameOver() {
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(64);
  // if has a better score
  if (bestScore < totalScore) {
    fill(SELECTED);
    text("YOU GOT A NEW RECORD!", width / 2, height / 2 - 200);
    textSize(64);
    text(totalScore, width / 2, 50);
    textSize(32);
    fill(255);
    text("YOUR PREV BEST SCORE: " + bestScore, width / 2, height / 2 - 150);
    // play lion roar
    if (!newRecord_sound.isPlaying() && playOnce) {
      newRecord_sound.setVolume(0.2);
      newRecord_sound.play();
      playOnce = false;
    }
    // if no better score
  } else {
    fill(SELECTED);
    text("YOU CAN DO BETTER!", width / 2, height / 2 - 200);
    textSize(64);
    text(totalScore, width / 2, 50);
    textSize(32);
    fill(255);
    text("YOUR BEST SCORE: " + bestScore, width / 2, height / 2 - 150);
    // play wolf cry
    if (!noNewRecord_sound.isPlaying() && playOnce) {
      noNewRecord_sound.setVolume(0.2);
      noNewRecord_sound.play();
      playOnce = false;
    }
  }
  // show where the player is
  fill(255, 100);
  ellipse(100, 100, 120);
  textAlign(CENTER, CENTER);
  textSize(16);
  fill(255);
  text("YOU ARE HERE", 100, 175);
  image(player1_texture, 100, 100, player1.radius * 2, player1.radius * 2);

  fill(255);
  textSize(32);
  text(STARTOVER, width / 2, height / 2 - 25); // game over msg
  textSize(32);
  // button left
  textAlign(RIGHT, CENTER);
  text("play as one", width / 2 - 100, height / 2 + 100);
  text("WASD KEYS\nF to sprint", width / 2 - 100, height / 2 + 190);
  // button right
  textAlign(LEFT, CENTER);
  text("play as two", width / 2 + 100, height / 2 + 100);
  text("ARROWKEYS\nL to sprint", width / 2 + 100, height / 2 + 190);
  pop();

  checkGameOverButtons();
}

// checkGameOverButtons()
//
// check buttons in game over screen
// handle game restart and reset all the objects
function checkGameOverButtons() {
  push();
  textSize(32);
  fill(255);
  if (mouseX < width / 2) {
    textAlign(RIGHT, CENTER);
    fill(SELECTED);
    text("play as one", width / 2 - 100, height / 2 + 100);
    fill(255);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 100);
    // reset all colors of prey and player
    // reset game stats
    if (mouseIsPressed) {
      background(100);
      if (bestScore < totalScore) {
        bestScore = totalScore;
      }
      // reset player
      player1 = new Predator(100, 100, 3, 30, player1_texture, player1_texture_flipped, 87, 83, 65, 68, 70);
      num_human = 1;
      setUpPrey(); // reset prey
      setupHuman(); // reset human
      gameOver = false;
      singlePlayer = true;

      playOnce = true;
    }
  } else {
    fill(255, 100);
    ellipse(width - 100, 100, 120);
    textAlign(CENTER, CENTER);
    textSize(16);
    fill(255);
    text("YOU ARE HERE", width - 100, 175);
    image(player2_texture, width - 100, 100, player1.radius * 2, player1.radius * 2);
    textSize(32);
    textAlign(RIGHT, CENTER);
    text("play as one", width / 2 - 100, height / 2 + 100);
    fill(SELECTED);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 100);
    // reset all colors of prey and two players
    // reset game stats
    if (mouseIsPressed) {
      if (bestScore < totalScore) {
        bestScore = totalScore;
      }
      player1 = new Predator(100, 100, 3, 30, player1_texture, player1_texture_flipped, 87, 83, 65, 68, 70);
      player2 = new Predator(width - 100, 100, 3, 30, player2_texture, player2_texture_flipped, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 76);
      num_human = 2;
      setUpPrey();
      setupHuman();
      gameOver = false;
      singlePlayer = false;

      playOnce = true;
    }
  }
  pop();
}
