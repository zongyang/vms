var ueditor = require('ueditor');
var express = require('express');
var path = require('path');

var router = express.Router();

router.use(ueditor(path.join(process.cwd(), 'public'), function(req, res, next) {

    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;

        var img_url = '/ueditor-tmp/';
        res.ue_up(img_url);
    }

    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/ueditor-tmp/';
        res.ue_list(dir_url);
    }

    // 客户端发起其它请求
    else {

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));

module.exports = router;
