var form = require('../form')();
var Modal = require('../modal');
var others = require('../../../utils/others');
var info = {};
info.init = function($dom) {
    var $form = $dom.find('.info-edit');
    form.init($form, null, function(data) {
        Modal.alert(data.msg);
    })
    form.setSubmitUrl(generateUrl());
    form.setSubmitType('put');
}


function generateUrl() {
    var id = others.getIdByHref();
    var baseUrl = '/api/video-info';
    return baseUrl + '/' + id;
}

module.exports = info;
