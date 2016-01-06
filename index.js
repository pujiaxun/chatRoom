
var express = require('express')
var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server)

//监听3000端口
server.listen(3000,'127.0.0.1')
console.log("Server listening at port 3000. ")

//设置静态文件默认路径
app.use(express.static(__dirname + '/public'));

//渲染静态文件
app.get('/', function(req, res) {
   res.sendFile(__dirname + '/views/index.html')
})

//设置初始在线人数
var usersOnline = 0
//新建数组储存近十条消息
var lastMessages = new Array
addToLastMessages = function(username,message){
  lastMessages.push({
    username: username,
    message: message
  })
  //如果超过十条则删除第一个元素(队列)
  if (lastMessages.length>10){
    lastMessages.shift()
  }
}
//监听socket
io.on('connection', function (socket) {
  var addedUser = false

  socket.on('add user',function(username){
    if(addedUser) return
    //取得名称 ，保存起来
    socket.username = username
    usersOnline++
    socket.emit('last message',{
        lastInfo: lastMessages
    })
  })

  socket.on('new message',function(data){
    console.log("服务器监听到了new message")
    socket.broadcast.emit('new message',{
        username: socket.username,
        message: data
    })
    addToLastMessages(socket.username,data)
  })


});
