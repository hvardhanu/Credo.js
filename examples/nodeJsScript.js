//simple signalling script to work on socket.io for example that goes with credo.js
var io = require('socket.io').listen(80);


io.sockets.on('connection', function (socket) {
  
  socket.on('sdp', function (data) {
    console.log(data);
    socket.broadcast.emit('sdp',data);
  });
socket.on('ice', function (data) {
    console.log(data);
    socket.broadcast.emit('ice',data);
  });

});
