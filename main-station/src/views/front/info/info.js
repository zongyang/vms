var mychanel = require('../../wigets/mychanel/mychanel');
var limits = require('../../../utils/upload-limits');
var Events = require('../../../utils/events')
var form = require('../../wigets/form')();
var Modal = require('../../wigets/modal');
require('../../router')('#front-info', function($dom) {
    var e = new Events();
    //上传进度事件
    var uploadProgressEvent = new Events();

    //页面结构初始化
    mychanel.init($dom);

    //个人信息表单初始化
    form.init($dom, function() {
        Modal.loading(uploadProgressEvent);
    }, function() {
        Modal.alert('信息修改成功');
    }, function(perenct) {
        uploadProgressEvent.emit('progress', perenct)
    });
    form.setSubmitType('put');
    form.setSubmitUrl('/api/info');
    //个人图片预览初始化
    filePreview($dom);

    $('.modal').modal('show')
})

// 图片预览
function filePreview($dom) {
    var $input = $dom.find('.preview-btn');
    $input.change(function() {

        var file = $input[0].files[0];

        //fileReader
        var reader = new FileReader();
        reader.onload = function(event) {
            $dom.find('.preview img').attr('src', event.target.result);
        }
        reader.readAsDataURL(file);
    })
}
