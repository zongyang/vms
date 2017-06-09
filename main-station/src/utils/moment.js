var moment = require('moment');

moment.locale('zh-cn');

/**
 * 添加带时间间隔的信息：1分钟内
 * @Author zongyang
 * @Date   2016-01-23
 * @param  time: string|Date
 * @return string
 */
exports.getTimeWithDiff = function(time) {
    var formatReg = 'll HH:mm:ss';
    var now = moment();
    var time = moment(new Date(time));
    var diff = now.diff(time, 'hours')
    if (Math.abs(diff) > 1)
        return time.format(formatReg);
    return now.to(time);
}

/**
 * 将秒数转换成 HH:mm:ss的格式
 * @Author zongyang
 * @Date   2016-01-23
 * @param  seconds: Number
 */
exports.formatSconds2Hms = function(seconds) {
    seconds = parseFloat(seconds);
    var duration = moment.duration(seconds, 'seconds');
    var hour = duration.hours();
    var minute = duration.minutes();
    var seconds = duration.seconds();

    return moment({
        h: hour,
        m: minute,
        s: seconds
    }).format('HH:mm:ss');
}

exports.formatTime2Seconds = function(str) {
    var duration = moment.duration(str);
    var seconds = duration.seconds();
    return seconds;
}

/**
 * 将秒数转换成 HH:mm:ss.msms的格式
 * @Author zongyang
 * @Date   2016-02-29
 * @param  seconds: Number
 */
exports.formatStr2Hmsms = function(str) {
    str = parseFloat(str);
    var duration = moment.duration(str, 'seconds');
    var hour = duration.hours();
    var minute = duration.minutes();
    var seconds = duration.seconds();
    var milliseconds = duration.milliseconds();

    return moment({
        h: hour,
        m: minute,
        s: seconds,
        ms: milliseconds,
    }).format('HH:mm:ss.SSS');
}
