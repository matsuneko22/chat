
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

  var myName = "名無し";
  socket.on("connected", function (Name) {
    if(Name === ""){
      myName = "nanashi"
    }else{
      myName = Name;
    }
    var msg = myName + "さんが入室しました";
    userHash[socket.id] = Name;
    socket.broadcast.emit("publish", {value: msg});
  });


  socket.on("publish", function (data) {
    io.sockets.emit("publish", {value:data.value});
  });

  socket.on("disconnect", function () {
    if (userHash[socket.id]) {
      var msg = myName + "さんが退出しました";
      var msg = userHash[socket.id] + "さんが退出しました";
      delete userHash[socket.id];
      io.sockets.emit("publish", {value: msg});
    }
  });
});
