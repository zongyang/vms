var ffmpeg = require('fluent-ffmpeg')
var path = require('path');
var fs = require('fs');

process.on('message', function(data) {
    var proc = ffmpeg(data.src)
        .format('mp4')
        .on('err', function(err) {
            process.send({
                type: 'err',
                info: err
            });
            process.exit(1);
        })
        .on('end', function() {
            process.send({
                type: 'end',
                info: 'end'
            });
            process.exit(0);
        })
        .on('progress', function(data) {
            process.send({
                type: 'progress',
                info: data.percent.toFixed(2) + '%'
            });
        })
        .save(data.dest);
})
