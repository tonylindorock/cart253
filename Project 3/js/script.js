/*****************
- Final Project -
Simple Defence (Prototype 2-Ex8)

By Yichen Wang

Simple Defence is a simple game with simple UI and straightforward rules.
Players can play with the computer or with their friends.
Players must defend their bases from their competitors and
must destory their components to win the game.
Players can send out soldiers using their resources. The more powerful the soldier is,
the more expensive it will be.
******************/

let State = "starting"; // game state
let subPage = 0;
let selectedMap = false; // if a map is selected
let selectedMode = false; // if a mode is selected
let mapId = -1; // record the id for map
let modeId = -1; // record the id for mode
let playing = false; // if playing
let gameOver = false; // if game is over
let singlePlayer = true; // if sinlge player
let winner = -1;

let startTime = 0;
let time = 0;
let time2 = 0;
let min = 0;
let sec = 0;
let timeBarLength = 0;
let playTime = 0; // current frame count
const RESPAWN_TIME = 5; // 5s for each respawn

let runOnce = true;
let p = 0;
let nextUnit = 0;

const ASSESS = ["M E D I O C R E","O P T I M A L","F L A W L E S S"];

const RULE0 = "You must defend your base against your component.";
const RULE1 = "To do so, you can buy 4 tatical units using your resources.";
const RULE2 = "Use these units to protect your base and destory the enemy base!";

// r g b values for background color
let r;
let g;
let b;

// ui properities
let rectUIWidth = 200;
let rectUIHeight = 115;
let rectUIStroke = 10;

// bases for players
let baseLeft;
let baseRight;

// highlighted color
const SELECTED = "#47b3ff";
const GOLD = "#ffce2b";
const BLUE = "#4fc7fb";
const RED = "#FB524F";

// images
let MapHorizontal;
let MapVertical;
let MapDiagonal1;
let MapDiagonal2;
let HelpPic0;
let HelpPic1;
let HelpPic2;
let HelpPic3;
let HelpPic4;
let HelpPics;

// sounds
let Bgm;
let Fire;
let Deploy;
let Die;
let Explode;
let Defeated;
let Alarm;

let playOnce = true;

function preload() {
  MapHorizontal = loadImage("assets/images/Horizontal.jpg");
  MapVertical = loadImage("assets/images/Vertical.jpg");
  MapDiagonal1 = loadImage("assets/images/Diagonal 1.jpg");
  MapDiagonal2 = loadImage("assets/images/Diagonal 2.jpg");
  HelpPic0 = loadImage("assets/images/WelcomePic.png");
  HelpPic1 = loadImage("assets/images/ControlsPic.png");
  HelpPic2 = loadImage("assets/images/UnitsPic.png");
  HelpPic3 = loadImage("assets/images/ResourcePic.png");
  HelpPic4 = loadImage("assets/images/TimePic.png");

  Bgm = loadSound("assets/sounds/BG Sound.mp3");
  Fire = loadSound("assets/sounds/Fire.mp3");
  Deploy = loadSound("assets/sounds/Deploy.mp3");
  Die = loadSound("assets/sounds/Die.mp3");
  Explode = loadSound("assets/sounds/Explode.mp3");
  Defeated = loadSound("assets/sounds/Defeated.mp3");
  Alarm = loadSound("assets/sounds/Alarm.mp3");

  Bgm.setVolume(0.25);
  Fire.setVolume(0.1);
  Deploy.setVolume(0.1);
  Die.setVolume(0.1);
  Explode.setVolume(0.5);
  Defeated.setVolume(0.5);
  Alarm.setVolume(0.15);
}

// setUp()
//
// set up canvas, background, and main style
function setup() {
  createCanvas(windowWidth, windowHeight);
  randomizeBG();

  textFont("Verdana");
  textStyle(BOLD);
  noStroke();

  HelpPics = [HelpPic0,HelpPic1,HelpPic2,HelpPic3,HelpPic4];
}

// randomizeBG()
//
// randomize background color
function randomizeBG() {
  r = random(80, 100);
  g = random(80, 100);
  b = random(80, 100);
}

// draw()
//
// handle the game whether the player is choosing maps, choosing modes, or playing
function draw() {
  background(r, g, b);

  // different states displaying different menus
  if (!gameOver){
    if (State === "starting") {
      displayMainMenu();
    }
    if (State === "help") {
      displayHelp(subPage);
    }
    if (State === "selectingMaps") {
      displayMapMenu();
    }
    if (State === "selectingMode") {
      displayModeMenu();
    }
  }
  // if playing
  if (playing){
    if (!Bgm.isPlaying()){
      Bgm.play();
    }
    displayTime();
    if (singlePlayer) {
      computerPlays();
      displayBase();
      displaySoldiers();
      moveSoldiers();
    } else if (!singlePlayer) {
      displayBase();
      displaySoldiers();
      moveSoldiers();
    }
  }
  if (gameOver){
    displayGameOver();
  }
}

function getUniqueId() {
  let id = random(0, 100);
  return id;
}

// setUpBase()
//
// create base objects
function setUpBase() {
  baseLeft = new Base(0, mapId, modeId);
  baseRight = new Base(1, mapId, modeId);
}

