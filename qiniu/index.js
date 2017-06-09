var path = require('path');
var fs = require('fs');
var config = require('../config');
var qn = require('qn');

process.on('message', function(data) {
    var filename = (data.name) || path.basename(data.path);

    var client = qn.create({
        accessKey: config.ACCESS_KEY,
        secretKey: config.SECRET_KEY,
        bucket: config.bucket
    })
    var readStream = fs.createReadStream(data.path);

    client.upload(readStream, {
        key: filename
    }, function(err, ret) {
        if (err) {
            // 上传失败， 处理返回代码
            console.log('上传失败', err);
            process.send({
                type: 'err',
                info: err
            });
            process.exit(1);
            return;
        }
        // 上传成功， 处理返回值
        console.log('上传成功', ret.key, ret.hash);
        process.send({
            type: 'end',
            info: ret
        });
        process.exit(0);

    })
});
