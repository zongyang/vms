var mongoose = require('mongoose');
var moment = require('../utils/moment');
var validator = require('../utils/validator');
var others = require('../utils/others');
var path = require('path');
var fs = require('fs');

var ObjectId = mongoose.Types.ObjectId;
var commentSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    time: {
        type: Date,
        default: Date.now
    },
    content: String
});


var schema = mongoose.Schema({
    videoName: String,
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    uploadTime: {
        type: Date,
        default: Date.now
    },
    state: String,
    links: [{
        x: Number,
        y: Number,
        // duration: Number,
        title: String,
        content: String,
        // display: String,
        time: Number
    }],
    playCount: {
        type: Number,
        default: 0
    },
    comments: { type: [commentSchema] },
    type: {
        type: String,
        default: 'normal'
    },
    tag: String,
    videoInfo: String,
    url: String,
    thumbnail: String,
    duration: String
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


/**
 * staic methods
 */
schema.statics.findByUserId = function(id, cb) {
    if (validator.isEmpty(id)) {
        cb('不是正常的id', null);
        return;
    }

    this
        .find({
            uploader: new ObjectId(id)
        })
        .populate('uploader')
        .exec(function(err, docs) {
            cb(err, docs)
        })
}
schema.statics.findByVideoIdAndIncPlayCount = function(id, cb) {
    if (validator.isEmpty(id)) {
        cb('不是正常的id', null);
        return;
    }
    var update = { $inc: { 'playCount': 1 } };
    this.findByIdAndUpdate(id, update, { new: true }, function(err, doc) {
        doc = doc || {};
        cb(err, doc);
    })

}

schema.statics.findByVideoId = function(id, cb) {
    if (validator.isEmpty(id)) {
        cb('不是正常的id', null);
        return;
    }

    this.findById(id, function(err, doc) {
        cb(err, doc);
    })

}

schema.statics.updateInfoById = function(id, data, cb) {
    if (validator.isEmpty(id)) {
        cb('不是正常的id', null);
        return;
    }
    var resultData = validator.check(data);
    if (Object.keys(resultData).length > 0) {
        cb(resultData);
        return;
    }

    var updateData = {
        videoName: data.videoName,
        videoInfo: data.videoInfo
    };

    this.findByIdAndUpdate(id, updateData, { new: true }, function(err, doc) {
        doc = doc || {};
        cb(err, doc);
    })
}
schema.statics.addLinkById = function(id, data, cb) {
    if (validator.isEmpty(id)) {
        cb('不是正常的id', null);
        return;
    }

    var update = {
        $addToSet: {
            links: data
        }
    };

    this.findByIdAndUpdate(id, update, { new: true }, function(err, doc) {
        doc = doc || {};
        cb(err, doc);
    })
}
schema.statics.getLinksById = function(id, cb) {
    if (validator.isEmpty(id)) {
        cb('不是正常的id', null);
        return;
    }

    this.findById(id, function(err, doc) {
        var links = [];
        if (doc)
            links = doc.links;

        cb(err, links);
    })
}

schema.statics.delLink = function(videoId, linkId, cb) {
    if (validator.isEmpty(videoId, linkId)) {
        cb('不是正常的id', null);
        return;

    }

    var update = {
        $pull: {
            links: { _id: new ObjectId(linkId) }
        }
    };

    this.findByIdAndUpdate(videoId, update, { new: true }, function(err, doc) {
        doc = doc || {};
        cb(err, doc);
    })
}
schema.statics.editLink = function(videoId, data, cb) {
    if (!data || validator.isEmpty(videoId, data._id)) {
        cb('没有link信息或者没有id信息', null);
        return;

    }

    var query = { _id: new ObjectId(videoId), 'links._id': new ObjectId(data._id) };
    var update = { $set: { 'links.$': data } };

    this.update(query, update, function(err, doc) {
        cb(err, doc);
    })
}
schema.statics.addComment = function(videoId, comment, cb) {
    var rootScope = this;
    if (!comment || validator.isEmpty(comment.userId, comment.content)) {
        cb('请检查评论的格式', null);
        return;
    }

    var update = {
        $addToSet: {
            comments: comment
        }
    };
    var condition = { _id: new ObjectId(videoId) };
    rootScope.update(condition, update, function(err, doc) {
        if (err) {
            cb(err)
            return
        }

        //查询
        rootScope
            .findOne({ _id: new ObjectId(videoId) })
            .populate('comments.userId')
            .exec(function(err, doc) {
                doc = doc || {};
                var comments = doc.localComments;
                cb(err, comments);
            })
    })

    // this.findByIdAndUpdate(videoId, update, { new: true }, function(err, doc) {
    //     doc = doc || {};
    //     cb(err, doc.localComments);
    // })
}
schema.statics.getCommentsById = function(id, cb) {
    if (validator.isEmpty(id)) {
        cb('不是正常的id', null);
        return;
    }

    this
        .findOne({ _id: new ObjectId(id) })
        .populate('comments.userId')
        .exec(function(err, doc) {
            doc = doc || {};
            var comments = doc.localComments;
            cb(err, comments);
        })
}
schema.statics.removeById = function(id, cb) {
    if (validator.isEmpty(id)) {
        cb('不是正常的id');
        return;
    }

    this.findByIdAndRemove(id, function(err, doc) {
        if (err) {
            cb(err)
            return
        }

        _delFile(doc, cb);
    })


    //删除相应文件thumbnail、url
    function _delFile(doc, cb) {
        if (!doc)
            return
        var _doc = doc.toObject();
        var url = path.join(process.cwd(), 'public', _doc.url);
        var thumbnail = path.join(process.cwd(), 'public', _doc.thumbnail);
        fs.unlink(url, function(err) {
            if (err) {
                cb(err)
                return
            }
            fs.unlink(thumbnail, function(err) {
                cb(err)
            })
        })
    }
}

schema.statics.findByKeyWord = function(keyword, cb) {
    var reg = new RegExp(keyword);
    var query = {}

    if (keyword != undefined) {
        if (validator.isIncludeSpecial(keyword) == '') {
            cb('请检查关键字格式!');
            return;
        }

        query = {
            $or: [
                { videoName: reg },
                { videoInfo: reg }
            ]
        }
    }


    this.find(query)
        .sort({ uploadTime: -1 })
        .populate('uploader')
        .exec(function(err, docs) {
            cb(err, docs);
        })
}
schema.statics.findWithSkip = function(skip, limit, cb) {
    skip = skip || 0;
    limit = limit || others.videoLimit;

    this.find({})
        .skip(skip)
        .limit(limit)
        .sort({ uploadTime: -1 })
        .exec(function(err, docs) {
            cb(err, docs)
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

    //部分信息的修正
    this.set('duration', moment.formatSconds2Hms(this.duration));

    this.save(function(err, doc) {
        cb(err, doc);
    })
}

/**
 * virtuals
 */
// 好像不起作用
commentSchema.virtual('localTime').get(function() {
    return moment.getTimeWithDiff(this.time);
});

schema.virtual('localComments').get(function() {
    var comments = this.comments.toObject();
    for (var i = 0; i < comments.length; i++) {
        comments[i].time = moment.getTimeWithDiff(comments[i].time);
    }
    return comments;
})

schema.virtual('localUploadTime').get(function() {
    return moment.getTimeWithDiff(this.uploadTime);
});

schema.virtual('commentsCount').get(function() {
    return this.comments.length;
});

var model = mongoose.model('video', schema);
module.exports = model;
