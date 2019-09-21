/******************************************************

Game - The Artful Dodger (Plus)
Modified by Yichen Wang

A (refined) simple dodging game with keyboard controls

******************************************************/

// The position and size of our avatar circle
let avatarX;
let avatarY;
let avatarSize = 50;

// The speed and velocity of our avatar circle
let avatarSpeed = 10;
let avatarVX = 0;
let avatarVY = 0;

// Acceleration
let acc = 0.2;

// The position and size of the enemy circle
let enemyX;
let enemyY;
let enemyX2; // second enemy x position for hard mode
let enemyY2; // second enemy y position for hard mode
let DEFAULT_ENEMYSIZE = 50; // default value for enemy size
let enemySize = DEFAULT_ENEMYSIZE;

let DEFAULT_ENEMYSPEED = 5; // default value for enemy speed
// The speed and velocity of our enemy circle
let enemySpeed = DEFAULT_ENEMYSPEED;
let enemyVX = 5;

// colors for enemy
let randomGreen;
let randomBlue;

// How many dodges the player has made
let dodges = 0;

// determining whether the game is starting
let gameStart = false;
// the difficulty of the game
let hardMode = false;
// which game mode the player chooses
let gameMode = "EASY";
// original backgroud rgb colors: dark blue (43,47,79)
let bG_R = 43;
let bG_G = 47;
let bG_B = 79;

// setup()
// Make the canvas, position the avatar and anemy
function setup() {
  // Create our playing area
  createCanvas(480,640);

  // Put the avatar in the centre
  avatarX = width/2;
  avatarY = height/2;

  // Put the enemy to the left at a random y coordinate within the canvas
  enemyX = 0;
  enemyX2 = 0; // second x position for hard mode
  enemyY = random(0,height);
  enemyY2 = random(0,height); // second random y position for hard mode

  // random colors for enemy
  randomGreen = random(0,255);
  randomBlue = random(0,255);

  // No stroke so it looks cleaner
  noStroke();

  // The main menu setup
  background("#2b2f4f"); // dark blue backgroud
  fill(255);
  textAlign(CENTER);
  textFont("Futura");
  textSize(40);
  text("THE ARTFUL DODGER",avatarX,avatarY); // Title
  textSize(32);
  textStyle(BOLD);
  text("EASY",avatarX,avatarY+50); // Start button
  text("HARD",avatarX,avatarY+100);
  textSize(20);
  textStyle(NORMAL);
  text("Use arrowkeys to dodge other circles!",avatarX,avatarY+150); // rule
}

