var player = require('../../wigets/video/player');
var info = require('../../wigets/video/info');
var editor = require('../../wigets/video/ueditor');
var link = require('../../wigets/video/link');

//编辑的事件可以同过单独的方法添加，如编辑和播放无区别则将方法放在init里面

require('../../router')('#front-edit-video', function($dom) {

    // link相关
    link.init($dom, function(time) {
        player.setCurrentTime(time);
    });
    link.addEditEvent(function() {

        // 弹出编辑框
        editor.show();

        //设置ueditor中所有的值
        editor.setAll();

        //暂停视频
        player.hide();
        player.pause();
    });


    //editor 相关
    editor.init($dom, function() {
        link.submit(); // 提交修改到服务器
        player.show();
    }, function() {
        player.show();
    })

    // player 相关
    player.init($dom);
    player.bindVideoClickEvent(function() {

        // 弹出编辑框
        editor.show();
        player.hide();

        //设置title
        editor.setTitle();
    });



    // 视频信息相关
    info.init($dom);


});
