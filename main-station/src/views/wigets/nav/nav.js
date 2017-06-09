var typeahead = require('../typeahead/typeahead')
var modal = require('../modal')

exports.init = function() {
    typeahead.initVideoSearch();
    this.logoutInit();
}

exports.logoutInit = function() {
    $('.login .logout').click(function() {
        modal.confirm('确认要注销吗？', function() {
            $.post('/logout', function(data) {
                modal.alert(data.msg, function() {
                    if (!data.success)
                        return;
                    location.href = '/';
                })
            })
            var modal = require('../modal');
        })
    })
}