// draw()
// Handle moving the avatar and enemy and checking for dodges and
// game over situations.
function draw() {
  // This is the simple control for the main menu
  // If the mouse hovers over the "EASY" or "HARD" button, the text color changes

  // This is easy button
    if (dist(mouseX,mouseY,avatarX,avatarY+50) < 25){
      fill("255");
      textSize(40);
      textStyle(NORMAL);
      text("THE ARTFUL DODGER",avatarX,avatarY);
      fill("#8effbd"); // GREEN
      textSize(32);
      textStyle(BOLD);
      text("EASY",avatarX,avatarY+50);
      fill(255);
      text("HARD",avatarX,avatarY+100);
      textSize(20);
      textStyle(NORMAL);
      text("Use arrowkeys to dodge other circles!",avatarX,avatarY+150);
      // If the mouse is pressed, the game will start in easy mode
      if (mouseIsPressed){
        gameStart = true;
      }
    // This is hard button
    }else if (dist(mouseX,mouseY,avatarX,avatarY+100) < 25){
      fill(255);
      textSize(40);
      textStyle(NORMAL);
      text("THE ARTFUL DODGER",avatarX,avatarY);
      textSize(32);
      textStyle(BOLD);
      text("EASY",avatarX,avatarY+50);
      fill("#ff7474"); // RED
      text("HARD",avatarX,avatarY+100);
      fill(255);
      textSize(20);
      textStyle(NORMAL);
      text("Use arrowkeys to dodge other circles!",avatarX,avatarY+150);
      // If the mouse is pressed, the game will start in hard mode
      if (mouseIsPressed){
        gameStart = true;
        hardMode = true;
        gameMode = "HARD";
      }
    // when the mouse is not hovering any buttons, the buttons go back to white
    }else{
      textStyle(NORMAL);
      fill(255);
      textSize(40);
      text("THE ARTFUL DODGER",avatarX,avatarY); // Title
      textSize(32);
      textStyle(BOLD);
      text("EASY",avatarX,avatarY+50); // Start button
      text("HARD",avatarX,avatarY+100);
      textSize(20);
      textStyle(NORMAL);
      text("Use arrowkeys to dodge other circles!",avatarX,avatarY+150);
    }


  if (gameStart){
    background(bG_R,bG_G,bG_B);

    // The dodge and game mode text
    fill("#ffcd59");
    textSize(16);
    textStyle(BOLD);
    textAlign(LEFT);
    text("DODGED: "+dodges,350,30);
    text(gameMode,25,30);

    // Default the avatar's velocity to 0 in case no key is pressed this frame
    avatarVX = 0;
    avatarVY = 0;

    // Check which keys are down and set the avatar's velocity based on its
    // speed appropriately

    // Left and right
    if (keyIsDown(LEFT_ARROW)) {
      avatarVX = -avatarSpeed;
    }
    else if (keyIsDown(RIGHT_ARROW)) {
      avatarVX = avatarSpeed;
    }

    // Up and down (separate if-statements so you can move vertically and
    // horizontally at the same time)
    if (keyIsDown(UP_ARROW)) {
      avatarVY = -avatarSpeed;
    }
    else if (keyIsDown(DOWN_ARROW)) {
      avatarVY = avatarSpeed;
    }

    // Move the avatar according to its calculated velocity
    avatarX = avatarX + avatarVX;
    avatarY = avatarY + avatarVY;

    // The enemy always moves at enemySpeed
    enemyVX = enemySpeed;
    // Update the enemy's position based on its velocity
    enemyX = enemyX + enemyVX;
    if (hardMode){
      enemyX2 = enemyX2 + enemyVX;
    }


    // Check if the enemy and avatar overlap - if they do the player loses
    // We do this by checking if the distance between the centre of the enemy
    // and the centre of the avatar is less that their combined radii
    if (dist(enemyX,enemyY,avatarX,avatarY) < enemySize/2 + avatarSize/2 ) {
      // Tell the player they lost
      console.log("YOU LOSE!");
      // Reset the enemy's position
      enemyX = 0;
      enemyY = random(0,height);
      if (hardMode){
        enemyX2 = 0
        enemyY2 = random(0,height);
      }
      // Reset the avatar's position
      avatarX = width/2;
      avatarY = height/2;
      // Reset the dodge counter
      dodges = 0;
      // reset enemy size and speed
      enemySpeed = DEFAULT_ENEMYSPEED;
      enemySize = DEFAULT_ENEMYSIZE;
      // reset background
      bG_R = 43;
      bG_G = 47;
    }
    // second enemy checking for hard mode
    if (hardMode){
      if (dist(enemyX,enemyY2,avatarX,avatarY) < enemySize/2 + avatarSize/2 ){
        console.log("YOU LOSE!");
        enemyX = 0;
        enemyY = random(0,height);
        enemyX2 = 0
        enemyY2 = random(0,height);

        avatarX = width/2;
        avatarY = height/2;

        dodges = 0;
        enemySpeed = DEFAULT_ENEMYSPEED;
        enemySize = DEFAULT_ENEMYSIZE;

        bG_R = 43;
        bG_G = 47;
      }
    }

    // Check if the avatar has gone off the screen (cheating!)
    if (avatarX < 0 || avatarX > width || avatarY < 0 || avatarY > height) {
      // If they went off the screen they lose in the same way as above.
      console.log("YOU LOSE!");

      enemyX = 0;
      enemyY = random(0,height);
      if (hardMode){
        enemyY2 = random(0,height);
        enemyX2 = 0;
      }

      avatarX = width/2;
      avatarY = height/2;

      dodges = 0;
      enemySpeed = DEFAULT_ENEMYSPEED;
      enemySize = DEFAULT_ENEMYSIZE;

      bG_R = 43;
      bG_G = 47;
    }

    // Check if the enemy has moved all the way across the screen
    if (enemyX > width) {
      // This means the player dodged so update its dodge statistic
      dodges = dodges + 1;
      // the background will change color after each 10 points
      if (dodges%10==0 && dodges!=0){
        // 43-80 range will keep it dark
        bG_R = random(43,80);
        bG_G = random(43,80);
      }
      // enemy speed and size will increase after each successful dodge
      enemySpeed += 0.05;
      enemySize += 5;
      // different color for the enemy
      randomGreen = random(0,255);
      randomBlue = random(0,255);
      // Tell them how many dodges they have made
      console.log(dodges + " DODGES!");
      // Reset the enemy's position to the left at a random height
      enemyX = 0;
      enemyY = random(0,height);
      if (hardMode){
        enemyX2 = 0;
        enemyY2 = random(0,height);
      }
    }

    // Display the number of successful dodges in the console
    console.log(dodges);

    // The player is white
    fill(255);
    // Draw the player as a circle
    ellipse(avatarX,avatarY,avatarSize,avatarSize);

    // The enemy is random colored
    fill(255,randomGreen,randomBlue);
    // Draw the enemy as a circle
    if (hardMode){
      ellipse(enemyX,enemyY,enemySize);
      ellipse(enemyX2,enemyY2,enemySize);
    }else{
      ellipse(enemyX,enemyY,enemySize);
    }
  }
}
