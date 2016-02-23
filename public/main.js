var socket = io.connect();

//通知服务器我进来了
socket.emit('new user')

var vm = new Vue({
  el: '#container',
  data: {
    messages: [],
    users: []
  },
//   methods: {
//     addMessage: function(data){
//       if (this.messages.length == 0){
//         this.messages = data.lastInfo
//       }
//       else{
//         this.messages.push(data)
//       }
//     },
//     addUser: function(data){
//       this.users = data.users
//     },
//     sendMessage: function(data){
//       var input = inputMessage
//       var content = input.value
//       input.value = ''
//       var publishTime = new Date().toLocaleDateString('en-us',{
//         year: "numeric", month: "short",
//         day: "numeric", hour: "2-digit",
//         minute: "2-digit",second: "2-digit"
//         })
//       if (content.trim()==''){
//         alert("Cannot send a blank message.")
//         return
//       }
//       this.addMessage({
//         username: username,
//         message: {content: content,publishTime: publishTime},
//         nameColor: nameColor
//       })
//       socket.emit('new message',{content: content,publishTime: publishTime})
//       this.$nextTick(function () {vm.scroll()})
//     },
//     notify: function(data){
//       vm.$set('notification', data)
//       setTimeout(function(){
//         vm.$set('notification','')
//       },3000)
//     },
//     scroll: function(){
//       var area = document.getElementById('messagesArea')
//       area.scrollTop = area.scrollHeight
//     }
//   }
})
//
// //监听socket事件
// socket.on('welcome',function(data){
//   vm.addMessage(data)
//   vm.addUser(data)
//   username = data.clientName
//   nameColor = data.nameColor
// })
//
// socket.on('new message',function(data){
//   vm.addMessage(data)
//   // 等待DOM更新后，触发滚动条
//   vm.$nextTick(function () {vm.scroll()})
// })
//
// socket.on('new user',function(data){
//   vm.addUser(data)
//   vm.notify(data.clientName+" joins the chat ")
// })
//
// socket.on('user left',function(data){
//   vm.addUser(data)
//   vm.notify(data.clientName+" leaves the chat ")
// })
//
// socket.on('disconnect',function(){
//   vm.notify("Sorry,here is too crowded.")
// })
