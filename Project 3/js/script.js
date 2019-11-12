/*****************
- Final Project -
Simple Defence

By Yichen Wang


Simple Defence is a simple game with simple UI and straightforward rules.
Players can play with the computer or with their friends.
Players must defend their bases from their competitors and
must destory their components to win the game.
Players can send out soldiers using their resources. The more powerful the soldier is,
the more expensive it will be. Players' resources will gain 1 per second.
******************/

let State = "starting";
let selectedMap = false;
let selectedMode = false;
let mapId = -1;
let modeId = -1;
let playing = false;
let gameOver = false;
let singlePlayer = true;

let r;
let g;
let b;

let baseLeft;
let baseRight;

const SELECTED = "#47b3ff";

function preload() {

}

function setup() {
  createCanvas(windowWidth,windowHeight);
  randomizeBG();

  textFont("Verdana");
  textStyle(BOLD);
  noStroke();
}

function randomizeBG(){
  r = random(80,100);
  g = random(80,100);
  b = random(80,100);
}

function draw() {
  background(r,g,b);

  if (State==="starting"){
    displayMainMenu();
  }
  if(State==="selectingMaps"){
    displayMapMenu();
  }
  if(State==="selectingMode"){
    displayModeMenu();
  }

  if(singlePlayer && playing){
    displayBase();
  }else if(!singlePlayer && playing){
    displayBase();
  }
}

function setUpBase(){
  baseLeft = new Base(0,mapId,modeId);
  baseRight = new Base(1,mapId,modeId);
}

function displayBase(){
  baseLeft.display();
  baseRight.display();
}

function displayMainMenu(){
  push();
  fill(255);
  textAlign(CENTER,CENTER);
  rectMode(CENTER);
  textSize(64);
  text("S I M P L E   D E F E N C E",width/2,height/2);
  pop();

  checkMainMenuButtons();
}

function checkMainMenuButtons(){
  push();
  textAlign(CENTER,CENTER);
  rectMode(CORNER);
  textSize(32);
  if (mouseY>height-75){
    fill(SELECTED);
    rect(0,height-75,width,75);
    fill(255);
    text("P L A Y",width/2,height-35);
    if (mouseIsPressed){
      State="selectingMaps";
    }
  }else{
    fill(50,150);
    rect(0,height-75,width,75);
    fill(255);
    text("P L A Y",width/2,height-35);
  }
  pop();
}

