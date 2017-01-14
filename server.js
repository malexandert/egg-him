
var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000, listen);

app.use(express.static('public'));


console.log("socket server running");


var socket = require('socket.io');

//keeping track of total eggs
//var total_eggs = 11542;

//database to keep track of totoal eggs
var total_eggs = 14069;

/*ter

var mongoose = require('mongoose');
mongoose.connect('mongodb:////');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

Eggs.find(function (err, eggs){
  if (err) {

              var total_eggs_model = mongoose.Schema({
                  count: Number
              });

              var Eggs = mongoose.model('Eggs', total_eggs);

              var total_count = new Eggs({ count: 0 });

            }
  total_eggs = eggs[0].count;
  console.log(eggs);
})

*/


// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));




// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {  

    console.log("We have a new client: " + socket.id);

    socket.emit('total', total_eggs);

    socket.on('addcount', function(){
      total_eggs++;  

/*      Eggs.findById(count, function (err, doc) {
          if (err) ..
          doc.name = 'jason borne';
          doc.save(callback);
        });*/


      socket.broadcast.emit('total', total_eggs);  
    });

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y);
        
        // Send it to all other clients
        socket.broadcast.emit('mouse', data);
        //total_eggs++;
        
        console.log("total: " + total_eggs);
       
        //socket.broadcast.emit('total', total_eggs);        
        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );



    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });



  }
);