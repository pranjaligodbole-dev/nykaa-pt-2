let player;
let gravity = 0.5;
let jumpForce = -13;

let platforms = [];
let products = [];
let slots = [null, null, null];

let gameState = "start";

let camY = 0;
let timer = 0;
let startTime;

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
    h: 20
  });

  // generate platforms + MORE PRODUCTS
  for(let i=1;i<12;i++){
    let y = height - 80 - i * 110;

    let p = {
      x: random(40, width-140),
      y: y,
      w: 120,
      h: 20
    };

    platforms.push(p);

    // 🔥 more products (almost every platform)
    if(random() < 0.8){
      products.push({
        x: p.x + random(20,80),
        y: y - 35,
        label: randomProduct()
      });
    }
  }
}

function draw(translate(0, -camY);){

  background(255,240,245);

  if(gameState === "start"){
    drawStart();
    return;
  }

  if(gameState === "end"){
    drawEnd();
    return;
  }

  // ⏱ TIMER
  timer = floor((millis() - startTime)/1000);

  updatePlayer();
  updateCamera();
  generatePlatforms();

  push();
  translate(0, -camY);

  drawPlatforms();
  drawProducts();
  drawPlayer();

  pop();

  drawSlots();
  drawTimer();

  if(!slots.includes(null)){
    gameState = "end";
  }
}

// START
function drawStart(){
  textAlign(CENTER,CENTER);
  textSize(26);
  fill(0);
  text("Tap to Start", width/2, height/2);
}

// END
function drawEnd(){
  background(255,240,245);

  textAlign(CENTER);
  textSize(28);
  fill(0);
  text("Your Picks ✨", width/2, 120);

  for(let i=0;i<3;i++){
    let x = width/2 - 120 + i*120;

    fill(255);
    rect(x,200,90,90,15);

    if(slots[i]){
      fill(0);
      textSize(12);
      text(slots[i], x+45, 250);
    }
  }

  textSize(20);
  text("Time: " + timer + "s", width/2, 320);
  text("20% OFF 💖", width/2, 360);
}

// PLAYER
function updatePlayer(){

  let tilt = rotationY || 0;
  player.x += tilt * 0.6;
  player.x = constrain(player.x, 0, width);

  player.velY += gravity;
  player.y += player.velY;

  for(let p of platforms){
    if(player.x > p.x - 10 &&
       player.x < p.x + p.w + 10 &&
       player.y + player.h > p.y &&
       player.y + player.h < p.y + 25 &&
       player.velY > 0){

        player.velY = jumpForce;
    }
  }

  // reset safety
  if(player.y > camY + height + 100){
    player.y = height - 150;
    player.velY = 0;
  }
}

// 🔥 FIXED CAMERA
function updateCamera(){

  let targetY = player.y - height * 0.4;

  if(targetY < camY){
    camY = lerp(camY, targetY, 0.15);
  }

  camY = max(camY, 0);
}


// GENERATE
function generatePlatforms(){

  let highestY = platforms[platforms.length-1].y;

  while(highestY > camY - height){

    highestY -= 110;

    let p = {
      x: random(40, width-140),
      y: highestY,
      w: 120,
      h: 20
    };

    platforms.push(p);

    if(random() < 0.8){
      products.push({
        x: p.x + random(20,80),
        y: highestY - 35,
        label: randomProduct()
      });
    }
  }

  platforms = platforms.filter(p => p.y < camY + height + 100);
  products = products.filter(p => p.y < camY + height + 100);
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

    if(dist(player.x, player.y, p.x, p.y) < 30){
      collect(p.label);
      products.splice(i,1);
    }
  }
}

function collect(label){
  let i = slots.indexOf(null);
  if(i !== -1) slots[i] = label;
}

// 🎯 BUNDLE SLOTS (CENTER BOTTOM)
function drawSlots(){

  let spacing = 90;
  let startX = width/2 - spacing;

  for(let i=0;i<3;i++){
    let x = startX + i*spacing;

    fill(255);
    rect(x, height-90, 70, 70, 12);

    if(slots[i]){
      fill(0);
      textSize(10);
      textAlign(CENTER,CENTER);
      text(slots[i], x+35, height-55);
    }
  }
}

// ⏱ TIMER UI
function drawTimer(){
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text("Time: " + timer + "s", 20, 30);
}

// DRAW
function drawPlatforms(){
  fill(180);
  for(let p of platforms){
    rect(p.x,p.y,p.w,p.h,10);
  }
}

function drawPlayer(){
  fill(0,200,255);
  rect(player.x, player.y, player.w, player.h,10);
}

// INPUT
function touchStarted(){

  if(gameState === "start"){
    gameState = "play";
    startTime = millis();
    return false;
  }

  if(gameState === "end"){
    location.reload();
    return false;
  }

  player.velY = jumpForce;
  return false;
}

// PRODUCTS
function randomProduct(){
  return random(["Kajal","Blush","Lip Tint","Sunscreen","Mascara","Compact"]);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
