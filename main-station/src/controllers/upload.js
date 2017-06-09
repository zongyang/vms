var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var contentType = require('content-type');
var formidable = require('formidable');
var limits = require('../utils/upload-limits');

// 删除文件
exports.delete = function(path, cb) {
    fs.rmdir(path, function(err) {
        if (cb)
            cb(err)
    });
}

//绝对地址->url
exports.absoluteAddress2Url = function(pathname) {
    var prefix = path.join(process.cwd(), 'public');
    return pathname.replace(prefix, '');
}

exports.limitsCheck = function(type, file) {
    var mimeType = file.type;
    var size = file.size;
    var path = file.path;
    //判断mime
    if (limits[type].mimes.indexOf(mimeType) == -1) {
        this.delete(path);
        return limits[type].mimesInfo;
    }

    //判断大小
    if (limits[type].size < size) {
        this.delete(path);
        return limits[type].sizeInfo;
    }
}
exports.isFormDataReq = function(req) {
    return contentType.parse(req.header('Content-Type')).type == 'multipart/form-data';
}

/**
 * 给req.body添加上传文件的web路径
 * @Author zongyang
 * @Date   2016-01-20
 * @param  req
 * @param  type :img|video
 * @param  fileFieldName :在req.body上key的名字
 * @param  savePath: 保存路径
 * @param  cb(err)
 */
exports.addFile2ReqBody = function(req, type, fileFieldName, savePath, cb) {
    //判断大小
    if (req.header('Content-Length') > limits[type].size) {
        cb({
            fileFieldName: limits[type].sizeInfo
        })
        return
    }
    //判断content-type类型
    if (!this.isFormDataReq(req)) {
        cb();
        return;
    }
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'public', savePath);
    form.keepExtensions = true;

    form.on('field', function(name, value) {
        req.body[name] = value;
    })

    form.parse(req, function(err, fields, files) {
        var file = files[fileFieldName];

        //绝对地址->url
        req.body[fileFieldName] = this.absoluteAddress2Url(file.path);
        //上传文件类型、大小的检测
        var result = this.limitsCheck(type, file);
        if (result)
            result = {
                fileFieldName: result
            };
        //video 生成缩略图
        if (type !== 'video') {
            cb(result);
            return
        }

        this.generateThumbnail(req, file.path, cb)
    }.bind(this));


}


exports.generateThumbnail = function(req, pathname, cb) {
    var dest = path.join(process.cwd(), 'public', 'thumbnails');
    var filename = path.basename(pathname, '.mp4') + '.png';
    ffmpeg(pathname)
        .on('end', function() {
            req.body.thumbnail = path.join('/thumbnails', filename);
            cb();
        })
        .screenshots({
            timestamps: ['50%'],
            folder: dest,
            filename: filename
        })
        .ffprobe(function(err, data) {
            req.body.duration = data.format.duration;
        });
}