// displayBase()
//
// display the two bases
function displayBase() {
  if (baseLeft.health > 0){
    baseLeft.display();
  }else{
    baseLeft.displayAnimation();
    winner = 1;
  }
  if (baseRight.health > 0){
    baseRight.display();
  }else{
    baseRight.displayAnimation();
    winner = 0;
  }
  if (keyIsDown(70)){
    baseLeft.displayUnitsMenu();
  }
  if (keyIsDown(76) && modeId === 1){
    baseRight.displayUnitsMenu();
  }
  if (baseLeft.animationFinished){
    playing = false;
    gameOver = true;
    sec = int(((frameCount - startTime) / 60) % 60);
    min = int(((frameCount - startTime) / 60) / 60);
  }
  if (baseRight.animationFinished){
    playing = false;
    gameOver = true;
    sec = int(((frameCount - startTime) / 60) % 60);
    min = int(((frameCount - startTime) / 60) / 60);
  }
}

// displaySoldiers()
//
// display all soldier units
function displaySoldiers() {
  if (baseRight.squareXL != null) {
    baseRight.squareXL.display();
  }
  if (baseLeft.squareXL != null) {
    baseLeft.squareXL.display();
  }
  for (let i = 0; i < baseLeft.squares.length; i++) {
    baseLeft.squares[i].display();
  }
  for (let i = 0; i < baseRight.squares.length; i++) {
    baseRight.squares[i].display();
  }
  for (let i = 0; i < baseRight.circleShooters.length; i++) {
    baseRight.circleShooters[i].display();
  }
  for (let i = 0; i < baseLeft.circleShooters.length; i++) {
    baseLeft.circleShooters[i].display();
  }
  for (let i = 0; i < baseLeft.circleDemos.length; i++) {
    baseLeft.circleDemos[i].display();
  }
  for (let i = 0; i < baseRight.circleDemos.length; i++) {
    baseRight.circleDemos[i].display();
  }
}

// let all soldier units attack their enemies and enemy base
function moveSoldiers() {
  for (let i = 0; i < baseLeft.squares.length; i++) {
    for (let j = 0; j < baseRight.squares.length; j++) {
      baseLeft.squares[i].attack(baseRight.squares[j]);
    }
    for (let j = 0; j < baseRight.circleShooters.length; j++) {
      baseLeft.squares[i].attack(baseRight.circleShooters[j]);
    }
    for (let j = 0; j < baseRight.circleDemos.length; j++) {
      baseLeft.squares[i].attack(baseRight.circleDemos[j]);
    }
    if (baseRight.squareXL != null) {
      baseLeft.squares[i].attack(baseRight.squareXL);
    }
    if (baseLeft.squares[i].targetId === -1) {
      if (!baseLeft.squares[i].dead) {
        baseLeft.squares[i].attackBase(baseRight);
      }
    }
  }
  for (let i = 0; i < baseLeft.circleShooters.length; i++) {
    for (let j = 0; j < baseRight.squares.length; j++) {
      baseLeft.circleShooters[i].attack(baseRight.squares[j]);
    }
    for (let j = 0; j < baseRight.circleShooters.length; j++) {
      baseLeft.circleShooters[i].attack(baseRight.circleShooters[j]);
    }
    for (let j = 0; j < baseRight.circleDemos.length; j++) {
      baseLeft.circleShooters[i].attack(baseRight.circleDemos[j]);
    }
    if (baseRight.squareXL != null) {
      baseLeft.circleShooters[i].attack(baseRight.squareXL);
    }
    if (baseLeft.circleShooters[i].targetId === -1) {
      if (!baseLeft.circleShooters[i].dead) {
        baseLeft.circleShooters[i].attackBase(baseRight);
      }
    }
  }
  for (let i = 0; i < baseLeft.circleDemos.length; i++) {
    for (let j = 0; j < baseRight.squares.length; j++) {
      baseLeft.circleDemos[i].attack(baseRight.squares[j]);
    }
    for (let j = 0; j < baseRight.circleShooters.length; j++) {
      baseLeft.circleDemos[i].attack(baseRight.circleShooters[j]);
    }
    for (let j = 0; j < baseRight.circleDemos.length; j++) {
      baseLeft.circleDemos[i].attack(baseRight.circleDemos[j]);
    }
    if (baseRight.squareXL != null) {
      baseLeft.circleDemos[i].attack(baseRight.squareXL);
    }
    if (baseLeft.circleDemos[i].targetId === -1) {
      if (!baseLeft.circleDemos[i].dead) {
        baseLeft.circleDemos[i].attackBase(baseRight);
      }
    }
  }
  if (baseLeft.squareXL != null) {
    baseLeft.squareXL.attackBase(baseRight);
    if (baseLeft.squareXL.animationFinished) {
      baseLeft.squareXL = null;
    }
  }
  for (let i = 0; i < baseRight.squares.length; i++) {
    for (let j = 0; j < baseLeft.squares.length; j++) {
      baseRight.squares[i].attack(baseLeft.squares[j]);
    }
    for (let j = 0; j < baseLeft.circleShooters.length; j++) {
      baseRight.squares[i].attack(baseLeft.circleShooters[j]);
    }
    for (let j = 0; j < baseLeft.circleDemos.length; j++) {
      baseRight.squares[i].attack(baseLeft.circleDemos[j]);
    }
    if (baseLeft.squareXL != null) {
      baseRight.squares[i].attack(baseLeft.squareXL);
    }
    if (baseRight.squares[i].targetId === -1) {
      if (!baseRight.squares[i].dead) {
        baseRight.squares[i].attackBase(baseLeft);
      }
    }
  }
  for (let i = 0; i < baseRight.circleShooters.length; i++) {
    for (let j = 0; j < baseLeft.squares.length; j++) {
      baseRight.circleShooters[i].attack(baseLeft.squares[j]);
    }
    for (let j = 0; j < baseLeft.circleShooters.length; j++) {
      baseRight.circleShooters[i].attack(baseLeft.circleShooters[j]);
    }
    for (let j = 0; j < baseLeft.circleDemos.length; j++) {
      baseRight.circleShooters[i].attack(baseLeft.circleDemos[j]);
    }
    if (baseLeft.squareXL != null) {
      baseRight.circleShooters[i].attack(baseLeft.squareXL);
    }
    if (baseRight.circleShooters[i].targetId === -1) {
      if (!baseRight.circleShooters[i].dead) {
        baseRight.circleShooters[i].attackBase(baseLeft);
      }
    }
  }
  for (let i = 0; i < baseRight.circleDemos.length; i++) {
    for (let j = 0; j < baseLeft.squares.length; j++) {
      baseRight.circleDemos[i].attack(baseLeft.squares[j]);
    }
    for (let j = 0; j < baseLeft.circleShooters.length; j++) {
      baseRight.circleDemos[i].attack(baseLeft.circleShooters[j]);
    }
    for (let j = 0; j < baseLeft.circleDemos.length; j++) {
      baseRight.circleDemos[i].attack(baseLeft.circleDemos[j]);
    }
    if (baseLeft.squareXL != null) {
      baseRight.circleDemos[i].attack(baseLeft.squareXL);
    }
    if (baseRight.circleDemos[i].targetId === -1) {
      if (!baseRight.circleDemos[i].dead) {
        baseRight.circleDemos[i].attackBase(baseLeft);
      }
    }
  }
  if (baseRight.squareXL != null) {
    baseRight.squareXL.attackBase(baseLeft);
    if (baseRight.squareXL.animationFinished) {
      baseRight.squareXL = null;
    }
  }
}

