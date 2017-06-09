/**
 * 处理方法前缀
 * @Author zongyang
 * @Date   2016-01-07
 * @return {[type]}   [description]
 */
var fullScreen = {};

fullScreen.runPrefixMethod = function(element, method) {
    var usablePrefixMethod;
    ["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
        if (usablePrefixMethod) return;
        if (prefix === "") {
            // 无前缀，方法首字母小写
            method = method.slice(0, 1).toLowerCase() + method.slice(1);

        }
        var typePrefixMethod = typeof element[prefix + method];
        if (typePrefixMethod + "" !== "undefined") {
            if (typePrefixMethod === "function") {
                usablePrefixMethod = element[prefix + method]();
            } else {
                usablePrefixMethod = element[prefix + method];
            }
        }
    });
    return usablePrefixMethod;
}

fullScreen.toggleFullScreen = function(element) {

    if (this.runPrefixMethod(document, 'FullScreen') || this.runPrefixMethod(document, 'IsFullScreen'))
        this.runPrefixMethod(document, 'CancelFullScreen')
    else
        this.runPrefixMethod(element, 'RequestFullScreen')
}
module.exports = fullScreen;
