require('../../router')('#front-history', function($dom) {
    activeChange($dom);
})

// 点击右侧affix的active的样式变化
function activeChange($dom) {
    $dom.find('.history-index li').click(function() {
        $(this)
            .addClass('active')
            .siblings()
            .removeClass('active')
    })
}
