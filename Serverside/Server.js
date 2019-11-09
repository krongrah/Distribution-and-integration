const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 80;

//calls function when a new connection is established
app.get('/', function(req, res){
  //sends the index.html file to the client
  res.sendFile(__dirname + '/index.html');
});

// Total hack. Can't call the file without exposing it.
app.get('/draw.js', function(req, res){
  res.sendFile(__dirname + '/draw.js');
});

app.get('/style.css', function(req, res){
  res.sendFile(__dirname + '/style.css');
});

function onConnection(socket){
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
  socket.on('clear', () => socket.broadcast.emit('clear'));
}




io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));




