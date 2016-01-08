var socket = io.connect();

//通知服务器我进来了
socket.emit('add user')

var vm = new Vue({
  el: '#page',
  data: {
    messages: [],
    users: []
  },
  methods: {
    addMessage: function(data){
      if (this.messages.length == 0){
        this.messages = data.lastInfo
      }
      else{
        this.messages.push(data)
      }
    },
    addUser: function(data){
      this.users = data.users
    },
    sendMessage: function(data){
      var input = inputMessage
      var message = input.value
      input.value = ''
      if (message.trim()==''){
        alert("Cannot send a blank message.")
        return
      }
      this.addMessage({
        username: username,
        message: message,
        nameColor: nameColor
      })
      socket.emit('new message',message)
      setTimeout("vm.scroll()",0)
    },
    notify: function(data){
      var log = document.getElementById('notification')
      log.innerHTML = data
    },
    scroll: function(){
      var area = document.getElementById('messagesArea')
      area.scrollTop = area.scrollHeight
    }
  }
})

//监听socket事件
socket.on('welcome',function(data){
  vm.addMessage(data)
  vm.addUser(data)
  username = data.clientName
  nameColor = data.nameColor
})

socket.on('new message',function(data){
  vm.addMessage(data)
  setTimeout("vm.scroll()",0)
})

socket.on('user join',function(data){
  vm.addUser(data)
  vm.notify(data.clientName+" joins the chat ")
})

socket.on('user left',function(data){
  vm.addUser(data)
  vm.notify(data.clientName+" leaves the chat ")
})

socket.on('disconnect',function(){
  vm.notify("Sorry,here is too crowded.")
})
