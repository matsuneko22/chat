// 1.���W���[���I�u�W�F�N�g�̏�����
var fs = require("fs");
var server = require("http").createServer(function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./index.html", "utf-8");
     res.end(output);
}).listen(8080);
var io = require("socket.io").listen(server);

// ���[�U�Ǘ��n�b�V��
var userHash = {};

// 2.�C�x���g�̒�`
io.sockets.on("connection", function (socket) {

  // �ڑ��J�n�J�X�^���C�x���g(�ڑ������[�U��ۑ����A�����[�U�֒ʒm)
  socket.on("connected", function (name) {
    var msg = name + "���������܂���";
    userHash[socket.id] = name;
    io.sockets.emit("publish", {value: msg});
  });

  // ���b�Z�[�W���M�J�X�^���C�x���g
  socket.on("publish", function (data) {
    io.sockets.emit("publish", {value:data.value});
  });

  // �ڑ��I���g�ݍ��݃C�x���g(�ڑ������[�U���폜���A�����[�U�֒ʒm)
  socket.on("disconnect", function () {
    if (userHash[socket.id]) {
      var msg = userHash[socket.id] + "���ޏo���܂���";
      delete userHash[socket.id];
      io.sockets.emit("publish", {value: msg});
    }
  });
});
