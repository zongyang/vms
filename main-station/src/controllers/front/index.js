exports.homepage = function(req, res, next) {
    res.render('front/index/index');
}
exports.search = function(req, res, next) {
    res.render('front/search/search');
}
exports.history = function(req, res, next) {
    res.render('front/history/history');
}
exports.mychanel = function(req, res, next) {
    res.render('front/mychanel/mychanel');
}

exports.lj = function(req, res, next) {
    res.render('front/lj/index');
}
exports.hdl = function(req, res, next) {
    res.render('front/lj/index', {
        hdl: true
    });
}
exports.test = function(req, res, next) {
    var json = [];
    for (var i = 1; i <= 10; i++) {
        json.push({
            id: i,
            x: 1 + 8 * i,
            y: 1 + 8 * i,
            duration: 4,
            time: i,
            title: 'title' + i,
            content: 'msg' + i
        })
    }

    res.send(json);
}
