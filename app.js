
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


  socket.on("connected", function (name) {
    var msg = name + "さんが入室しました";
    userHash[socket.id] = name;
    socket.broadcast.emit("publish", {value: msg});
  });


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
