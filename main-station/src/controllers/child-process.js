var fork = require('child_process').fork;
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
//todo 进程管理，数量内存等的管理，避免消耗太多
//先从数量考虑
/**
 * 创建带事件的子进程
 * @Author zongyang
 * @Date   2015-12-18
 * @param  {[string]}   filePath    [路径]
 * @param  {[object]}   child_argus [自定义子进程参数]
 */
function ChildProcess(filePath, child_argus) {
    if (!(this instanceof ChildProcess)) {
        return new ChildProcess(filePath, child_argus);
    }

    var _self = this;

    var _process = fork(filePath);
    _process.on('message', function(data) {
        switch (data.type) {
            case 'err': // 子进程自定义错误
                _self.emit('err', data.err)
                break;
            case 'end': // 子进程完成任务，关闭
                _self.emit('end', data.info)
                break;
            case 'progress': // 子进程完成进度
                _self.emit('progress', data.info);
                break;
            default:
                _self.emit('err', 'illegal child process event type!');
        };
    });
    // 无法创建、关闭子进程等异常
    _process.on('err', function(err) {
        _self.emit('err', err)
    })

    // 发送参数
    _process.send(child_argus);
}

util.inherits(ChildProcess, EventEmitter)

/**
 * 启动ffmpeg和qiniu
 * @Author zongyang
 * @Date   2015-12-18
 * @param  {Object}   options:{src:''}
 */
exports.start = function(options) {
    options = {}
    options.src = path.join(process.cwd(), 'public', 'videos', '2.mkv');
    var ffmpeg = path.join(process.cwd(), 'ffmpeg', 'index.js');
    var qiniu = path.join(process.cwd(), 'qiniu', 'index.js');
    var dest = options.src.replace(/\.\w+$/, '.mp4');

    // 启动ffmpeg
    ChildProcess(ffmpeg, {
            src: options.src,
            dest: dest
        }).on('progress', function(data) {
            console.log(data)
        })
        .on('err', function(err) {
            console.log(err);
        })
        .on('end', function(data) {
            console.log(data);
            _startQiniu();
        })

    // 启动qiniu
    function _startQiniu() {
        console.log('qiniu start')
        ChildProcess(qiniu, {
            path: dest
        }).on('err', function(err) {
            console.log(err)
        }).on('end', function(data) {
            console.log(data);
        })
    }

}
exports.startFfmpeg = function() {}

exports.startQiniu = function() {}
