var delay = 0.5; //一个link停留的时间等于delay*2

exports.toFixed = function(data) {
    data = new Number(data);
    return data.toFixed(2);
}

// is i in [j-gap,j+gap] 
// options:{left:0,right:0},is i in [j-gap-left,j+gap+right]
exports.isRound = function(i, j, gap, options) {
    var left = (options.left) ? options.left : 0;
    var right = (options.right) ? options.right : 0;
    gap = (gap) ? gap : 0;

    if (i >= j - gap - left && i <= j + gap + right)
        return true;
    return false;
}

// 获得arr数据里面时间为time的结果
exports.getRightTimeArr = function(time, arr) {

    time = this.toFixed(time);
    var result = arr.filter(function(item) {
        if (this.isRound(time, item.time, delay, {
                // right: item.duration
                right: 1
            }))
            return true;
        return false
    }.bind(this));
    return result;
}

// 获得arr数据里面时间为time的结果添加active标记
exports.setRightTimeArrWithActiveTag = function(time, arr) {
    time = this.toFixed(time);
    var result = arr.map(function(item) {
        if (this.isRound(time, item.time, delay, {
                // right: item.duration
                right: 1
            })) {
            item['active'] = true;
            return item;
        }
        delete item.active
        return item
    }.bind(this));
    return result;
}
