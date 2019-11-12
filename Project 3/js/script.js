/*****************
- Final Project -
Simple Defence
By Yichen Wang

Simple Defence is a simple game with simple UI and straightforward rules.


******************/

let starting = false;
let playing = false;
let gameOver = false;
let singlePlayer = true;

const SELECTED = "#4ddeff";

function preload() {

}

function setup() {
  createCanvas(windowWidth,windowHeight);
  background(100);

  textFont("Verdana");
  textStyle(BOLD);
}

function draw() {
  background(100);
  if (!starting){
    displayMainMenu();
  }else{
    if(!playing){
      displaySecondMenu()
    }else{

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
  textSize(32);
  if (mouseY>height-height/3){
    fill(SELECTED);
    text("P L A Y",width/2,height/2+200);
    if (mouseIsPressed){
      starting = true;
    }
  }else{
    fill(255);
    text("P L A Y",width/2,height/2+200);
  }
  pop();
}

function displaySecondMenu(){
  push();
  fill(255);
  textAlign(CENTER,CENTER);
  rectMode(CENTER);
  textSize(32);
  text("C H O O S E   Y O U R   M A P",width/2,75);
  pop();

  checkSecondMenuButton();
}

function checkSecondMenuButton(){
  push();
  textAlign(CENTER,CENTER);
  textSize(32);
  pop();
}
