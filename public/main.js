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
    lastDisplayTime: 0
  },
  methods: {
    addMessage: function(data) {
      if (this.messages.length == 0 && data.lastInfo != null) {
        this.messages = data.lastInfo
      } else {
        this.messages.push(data)
      }
    },
    updateUsers: function(data) {
      this.users = data.users
    },
    sendMessage: function(data) {
      var content = input.value
      input.value = ''
      if (content.trim() == '') {
        //干脆直接不响应？  体验也许会更好些
        // alert("不能发送空白消息")
        return
      }

      var rawTime = new Date()
      var needDisplayTime = false
        //如果距离上次显示消息时间的时间超过3分钟，则再次显示时间
      if ((rawTime - this.lastDisplayTime) > 5 * 60 * 1000) {
        needDisplayTime = true
        this.lastDisplayTime = rawTime
      }

      displayTime = this.timeFormat(rawTime)
      this.addMessage({
        userName: this.myName,
        userColor: this.myColor,
        message: {
          content: content,
          publicTime: displayTime,
          is_self: true,
          is_time: needDisplayTime
        }
      })
      socket.emit('new message', {
        content: content,
        publicTime: displayTime,
        is_other: true,
        is_time: needDisplayTime,
        lastDisplayTime: this.lastDisplayTime.toString()
      })
      this.$nextTick(function() {
        vm.scroll()
      })
    },
    notify: function(data, content) {
      this.addMessage({
        message: {
          content: content,
          is_system: true
        }
      })
      this.$nextTick(function() {
        vm.scroll()
      })
    },
    scroll: function() {
      var area = document.getElementById('messageList')
      area.scrollTop = area.scrollHeight
    },
    timeFormat: function(rawTime) {
      var h = rawTime.getHours()
      var m = rawTime.getMinutes()
      var d = rawTime.getDate()
      var mon = rawTime.getMonth() + 1
      var y = rawTime.getFullYear()
      var hour = (Array(2).join(0) + h).slice(-2)
      var min = (Array(2).join(0) + m).slice(-2)
      return y + '-' + mon + '-' + d + ' ' + hour + ':' + min
    },
    menuSwitch: function() {
      var menu = document.getElementById('userList')
      var checkbox = document.getElementById('menuCheck')
      menu.style.display = checkbox.checked ? 'block' : 'none'
    }
  }
})

//监听socket事件
socket.on('welcome', function(data) {
  //初始化一些信息
  vm.lastDisplayTime = new Date(data.lastDisplayTime)
  vm.addMessage(data)
  vm.updateUsers(data)
  vm.myName = data.userName
  vm.myColor = data.userColor
  vm.$nextTick(function() {
    vm.scroll()
  })
})

socket.on('new message', function(data) {
  vm.lastDisplayTime = new Date(data.message.lastDisplayTime)
  vm.addMessage(data)
  // 等待DOM更新后，触发滚动条
  vm.$nextTick(function() {
    vm.scroll()
  })
})

socket.on('new user', function(data) {
  vm.updateUsers(data)
  vm.notify(data, data.userName + " 进入了聊天室")
})

socket.on('user left', function(data) {
  vm.updateUsers(data)
  vm.notify(data, data.userName + " 离开了聊天室")
})

socket.on('disconnect', function() {
  vm.notify(data, "对不起房间已满员")
})
