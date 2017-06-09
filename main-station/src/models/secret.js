var crypto = require('crypto');
exports.encrypt = function(data) {
    var md5 = crypto.createHash('md5');
    return md5.update(data).digest('hex');
}
