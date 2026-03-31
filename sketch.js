let player;
let gravity = 0.5;
let jumpForce = -13;

let platforms = [];
let products = [];
let slots = [null, null, null];

let productList = ["Kajal","Blush","Lip Tint","Sunscreen","Mascara","Compact"];

let gameState = "start";

let startTime;
let timer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initGame();
}

function initGame(){

  player = {
    x: width/2,
    y: height - 150,
    w: 30,
    h: 40,
    velY: 0
  };

  platforms = [];
  products = [];
  slots = [null, null, null];

  // START PLATFORM
  platforms.push({
    x: width/2 - 60,
    y: height - 80,
    w: 120,
    h: 20,
    type: "normal"
  });

  let gap = 120;

  for(let i=1;i<20;i++){

    let y = height - 80 - i * gap;

    // ✅ REMOVED BOOST (all normal now)
    let type = "normal";

    let p = {
      x: random(40, width-140),
      y: y,
      w: 120,
      h: 20,
      type: type
    };

    platforms.push(p);

    // PRODUCTS (NO REPEAT + SPACING)
    if(i % 3 === 0 && products.length < productList.length){
      products.push({
        x: p.x + 50,
        y: y - 40,
        label: productList[products.length]
      });
    }
  }
}

function draw(){

  background(255,240,245);

  if(gameState === "start"){
    drawStart();
    return;
  }

  // ✅ NEW HOW SCREEN
  if(gameState === "how"){
    drawHowTo();
    return;
  }

  if(gameState === "end"){
    drawEnd();
    return;
  }

  timer = floor((millis() - startTime)/1000);

  updatePlayer();
  moveWorld();

  drawPlatforms();
  drawProducts();
  drawPlayer();
  drawSlots();
  drawTimer();

  // FALL CHECK
  if(player.y > height){
    gameState = "start";
    initGame();
  }

  // END CONDITION
  if(!slots.includes(null)){
    gameState = "end";
  }
}

// PLAYER
function updatePlayer(){

  let tilt = rotationY || 0;
  player.x += tilt * 0.6;
  player.x = constrain(player.x, 0, width);

  player.velY += gravity;
  player.y += player.velY;

  for(let p of platforms){

    if(player.x > p.x - 15 &&
       player.x < p.x + p.w + 15 &&
       player.y + player.h > p.y &&
       player.y + player.h < p.y + 25 &&
       player.velY > 0){

        // ✅ ONLY NORMAL JUMP NOW
        player.velY = jumpForce;
    }
  }
}

// WORLD MOVEMENT
function moveWorld(){

  if(player.y < height * 0.4){

    let diff = height * 0.4 - player.y;
    player.y = height * 0.4;

    for(let p of platforms){
      p.y += diff;
    }

    for(let pr of products){
      pr.y += diff;
    }
  }
}

// PRODUCTS
function drawProducts(){

  for(let i=products.length-1;i>=0;i--){

    let p = products[i];

    fill(255,180,200);
    ellipse(p.x, p.y, 40);

    fill(0);
    textSize(10);
    textAlign(CENTER);
    text(p.label, p.x, p.y);

    if(dist(player.x, player.y, p.x, p.y) < 45){
      collect(p.label);
      products.splice(i,1);
    }
  }
}

function collect(label){
  let i = slots.indexOf(null);
  if(i !== -1) slots[i] = label;
}

// DRAW
function drawPlatforms(){
  for(let p of platforms){
    fill(180);
    rect(p.x, p.y, p.w, p.h, 10);
  }
}

function drawPlayer(){
  fill(0,200,255);
  rect(player.x, player.y, player.w, player.h,10);
}

// UI
function drawSlots(){

  let spacing = 90;
  let startX = width/2 - spacing;

  for(let i=0;i<3;i++){
    let x = startX + i*spacing;
    let y = height - 90;

    fill(255);
    rect(x, y, 70, 70, 12);

    if(slots[i]){
      fill(0);
      textSize(10);
      textAlign(CENTER,CENTER);
      text(slots[i], x+35, y+35);
    }
  }
}

function drawTimer(){
  fill(0);
  textSize(16);
  text("Time: " + timer + "s", 20, 30);
}

// START
function drawStart(){
  textAlign(CENTER,CENTER);
  textSize(26);
  fill(0);
  text("Tap to Start", width/2, height/2);
}

// ✅ NEW HOW TO PLAY
function drawHowTo(){
  background(255,240,245);

  textAlign(CENTER, CENTER);
  fill(0);

  textSize(24);
  text("How to Play", width/2, height/2 - 80);

  textSize(16);
  text("Tilt / Arrow Keys to move", width/2, height/2 - 20);
  text("Tap to jump", width/2, height/2 + 10);
  text("Collect any 3 products", width/2, height/2 + 40);

  textSize(14);
  text("Tap to continue", width/2, height/2 + 100);
}

// END
function drawEnd(){

  background(255,240,245);

  textAlign(CENTER);
  fill(0);

  textSize(28);
  text("Your Picks ✨", width/2, 100);

  for(let i=0;i<3;i++){
    let x = width/2 - 120 + i*120;

    fill(255);
    rect(x,150,90,90,15);

    if(slots[i]){
      fill(0);
      textSize(12);
      text(slots[i], x+45, 200);
    }
  }

  textSize(20);
  text("Time: " + timer + "s", width/2, 300);

  textSize(18);
  text("Use Code: NYKAA20 💖", width/2, 340);

  textSize(14);
  text("Tap to restart", width/2, 380);
}

// INPUT
function touchStarted(){

  // ✅ UPDATED FLOW
  if(gameState === "start"){
    gameState = "how";
    return false;
  }

  if(gameState === "how"){
    gameState = "play";
    startTime = millis();
    return false;
  }

  if(gameState === "end"){
    initGame();
    gameState = "start";
    return false;
  }

  player.velY = jumpForce;
  return false;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
