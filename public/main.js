var socket = io.connect()

var input = document.getElementById('messageInput')

//通知服务器我进来了
socket.emit('new user')

var vm = new Vue({
  el: '#container',
  data: {
    myName: '',
    myColor: '',
    messages: [],
    users: [],
    notifications: []
  },
  methods: {
    addMessage: function(data){
      if (this.messages.length == 0 && data.lastInfo!=null){
        this.messages = data.lastInfo
      }
      else{
        this.messages.push(data)
      }
    },
    updateUsers: function(data){
      this.users = data.users
    },
    sendMessage: function(data){
      var content = input.value
      input.value = ''
      if (content.trim()==''){
        //干脆直接不响应？  体验也许会更好些
        // alert("不能发送空白消息")
        return
      }
      var publishTime = new Date().toLocaleDateString('en-us',{
        year: "numeric", month: "short",
        day: "numeric", hour: "2-digit",
        minute: "2-digit",second: "2-digit"
        })
      this.addMessage({
        userName: userName,
        userColor: userColor,
        message: {content: content,publishTime: publishTime},
        is_self: true
      })
      socket.emit('new message',{content: content,publishTime: publishTime})
      this.$nextTick(function () {vm.scroll()})
    },
    notify: function(data,content){
      this.addMessage({
        userName: data.userName,
        userColor: data.userColor,
        message: {content: content,is_notification: true},
        is_self: false
      })
      this.$nextTick(function () {vm.scroll()})
    },
    scroll: function(){
      var area = document.getElementById('messageList')
      area.scrollTop = area.scrollHeight
    }
  }
})

//监听socket事件
socket.on('welcome',function(data){
  vm.addMessage(data)
  vm.updateUsers(data)
  userName   = data.userName
  userColor  = data.userColor
  vm.myName  = userName
  vm.myColor = userColor
  vm.$nextTick(function () {vm.scroll()})
})

socket.on('new message',function(data){
  vm.addMessage(data)
  // 等待DOM更新后，触发滚动条
  vm.$nextTick(function () {vm.scroll()})
})

socket.on('new user',function(data){
  vm.updateUsers(data)
  vm.notify(data,data.userName + " 进入了聊天室")
})

socket.on('user left',function(data){
  vm.updateUsers(data)
  vm.notify(data,data.userName+" 离开了聊天室")
})

socket.on('disconnect',function(){
  vm.notify(data,"对不起房间已满员")
})
