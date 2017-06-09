var upload = require('../upload');
var socket = require('../socket');
var resSend = require('../res-send');
var Video = require('../../models/video');

/**
 * render page
 */

exports.renderIndexPage = function(req, res, next) {
    Video.findWithSkip(null, null, function(err, docs) {
        res.locals.docs = docs;
        res.render('front/index/index');
    })

}
exports.renderEditPage = function(req, res, next) {
    // var id = '56d05f93058c3bfa2eff46f3';
    var id = req.params.id;

    Video.findByVideoId(id, function(err, doc) {
        if (err) {
            next(err);
            return;
        }
        res.locals.doc = doc;
        res.render('front/edit-video/edit-video');
    })
}
exports.renderUploadedPage = function(req, res, next) {
    Video.findByUserId(req.session.user._id, function(err, docs) {
        if (err) {
            next(err);
            return;
        }
        res.locals.docs = docs;
        res.render('front/uploaded/uploaded');
    })

}
exports.renderPlayPage = function(req, res, next) {
    var id = req.params.id;
    Video.findByVideoIdAndIncPlayCount(id, function(err, doc) {
        if (err) {
            next(err);
            return;
        }
        socket.createVideoNsp(doc._id);
        res.locals.doc = doc;
        res.render('front/play/play');
    })

}
exports.renderSearchPage = function(req, res, next) {
    var keyword = req.params.keyword;
    console.log(keyword)
    Video.findByKeyWord(keyword, function(err, docs) {

        if (err) {
            next(err)
            return
        }
        res.locals.docs = docs;
        res.render('front/search/search');
    })

}
exports.renderAddPage = function(req, res, next) {
    res.render('front/add-video/add-video');
}

/**
 * find
 */

exports.getLinks = function(req, res, next) {
    var id = req.params.id;
    Video.getLinksById(id, function(err, doc) {
        resSend.send(res, doc, err);
    })
}
exports.getComments = function(req, res, next) {
    var id = req.params.id;
    Video.getCommentsById(id, function(err, comments) {
        resSend.send(res, comments, err);
    })
};
exports.findByKeyWord = function(req, res, next) {
    var keyword = req.params.keyword;
    Video.findByKeyWord(keyword, function(err, docs) {
        res.send(docs)
    })
}
exports.findForPage = function(req, res, next) {
    var skip = req.params.skip;
    var limit = req.params.limit;
    Video.findWithSkip(skip, limit, function(err, docs) {
        resSend.send(res, docs, err);
    });
}

/**
 * add
 */
exports.add = function(req, res, next) {
    upload.addFile2ReqBody(req, 'video', 'url', 'videos', function(err) {
        if (err) {
            resSend.send(res, null, err);
            return;
        }

        //req.body的处理
        req.body.uploader = req.session.user._id;
        var video = new Video(req.body);
        video.checkAndInsert(function(err, doc) {
            resSend.send(res, '视频添加成功', err);
        });
    });
}

exports.addLink = function(req, res, next) {
    // req.body.id = '56d05f93058c3bfa2eff46f3';
    var id = req.params.id;
    Video.addLinkById(id, req.body, function(err, doc) {
        resSend.send(res, '视链添加成功', err);
    });
}
exports.addComment = function(req, res, next) {
    var videoId = req.params.id;
    req.body.userId = req.session.user._id;
    Video.addComment(videoId, req.body, function(err, comments) {
        if (!err)
            socket.sendMsg(comments)
        resSend.send(res, '评论添加成功', err);
    });

}

/**
 * update
 */

exports.editInfo = function(req, res, next) {
    // req.body.id = '56d05f93058c3bfa2eff46f3';
    var id = req.params.id;
    Video.updateInfoById(id, req.body, function(err, doc) {
        resSend.send(res, '视频信息修改成功', err);
    });
}
exports.editLink = function(req, res, next) {
    var videoId = req.params.videoId;
    Video.editLink(videoId, req.body, function(err) {
        resSend.send(res, '视链修改成功', err);
    })
}

/**
 * delete
 */

exports.delete = function(req, res, next) {
    var id = req.params.id;
    Video.removeById(id, function(err) {
        resSend.send(res, '视频删除成功', err);
    })
}


exports.delLink = function(req, res, next) {
    var videoId = req.params.videoId;
    var linkId = req.params.linkId;
    Video.delLink(videoId, linkId, function(err) {
        resSend.send(res, '视链删除成功', err);
    })
}
