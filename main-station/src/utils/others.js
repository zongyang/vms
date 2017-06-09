exports.getIdByHref = function() {
    return location.href.substr(location.href.lastIndexOf('/') + 1);
}
exports.videoLimit = 3;
