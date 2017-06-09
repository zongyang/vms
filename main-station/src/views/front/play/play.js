var player = require('../../wigets/video/player');
var info = require('../../wigets/video/info');
var editor = require('../../wigets/video/ueditor');
var link = require('../../wigets/video/link');
var comment = require('./comment');
var history = require('./history');

//编辑的事件可以同过单独的方法添加，如编辑和播放无区别则将方法放在init里面

require('../../router')('#front-play', function($dom) {
    comment.init($dom);

    // link相关
    link.init($dom, function(time) {
        player.setCurrentTime(time);
    });

    // player 相关
    player.init($dom);


    // 视频信息相关
    info.init($dom);

    //播放记录相关
    history.init($dom, player);
});
