var form = require('../../wigets/form')();
var Modal = require('../../wigets/modal');

require('../../router')('#front-register', function($dom) {
    form.init($dom, null, function(data) {
        if (!data.success)
            return

        Modal.alert('注册成功', function() {
            window.location.href = '/info'
        });
    });
})
