var carousel = {}
carousel.init = function($dom) {
    $dom.find('.carousel-inner .item:first').addClass('active');
}
module.exports = carousel;