// keyPressed()
//
// read the inputs to spawn the specified unit
function keyPressed() {
  if (State === "help"){
    if (keyCode === 39 || keyCode === 40){
      subPage ++;
    }else if (keyCode === 37 || keyCode === 38){
      subPage --;
    }
    if (subPage >= 5){
      subPage = 0;
    }else if (subPage < 0){
      subPage = 4;
    }
  }
  if (playing) {
    if (keyCode === 83) {
      if (baseLeft.resource >= 42 && baseLeft.squareXL===null) {
        baseLeft.DownkeyColor = BLUE;
        let uniqueId = getUniqueId();
        let squareXL = new SquareXL(baseLeft.x, baseLeft.y, 0, mapId, 100);
        baseLeft.squareXL = squareXL;
        console.log("BLUE player spawned a square XL (id: 100)");
        baseLeft.resource -= squareXL.cost;
        Deploy.play();
      }
    }
    if (baseLeft.capacity < baseLeft.maxCap) {
      if (keyCode === 87) {
        if (baseLeft.resource >= 16) {
          baseLeft.UpkeyColor = BLUE;
          let uniqueId = getUniqueId();
          let square = new Square(baseLeft.x, baseLeft.y, 0, mapId, uniqueId);
          baseLeft.squares.push(square);
          console.log("BLUE player spawned a square (id: " + uniqueId + ")");
          baseLeft.capacity++;
          baseLeft.squaresNum++;
          baseLeft.resource -= square.cost;
          Deploy.play();
        }
      } else if (keyCode === 65) {
        if (baseLeft.resource >= 28) {
          baseLeft.LeftkeyColor = BLUE;
          let uniqueId = getUniqueId();
          let circleShooter = new CircleShooter(baseLeft.x, baseLeft.y, 0, mapId, uniqueId);
          baseLeft.circleShooters.push(circleShooter);
          console.log("BLUE player spawned a circle shooter (id: " + uniqueId + ")");
          baseLeft.capacity++;
          baseLeft.circleShootersNum++;
          baseLeft.resource -= circleShooter.cost;
          Deploy.play();
        }
      } else if (keyCode === 68) {
        if (baseLeft.resource >= 20) {
          baseLeft.RightkeyColor = BLUE;
          let uniqueId = getUniqueId();
          let circleDemo = new CircleDemo(baseLeft.x, baseLeft.y, 0, mapId, uniqueId);
          baseLeft.circleDemos.push(circleDemo);
          console.log("BLUE player spawned a circle demo (id: " + uniqueId + ")");
          baseLeft.capacity++;
          baseLeft.circleDemosNum++;
          baseLeft.resource -= circleDemo.cost;
          Deploy.play();
        }
      }
    }
    if (!singlePlayer) {
      if (keyCode === 40) {
        if (baseRight.resource >= 42  && baseRight.squareXL===null) {
          baseRight.DownkeyColor = RED;
          let uniqueId = getUniqueId();
          let squareXL = new SquareXL(baseRight.x, baseRight.y, 1, mapId, 100);
          baseRight.squareXL = squareXL;
          console.log("RED player spawned a square XL (id: 100)");
          baseRight.resource -= squareXL.cost;
          Deploy.play();
          }
        }
      }
      if (baseRight.capacity < baseRight.maxCap) {
        if (keyCode === 38) {
          if (baseRight.resource >= 16) {
            baseRight.UpkeyColor = RED;
            let uniqueId = getUniqueId();
            let square = new Square(baseRight.x, baseRight.y, 1, mapId, uniqueId);
            baseRight.squares.push(square);
            console.log("RED player spawned a square (id: " + uniqueId + ")");
            baseRight.capacity++;
            baseRight.squaresNum++;
            baseRight.resource -= square.cost;
            Deploy.play();
          }
        } else if (keyCode === 37) {
          if (baseRight.resource >= 28) {
            baseRight.LeftkeyColor = RED;
            let uniqueId = getUniqueId();
            let circleShooter = new CircleShooter(baseRight.x, baseRight.y, 1, mapId, uniqueId);
            baseRight.circleShooters.push(circleShooter);
            console.log("RED player spawned a circle shooter (id: " + uniqueId + ")");
            baseRight.capacity++;
            baseRight.circleShootersNum++;
            baseRight.resource -= circleShooter.cost;
            Deploy.play();
          }
        } else if (keyCode === 39) {
          if (baseRight.resource >= 20) {
            baseRight.RightkeyColor = RED;
            let uniqueId = getUniqueId();
            let circleDemo = new CircleDemo(baseRight.x, baseRight.y, 1, mapId, uniqueId);
            baseRight.circleDemos.push(circleDemo);
            console.log("RED player spawned a circle demo (id: " + uniqueId + ")");
            baseRight.capacity++;
            baseRight.circleDemosNum++;
            baseRight.resource -= circleDemo.cost;
            Deploy.play();
          }
        }
      }
    }
  }

