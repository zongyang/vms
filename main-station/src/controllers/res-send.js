exports.send = function(res, msg, err, cb) {
    if (err)
        res.send({
            success: false,
            msg: err
        });
    else {
        if (cb)
            cb();
        res.send({
            success: true,
            msg: msg
        });
    }
}

/**
 * 根据req accpet 字段 发送不同的res 类型
 */
exports.sendByReqType = function(req, res, err) {
    var accepts = req.headers['accept'].split(',');

    if (req.xhr || accepts.indexOf('application/json') != -1) {
        res.send({
            msg: err.message,
            error: err
        });
        return
    }

    if (accepts.indexOf('text/plain') != -1) {
        res.send(err.message)
        return
    }
    res.render('error/error', {
        msg: err.message,
        error: err
    });
}