function displayMapMenu(){
  push();
  fill(255);
  textAlign(CENTER,CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  textSize(32);
  text("C H O O S E   Y O U R   M A P",width/2,height/2-200);
  rect(width/2-375,height/2,width/6,height/6);
  rect(width/2-125,height/2,width/6,height/6);
  rect(width/2+125,height/2,width/6,height/6);
  rect(width/2+375,height/2,width/6,height/6);

  if (mapId===0){
    fill(SELECTED);
    rect(width/2-375,height/2,width/6+10,height/6+10);
    fill(255);
    rect(width/2-375,height/2,width/6,height/6);
  }else if(mapId===1){
    fill(SELECTED);
    rect(width/2-125,height/2,width/6+10,height/6+10);
    fill(255);
    rect(width/2-125,height/2,width/6,height/6);
  }else if(mapId===2){
    fill(SELECTED);
    rect(width/2+125,height/2,width/6+10,height/6+10);
    fill(255);
    rect(width/2+125,height/2,width/6,height/6);
  }else if(mapId===3){
    fill(SELECTED);
    rect(width/2+375,height/2,width/6+10,height/6+10);
    fill(255);
    rect(width/2+375,height/2,width/6,height/6);
  }
  if(selectedMap){
    rectMode(CORNER);
    fill(50,150);
    rect(0,height-75,width,75);
    fill(255);
    text("N E X T",width/2,height-35);
  }
  pop();

  checkMapMenuButton();
}

function checkMapMenuButton(){
  push();
  textAlign(CENTER,CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  textSize(32);
  if (height/2-height/12<mouseY && mouseY<height/2+height/12
  && mouseX>width/2-375-width/12 && mouseX<width/2+375+width/12){
    if(mouseX<width/2-375+width/12 && mouseX>width/2-375-width/12){
      fill(SELECTED);
      rect(width/2-375,height/2,width/6+10,height/6+10);
      fill(255);
      rect(width/2-375,height/2,width/6,height/6);
      textSize(16);
      text("H O R I Z O N T A L",width/2,height/2+100);
      if(mouseIsPressed){
        mapId = 0;
        selectedMap = true;
      }
    }else if(mouseX>width/2-125-width/12 && mouseX<width/2-125+width/12){
      fill(SELECTED);
      rect(width/2-125,height/2,width/6+10,height/6+10);
      fill(255);
      rect(width/2-125,height/2,width/6,height/6);
      textSize(16);
      text("D I A G O N A L   I",width/2,height/2+100);
      if(mouseIsPressed){
        mapId = 1;
        selectedMap = true;
      }
    }else if(mouseX>width/2+125-width/12 && mouseX<width/2+125+width/12){
      fill(SELECTED);
      rect(width/2+125,height/2,width/6+10,height/6+10);
      fill(255);
      rect(width/2+125,height/2,width/6,height/6);
      textSize(16);
      text("D I A G O N A L   I I",width/2,height/2+100);
      if(mouseIsPressed){
        mapId = 2;
        selectedMap = true;
      }
    }else if(mouseX>width/2+375-width/12 && mouseX<width/2+375+width/12){
      fill(SELECTED);
      rect(width/2+375,height/2,width/6+10,height/6+10);
      fill(255);
      rect(width/2+375,height/2,width/6,height/6);
      textSize(16);
      text("V E R T I C A L",width/2,height/2+100);
      if(mouseIsPressed){
        mapId = 3;
        selectedMap = true;
      }
    }
  }else{
    if(mouseIsPressed && mouseY<height-75){
      mapId = -1;
      selectedMap = false;
    }
  }
  if(selectedMap && mouseY>height-75){
    rectMode(CORNER);
    fill(SELECTED);
    rect(0,height-75,width,75);
    fill(255);
    text("N E X T",width/2,height-35);
    if(mouseIsPressed){
      State="selectingMode";
    }
  }
  pop();
}

function displayModeMenu(){
  push();
  fill(255);
  textAlign(CENTER,CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  textSize(32);
  text("C H O O S E   A   G A M E   M O D E",width/2,height/2-200);
  rect(width/2-125,height/2,width/6,height/6);
  rect(width/2+125,height/2,width/6,height/6);
  if(modeId===0){
    fill(SELECTED);
    rect(width/2-125,height/2,width/6+10,height/6+10);
    fill(255);
    rect(width/2-125,height/2,width/6,height/6);
  }else if(modeId===1){
    fill(SELECTED);
    rect(width/2+125,height/2,width/6+10,height/6+10);
    fill(255);
    rect(width/2+125,height/2,width/6,height/6);
  }
  if (selectedMode){
    rectMode(CORNER);
    fill(50,150);
    rect(0,height-75,width,75);
    fill(255);
    text("S T A R T",width/2,height-35);
  }
  pop();

  checkModeMenu();
}

function checkModeMenu(){
  push();
  fill(255);
  textAlign(CENTER,CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  textSize(32);
  if (height/2-height/12<mouseY && mouseY<height/2+height/12
  && mouseX>width/2-125-width/12 && mouseX<width/2+125+width/12){
    if(mouseX>width/2-125-width/12 && mouseX<width/2-125+width/12){
      fill(SELECTED);
      rect(width/2-125,height/2,width/6+10,height/6+10);
      fill(255);
      rect(width/2-125,height/2,width/6,height/6);
      textSize(16);
      text("C O M P E T E   W I T H   Y O U R   C O M P U T E R",width/2,height/2+100);
      if(mouseIsPressed){
        modeId = 0;
        selectedMode = true;
      }
    }else if(mouseX>width/2+125-width/12 && mouseX<width/2+125+width/12){
      fill(SELECTED);
      rect(width/2+125,height/2,width/6+10,height/6+10);
      fill(255);
      rect(width/2+125,height/2,width/6,height/6);
      textSize(16);
      text("C O M P E T E   W I T H   Y O U R   F R I E N D",width/2,height/2+100);
      if(mouseIsPressed){
        modeId = 1;
        selectedMode = true;
      }
    }
  }else{
    if(mouseIsPressed && mouseY<height-75){
      modeId = -1;
      selectedMode = false;
    }
  }
  if (selectedMode && mouseY>height-75){
    rectMode(CORNER);
    fill(SELECTED);
    rect(0,height-75,width,75);
    fill(255);
    text("S T A R T",width/2,height-35);
    if(mouseIsPressed){
      State="";
      if(modeId===0){
        singlePlayer=true;
      }else if((modeId===1)){
        singlePlayer=false;
      }
      setUpBase();
      playing = true;
    }
  }
  fill(r,g,b);
  textSize(32);
  text("SINGLE",width/2-125,height/2);
  text("MULTI",width/2+125,height/2);
  pop();
}
