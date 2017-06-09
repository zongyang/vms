var validator = require('../../../utils/validator');
var store = require('../store');
var modal = require('../modal');

var editor = {};

editor.init = function($dom, submitCb, cancleCb) {
    this.$container = $dom.find('.edit-container');
    this.ue = UE.getEditor('edit-video-ue-container');
    this.$linkTitleInput = this.$container.find('.link-title-input');
    this.$submit = this.$container.find('.submit');
    this.$cancle = this.$container.find('.cancle');
    this.btnBindEvent(submitCb, cancleCb);
}
editor.setTitle = function() {
    var link = store.get('editingLink');
    this.$container.find('.time').text(link.formatedTime);
    this.$container.find('.x').text(link.x);
    this.$container.find('.y').text(link.y);
}
editor.setAll = function() {
    var link = store.get('editingLink');
    this.$linkTitleInput.val(link.title);
    this.ue.setContent(link.content);
    this.setTitle();
}
editor.check = function() {
    var link = store.get('editingLink');

    if (validator.isEmpty(link.title)) {
        modal.alert('标题不能为空或有空字符');
        return false;
    }

    if (link.content == '') {
        modal.alert('内容不能为空');
        return false;
    }
    return true;
}
editor.setEditingLink = function() {
    var link = store.get('editingLink');
    link.title = this.$linkTitleInput.val();
    link.content = this.ue.getContent();
    store.set('editingLink', link);
}
editor.initInputs = function() {
    this.ue.setContent('');
    this.$linkTitleInput.val('');
}
editor.hide = function() {
    this.$container.fadeOut('slow');
}
editor.show = function() {
    this.$container.fadeIn('slow');
}

editor.btnBindEvent = function(submitCb, cancleCb) {
    this.$submit.click(function() {
        this.setEditingLink();

        if (!this.check())
            return
        if (submitCb)
            submitCb()

        this.hide();
        this.initInputs();
    }.bind(this))

    this.$cancle.click(function() {
        if (cancleCb)
            cancleCb()
        this.initInputs();
        this.hide();
    }.bind(this))
}


module.exports = editor;
