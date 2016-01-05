
var express = require('express')
var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server)

server.listen(3000,"127.0.0.1")
console.log("Server listening at port 3000. ")

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/views/index.html')
})

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('new message',function(data){
    socket.broadcast.emit('new message',{
        username: 'testname',
        message: 'testmsg'
    })
  })
});