// keyReleased()
//
// if released, let the button go back to normal
function keyReleased() {
  if (playing) {
    if (keyCode === 87) {
      baseLeft.UpkeyColor = color(255, 0);
    } else if (keyCode === 65) {
      baseLeft.LeftkeyColor = color(255, 0);
    } else if (keyCode === 83) {
      baseLeft.DownkeyColor = color(255, 0);
    } else if (keyCode === 68) {
      baseLeft.RightkeyColor = color(255, 0);
    }
    if (!singlePlayer) {
      if (keyCode === 38) {
        baseRight.UpkeyColor = color(255, 0);
      } else if (keyCode === 37) {
        baseRight.LeftkeyColor = color(255, 0);
      } else if (keyCode === 40) {
        baseRight.DownkeyColor = color(255, 0);
      } else if (keyCode === 39) {
        baseRight.RightkeyColor = color(255, 0);
      }
    }
  }
}

function displayTime(){
  playTime = frameCount;
  if (playTime % 1 === 0 && playTime!=0){
    time += 0.0167;
    if (time >= RESPAWN_TIME){
      time = 0;
      time2 ++;
      if (baseLeft.health > 0 && baseRight.health > 0){
        respawnUnits(time2);
      }
      if (time2 >= 2){
        time2 = 0;
      }
    }
  }
  timeBarLength = map(time,0,RESPAWN_TIME,0,250);
  push();
  fill(255);
  textAlign(CENTER,CENTER);
  rectMode(LEFT);
  ellipseMode(CENTER);
  textSize(16);
  if (mapId!=3){
    text("T",width/2-125, 25);
    fill(GOLD);
    rect(width/2-125,50,timeBarLength,25);
    text("RESPAWN",width/2+125, 25);
    textSize(24);
    stroke(255);
    strokeWeight(4);
    fill(255,0);
    rect(width/2-125, 50, 250, 25);
    if(time2 === 0){
      fill(255,0);
      ellipse(width/2+150,62.5,15);
    }else{
      fill(255);
      ellipse(width/2+150,62.5,15);
    }
  }else{
    text("T",width-375, 25);
    fill(GOLD);
    rect(width-375, 50, timeBarLength, 25);
    text("RESPAWN",width-125, 25);
    stroke(255);
    strokeWeight(4);
    fill(255,0);
    rect(width-375, 50, 250, 25);
    if(time2 === 0){
      fill(255,0);
      ellipse(width-100,62.5,15);
    }else{
      fill(255);
      ellipse(width-100,62.5,15);
    }
  }
  pop();
}

function respawnUnits(time){
  if (time === 1 || time === 2){
    for (let i = 0; i < baseLeft.squaresNum; i++) {
      let uniqueId = getUniqueId();
      if (baseLeft.capacity < baseLeft.maxCap){
        let square = new Square(baseLeft.x, baseLeft.y, 0, mapId, uniqueId);
        baseLeft.squares.push(square);
        baseLeft.capacity++;
      }
    }
    for (let i = 0; i < baseRight.squaresNum; i++) {
      let uniqueId = getUniqueId();
      if (baseRight.capacity < baseRight.maxCap){
        let square = new Square(baseRight.x, baseRight.y, 1, mapId, uniqueId);
        baseRight.squares.push(square);
        baseRight.capacity++;
      }
    }
  }
  if (time === 2){
    for (let i = 0; i < baseLeft.circleShootersNum; i++) {
      let uniqueId = getUniqueId();
      if (baseLeft.capacity < baseLeft.maxCap){
        let circleShooter = new CircleShooter(baseLeft.x, baseLeft.y, 0, mapId, uniqueId);
        baseLeft.circleShooters.push(circleShooter);
        baseLeft.capacity++;
      }
    }
    for (let i = 0; i < baseLeft.circleDemosNum; i++) {
      let uniqueId = getUniqueId();
      if (baseLeft.capacity < baseLeft.maxCap){
        let circleDemo = new CircleDemo(baseLeft.x, baseLeft.y, 0, mapId, uniqueId);
        baseLeft.circleDemos.push(circleDemo);
        baseLeft.capacity++;
      }
    }
    for (let i = 0; i < baseRight.circleShootersNum; i++) {
      let uniqueId = getUniqueId();
      if (baseRight.capacity < baseRight.maxCap){
        let circleShooter = new CircleShooter(baseRight.x, baseRight.y, 1, mapId, uniqueId);
        baseRight.circleShooters.push(circleShooter);
        baseRight.capacity++;
      }
    }
    for (let i = 0; i < baseRight.circleDemosNum; i++) {
      let uniqueId = getUniqueId();
      if (baseRight.capacity < baseRight.maxCap){
        let circleDemo = new CircleDemo(baseRight.x, baseRight.y, 1, mapId, uniqueId);
        baseRight.circleDemos.push(circleDemo);
        baseRight.capacity++;
      }
    }
  }
}

