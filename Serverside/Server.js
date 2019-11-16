const express = require('express');
const app = express();
const fs = require('fs');

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/ahmadhamid.dk/privkey.pem');
const certificate = fs.readFileSync('/etc/letsencrypt/live/ahmadhamid.dk/cert.pem');
const ca = fs.readFileSync('/etc/letsencrypt/live/ahmadhamid.dk/chain.pem');
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
}

// Webservers
const http = require('http').createServer(app);
const httpPort = 80;

const https = require('https').createServer(credentials, app);
const httpsPort = 443;

const io = require('socket.io').listen(http);

app.use(express.static(__dirname, { dotfiles: 'allow' } ));

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

// Start listening on port 80 and 443
http.listen(httpPort, () => {
  console.log('listening on port ' + httpPort);
});

https.listen(httpsPort, () => {
  console.log('listening on port ' + httpsPort);
});
