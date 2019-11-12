/*****************
- Final Project -
Simple Defence
By Yichen Wang

Simple Defence is a simple game with simple UI and straightforward rules.


******************/

let starting = false;
let selectedMap = false;
let mapId = -1;
let playing = false;
let gameOver = false;
let singlePlayer = true;

const SELECTED = "#47b3ff";

function preload() {

}

function setup() {
  createCanvas(windowWidth,windowHeight);
  background(100);

  textFont("Verdana");
  textStyle(BOLD);
  noStroke();
}

function draw() {
  background(100);
  if (!starting){
    displayMainMenu();
  }else{
    if(!playing){
      displaySecondMenu();
    }else{
      if(singlePlayer){

      }else{

      }
    }
  }

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
      starting = true;
    }
  }else{
    fill(50);
    rect(0,height-75,width,75);
    fill(255);
    text("P L A Y",width/2,height-35);
  }
  pop();
}

function displaySecondMenu(){
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
    fill(50);
    rect(0,height-75,width,75);
    fill(255);
    text("N E X T",width/2,height-35);
  }
  pop();

  checkSecondMenuButton();
}

function checkSecondMenuButton(){
  push();
  textAlign(CENTER,CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  textSize(32);
  if (height/2-height/12<mouseY && mouseY<height/2+height/12){
    if(mouseX<width/2-375+width/12 && mouseX>width/2-375-width/12){
      fill(SELECTED);
      rect(width/2-375,height/2,width/6+10,height/6+10);
      fill(255);
      rect(width/2-375,height/2,width/6,height/6);
      if(mouseIsPressed){
        mapId = 0;
        selectedMap = true;
      }
    }else if(mouseX>width/2-125-width/12 && mouseX<width/2-125+width/12){
      fill(SELECTED);
      rect(width/2-125,height/2,width/6+10,height/6+10);
      fill(255);
      rect(width/2-125,height/2,width/6,height/6);
      if(mouseIsPressed){
        mapId = 1;
        selectedMap = true;
      }
    }else if(mouseX>width/2+125-width/12 && mouseX<width/2+125+width/12){
      fill(SELECTED);
      rect(width/2+125,height/2,width/6+10,height/6+10);
      fill(255);
      rect(width/2+125,height/2,width/6,height/6);
      if(mouseIsPressed){
        mapId = 2;
        selectedMap = true;
      }
    }else if(mouseX>width/2+375-width/12 && mouseX<width/2+375+width/12){
      fill(SELECTED);
      rect(width/2+375,height/2,width/6+10,height/6+10);
      fill(255);
      rect(width/2+375,height/2,width/6,height/6);
      if(mouseIsPressed){
        mapId = 3;
        selectedMap = true;
      }
    }
  }else{
    if(mouseIsPressed){
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
  }
  pop();
}
