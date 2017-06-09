function getItems() {
    return {
        login: { route: '/login', name: '登录' },
        register: { route: '/register', name: '注册' },
        index: { route: '/', name: '首页' },
        search: { route: '/search', name: '发现' },
        play: { route: '/play', name: '播放' },
        info: { route: '/info', name: '个人资料' },
        history: { route: '/histroy', name: '观看记录' },
        password: { route: '/password', name: '密码修改' },
        uploaded: { route: '/uploaded', name: '我的频道' },
        'add-video': { route: '/add-video', name: '添加视频' },
        'edit-video': { route: '/edit-video', name: '编辑视频' }
    }
}

exports.append = function(req, res, next) {
    var items = getItems();
    var results = [];
    var routes = req.path.split('/');

    routes.shift();
    for (var i = 0; i < routes.length; i++) {
        if (items[routes[i]] == undefined)
            break;
        results.push(items[routes[i]]);
    }

    if (results.length > 0) {
        results[results.length - 1].active = true
        results.unshift(items['index']);
    }

    res.locals.breadcrumbs = results;
    next();
}
