
var express = require('express')
var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server)

//监听3000端口
server.listen(3000,'192.168.1.107')
console.log("Server listening at port 3000. ")

//设置静态文件默认路径
app.use(express.static(__dirname + '/public'));

//渲染静态文件
app.get('/', function(req, res) {
   res.sendFile(__dirname + '/views/index.html')
})

//设置初始昵称和颜色数组
var nicknamesList = [
  'Jack','Jason','Lisa','Alice','Sherly',
  'Winnie','Poker','Mike','Jay','Lucy','Kate'
]
var colorsList = [
  '#ff5444', '#ffac42', '#70dd5e', '#f78b00', '#79e632',
  '#3a84e7', '#9d43db', '#50eeca', '#4c8de2', '#d44141'
]

var usersOnline = new Array
leaveUsersOnline = function(username,nameColor){
  //回收昵称
  nicknamesList.push(username)
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
  //如果超过十条则删除第二个元素
  if (lastMessages.length>11){
    lastMessages.splice(1,1)
  }
}
//增加一个初始信息，懒得改addMessage的逻辑了
addToLastMessages('System','Welcome to here.')

//选择名称
selectName = function(){
  if(nicknamesList.length == 1){
    //舍弃一个名字吧，省的下面各种判定了
    return null
  }
  color = colorsList[Math.floor(Math.random()*10)]
  randomIndex = Math.floor(Math.random()*(nicknamesList.length-1))
  name = nicknamesList[randomIndex]
  nicknamesList[randomIndex] = nicknamesList.pop()
  data={name: name,color:color}
  return data
}

//监听socket 建立新连接时
io.on('connection', function (socket) {
  var addedUser = false

  //当有新的用户访问网站
  socket.on('add user',function(){
    if(addedUser) return
    //选择名称，保存起来
    newUser = selectName()
    // 如果选择名字得到的是null 则连接数达到上限 disconnect之
    if(newUser==null){
      socket.emit('disconnect')
      socket.disconnect()
      return
    }
    socket.username = newUser.name
    socket.nameColor = newUser.color
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
    console.log(socket.username+" 发消息啦")
    socket.broadcast.emit('new message',{
        username: socket.username,
        nameColor: socket.nameColor,
        message: data
    })
    addToLastMessages(socket.username,data)
  })

  socket.on('disconnect',function(data){
    if(addedUser){
      console.log(socket.username+' 断开连接啦')
      leaveUsersOnline(socket.username,socket.nameColor)
      socket.broadcast.emit('user left',{
        clientName: socket.username,
        nameColor: socket.nameColor,
        users: usersOnline
      })
    }
  })

});
