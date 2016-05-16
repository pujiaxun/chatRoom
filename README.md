# Chat Room
A simple chat room with socket.io, Vue.js and Node.js.

## How to use

```
$ cd chatRoom
$ npm install
$ node .
```

## Features
- Multiple users can join a chat room by each entering a random user name on website load.
- Users can type chat messages to the chat room.
- A notification is sent to all users when a user joins or leaves the chat room.
- Not all the publish time of messages will  display.About every 5 minutes a **displayTime**.
- Support the responsive web design, you can click the button on the right top of screen to display the list of on-line users.  

--------------------------------------------------------------------------------

# 聊天室
一个基于Socket.io, Vue.js 和 Node.js实现的简单聊天室应用。

## 使用方法

```
$ cd chatRoom
$ npm install
$ node .
```

## 特性
- 用户可以访问指定端口，进入聊天室，并随机获得一个内置的匿名和颜色。
- 用户可以在这里聊天，暂时仅支持文字，并且似乎不支持SQL注入等黑科技。
- 当有用户进入或者离开时，其他用户会收到通知。
- 消息的时间显示逻辑为五分钟以上才显示一次，并非每条都会显示。
- 支持响应式布局，竖版可点击右上角按钮查看当前用户列表。

---

TODO: 使用Sass/Scss/Less,Bootstrap,Webpack,gulp等前端工具重构，练习前端
