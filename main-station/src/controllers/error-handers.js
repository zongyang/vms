var resSend = require('./res-send');
// development error handler
// will print stacktrace
exports.env = function(err, req, res, next) {
    res.status(err.status || 500)
        // .format({
        //     html: function() {
        //         res.render('error/error', {
        //             message: err.message,
        //             error: err
        //         });
        //     },
        //     json: function() {
        //         res.send({
        //             message: err.message,
        //             error: err
        //         });
        //     },
        //     text: function() {
        //         res.send(err.message)
        //     }
        // })

    resSend.sendByReqType(req, res, err);


}

// production error handler
// no stacktraces leaked to user
exports.production = function(err, req, res, next) {
    res.status(err.status || 500)
        // .format({
        //     html: function() {
        //         res.render('error/error', {
        //             message: err.message,
        //             error: {}
        //         });
        //     },
        //     json: function() {
        //         res.send({
        //             message: err.message,
        //             error: {}
        //         });
        //     },
        //     text: function() {
        //         res.send(err.message)
        //     }
        // })
    err = { msg: err.message }
    resSend.sendByReqType(req, res, err);
}



// catch 404 and forward to error handler
exports.notfound = function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}
