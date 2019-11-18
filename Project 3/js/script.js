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
let selectedMap = false; // if a map is selected
let selectedMode = false; // if a mode is selected
let mapId = -1; // record the id for map
let modeId = -1; // record the id for mode
let playing = false; // if playing
let gameOver = false; // if game is over
let singlePlayer = true; // if sinlge player

let uniqueIds=[];

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

let MapHorizontal;
let MapVertical;
let MapDiagonal1;
let MapDiagonal2;

function preload() {
  MapHorizontal = loadImage("assets/images/Horizontal.jpg");
  MapVertical = loadImage("assets/images/Vertical.jpg");
  MapDiagonal1 = loadImage("assets/images/Diagonal 1.jpg");
  MapDiagonal2 = loadImage("assets/images/Diagonal 2.jpg");
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
  if (State === "starting") {
    displayMainMenu();
  }
  if (State === "selectingMaps") {
    displayMapMenu();
  }
  if (State === "selectingMode") {
    displayModeMenu();
  }
  // if playing
  if (singlePlayer && playing) {
    displayBase();
    displaySoldiers();
    moveSoldiers();
  } else if (!singlePlayer && playing) {
    displayBase();
    displaySoldiers();
    moveSoldiers();
  }
}

function getUniqueId(){
  let id = random(0,100);
  let sameId = false;
  for(let i=0;i<uniqueIds.length;i++){
    if(uniqueIds[i]===id){
      sameId = true;
    }
    if(sameId){
      id = random(0,100);
      i=0;
      sameId=false;
    }
  }
  uniqueIds.push(id);
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
  baseLeft.display();
  baseRight.display();
}

