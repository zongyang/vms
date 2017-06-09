var store = require('../../wigets/store');
var Modal = require('../../wigets/modal');
var validator = require('../../../utils/validator');
var others = require('../../../utils/others');
var reactComment = require('./react-comment');
var comment = {};

comment.init = function($dom) {
    this.$dom = $dom;
    this.$commentItem = $dom.find('.comment-item');
    this.videoId = others.getIdByHref();
    this.$submit = $dom.find('.btn-comment');


    this.addSubmitClick();
    this.socketInit();
    this.ajaxGet();
    reactComment.init($dom);
}

comment.addSubmitClick = function() {
    var rootScope = this;
    var $input = this.$dom.find('.input-comment');

    this.$submit.click(_event);
    $input.keypress(function(e) {
        if (e.keyCode == 13)
            _event()
    })


    function _event() {
        // 校验
        var data = { content: $input.val() };
        if (validator.isEmpty(data.content)) {
            Modal.alert('评论不能为空，不能有空格');
            return;
        }

        // 提交到服务器
        $.post('/api/video-comment/' + rootScope.videoId, data, function(data) {
            Modal.alert(data.msg);
            $input.val('');
        })
    }
}

comment.render = function() {

}
comment.ajaxGet = function(cb) {
    $.get('/api/comments/' + this.videoId, function(data) {
        if (!data.success) {
            Modal.alert(data.msg);
            return
        }
        store.set('comments', data.msg)

        if (cb)
            cb()
    })
}
comment.storeInit = function() {
    var rootScope = this;
    store.set('comments', []);
    store.addChangeEvent('comments', function() {

    })
}
comment.socketInit = function() {
    this.socket = io.connect('/video/' + this.videoId);
    this.socket
        .on('get-comments', function(data) {
            store.set('comments', data)
        })
}
module.exports = comment;
