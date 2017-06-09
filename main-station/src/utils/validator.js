var validator = {
    username: {
        status: false,
        val: null,
        err: '用户名6~12位,数字、字母、中文'
    },
    password: {
        status: false,
        val: null,
        err: '密码6~12位,数字、字母'
    },
    repeatPassword: {
        status: false,
        val: null,
        err: '两次密码输入不一致'
    },
    oldPassword: {
        status: false,
        val: null,
        err: '原密码不正确'
    },
    // tag: {
    //     status: false,
    //     val: null,
    //     err: '视频标签不能为空或有空字符'
    // },
    videoInfo: {
        status: false,
        val: null,
        err: '视频简介不能为空'
    },
    videoName: {
        status: false,
        val: null,
        err: '视频名称,长度大于3的数字、字母、中文'
    },
    usernameCheck: function() {
        this.username.status = /^[\u4E00-\u9FA5A-Za-z0-9_]{6,12}$/.test(this.username.val);
    },
    passwordCheck: function() {
        this.password.status = /^[\d\w]{6,12}$/.test(this.password.val);
    },
    repeatPasswordCheck: function() {
        this.repeatPassword.status = (this.password.val === this.repeatPassword.val) && this.password.status;
    },
    oldPasswordCheck: function() {
        this.oldPassword.status = /^[\d\w]{6,12}$/.test(this.oldPassword.val);
    },
    tagCheck: function() {
        this.tag.status = !this.isEmpty(this.tag.val);
    },
    videoInfoCheck: function() {
        this.videoInfo.status = !this.isEmpty(this.videoInfo.val);
    },
    videoNameCheck: function() {
        this.videoName.status = /^[\u4E00-\u9FA5A-Za-z0-9_]{3,}$/.test(this.videoName.val);
    },
    init: function(data) {
        for (var key in this) {
            if (this[key].status === undefined)
                continue;
            this[key].status = false;
            this[key].val = null;
        }
    },
    check: function(data) {
        this.init();
        var result = {};
        for (var key in data) {
            if (this[key] === undefined) //排除不需要验证的属性
                continue;

            if (this[key].status === undefined) //排除this的function类型的属性
                continue;

            this[key].val = data[key];
            this[key + 'Check']();
            if (!this[key].status) {
                result[key] = this[key].err
            }
        }
        return result;
    },
    isEmpty: function() {
        var args = Array.prototype.slice.call(arguments);
        var result;
        for (var i = 0; i < args.length; i++) {
            if (args[i] === null || args[i] === undefined || args[i] === '')
                return true
            if (/^\s*$/g.test(args[i]))
                return true
        }
        return false
    },
    hasSpace: function() {
        var args = Array.prototype.slice.call(arguments);
        var result;
        for (var i = 0; i < args.length; i++) {
            if (/\s/g.test(args[i]))
                return true;
        }
        return false;
    },
    isIncludeSpecial: function(s) {
        // 去掉转义字符
        s = s.replace(/[\'\"\\\/\b\f\n\r\t\s]/g, '');
        // 去掉特殊字符
        s = s.replace(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]]/g, '');
        return s;
    }

}
module.exports = validator;
