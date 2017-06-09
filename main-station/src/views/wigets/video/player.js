var Player = require('../Player');
var store = require('../store');
var moment = require('../../../utils/moment');
var math = require('../../../utils/math');

var video = {}
video.init = function($dom) {
    this.videoJsInit()
    this.$container = $dom.find('.play-container');
    this.$dom = $dom.find('video');
    this.dom = this.$dom[0];
    this.play();
}
video.videoJsInit = function() {
    var rootScope = this;
    var video = videojs($('video')[0]).ready(function() {
        store.set('time', 0);
        video.on('timeupdate', function() {
            var links = store.get('links');
            links = math.setRightTimeArrWithActiveTag(this.currentTime(), links);
            store.set('links', links);
            store.set('time', this.currentTime());
        });
        Player.render('.video-js', function() {
            rootScope.pause();
        });
    })
}

// 视频上的点击事件
video.bindVideoClickEvent = function(cb) {
    this.$dom.click(function(event) {

        // 如果是播放状态则不处理
        if (!this.dom.paused)
            return;

        //设置数据
        var time = math.toFixed(this.dom.currentTime);
        var x = math.toFixed(event.offsetX / this.$dom.width() * 100);
        var y = math.toFixed(event.offsetY / this.$dom.height() * 100);
        this.setEeditingLink(x, y, time);
        if (cb)
            cb();

    }.bind(this));
}

video.setEeditingLink = function(x, y, time) {
    // player 中的link编辑都是添加视链(action=add)
    var link = store.get('editingLink');
    link.x = x;
    link.y = y;
    link.time = time;
    link.action = 'add';
    store.set('editingLink', link);
}
video.show = function() {
    this.$container.fadeIn('slow');
}
video.hide = function() {
    this.$container.fadeOut('slow');
}
video.setCurrentTime = function(time) {
    this.dom.currentTime = time;
    if (this.dom.paused)
        this.dom.play();
}
video.pause = function() {
    if (!this.dom.paused)
        this.dom.pause();
}
video.play = function() {
    this.dom.play();
}
module.exports = video;
