var socketIo = require('socket.io');

var sk = {};

sk.init = function(server) {
    this.io = socketIo(server);
}

// 创建 video namespace
sk.createVideoNsp = function(videoId) {
    var rootSocpe = this;
    this.videoNsp = rootSocpe.io.of('video/' + videoId);
}
sk.sendMsg = function(msg) {
    this.videoNsp.emit('get-comments', msg);
}

module.exports = sk;
