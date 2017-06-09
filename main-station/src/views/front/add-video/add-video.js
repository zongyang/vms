var mychanel = require('../../wigets/mychanel/mychanel');
var Events = require('../../../utils/events')
var form = require('../../wigets/form')();
var Modal = require('../../wigets/modal');
require('../../router')('#front-add-video', function($dom) {
    var e = new Events();
    //上传进度事件
    var progressbarEvent = new Events();

    //页面结构初始化
    mychanel.init($dom);

    //表单检测事件
    submitCheckEvent($dom);

    //表单初始化
    form.init($dom, function() {
        Modal.progressbar(progressbarEvent);
    }, function(data) {
        if (!data.success)
            return

        Modal.alert('视频添加成功', function() {
            window.location.href = '/uploaded'
        });

    }, function(perenct) {
        progressbarEvent.emit('progress', perenct)
    });
    

})


function submitCheckEvent($dom) {
    var $input = $dom.find('input[type=file]');

    //提交按钮
    $dom.find('.submit').click(function(event) {
        event.preventDefault();
        var fileCount = $input[0].files.length;
        if (fileCount == 0) {
            Modal.alert('请选择视频文件');
            event.stopImmediatePropagation();

        }
        return false;
    });


}
