var carousel = require('./carousel/carousel');
var latestVideos = require('./latest-videos/latest-videos');
require('../../router')('#front-index', function($dom) {
    carousel.init($dom);
    latestVideos.init($dom);
})