// computerPlays()
//
// This is the way how computer plays the game
// The behaviour is completely random
// Sometimes it can be hard to beat, sometimes it can be very dumb
function computerPlays(){
  if (runOnce && baseRight.capacity < baseRight.maxCap){
    p = int(random(0,5));
    runOnce = false;
  }
  if (p === 4 && nextUnit < 0){
    if (baseRight.squaresNum <= 2 && (baseRight.circleDemosNum < 1 || baseRight.circleShootersNum < 1)){
        p = int(random(0,4));
        if (p===3 && baseRight.resource < 32){
          p = int(random(0,3));
        }
    }
    nextUnit = p;
    console.log("Computer's next unit is "+nextUnit);
  }
  if (p === 3 && nextUnit < 0 && (baseRight.squaresNum >= 2 || baseRight.circleDemosNum >= 2)){
    if (baseRight.resource > 32){
      nextUnit = p;
      console.log("Computer's next unit is "+nextUnit);
    }else{
      while(p === 3){
        p = int(random(0,5));
      }
      nextUnit = p;
      console.log("Computer's next unit is "+nextUnit);
    }
  }
  if (p === 2  && nextUnit < 0){
    if (baseRight.resource > 10 && baseLeft.squaresNum <= baseRight.squaresNum){
      nextUnit = p;
      console.log("Computer's next unit is "+nextUnit);
    }else{
      while(p === 2){
        p = int(random(0,5));
      }
      if (p === 4 && (baseRight.squaresNum >= 2 || baseRight.circleDemosNum >= 2)){
        p = int(random(0,3));
      }
      if (p === 3 && baseRight.resource < 32){
        p = int(random(0,2));
      }
      nextUnit = p;
      console.log("Computer's next unit is "+nextUnit);
    }
  }
  if (p === 1  && nextUnit < 0){
    if (baseRight.resource > 20 && (baseRight.squaresNum >= 2 || baseRight.circleDemosNum >= 2)){
      nextUnit = p;
      console.log("Computer's next unit is "+nextUnit);
    }else{
      p = int(random(0,4));
      if (p === 3 && baseRight.resource < 32){
        p = int(random(0,3));
      }
      while(p === 1){
        p = int(random(0,3));
      }
      nextUnit = p;
      console.log("Computer's next unit is "+nextUnit);
      }
  }
  if (p === 0  && nextUnit < 0){
      nextUnit = p;
      console.log("Computer's next unit is "+nextUnit);
  }

  if (nextUnit === 0){
    if (baseRight.resource >= 16 && baseRight.capacity < baseRight.maxCap) {
      baseRight.UpkeyColor = RED;
      let uniqueId = getUniqueId();
      let square = new Square(baseRight.x, baseRight.y, 1, mapId, uniqueId);
      baseRight.squares.push(square);
      console.log("RED player spawned a square (id: " + uniqueId + ")");
      baseRight.capacity++;
      baseRight.squaresNum++;
      baseRight.resource -= square.cost;
      nextUnit = -1;
      runOnce = true;
    }
  }else if(nextUnit === 1){
    if (baseRight.resource >= 28  && baseRight.capacity < baseRight.maxCap) {
      baseRight.LeftkeyColor = RED;
      let uniqueId = getUniqueId();
      let circleShooter = new CircleShooter(baseRight.x, baseRight.y, 1, mapId, uniqueId);
      baseRight.circleShooters.push(circleShooter);
      console.log("RED player spawned a circle shooter (id: " + uniqueId + ")");
      baseRight.capacity++;
      baseRight.circleShootersNum++;
      baseRight.resource -= circleShooter.cost;
      nextUnit = -1;
      runOnce = true;
    }
  }else if(nextUnit === 2){
    if (baseRight.resource >= 20  && baseRight.capacity < baseRight.maxCap) {
      baseRight.RightkeyColor = RED;
      let uniqueId = getUniqueId();
      let circleDemo = new CircleDemo(baseRight.x, baseRight.y, 1, mapId, uniqueId);
      baseRight.circleDemos.push(circleDemo);
      console.log("RED player spawned a circle demo (id: " + uniqueId + ")");
      baseRight.capacity++;
      baseRight.circleDemosNum++;
      baseRight.resource -= circleDemo.cost;
      nextUnit = -1;
      runOnce = true;
    }
  }else if(nextUnit === 3){
    if (baseRight.resource >= 42  && baseRight.squareXL===null) {
      baseRight.DownkeyColor = RED;
      let uniqueId = getUniqueId();
      let squareXL = new SquareXL(baseRight.x, baseRight.y, 1, mapId, 100);
      baseRight.squareXL = squareXL;
      console.log("RED player spawned a square XL (id: 100)");
      baseRight.resource -= squareXL.cost;
      nextUnit = -1;
      runOnce = true;
    }
  }else if(nextUnit === 4){
    if (baseRight.resource >= 32){
      nextUnit = -1;
      runOnce = true;
    }
  }else{
    if (baseRight.resource >= 16  && baseRight.capacity < baseRight.maxCap) {
      baseRight.UpkeyColor = RED;
      let uniqueId = getUniqueId();
      let square = new Square(baseRight.x, baseRight.y, 1, mapId, uniqueId);
      baseRight.squares.push(square);
      console.log("RED player spawned a square (id: " + uniqueId + ")");
      baseRight.capacity++;
      baseRight.squaresNum++;
      baseRight.resource -= square.cost;
      nextUnit = -1;
      runOnce = true;
    }
  }
}

