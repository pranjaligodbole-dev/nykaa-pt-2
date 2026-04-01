let player;
let gravity = 0.5;
let jumpForce = -13;

let platforms = [];
let products = [];
let slots = [null, null, null];

let productList = ["Kajal","Blush","Lip Tint","Mascara","Lip Liner"];

let gameState = "start";

let startTime;
let timer = 0;

// IMAGES
let startImg, howToImg, endImg, restartImg, bgImg;
let characterImg, platformImg, timerImg;
let productImgs = {};

function preload(){

  startImg = loadImage("assets/start.png");
  howToImg = loadImage("assets/howto.png");
  endImg = loadImage("assets/end.png");
  restartImg = loadImage("assets/restart.png");
  bgImg = loadImage("assets/bg.png");

  characterImg = loadImage("assets/character.png");
  platformImg = loadImage("assets/platform.png");
  timerImg = loadImage("assets/timer.png");

  productImgs["Kajal"] = loadImage("assets/kajal.png");
  productImgs["Blush"] = loadImage("assets/blush.png");
  productImgs["Lip Tint"] = loadImage("assets/liptint.png");
  productImgs["Mascara"] = loadImage("assets/mascara.png");
  productImgs["Lip Liner"] = loadImage("assets/lipliner.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initGame();
}

function initGame(){

  player = {
    x: width/2,
    y: height - 150,
    w: 60,
    h: 80,
    velY: 0
  };

  platforms = [];
  products = [];
  slots = [null, null, null];

  platforms.push({
    x: width/2 - 60,
    y: height - 80,
    w: 120,
    h: 20
  });

  let gap = 120;

  for(let i=1;i<20;i++){

    let y = height - 80 - i * gap;

    let p = {
      x: random(40, width-140),
      y: y,
      w: 120,
      h: 20
    };

    platforms.push(p);

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

  // START
  if(gameState === "start"){
    image(startImg, 0, 0, width, height);
    return;
  }

  // HOW
  if(gameState === "how"){
    image(howToImg, 0, 0, width, height);
    return;
  }

  // WIN
  if(gameState === "end"){
    image(endImg, 0, 0, width, height);
    return;
  }

  // LOSE
  if(gameState === "lose"){
    image(restartImg, 0, 0, width, height);
    return;
  }

  // GAMEPLAY BG
  image(bgImg, 0, 0, width, height);

  timer = floor((millis() - startTime)/1000);

  updatePlayer();
  moveWorld();

  drawPlatforms();
  drawProducts();
  drawPlayer();
  drawSlots();
  drawTimer();

  // FALL → LOSE
  if(player.y > height){
    gameState = "lose";
  }

  // WIN
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

        player.velY = jumpForce;
    }
  }
}

// WORLD
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

    image(productImgs[p.label], p.x-25, p.y-25, 50, 50);

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

// PLATFORMS
function drawPlatforms(){
  for(let p of platforms){
    image(platformImg, p.x, p.y, p.w, p.h);
  }
}

// PLAYER IMAGE
function drawPlayer(){
  image(characterImg, player.x, player.y, player.w, player.h);
}

// SLOTS
function drawSlots(){

  let spacing = 90;
  let startX = width/2 - spacing;

  for(let i=0;i<3;i++){
    let x = startX + i*spacing;
    let y = height - 90;

    if(slots[i]){
      image(productImgs[slots[i]], x, y, 70, 70);
    }
  }
}

// TIMER (TEXT INSIDE IMAGE)
function drawTimer(){

  let x = 20;
  let y = 15;

  image(timerImg, x, y, 120, 50);

  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(timer + "s", x + 60, y + 25);
}

// INPUT
function touchStarted(){

  if(gameState === "start"){
    gameState = "how";
    return false;
  }

  if(gameState === "how"){
    gameState = "play";
    startTime = millis();
    return false;
  }

  if(gameState === "end" || gameState === "lose"){
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
