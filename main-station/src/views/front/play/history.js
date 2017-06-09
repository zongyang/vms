var moment = require('../../../utils/moment');
var others = require('../../../utils/others');
var store = require('../../wigets/store');
var history = {}
history.init = function($dom, player) {
    this.player = player;
    this.submit();
    this.setPlayTimeByHistory();
}
history.submit = function() {
    window.onbeforeunload = function(event) {
        var videoId = others.getIdByHref();
        var time = store.get('time');
        var formatTime = moment.formatSconds2Hms(time);
        if (time == 0)
            return

        $.post('/api/history/' + videoId + '/' + formatTime);
    }.bind(this);
}
history.setPlayTimeByHistory = function() {
    var params = location.pathname.split('/');
    if (params.length != 4) {
        return
    }
    var time = moment.formatTime2Seconds(params[2])
    this.player.setCurrentTime(time);

}
module.exports = history;
