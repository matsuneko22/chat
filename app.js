
var fs = require("fs");
var server = require("http").createServer(function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./index.html", "utf-8");
     res.end(output);
}).listen(8080);
var io = require("socket.io").listen(server);


var userHash = {};
var username;

io.sockets.on("connection", function (socket) {


  socket.on("connected", function (user) {
    var msg = user.name + "さんが入室しました";
    userHash[socket.id] = user.name;
    io.sockets.emit("publish", {value: msg});
  });

  socket.on("roomChange", function(user){
    socket.join(user.room);
    console.log("emit comming!")
    socket.broadcast.to(user.room).emit('emmit_from_server', user.name + " さんが入室");
  })

  socket.on("publish", function (data) {
    io.sockets.emit("publish", {value:data.value});
  });

  socket.on("disconnect", function () {
    if (userHash[socket.id]) {
      // var msg = username + "さんが退出しました";
      var msg = userHash[socket.id] + "さんが退出しました";
      delete userHash[socket.id];
      io.sockets.emit("publish", {value: msg});
    }
  });
});
