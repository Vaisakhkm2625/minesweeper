function make2dArr(cols, rows) {
  var arr=new Array(cols);
  for (var i=0; i<cols; i++) {  
    arr[i]=new Array(rows);
  }
  return arr;
}


var grid;
var w=20;
var cols;
var rows;
var totalBee=100;
var start= false;
function setup() {
  createCanvas(400, 400);
  cols=floor(width/w);
  rows=floor(height/w);
  totalBee=floor(cols*rows/7);
//  while(!start){
//  textAlign(CENTER);
//  fill(0);
//  text("press any key to start");
//  if (mouseIsPressed) {
//   start=true;
// }
//}
  
  
  
  
  grid=make2dArr(cols, rows);
  for (var i=0; i<cols; i++) {  
    for (var j=0; j<rows; j++) {  
      grid[i][j]=new cell(i, j, w);
    }
  }
  for (var n=0; n<totalBee; n++)
  {
    i=floor(random(cols));
    var c=floor(random(rows));
    if (grid[i][c].bee)
    {
      n--;
    }
    grid[i][c].bee=true;
  }

  for (var t=0; t<cols; t++) {  
    for (var l=0; l<rows; l++) {  
      grid[t][l].countBees();
    }
  }
}


function draw() {
  background(255);
  
  
  for (var i=0; i<cols; i++) {  
    for (var j=0; j<rows; j++) {  
      grid[i][j].show();
    }
  }
}

function gameOver() {
  for (var i=0; i<cols; i++) {  
    for (var j=0; j<rows; j++) {  
      grid[i][j].revealed=true;
    }
  }
}

function mousePressed() {
  background(255);
  for (var i=0; i<cols; i++) {  
    for (var j=0; j<rows; j++) {  
      if ( grid[i][j].contains(mouseX, mouseY)) { 
        if(mouseButton === RIGHT ||mouseButton ===CENTER){
          if(grid[i][j].marker==false){
          grid[i][j].marker=true;}
          else{
          grid[i][j].marker=false;
          }
        }else{
      
        grid[i][j].reveal();
        if (grid[i][j].bee) {
          gameOver();
        }
        }      
      }
    }
  }
}
