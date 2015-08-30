
var fs = require("fs");
var server = require("http").createServer(function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./index.html", "utf-8");
     res.end(output);
}).listen(8080);
var io = require("socket.io").listen(server);


var userHash = {};
// var username;
var rooms = new Array("default");

io.sockets.on("connection", function (socket) {


  socket.on("connected", function (user) {
    console.log("connected: "+ socket.id);
    var msg = user.name + "さんが入室しました";
    userHash[socket.id] = user.name;
    socket.join("default");
    socket.emit("push_room", rooms);
    socket.broadcast.emit("publish", {value: msg});
  });

  socket.on("roomChange", function(user){
    socket.join(user.room);
    console.log("emit comming!")
    var data = {
      user: user,
      value : user.name + "さんが入室しました"
    }
    socket.broadcast.to(user.room).emit('publish', data);
  })

  socket.on("publish", function (data) {
    io.to(data.user.room).emit('publish', data);
  });

  socket.on("disconnect", function () {
    if (userHash[socket.id]) {
      // var msg =  + "さんが退出しました";
      var msg = userHash[socket.id] + "さんが退出しました";
      delete userHash[socket.id];
      io.sockets.emit("publish", {value: msg});
    }
  });
  
  
  socket.on("roomCreated", function(roomname){
    rooms.push(roomname);
    io.sockets.emit("add_room", roomname);
  })
});
