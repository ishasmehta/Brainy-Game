const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Events = Matter.Events;

let engine, world;
let boxes = [];
let holes = [];
let row = 6;
let col = 6;
let gridWidth = 100;
let gridHeight = 100;
let totalTurns = 0;
const shiftArray = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
let score = { white: 0, black: 0 };
let gameState = "intro";

function setup() {
  createCanvas(col * gridWidth, row * gridHeight);
  engine = Engine.create({ enableSleeping: true });

  world = engine.world;

  ground = Bodies.rectangle(width / 2, height + 10, width, 20, {
    isStatic: true,
  });
  World.add(world, ground);
  

  // creating spots
  for (let i = 0; i < col; i++) {
    holes[i] = [];
    for (let j = 0; j < row; j++) {
      holes[i][j] = new Hole(gridWidth, gridHeight);
      holes[i][j].x = i * gridWidth + gridWidth / 2;
      holes[i][j].y = j * gridHeight + gridHeight / 2;
    }
  }
}

function draw() {
  background(128);
  Engine.update(engine);
  //display spots
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      holes[i][j].display();
    }
  }
  //display all boxes
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].display();
  }
  textSize(14);
  strokeWeight(0);
  fill("green");
  text("White: " + score.white, 10, 40);
  text("Black: " + score.black, 10, 60);

  if(gameState === "intro"){
    text("This is a two player game between the White and the Black! \n"+
    "The player with maximum balls at the end wins the game. \n \n"+
    "Rules: \n"+
    "The balls that are between the current ball and \n the first ball of same color in any direction will convert to your color.\n"+
    "Press 1,2,3,4,5 to drop a ball in the column of your choice.\n"+
    "Game ends when all the positions are filled with balls.\n\n"+
    "Press SPACE to start the game.", 20, 100);
  }

  if(totalTurns % 2 === 0 && gameState === "drop"){
    text("<- Current Player", 70, 40);
  }
  else if(totalTurns % 2 === 1 && gameState === "drop"){
    text("<- Current Player", 70, 60);
  }

  if (gameState === "drop") {
    text("Ready to drop! Press 1,2,3,4,5 to drop a ball in that column.", 10, 20);
  }
  if (gameState === "end" && ground.position.x > (-width/2)) {
    textSize(30);
    text("Game Over", width / 2 - 100, height / 2);
    Matter.Body.translate(ground,{x:-10,y:0});    
  }
  
}

function keyPressed() {
  if(keyCode === 32 && gameState === "intro"){
    gameState = "drop";
  }
  if (gameState === "drop" && keyCode >= 49 && keyCode <= 48 + col) {
    if(isColFull(keyCode-49)){
      console.log("col full");
      return;

    }

    //prevent next player turn
    gameState = "fall";
    totalTurns++;

    //choose color for box
    let color = "white";
    if (totalTurns % 2 === 0) color = "black";
    score[color]++;

    let obj;
    let multiplyingFactor = 0.5;
    multiplyingFactor += keyCode - 49;
    obj = new Box(
      gridWidth * multiplyingFactor,
      -gridHeight / 2,
      gridWidth,
      gridHeight,
      color
    );

    boxes.push(obj);
    Events.on(boxes[totalTurns - 1].body, "sleepStart", setIndex);
  }
}

function parseHoles(lastX, lastY, shiftX, shiftY) {
  let currentColor = holes[lastX][lastY].box.color;
  let changeColorArray = [];

  let x = lastX + shiftX;
  let y = lastY + shiftY;
  let iterationCount = 0;

  while (x >= 0 && x < col && y >= 0 && y < row) {
    if (holes[x][y].box === null) {
      break;
    } else if (holes[x][y].box.color === currentColor && iterationCount === 0) {
      break;
    } else if (holes[x][y].box.color === currentColor && iterationCount !== 0) {
      changeColor(changeColorArray, currentColor);
      break;
    } else {
      changeColorArray.push(holes[x][y].box);
    }
    x += shiftX;
    y += shiftY;
    iterationCount += 1;
  }
}
function changeColor(arr, color) {
  arr.map((box) => {
    box.color = color;
    for (let sc in score) {
      if (sc === color) {
        score[sc]++;
      } else {
        score[sc]--;
      }
    }
  });
}
function setIndex(obj) {
  if (boxes[boxes.length - 1].body.id === obj.source.id) {
    let lastBox = boxes[boxes.length - 1];
    let x = Math.floor(lastBox.body.position.x / gridWidth);
    let y = Math.floor(lastBox.body.position.y / gridHeight);
    lastBox.xIndex = x;
    lastBox.yIndex = y;

    holes[x][y].box = lastBox;

    for (let i = 0; i < shiftArray.length; i++) {
      parseHoles(x, y, shiftArray[i][0], shiftArray[i][1]);
    }
    if (totalTurns === col * row) {
      gameState = "end";
      //Matter.Body.rotate(ground,PI/10,{x:0,y:height});
      awakeBoxes(boxes);
    } else {
      gameState = "drop";
    }
  }
}
function isColFull(col){
  return holes[col][0].box !== null;
}
function awakeBoxes(boxesArr){
  boxesArr.map((box)=>{
    Matter.Body.set(box.body,"isSleeping",false);
  });
}