function displaySoldiers() {
  if(baseRight.squareXL!=null){
    baseRight.squareXL.display();
  }
  if(baseLeft.squareXL!=null){
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

function moveSoldiers(){
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
      if(baseRight.squareXL!=null){
        baseLeft.squares[i].attack(baseRight.squareXL);
      }
      if (baseLeft.squares[i].targetId===-1){
        if(!baseLeft.squares[i].dead){
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
    if(baseRight.squareXL!=null){
      baseLeft.circleShooters[i].attack(baseRight.squareXL);
    }
    if (baseLeft.circleShooters[i].targetId===-1){
      if(!baseLeft.circleShooters[i].dead){
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
    if(baseRight.squareXL!=null){
      baseLeft.circleDemos[i].attack(baseRight.squareXL);
    }
    if (baseLeft.circleDemos[i].targetId===-1){
      if(!baseLeft.circleDemos[i].dead){
        baseLeft.circleDemos[i].attackBase(baseRight);
      }
    }
  }
  if(baseLeft.squareXL!=null){
    baseLeft.squareXL.attackBase(baseRight);
    if(baseLeft.animationFinished){
      baseLeft.squareXL=null;
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
      if(baseLeft.squareXL!=null){
        baseRight.squares[i].attack(baseLeft.squareXL);
      }
      if (baseRight.squares[i].targetId===-1){
        if(!baseRight.squares[i].dead){
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
    if(baseLeft.squareXL!=null){
      baseRight.circleShooters[i].attack(baseLeft.squareXL);
    }
    if (baseRight.circleShooters[i].targetId===-1){
      if(!baseRight.circleShooters[i].dead){
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
    if(baseLeft.squareXL!=null){
      baseRight.circleDemos[i].attack(baseLeft.squareXL);
    }
    if (baseRight.circleDemos[i].targetId===-1){
      if(!baseRight.circleDemos[i].dead){
        baseRight.circleDemos[i].attackBase(baseLeft);
      }
    }
  }
  if(baseRight.squareXL!=null){
    baseRight.squareXL.attackBase(baseLeft);
    if(baseRight.animationFinished){
      baseRight.squareXL=null;
    }
  }
}

// keyPressed()
//
// handle the inputs
function keyPressed() {
  if (playing) {
    if (baseLeft.capacity<baseLeft.maxCap){
      if (keyCode === 87) {
        let uniqueId = getUniqueId();
        let square = new Square(baseLeft.x, baseLeft.y, 0, mapId,uniqueId);
        baseLeft.squares.push(square);
        console.log("BLUE player spawned a square (id: "+uniqueId+")");
        baseLeft.capacity++;
      } else if (keyCode === 65) {
        let uniqueId = getUniqueId();
        let circleShooter = new CircleShooter(baseLeft.x, baseLeft.y, 0, mapId,uniqueId);
        baseLeft.circleShooters.push(circleShooter);
        console.log("BLUE player spawned a circle shooter (id: "+uniqueId+")");
        baseLeft.capacity++;
      } else if (keyCode === 83) {
        let uniqueId = getUniqueId();
        let squareXL = new SquareXL(baseLeft.x, baseLeft.y, 0, mapId,-10);
        baseLeft.squareXL = squareXL;
        console.log("BLUE player spawned a square XL (id: -10)");
      } else if (keyCode === 68) {
        let uniqueId = getUniqueId();
        let circleDemo = new CircleDemo(baseLeft.x, baseLeft.y, 0, mapId,uniqueId);
        baseLeft.circleDemos.push(circleDemo);
        console.log("BLUE player spawned a circle demo (id: "+uniqueId+")");
        baseLeft.capacity++;
      }
    }
    if (!singlePlayer) {
      if (baseRight.capacity<baseRight.maxCap){
        if (keyCode === 38) {
          let uniqueId = getUniqueId();
          let square = new Square(baseRight.x, baseRight.y, 1,mapId,uniqueId);
          baseRight.squares.push(square);
          console.log("RED player spawned a square (id: "+uniqueId+")");
          baseRight.capacity++;
        } else if (keyCode === 37) {
          let uniqueId = getUniqueId();
          let circleShooter = new CircleShooter(baseRight.x, baseRight.y, 1,mapId,uniqueId);
          baseRight.circleShooters.push(circleShooter);
          console.log("RED player spawned a circle shooter (id: "+uniqueId+")");
          baseRight.capacity++;
        } else if (keyCode === 40) {
          let uniqueId = getUniqueId();
          let squareXL = new SquareXL(baseRight.x, baseRight.y, 1,mapId,-10);
          baseRight.squareXL = squareXL;
          console.log("RED player spawned a square XL (id: -10)");
        } else if (keyCode === 39) {
          let uniqueId = getUniqueId();
          let circleDemo = new CircleDemo(baseRight.x, baseRight.y, 1,mapId,uniqueId);
          baseRight.circleDemos.push(circleDemo);
          console.log("RED player spawned a circle demo (id: "+uniqueId+")");
          baseRight.capacity++;
        }
      }
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
  text("S I M P L E   D E F E N C E", width / 2, height / 2);
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
  // if hovering
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
  image(MapHorizontal,width / 2 - 375, height / 2, rectUIWidth, rectUIHeight);
  image(MapDiagonal1,width / 2 - 125, height / 2, rectUIWidth, rectUIHeight);
  image(MapDiagonal2,width / 2 + 125, height / 2, rectUIWidth, rectUIHeight);
  image(MapVertical,width / 2 + 375, height / 2, rectUIWidth, rectUIHeight);

  // if a map is selected, highlight that map
  fill(SELECTED); // outline
  if (mapId === 0) {
    rect(width / 2 - 375, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
    // map
    image(MapHorizontal,width / 2 - 375, height / 2, rectUIWidth, rectUIHeight);
  } else if (mapId === 1) {
    rect(width / 2 - 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
    image(MapDiagonal1,width / 2 - 125, height / 2, rectUIWidth, rectUIHeight);
  } else if (mapId === 2) {
    rect(width / 2 + 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
    image(MapDiagonal2,width / 2 + 125, height / 2, rectUIWidth, rectUIHeight);
  } else if (mapId === 3) {
    rect(width / 2 + 375, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
    image(MapVertical,width / 2 + 375, height / 2, rectUIWidth, rectUIHeight);
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
  if (height / 2 - height / 12 < mouseY && mouseY < height / 2 + height / 12 &&
    mouseX > width / 2 - 375 - width / 12 && mouseX < width / 2 + 375 + width / 12) {
    if (mouseX < width / 2 - 375 + width / 12 && mouseX > width / 2 - 375 - width / 12) {
      rect(width / 2 - 375, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
      image(MapHorizontal,width / 2 - 375, height / 2, rectUIWidth, rectUIHeight);
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
    } else if (mouseX > width / 2 - 125 - width / 12 && mouseX < width / 2 - 125 + width / 12) {
      rect(width / 2 - 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
      image(MapDiagonal1,width / 2 - 125, height / 2, rectUIWidth, rectUIHeight);
      textSize(16);
      fill(255);
      text("D I A G O N A L   I", width / 2, height / 2 + 100);
      if (mouseIsPressed) {
        mapId = 1;
        selectedMap = true;
      }
      // map 3
    } else if (mouseX > width / 2 + 125 - width / 12 && mouseX < width / 2 + 125 + width / 12) {
      rect(width / 2 + 125, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
      image(MapDiagonal2,width / 2 + 125, height / 2, rectUIWidth, rectUIHeight);
      textSize(16);
      fill(255);
      text("D I A G O N A L   I I", width / 2, height / 2 + 100);
      if (mouseIsPressed) {
        mapId = 2;
        selectedMap = true;
      }
      // map 4s
    } else if (mouseX > width / 2 + 375 - width / 12 && mouseX < width / 2 + 375 + width / 12) {
      rect(width / 2 + 375, height / 2, rectUIWidth + rectUIStroke, rectUIHeight + rectUIStroke);
      image(MapVertical,width / 2 + 375, height / 2, rectUIWidth, rectUIHeight);
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
  if (height / 2 - height / 12 < mouseY && mouseY < height / 2 + height / 12 &&
    mouseX > width / 2 - 125 - width / 12 && mouseX < width / 2 + 125 + width / 12) {
    // mode 1
    if (mouseX > width / 2 - 125 - width / 12 && mouseX < width / 2 - 125 + width / 12) {
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
    } else if (mouseX > width / 2 + 125 - width / 12 && mouseX < width / 2 + 125 + width / 12) {
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
  } else {
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
    }
  }
  // modes names
  fill(r, g, b);
  textSize(32);
  text("SINGLE", width / 2 - 125, height / 2);
  text("MULTI", width / 2 + 125, height / 2);
  pop();
}
