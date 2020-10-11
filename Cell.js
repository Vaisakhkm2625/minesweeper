function cell(i, j, w) {
  this.i=i;
  this.j=j;
  this.x=i*w;
  this.y=j*w;
  this.w=w;
  this.bee =false;
  this.revealed =false;
  this.neighborCount =0;
  this.marker=false;
  
  
//  if (random(1)<0.25) {
//    this.bee=true;
//  }
}
cell.prototype.show = function() {
  noFill();
  rect(this.x, this.y, this.w, this.w);
  
  if(this.marker==true){
  fill(color(255,50,50));
  ellipse(this.x+this.w*0.5, this.y+this.w*0.5, this.w*0.5);
  }

  if (this.revealed == true) {
    if (this.bee == true)
    {
      ellipse(this.x+this.w*0.5, this.y+this.w*0.5, this.w*0.5);
    } else {
      fill(200);
        rect(this.x, this.y, this.w, this.w);
        if(this.neighborCount){
        textAlign(CENTER);
        fill(0);
        text(this.neighborCount,this.x+this.w*0.5,this.y+this.w*0.5)
        }
      }
  }
};


cell.prototype.contains = function(x, y) {
  return(x > this.x && x < this.x+this.w && y > this.y && y < this.y+this.w);
};

cell.prototype.reveal = function() {
  this.revealed =true;
  if(this.neighborCount == 0)
  {
    this.floodFill();
  }
};

cell.prototype.countBees = function() {
  if(this.bee){
  return -1;
  }
  var total = 0;
  for(var xoff=-1;xoff<=1;xoff++){
    for(var yoff=-1;yoff<=1;yoff++){
      var i=this.i+xoff;
      var j=this.j+yoff;
      if(i>-1 && i<cols && j>-1 && j<rows){
        var neighbor= grid[i][j];
        if(neighbor.bee){
          total++;
        }
      }
      
    }
  }
  this.neighborCount = total;
};

cell.prototype.floodFill = function() {
  for(var xoff=-1;xoff<=1;xoff++){
    for(var yoff=-1;yoff<=1;yoff++){
      var i=this.i+xoff;
      var j=this.j+yoff;
      if(i>-1 && i<cols && j>-1 && j<rows){
        var neighbor= grid[i][j];
        if(!neighbor.bee && !neighbor.revealed){
          neighbor.reveal();
        }
      }
    }
  }
};
