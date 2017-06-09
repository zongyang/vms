var Modal = require('../modal');
var thumbPanel = {};
thumbPanel.init = function($dom) {
    this.$thumbPanel = $dom.find('.thumb-panel');
    this.delConfirm();
}

thumbPanel.delConfirm = function() {
    this.$thumbPanel.find('.btn-del').click(function() {
        var videoId = $(this).data('id');
        Modal.confirm('是否要删除该视频？', function() {
            $.ajax({
                type: 'delete',
                url: '/api/video/' + videoId
            }).done(function(data) {
                Modal.alert(data.msg)
                if (data.success)
                    location.reload();
            });
        })
    });
}


module.exports = thumbPanel;
