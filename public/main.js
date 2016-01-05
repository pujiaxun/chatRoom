username = 'initname'

new Vue({
  el: '.title',
  data: {
    welcome: 'Welcome to Here.'
  }
})

var loginButton = new Vue({
  el: '.loginButton',
  data: {
    value: '开始聊天'
  },
  methods: {
    login: function () {
      console.log('可以响应');
      // 下面的逻辑应该 设计在登陆成功后  而不是点击按钮后
      // 此处应该调用函数来开启socket
      //算了直接进去吧
      var loginPage = document.getElementById("loginPage")
      loginPage.style.display = 'none'

    }
  }
})

var messagesList = new Vue({
  el: '.messages',
  data: {
    items:[
      {message: '第一条', username: 'Jason'},
      {message: '第二条', username: 'Jack'}
    ]
  }
})
var usersList = new Vue({
  el: '.users',
  data: {
    items:[
      {username: 'Jack'},
      {username: 'Jason'}
    ]
  }
})

var inputMessage = new Vue({
  el: '.inputMessage',
  methods: {
    send: function(){
      sendMessage()
    }
  }
})

function addChatMessage (data){
  messagesList.items.push(data)
}
function sendMessage(){
  var message = inputMessage.message
  //清空输入框
  inputMessage.message = ''
  //发送出去
  addChatMessage({
    username: username, message: message
  })
  socket.emit('new message',message)
}
// 发布一条消息
function log (message, options) {
  //还么写好
  var $el = $('<li>').addClass('log').text(message);
  addMessageElement($el, options);
}

var socket = io.connect();
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
