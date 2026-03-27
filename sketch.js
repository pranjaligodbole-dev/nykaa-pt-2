let player;
let gravity = 0.5;
let jumpForce = -13;

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
    y: height - 150,
    w: 30,
    h: 40,
    velY: 0
  };

  platforms = [];
  products = [];

  // ✅ STRONG START PLATFORM
  platforms.push({
    x: width/2 - 60,
    y: height - 80,
    w: 120,
    h: 20
  });

  // generate above
  for(let i=1;i<12;i++){
    let y = height - 80 - i * 110;

    let p = {
      x: random(40, width-140),
      y: y,
      w: 120,
      h: 20
    };

    platforms.push(p);

    if(i % 2 === 0){
      products.push({
        x: p.x + 50,
        y: y - 35,
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
  text("20% OFF 💖", width/2, 350);
}

// PLAYER
function updatePlayer(){

  let tilt = rotationY || 0;
  player.x += tilt * 0.6;
  player.x = constrain(player.x, 0, width);

  player.velY += gravity;
  player.y += player.velY;

  for(let p of platforms){

    // MUCH MORE FORGIVING COLLISION
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

// CAMERA
function updateCamera(){
  camY = player.y - height/2;
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

    if(random() < 0.5){
      products.push({
        x: p.x + 50,
        y: highestY - 35,
        label: randomProduct()
      });
    }
  }

  // cleanup
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

// UI
function drawSlots(){

  for(let i=0;i<3;i++){
    let x = width/2 - 90 + i*90;

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
