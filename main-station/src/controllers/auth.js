var validator = require('../utils/validator');
var resSend = require('./res-send');

var auth = {};
auth.isLogin = function(req, res, next) {
    if (!validator.isEmpty(req.session.user)) {
        next()
        return
    }
    var err = {
        message: '还未登录，无法进行此操作！'
    }
    resSend.sendByReqType(req, res, err);
}


module.exports = auth;
