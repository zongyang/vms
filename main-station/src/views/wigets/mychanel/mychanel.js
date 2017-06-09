var modal = require('../modal');

exports.init = function($dom) {
    this.$dom = $dom;
    this.$mychanle = $('.mychanle');
    this.$logout = this.$mychanle.find('.logout');
    this.$sideNav = this.$mychanle.find('.side-nav');
    this.sideNavInit();
    this.logoutInit();
}

exports.sideNavInit = function() {
    var pageTag = location.pathname.split('/')[1];
    this.$sideNav
        .find('li')
        .filter('.' + pageTag)
        .addClass('active')
        .siblings()
        .removeClass('active');
}
exports.logoutInit = function() {
    this.$logout.click(function() {
        modal.confirm('确认要注销吗？', function() {
            $.post('/logout', function(data) {
                modal.alert(data.msg, function() {
                    if (!data.success)
                        return;
                    location.href = '/';
                })
            })
        })
    })
}
