var mychanel = require('../../wigets/mychanel/mychanel');
var thumbPanel = require('../../wigets/thumb-panel/thumb-panel');
require('../../router')('#front-uploaded', function($dom) {
    //页面结构初始化
    mychanel.init($dom);

    thumbPanel.init($dom);
})
