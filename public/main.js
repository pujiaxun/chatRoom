var socket = io.connect();

//通知服务器我进来了
socket.emit('add user')

var messagesList = new Vue({
  el: '#messagesArea',
  data: {
    items: []
  },
  methods: {
    add: function(data){
      if (this.items.length == 0){
        this.items = data.lastInfo
      }
      else{
        this.items.push(data)
      }
    }
  }
})

var usersList = new Vue({
  el: '#userArea',
  data: {
    items:[]
  },
  methods: {
    add: function(data){
      this.items = data.users
    }
  }
})

var inputMessage = new Vue({
  el: '#inputMessage',
  methods: {
    send: function(){
      var message = inputMessage.message
      //清空输入框
      inputMessage.message = ''
      //发送出去
      messagesList.add({
        username: username, message: message,nameColor: nameColor
      })
      socket.emit('new message',message)
    }
  }
})

//先渲染以前保存的数条消息
// function lastChatMessage (data){
//   messagesList.items = (data.lastInfo)
// }

// function addChatMessage (data){
//   messagesList.items.push(data)
//
// }
function addMyChatMessage(data){

}

// function sendMessage(){
//   var message = inputMessage.message
//   //清空输入框
//   inputMessage.message = ''
//   //发送出去
//   addChatMessage({
//     username: username, message: message,nameColor: nameColor
//   })
//   socket.emit('new message',message)
// }

socket.on('welcome',function(data){
  console.log("客户端监听到了welcome");
  messagesList.add(data)
  usersList.add(data)
  // lastChatMessage(data)
  username = data.clientName
  nameColor = data.nameColor
})

socket.on('new message',function(data){
  console.log("客户端监听到了new message");
  messagesList.add(data)
})

socket.on('user left',function(data){
  // notify()
})
