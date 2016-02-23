
var express = require('express')
var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server)

//监听3000端口
server.listen(3000,'127.0.0.1')
console.log("Server starts. ")

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
  '#3a84e7', '#9d43db', '#50eeca', '#4c8de2', '#e6d32e','#e7206d'
]

var userList = new Array
userLeave = function(userName,userColor){
  //回收昵称
  nicknamesList.push(userName)
  for(var n in userList){
    t = userList[n]
    if((t.userName == userName)&&(t.userColor == userColor)){
      userList.splice(n,1)
    }
  }
}
//新建数组储存近十条消息
var lastMessages = new Array
addToLastMessages = function(userName,message){
  lastMessages.push({
    userName: userName,
    message: message,
    userColor: 'rgb(150, 150, 150)'
  })
  //如果超过十条则删除第二个元素
  if (lastMessages.length>10){
    lastMessages.shift()
  }
}
// //增加一个初始信息，懒得改addMessage的逻辑了
// addToLastMessages('System',{content: '欢迎来到匿名聊天室', publishTime: ''})

//注释掉上方代码会导致Message数组为空时的 读取bug ！！！！

//选择名称
selectName = function(){
  if(nicknamesList.length == 1){
    //舍弃一个名字吧，省的下面各种判定了
    return null
  }
  randomIndex = Math.floor(Math.random()*(nicknamesList.length-1))
  name = nicknamesList[randomIndex]
  // color = colorsList[Math.floor(Math.random()*10)]
  color = colorsList[randomIndex]
  nicknamesList[randomIndex] = nicknamesList.pop()
  data={name: name,color:color}
  return data
}

//监听socket 建立新连接时
io.on('connection', function (socket) {
  var addedUser = false

  //当有新的用户访问网站
  socket.on('new user',function(){
    if(addedUser) return
    //选择名称，保存起来
    newUser = selectName()
    // 如果选择名字得到的是null 则连接数达到上限 disconnect之
    if(newUser==null){
      socket.emit('disconnect')
      socket.disconnect()
      return
    }
    socket.userName = newUser.name
    socket.userColor = newUser.color
    //新用户加入到在线用户数组
    userList.push({userName: socket.userName,userColor: socket.userColor})
    socket.emit('welcome',{
        lastInfo: lastMessages,
        clientName: socket.userName,
        userColor: socket.userColor,
        users: userList
    })
    socket.broadcast.emit('new user',{
      clientName: socket.userName,
      userColor: socket.userColor,
      users: userList
    })
    addedUser = true
  })

  socket.on('new message',function(data){
    console.log(socket.userName+" 发消息啦")
    socket.broadcast.emit('new message',{
        userName: socket.userName,
        userColor: socket.userColor,
        message: data
    })
    addToLastMessages(socket.userName,data)
  })

  socket.on('disconnect',function(data){
    if(addedUser){
      console.log(socket.userName+' 断开连接啦')
      userLeave(socket.userName,socket.userColor)
      socket.broadcast.emit('user left',{
        clientName: socket.userName,
        userColor: socket.userColor,
        users: userList
      })
    }
  })

});
