/*
$(document).ready(function(){
	$('img').css('cursor', 'url("lib/egg.png") 0 0, auto');
});
$(document).mousedown(function() {
    $('img').css('cursor', 'url("lib/egg1.png") 0 0, auto');
});
$(document).mouseup(function() {
    $('img').css('cursor', 'url("lib/egg.png") 0 0, auto');
});*/

var socket;



var xhead1 = window.innerWidth/3;
var xhead2 = window.innerWidth/3*2;
var yhead1 = window.innerWidth/10*6/11;
var yhead2 = window.innerWidth/10*6/11*9;

var bg;
var egg_count = 0;
//array of egg locations
var EggHist = [];
var other_EggHist = [];


function setup() {
  bg = loadImage("lib/bg.jpg");
  other_egg = loadImage("lib/egg2.png");
  egg = loadImage("lib/egg3.png");
  shell = loadImage("lib/egg.png");
  broken = loadImage("lib/egg1.png");
  image(bg, 0, 0, bg.width, bg.height);
  createCanvas(window.innerWidth, window.innerWidth/10*6);



  
  
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('https://egg-him.herokuapp.com/');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('total', function(total_eggs){
  egg_count = total_eggs;
  console.log("egg_count " + egg_count);
  });

  socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
      append(other_EggHist, [data.x-30, data.y-30]);
    
    }
  );
  


}

function draw() {
  //no content





  background(bg);
  textSize(16);
  textStyle(BOLD);
  text("total eggs thrown: " + egg_count, 50, 30);
  if (mouseX > xhead1 && mouseX < xhead2
    && mouseY > yhead1 && mouseY < yhead2) {
    if (mouseIsPressed) {cursor("lib/egg1.png");}
    else{cursor("lib/egg.png");}
  } else {
    cursor(ARROW);
  }

  for (var j = 0; j < other_EggHist.length; j++) {
    image(other_egg, other_EggHist[j][0], other_EggHist[j][1]);
  }

  for (var i = 0; i < EggHist.length; i++) {
    image(egg, EggHist[i][0], EggHist[i][1]);
  }


}


function mousePressed() {
/*  fill(255);
  noStroke();
  ellipse(mouseX,mouseY,20,20);*/


  if (mouseX > xhead1 && mouseX < xhead2
    && mouseY > yhead1 && mouseY < yhead2) {
  //image(egg, mouseX-30, mouseY-30);
  //cursor("lib/egg1.png");
  // Send the mouse coordinates
  sendmouse(mouseX,mouseY);
  append(EggHist, [mouseX-30, mouseY-30]);
  socket.emit('addcount');
  egg_count++;

  }
}

// Function for sending to the socket
function sendmouse(xpos, ypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);

  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos
  };

  // Send that object to the socket
  socket.emit('mouse',data);

}