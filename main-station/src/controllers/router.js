var express = require('express');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var index = require('./front/index');
var user = require('./front/user');
var video = require('./front/video');
var auth = require('./auth');
var breadcrumb = require('./breadcrumb');
var router = express.Router();


router.all('/*', breadcrumb.append, function(req, res, next) {
    res.locals.user = req.session.user;
    next()
});

//test
// router.get('/', index.homepage);
// router.get('/search', index.search);
// router.get('/history', index.history);
// router.get('/mychanel', index.mychanel);

router.get('/lj', index.lj);
router.get('/hdl', index.hdl);
router.get('/test', index.test);


//不需要登录
//user
router.get('/login', user.renderLoginPage);
router.get('/register', user.renderRegisterPage);
router.post('/login', user.login);
router.post('/register', user.register);

//video
router.get('/', video.renderIndexPage);
router.get('/search', video.renderSearchPage);
router.get('/search/:keyword', video.renderSearchPage);
router.get('/play/:id', video.renderPlayPage);
router.get('/play/:time/:id', video.renderPlayPage);
router.get('/api/links/:id', video.getLinks);
router.get('/api/comments/:id', video.getComments);
router.get('/api/search/:keyword', video.findByKeyWord);
router.get('/api/search/:skip/:limit', video.findForPage);

//需要登录

router.all('/*', auth.isLogin)

//user
router.get('/info', user.renderInfoPage);
router.get('/history', user.renderHistoryPage);
router.get('/password', user.renderPasswordPage);

router.put('/api/info', user.editInfo);
router.put('/api/password', user.editPassword);
router.post('/api/history/:id/:time', user.addHistory)
router.post('/logout', user.logout);

//video
router.get('/uploaded', video.renderUploadedPage);
router.get('/add-video', video.renderAddPage);
router.get('/edit-video/:id', video.renderEditPage);
router.post('/video', video.add);
router.post('/api/video-link/:id', video.addLink);
router.post('/api/video-comment/:id', video.addComment);
router.put('/api/video-info/:id', video.editInfo);
router.put('/api/video-link/:videoId/:linkId', video.editLink);
router.delete('/api/video/:id', video.delete);
router.delete('/api/video-link/:videoId/:linkId', video.delLink);

module.exports = router;
