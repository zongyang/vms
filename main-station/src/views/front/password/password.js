var mychanel = require('../../wigets/mychanel/mychanel');
var form = require('../../wigets/form')();
var Modal = require('../../wigets/modal');

require('../../router')('#front-password', function($dom) {
    //布局初始化
    mychanel.init($dom);
    //from初始化
    form.init($dom, null, function(data) {
        if (!data.success)
            return
        Modal.alert(data.msg, function() {
            form.clearInputsVal();
        });

    });
    form.setSubmitType('put');
    form.setSubmitUrl('/api/password');
})
