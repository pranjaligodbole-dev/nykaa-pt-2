let player;
let gravity = 0.6;
let jumpForce = -12;

let platforms = [];
let products = [];
let slots = [null, null, null];

let gameState = "start";

let camY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initGame();
}

function initGame(){

  player = {
    x: width/2,
    y: height - 120,
    w: 30,
    h: 40,
    velY: 0
  };

  platforms = [];
  products = [];

  // ✅ START PLATFORM (fixes falling bug)
  platforms.push({
    x: width/2 - 50,
    y: height - 60,
    w: 100,
    h: 20
  });

  // generate platforms above
  for(let i=1;i<10;i++){
    let y = height - i * 120;

    let p = {
      x: random(50, width-100),
      y: y,
      w: 110,
      h: 20
    };

    platforms.push(p);

    if(i % 2 === 0){
      products.push({
        x: p.x + 40,
        y: y - 30,
        label: randomProduct()
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

  if(gameState === "end"){
    drawEnd();
    return;
  }

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

  if(!slots.includes(null)){
    gameState = "end";
  }
}

// 🎬 START
function drawStart(){
  textAlign(CENTER,CENTER);
  fill(0);
  textSize(28);
  text("Tap to Start", width/2, height/2);
}

// 🎁 END
function drawEnd(){
  background(255,240,245);

  textAlign(CENTER);
  fill(0);
  textSize(28);
  text("Your Picks ✨", width/2, 120);

  for(let i=0;i<slots.length;i++){
    let x = width/2 - 110 + i*110;

    fill(255);
    rect(x,200,90,90,15);

    if(slots[i]){
      fill(0);
      text(slots[i], x+45, 250);
    }
  }

  textSize(20);
  text("You’ve unlocked 20% OFF 💖", width/2, 350);
}

// 🧍 PLAYER
function updatePlayer(){

  // tilt movement
  let tilt = rotationY || 0;
  player.x += tilt * 0.5;

  player.x = constrain(player.x, 0, width);

  // gravity
  player.velY += gravity;
  player.y += player.velY;

  // collision (fixed)
  for(let p of platforms){
    if(player.x > p.x &&
       player.x < p.x + p.w &&
       player.y + player.h > p.y &&
       player.y + player.h < p.y + 15 &&
       player.velY > 0){

        player.velY = jumpForce;
    }
  }

  // safety reset (optional)
  if(player.y > camY + height + 200){
    player.y = height - 120;
    player.velY = 0;
  }
}

// 📷 CAMERA
function updateCamera(){
  camY = player.y - height/2;
  if(camY < 0) camY = 0;
}

// 🧱 PLATFORM GENERATION
function generatePlatforms(){

  if(platforms.length < 15){

    let lastY = platforms[platforms.length-1].y;
    let newY = lastY - 120;

    let newPlatform = {
      x: random(50, width-100),
      y: newY,
      w: 110,
      h: 20
    };

    platforms.push(newPlatform);

    if(random() < 0.5){
      products.push({
        x: newPlatform.x + 40,
        y: newY - 30,
        label: randomProduct()
      });
    }
  }

  // cleanup
  platforms = platforms.filter(p => p.y < camY + height + 100);
  products = products.filter(p => p.y < camY + height + 100);
}

// 🧴 PRODUCTS
function drawProducts(){

  for(let i=products.length-1;i>=0;i--){
    let p = products[i];

    fill(255,200,220);
    ellipse(p.x, p.y, 40);

    fill(0);
    textSize(10);
    textAlign(CENTER);
    text(p.label, p.x, p.y);

    let d = dist(player.x, player.y, p.x, p.y);

    if(d < 30){
      collect(p.label);
      products.splice(i,1);
    }
  }
}

function collect(label){
  let index = slots.indexOf(null);
  if(index !== -1){
    slots[index] = label;
  }
}

// 🎯 SLOTS
function drawSlots(){

  for(let i=0;i<3;i++){
    let x = width/2 - 90 + i*90;

    fill(255);
    rect(x, height-100, 70, 70, 12);

    if(slots[i]){
      fill(0);
      textSize(10);
      textAlign(CENTER,CENTER);
      text(slots[i], x+35, height-65);
    }
  }
}

// 🎨 DRAW
function drawPlatforms(){
  fill(200);
  for(let p of platforms){
    rect(p.x,p.y,p.w,p.h,10);
  }
}

function drawPlayer(){
  fill(0,200,255);
  rect(player.x, player.y, player.w, player.h,10);
}

// 📱 INPUT
function touchStarted(){
  if(gameState === "start"){
    gameState = "play";
    return false;
  }

  if(gameState === "end"){
    location.reload();
    return false;
  }

  player.velY = jumpForce;
  return false;
}

// 🧴 PRODUCTS LIST
function randomProduct(){
  let items = ["Kajal","Blush","Lip Tint","Sunscreen","Mascara","Compact"];
  return random(items);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
