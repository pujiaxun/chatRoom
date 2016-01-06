
var express = require('express')
var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server)

//监听3000端口
server.listen(3000,'192.168.1.108')
console.log("Server listening at port 3000. ")

//设置静态文件默认路径
app.use(express.static(__dirname + '/public'));

//渲染静态文件
app.get('/', function(req, res) {
   res.sendFile(__dirname + '/views/index.html')
})

//设置昵称数组
var nicknamesList = [
  'Jack','Jason','Jim','Alice','Sherly',
  'Ben','James','Mike','Jay','Lucy','Kate'
]
var colorsList = [
  '#ff5444', '#ffac42', '#70dd5e', '#f78b00', '#79e632',
  '#3a84e7', '#9d43db', '#50eeca', '#4c8de2', '#d44141'
]

var usersOnline = new Array
leaveUsersOnline = function(username,nameColor){
  for(var n in usersOnline){
    t = usersOnline[n]
    if((t.username == username)&&(t.nameColor == nameColor)){
      usersOnline.splice(n,1)
    }
  }
}
//新建数组储存近十条消息
var lastMessages = new Array
addToLastMessages = function(username,message){
  lastMessages.push({
    username: username,
    message: message,
    nameColor: 'gray'
  })
  //如果超过十条则删除第一个元素(队列)
  if (lastMessages.length>11){
    lastMessages.splice(1,1)
  }
}
//增加一个初始信息，懒得改addMessage的逻辑了
addToLastMessages('System','Welcome to here.')
//选择名称
selectName = function(){
  //还需要一些逻辑 来避免重名
  name = nicknamesList[Math.floor(Math.random()*10)]
  color = colorsList[Math.floor(Math.random()*10)]
  data={name: name,color:color}
  return data
}

//监听socket 建立新连接时
io.on('connection', function (socket) {
  var addedUser = false

  //当有新的用户访问网站
  socket.on('add user',function(){
    console.log("有人加入聊天啦")
    if(addedUser) return
    //选择名称 ，保存起来
    newUser = selectName()
    socket.username = newUser.name
    socket.nameColor = newUser.color
    // usersOnline++
    //新用户加入到在线用户数组
    usersOnline.push({username: socket.username,nameColor: socket.nameColor})
    socket.emit('welcome',{
        lastInfo: lastMessages,
        clientName: socket.username,
        nameColor: socket.nameColor,
        users: usersOnline
    })
    socket.broadcast.emit('user join',{
      clientName: socket.username,
      nameColor: socket.nameColor,
      users: usersOnline
    })
    addedUser = true
  })

  socket.on('new message',function(data){
    console.log("有人发消息啦")
    socket.broadcast.emit('new message',{
        username: socket.username,
        nameColor: socket.nameColor,
        message: data
    })
    addToLastMessages(socket.username,data)
  })

  socket.on('disconnect',function(data){
    if(addedUser){
      console.log('有人断开连接啦')
      leaveUsersOnline(socket.username,socket.nameColor)
      console.log('还有'+usersOnline.length+'个人')
      socket.broadcast.emit('user left',{
        clientName: socket.username,
        nameColor: socket.nameColor,
        users: usersOnline
      })
    }
  })

});
