function make2dArr(cols, rows) {
  var arr=new Array(cols);
  for (var i=0; i<cols; i++) {  
    arr[i]=new Array(rows);
  }
  return arr;
}


var grid;
var w=20;
var o=20;
var cols;
var rows;
var totalBee=100;
let slider;
var start= false;
var startgame=false;

function setup() {
  createCanvas(400, 400);

  slider = createSlider(0, 30, 20);
  slider.position(10, 410);
  slider.style('width', '80px');

  
}


function initing(){

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
  background(color(200,255,200));
  
  if(startgame==true){
  
   for (var i=0; i<cols; i++) {  
     for (var j=0; j<rows; j++) {  
       grid[i][j].show();
     }
   }
 }
 else{
  rect(width/2-50,height/2-25,100,50,20, 15, 10, 5);
  textAlign(CENTER);
  text('START',width/2,height/2);
  o =  slider.value();
  w = width/o;
  text('No of columns & rows: '+ o +'  move slider to change' ,width/2,height - 25);
  text('Refresh the page to start again' ,width/2,height - 10);
  text('vkm',width-20,height-10)
 }
}

function gameOver() {
  for (var i=0; i<cols; i++) {  
    for (var j=0; j<rows; j++) {  
      grid[i][j].revealed=true;
    }
  }
  text('YOU LOST',width/2,height/2);
}

function mousePressed() {
  background(255);
  if(startgame==true)
  {
  for (var i=0; i<cols; i++) {  
    for (var j=0; j<rows; j++) {  
      if ( grid[i][j].contains(mouseX, mouseY)) { 
        if(mouseButton === RIGHT ||mouseButton ===CENTER ){
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
else{
  if(width/2-50<mouseX && mouseX<width/2+50 && height/2-25<mouseY && mouseY<height/2+25){
   startgame=true;
   removeElements(); 
   initing();
  }
}
}