// displayMainMenu()
//
// display the main menu (title)
function displayMainMenu() {
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  // title
  textSize(64);
  text("S I M P L E   D E F E N C E", width / 2, height / 2 - 75);
  pop();
  // check the play button
  checkMainMenuButton();
}

// checkMainMenuButton()
//
// check the main menu button
function checkMainMenuButton() {
  push();
  textAlign(CENTER, CENTER);
  // play button
  rectMode(CORNER);
  textSize(32);
  // if hovering PLAY
  if (mouseY > height - 75) {
    fill(SELECTED);
    rect(0, height - 75, width, 75);
    fill(255);
    text("P L A Y", width / 2, height - 35);
    // if pressed, go to next state - choosing map
    if (mouseIsPressed) {
      State = "selectingMaps";
    }
    // if not hovering
  } else {
    fill(50, 150);
    rect(0, height - 75, width, 75);
    fill(255);
    text("P L A Y", width / 2, height - 35);
  }
  // if hovering HELP
  if (mouseY < height - 80 && mouseY > height - 155) {
    fill(SELECTED);
    rect(0, height - 155, width, 75);
    fill(255);
    text("H E L P", width / 2, height - 120);
    // if pressed, go to next state - choosing map
    if (mouseIsPressed) {
      State = "help";
    }
    // if not hovering
  } else {
    fill(50, 150);
    rect(0, height - 155, width, 75);
    fill(255);
    text("H E L P", width / 2, height - 120);
  }
  pop();
}

// displayHelp()
//
//
function displayHelp(page){
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(CENTER);
  textSize(16);
  text("click the next circle or use arrowkeys to navigate",width / 2,25);
  if (mouseY < 63 && mouseX < width / 2 - 52 && mouseX > width / 2 - 68){
    fill(SELECTED);
    ellipse(width / 2 - 60, 55,24);
    if (mouseIsPressed) {
      subPage = 0;
    }
  }else if (mouseY < 63 && mouseX < width / 2 - 22 && mouseX > width / 2 - 38){
    fill(SELECTED);
    ellipse(width / 2 - 30, 55,24);
    if (mouseIsPressed) {
      subPage = 1;
    }
  }else if (mouseY < 63 && mouseX < width / 2 + 8 && mouseX > width / 2 - 8){
    fill(SELECTED);
    ellipse(width / 2, 55,24);
    if (mouseIsPressed) {
      subPage = 2;
    }
  }else if (mouseY < 63 && mouseX < width / 2 + 38 && mouseX > width / 2 + 22){
    fill(SELECTED);
    ellipse(width / 2 + 30, 55,24);
    if (mouseIsPressed) {
      subPage = 3;
    }
  }else if (mouseY < 63 && mouseX < width / 2 + 68 && mouseX > width / 2 + 52){
    fill(SELECTED);
    ellipse(width / 2 + 60, 55,24);
    if (mouseIsPressed) {
      subPage = 4;
    }
  }
  fill(50,150);
  ellipse(width / 2 - 60, 55,16);
  ellipse(width / 2 - 30, 55,16);
  ellipse(width / 2, 55,16);
  ellipse(width / 2 + 30, 55,16);
  ellipse(width / 2 + 60, 55,16);
  textSize(32);
  if (page===0){
    fill(SELECTED);
    ellipse(width / 2 - 60, 55,16);
    fill(255);
    text("W E L C O M E",width / 2, 90);
  }else if (page===1){
    fill(SELECTED);
    ellipse(width / 2 - 30, 55,16);
    fill(255);
    text("C O N T O R L S",width / 2, 90);
  }else if (page===2){
    fill(SELECTED);
    ellipse(width / 2, 55,16);
    fill(255);
    text("U N I T S",width / 2, 90);
  }else if (page===3){
    fill(SELECTED);
    ellipse(width / 2 + 30, 55,16);
    fill(255);
    text("R E S O U R C E",width / 2, 90);
  }else if (page===4){
    fill(SELECTED);
    ellipse(width / 2 + 60, 55,16);
    fill(255);
    text("T I M E",width / 2, 90);
  }
  image(HelpPics[page],width/2,height/2,640,360);
  pop();

  checkHelpButton();
}

function checkHelpButton(){
  push();
  textAlign(CENTER, CENTER);
  // play button
  rectMode(CORNER);
  textSize(32);
  // if hovering
  if (mouseY > height - 75) {
    fill(SELECTED);
    rect(0, height - 75, width, 75);
    fill(255);
    text("P L A Y", width / 2, height - 35);
    // if pressed, go to next state - choosing map
    if (mouseIsPressed) {
      State = "selectingMaps";
      subPage = 0;
    }
    // if not hovering
  } else {
    fill(50, 150);
    rect(0, height - 75, width, 75);
    fill(255);
    text("P L A Y", width / 2, height - 35);
  }
  pop();
}

