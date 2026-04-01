function drawSlots(){

  // Only adjust when on END screen
  if(gameState === "end"){

    let pouchY = height * 0.42;
    let spacing = 110;
    let startX = width/2 - spacing;

    for(let i=0;i<3;i++){
      let x = startX + i*spacing;
      let y = pouchY;

      if(slots[i]){
        image(productImgs[slots[i]], x, y, 80, 80);
      }
    }

  } else {

    // ORIGINAL POSITION (unchanged for gameplay)
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
}
