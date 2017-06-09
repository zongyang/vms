var nav = require('./wigets/nav/nav');
/**
 * 前台的路径配置文件
 * @Author zongyang
 * @Date   2016-01-04
 * @param  选择器
 * @param  回调函数
 * @return null
 */
module.exports = function(route, callback) {
    var $self = $(route);
    if ($self.length > 0) {
        layoutInit();
        callback($self);
    }
}

function layoutInit() {
    //nav
    nav.init();
}
