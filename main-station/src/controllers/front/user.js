var User = require('../../models/user');
var upload = require('../upload');
var resSend = require('../res-send');


exports.renderLoginPage = function(req, res, next) {
    res.render('front/login/login');
}
exports.renderPasswordPage = function(req, res, next) {
    res.render('front/password/password');
}

exports.login = function(req, res, next) {
    User.findUser(req.body, function(err, user) {
        resSend.send(res, '登录成功', err, function() {
            req.session.user = user;
        });
    });

}
exports.logout = function(req, res, next) {
    req.session.user = null;
    resSend.send(res, '注销成功', null);
}
exports.renderRegisterPage = function(req, res, next) {
    res.render('front/register/register');
}
exports.register = function(req, res, next) {
    var user = new User(req.body);
    user.checkAndInsert(function(err, user) {
        resSend.send(res, '注册成功', err, function() {
            req.session.user = user;
        })
    });
}

exports.editInfo = function(req, res, next) {
    upload.addFile2ReqBody(req, 'img', 'avator', 'avators', function(err) {
        if (err) {
            resSend.send(res, null, err);
            return;
        }

        User.updateUserInfo(req.session.user._id, req.body, function(err, doc) {
            resSend.send(res, doc, err, function() {
                req.session.user = doc;
            });
        })
    })

}

exports.renderInfoPage = function(req, res, next) {
    res.render('front/info/info', {
        username: req.session.user.username,
        signature: req.session.user.signature,
        avator: req.session.user.avator
    });
}

exports.addHistory = function(req, res, next) {
    var userId = req.session.user._id;
    var videoId = req.params.id;
    var time = req.params.time;
    User.addHistory(userId, videoId, time, function(err, doc) {
        resSend.send(res, '添加成功', err);
    })
}
exports.renderHistoryPage = function(req, res, next) {
    var id = req.session.user._id;
    User.getHistory(id, function(err, historys) {
        res.locals.historys = historys;
        res.render('front/history/history');
    })
}
exports.editPassword = function(req, res, next) {
    var password = {
        password: req.body.password,
        repeatPassword: req.body.repeatPassword,
        oldPassword: req.body.oldPassword
    }
    var id = req.session.user._id;
    User.updatePassword(id, password, function(err, doc) {
        resSend.send(res, '密码修改成功', err)
    })
}