// displayMapMenu()
//
// display the map selection menu
function displayMapMenu() {
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  // title
  textSize(32);
  text("C H O O S E   Y O U R   M A P", width / 2, height / 2 - 200);
  // 4 maps
  image(MapHorizontal, width / 2 - 375, height / 2, rectUIWidth, rectUIHeight);
  image(MapDiagonal1, width / 2 - 125, height / 2, rectUIWidth, rectUIHeight);
  image(MapDiagonal2, width / 2 + 125, height / 2, rectUIWidth, rectUIHeight);
  image(MapVertical, width / 2 + 375, height / 2, rectUIWidth, rectUIHeight);

  // if a map is selected, highlight that map
  fill(SELECTED); // outline
  if (mapId === 0) {
    rect(width / 2 - 375, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
    // map
    image(MapHorizontal, width / 2 - 375, height / 2, rectUIWidth, rectUIHeight);
  } else if (mapId === 1) {
    rect(width / 2 - 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
    image(MapDiagonal1, width / 2 - 125, height / 2, rectUIWidth, rectUIHeight);
  } else if (mapId === 2) {
    rect(width / 2 + 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
    image(MapDiagonal2, width / 2 + 125, height / 2, rectUIWidth, rectUIHeight);
  } else if (mapId === 3) {
    rect(width / 2 + 375, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
    image(MapVertical, width / 2 + 375, height / 2, rectUIWidth, rectUIHeight);
  }
  // if a map is selected, a next button will be displayed
  if (selectedMap) {
    rectMode(CORNER);
    fill(50, 150);
    rect(0, height - 75, width, 75);
    fill(255);
    text("N E X T", width / 2, height - 35);
  }
  pop();
  // check map menu buttons
  checkMapMenuButton();
}

// checkMapMenuButton()
//
// check buttons in map menu
function checkMapMenuButton() {
  push();
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  // if a map is being hovered, display its name under maps
  textSize(32);
  fill(SELECTED);
  // map 1
  if (height / 2 - rectUIHeight/2 < mouseY && mouseY < height / 2 + rectUIHeight/2 &&
    mouseX > width / 2 - 375 - rectUIWidth/2 && mouseX < width / 2 + 375 + rectUIWidth/2) {
    if (mouseX < width / 2 - 375 + rectUIWidth/2 && mouseX > width / 2 - 375 - rectUIWidth/2) {
      rect(width / 2 - 375, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
      image(MapHorizontal, width / 2 - 375, height / 2, rectUIWidth, rectUIHeight);
      // map name
      textSize(16);
      fill(255);
      text("H O R I Z O N T A L", width / 2, height / 2 + 100);
      // if pressed, set mapId and a map is selected
      if (mouseIsPressed) {
        mapId = 0;
        selectedMap = true;
      }
      // map 2
    } else if (mouseX > width / 2 - 125 - rectUIWidth/2 && mouseX < width / 2 - 125 + rectUIWidth/2) {
      rect(width / 2 - 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
      image(MapDiagonal1, width / 2 - 125, height / 2, rectUIWidth, rectUIHeight);
      textSize(16);
      fill(255);
      text("D I A G O N A L   I", width / 2, height / 2 + 100);
      if (mouseIsPressed) {
        mapId = 1;
        selectedMap = true;
      }
      // map 3
    } else if (mouseX > width / 2 + 125 - rectUIWidth/2 && mouseX < width / 2 + 125 + rectUIWidth/2) {
      rect(width / 2 + 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
      image(MapDiagonal2, width / 2 + 125, height / 2, rectUIWidth, rectUIHeight);
      textSize(16);
      fill(255);
      text("D I A G O N A L   I I", width / 2, height / 2 + 100);
      if (mouseIsPressed) {
        mapId = 2;
        selectedMap = true;
      }
      // map 4s
    } else if (mouseX > width / 2 + 375 - rectUIWidth/2 && mouseX < width / 2 + 375 + rectUIWidth/2) {
      rect(width / 2 + 375, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
      image(MapVertical, width / 2 + 375, height / 2, rectUIWidth, rectUIHeight);
      textSize(16);
      fill(255);
      text("V E R T I C A L", width / 2, height / 2 + 100);
      if (mouseIsPressed) {
        mapId = 3;
        selectedMap = true;
      }
    }
  } else {
    // if mouse is pressed somewhere else, remove map selection
    if (mouseIsPressed && mouseY < height - 75) {
      mapId = -1;
      selectedMap = false;
    }
  }
  // check next button
  if (selectedMap && mouseY > height - 75) {
    rectMode(CORNER);
    fill(SELECTED);
    rect(0, height - 75, width, 75);
    fill(255);
    text("N E X T", width / 2, height - 35);
    // if pressed, go to next state - choosing mode
    if (mouseIsPressed) {
      State = "selectingMode";
    }
  }
  pop();
}

// displayModeMenu()
//
// display the mode menu
function displayModeMenu() {
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  // title
  textSize(32);
  text("C H O O S E   A   G A M E   M O D E", width / 2, height / 2 - 200);
  // modes
  rect(width / 2 - 125, height / 2, rectUIWidth, rectUIHeight);
  rect(width / 2 + 125, height / 2, rectUIWidth, rectUIHeight);
  // if a mode is selected, highlight that mode
  // single
  if (modeId === 0) {
    // outline
    fill(SELECTED);
    rect(width / 2 - 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
    // mode
    fill(255);
    rect(width / 2 - 125, height / 2, rectUIWidth, rectUIHeight);
    // multi
  } else if (modeId === 1) {
    fill(SELECTED);
    rect(width / 2 + 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
    fill(255);
    rect(width / 2 + 125, height / 2, rectUIWidth, rectUIHeight);
  }
  // if a mode is selected, display start button
  if (selectedMode) {
    rectMode(CORNER);
    fill(50, 150);
    rect(0, height - 75, width, 75);
    fill(255);
    text("S T A R T", width / 2, height - 35);
  }
  pop();
  // check mode menu buttons
  checkModeMenuButton();
}

// checkModeMenuButton()
//
// check the buttons in mode menu
function checkModeMenuButton() {
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  textSize(32);
  if (height / 2 - rectUIHeight/2 < mouseY && mouseY < height / 2 + rectUIHeight/2 &&
    mouseX > width / 2 - 125 - rectUIWidth/2 && mouseX < width / 2 + 125 + rectUIWidth/2) {
    // mode 1
    if (mouseX > width / 2 - 125 - rectUIWidth/2 && mouseX < width / 2 - 125 + rectUIWidth/2) {
      fill(SELECTED);
      rect(width / 2 - 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
      fill(255);
      rect(width / 2 - 125, height / 2, rectUIWidth, rectUIHeight);
      // description
      textSize(16);
      text("C O M P E T E   W I T H   Y O U R   C O M P U T E R", width / 2, height / 2 + 100);
      // if pressed, set mode and a mode is selected
      if (mouseIsPressed) {
        modeId = 0;
        selectedMode = true;
      }
      // mode 2
    } else if (mouseX > width / 2 + 125 - rectUIWidth/2 && mouseX < width / 2 + 125 + rectUIWidth/2) {
      fill(SELECTED);
      rect(width / 2 + 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
      fill(255);
      rect(width / 2 + 125, height / 2, rectUIWidth, rectUIHeight);
      textSize(16);
      text("C O M P E T E   W I T H   Y O U R   F R I E N D", width / 2, height / 2 + 100);
      if (mouseIsPressed) {
        modeId = 1;
        selectedMode = true;
      }
    }
  }else{
    // if mouse is pressed somewhere else, remove the selection
    if (mouseIsPressed && mouseY < height - 75) {
      modeId = -1;
      selectedMode = false;
    }
  }
  // start button
  if (selectedMode && mouseY > height - 75) {
    rectMode(CORNER);
    fill(SELECTED);
    rect(0, height - 75, width, 75);
    fill(255);
    text("S T A R T", width / 2, height - 35);
    // if pressed, remember the mode, reset state, and start the game
    if (mouseIsPressed) {
      State = "";
      if (modeId === 0) {
        singlePlayer = true;
      } else if ((modeId === 1)) {
        singlePlayer = false;
      }
      setUpBase(); // set up player bases
      playing = true;
      time = 0;
      startTime = frameCount;
    }
  }
  // modes names
  fill(r, g, b);
  textSize(32);
  text("SINGLE", width / 2 - 125, height / 2);
  text("MULTI", width / 2 + 125, height / 2);
  pop();
}

function displayGameOver(){
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  textSize(64);
  if (winner === 0){
    fill(BLUE);
    text("B L U E   W O N", width / 2, height / 2 - 100);
  }else if (winner === 1){
    fill(RED);
    text("R E D   W O N", width / 2, height / 2 - 100);
  }
  fill(GOLD);
  textSize(32);
  if (min <= 9){
    if (sec <= 9){
      text("T I M E   C O N S U M E D\n0"+min+"m 0"+sec+"s", width / 2, height / 2+50);
    }else{
      text("T I M E   C O N S U M E D\n0"+min+"m "+sec+"s", width / 2, height / 2+50);
    }
  }else{
    if (sec <= 9){
      text("T I M E   C O N S U M E D\n"+min+"m 0"+sec+"s", width / 2, height / 2+50);
    }else{
      text("T I M E   C O N S U M E D\n"+min+"m "+sec+"s", width / 2, height / 2+50);
    }
  }
  fill(255);
  textSize(16);
  if (modeId === 1 || (winner === 0 && modeId === 0)){
    if (min >=6){
      text("A S S E S S M E N T :   "+ASSESS[0], width / 2, height / 2+200);
    }else if (min >= 3 && min < 6){
      text("A S S E S S M E N T :   "+ASSESS[1], width / 2, height / 2+200);
    }else if (min < 3){
      text("A S S E S S M E N T :   "+ASSESS[2], width / 2, height / 2+200);
    }
  }else{
    text("A S S E S S M E N T :   F A I L U R E   I S   N O T   A N   O P T I O N", width / 2, height / 2+200);
  }
  pop();

  checkGameOverButton();
}

function checkGameOverButton(){
  push();
  textAlign(CENTER, CENTER);
  // restart button
  rectMode(CORNER);
  textSize(32);
  // if hovering
  if (mouseY < 75) {
    fill(SELECTED);
    rect(0, 0, width, 75);
    fill(255);
    text("B A C K   T O   M A I N   M E N U", width / 2, 35);
    // if pressed, go to first state
    if (mouseIsPressed) {
      State = "starting";
      gameOver = false;
      mapId = -1;
      modeId = -1;
      selectedMap = false;
      selectedMode = false;
    }
    // if not hovering
  } else {
    fill(50, 150);
    rect(0, 0, width, 75);
    fill(255);
    text("B A C K   T O   M A I N   M E N U", width / 2, 35);
  }
  pop();
}
