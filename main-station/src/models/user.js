var mongoose = require('mongoose');
var validator = require('../utils/validator');
var secret = require('./secret');
var ObjectId = mongoose.Types.ObjectId;

var schema = mongoose.Schema({
    username: String,
    password: String,
    regTime: Date,
    loginTime: Date,
    signature: String,
    avator: String,
    history: [{
        time: String,
        video: { type: mongoose.Schema.Types.ObjectId, ref: 'video' }
    }],
    type: {
        type: String,
        default: 'normal'
    }
});

/**
 * staic methods
 */
schema.statics.findUser = function(data, cb) {
    var resultData = validator.check(data);
    if (Object.keys(resultData).length > 0) {
        cb(resultData);
        return;
    }
    data.password = secret.encrypt(data.password);
    this.findOne({
        username: data.username,
        password: data.password
    }).exec(function(err, doc) {
        if (doc)
            cb(err, doc)
        else
            cb({
                username: '用户名或密码不正确',
                'password': '用户名或密码不正确'
            })
    });
}
schema.statics.updateUserInfo = function(id, update, cb) {
    if (validator.isEmpty(id)) {
        cb('不是正常的id', null);
        return;
    }
    //过滤update字段
    var updateSet = {};
    if (!validator.isEmpty(update.avator))
        updateSet.avator = update.avator;
    if (!validator.isEmpty(update.signature))
        updateSet.signature = update.signature;
    if (!validator.isEmpty(update.username))
        updateSet.username = update.username;

    this
        .findByIdAndUpdate(id, updateSet, { new: true })
        .exec(function(err, doc) {
            cb(err, doc);
        })

}
schema.statics.addHistory = function(userId, videoId, time, cb) {
    if (validator.isEmpty(userId, videoId, time)) {
        cb('不是正常的用户id,视频id,时间', null);
        return;
    }
    var query = { _id: new ObjectId(userId), 'history.video': new ObjectId(videoId) };
    var update = { $set: { 'history.$.time': time } };

    this.findOne(query, function(err, doc) {
        if (err) {
            cb(err)
            return
        }

        if (!doc) { //insert options,改视频的历史不存在，需要添加
            query = { _id: new ObjectId(userId) };
            update = { $addToSet: { history: { time: time, video: new ObjectId(videoId) } } }
        }


        this.findOneAndUpdate(query, update, { new: true }, function(err, doc) {

            cb(err, doc)
        })
    }.bind(this))

}
schema.statics.getHistory = function(id, cb) {
    if (validator.isEmpty(id)) {
        cb('不是正常的id', null);
        return;
    }

    this.findById(id)
        .populate('history.video')
        .exec(function(err, doc) {
            doc = doc || {};
            cb(err, doc.history)
        })
}
schema.statics.updatePassword = function(id, password, cb) {
    var resultData = validator.check(password);
    if (Object.keys(resultData).length > 0) {
        cb(resultData);
        return;
    }
    if (validator.isEmpty(id)) {
        cb('不是正常的id', null);
        return;
    }

    var query = {
        _id: new ObjectId(id),
        password: secret.encrypt(password.oldPassword)
    }
    var update = {
        password: secret.encrypt(password.password)
    }

    this.findOneAndUpdate(query, update, { new: true }, function(err, doc) {
        if (err) {
            cb(err)
            return
        }
        if (doc == null) {
            cb({ oldPassword: '原密码不正确' })
            return
        }
        cb(err, doc);
    })
}



/**
 * instance methods
 */
schema.methods.checkAndInsert = function(cb) {
    var resultData = validator.check(this.toObject());
    if (Object.keys(resultData).length > 0) {
        cb(resultData);
        return;
    }
    model.findOne({
        username: this.username
    }).exec(function(err, doc) {
        if (doc) {
            cb({
                username: '用户名已存在'
            })
            return
        }
        this.password = secret.encrypt(this.password);
        this.save(function(err, doc) {
            cb(err, doc);
        });
    }.bind(this));
}
var model = mongoose.model('user', schema);
module.exports = model;
