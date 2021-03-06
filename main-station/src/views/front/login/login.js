var form = require('../../wigets/form')();
var Modal = require('../../wigets/modal');

require('../../router')('#front-login', function($dom) {
    form.init($dom, null, function(data) {
        if (!data.success)
            return

        Modal.alert(data.msg, function() {
            window.location.href = '/info'
        });
    });
})
