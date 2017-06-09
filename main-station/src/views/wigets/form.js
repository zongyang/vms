var validator = require('../../utils/validator');
var limits = require('../../utils/upload-limits');
var Modal = require('./modal');
module.exports = function() {
    return {
        /**
         * 表单初始化
         * @Author zongyang
         * @Date   2016-01-14
         * @param  页面根元素
         * @param  按下提交动作时的回调
         * @param  服务器返回结果后的回调
         * @param  上传进度回调
         */
        init: function($dom, onSubmitCb, afterSubmitCb, progressCb) {
            //回调函数
            this.progressCb = progressCb;
            this.onSubmitCb = onSubmitCb;
            this.afterSubmitCb = afterSubmitCb;
            //form
            this.$form = $dom.find('form');
            //所有输入框
            this.$inputs = $dom
                .find('input,select,textarea')
                .not('[type=submit]')
                .not('[type=file]')
                .keyup(function() {
                    this.generateSubmitData();
                    this.changeStyleByData(this.generateResultData());
                }.bind(this));

            //文件输入框
            this.$fileInput = $dom.find('input[type=file]');
            this.addFileInputOnChangeEvent();

            //提交按钮
            this.$submit = $dom.find('.submit').click(function(event) {
                event.preventDefault();

                // if (!this.url)
                //     this.url = this.$form.attr('action') || '';

                this.generateSubmitData(true);
                this.changeStyleByData(this.generateResultData());
                this.setSubmitDataToFormData();
                this.submit();
            }.bind(this));

            this.url = '';
        },
        setSubmitUrl: function(url) {
            this.url = url;
        },
        setSubmitType: function(type) {
            this.type = type;
        },
        getSubmitUrl: function() {
            return this.url || this.$form.attr('action');
        },
        getSubmitType: function() {
            return this.type || 'post';
        },
        generateSubmitData: function(flag) {
            this.submitData = {};
            this.$inputs.each(function(index, el) {
                if ($(el).val() !== '' || flag)
                    this.submitData[$(el).attr('name')] = $(el).val();
            }.bind(this));
            return this.submitData;
        },
        generateResultData: function() {
            this.resultData = validator.check(this.submitData);
            return this.resultData;
        },
        changeStyleByData: function(resultData) {
            //先将有值的input设置为成功的样式，在根据resultData，添加错误样式
            this.styleInit();
            for (var key in resultData) {
                var $input = this.$inputs.filter('[name=' + key + ']');

                this.addErrStyle($input, resultData[key]);
            }
        },
        clearInputsVal: function() {
            this.$inputs.each(function(index, el) {
                $(el).val('')
            });
            this.styleInit();
        },
        styleInit: function() {
            this.addInitStyle(this.$inputs);
            this.addSuccessStyle(this.$inputs);
        },
        addErrStyle: function($dom, err) {
            $dom.parents('.form-group').removeClass('has-success').addClass('has-error');
            $dom.siblings('i').removeClass('fa-check').addClass('fa-times');
            $dom.siblings('.help-block').text(err);
        },
        addSuccessStyle: function($dom) {
            $dom = $dom.filter(function() {
                if ($(this).val() === '')
                    return false;
                return true;
            })
            $dom.parents('.form-group').removeClass('has-error').addClass('has-success');
            $dom.siblings('i').removeClass('fa-times').addClass('fa-check');
            $dom.siblings('.help-block').text('');
        },
        addInitStyle: function($dom) {
            $dom.parents('.form-group').removeClass('has-error').removeClass('has-success');
            $dom.siblings('i').removeClass('fa-times').removeClass('fa-check');
            $dom.siblings('.help-block').text('');
        },
        formIsAvalible: function() {
            //非文件字段的检查
            if (Object.keys(this.resultData).length > 0) {
                return false
            }

            //是否有选择文件
            if (this.$fileInput.length > 0 && validator.isEmpty(this.$fileInput.data('file-path'))) {
                Modal.alert('请选择文件');
                return false;
            }

            //文件的大小格式是否满足要求
            if (!this.checkFileLimits())
                return false;

            return true;
        },
        checkFileLimits: function() {
            //如果input的值为空则说明没有，无需处理
            if (validator.isEmpty(this.$fileInput.val()))
                return true;

            var type = this.$fileInput.data('file-type');
            var file = this.$fileInput[0].files[0];

            if (limits[type].mimes.indexOf(file.type) == -1) {
                Modal.alert(limits[type].mimesInfo);
                this.$fileInput.val('');
                return false;
            }
            if (limits[type].size < file.size) {
                Modal.alert(limits[type].sizeInfo);
                this.$fileInput.val('');
                return false;
            }

            return true;

        },
        addFileInputOnChangeEvent: function() { //给file input 添加change事件，处理data-file-path属性;
            this.$fileInput.change(function(event) {
                if (!this.checkFileLimits())
                    event.stopImmediatePropagation();

                this.$fileInput.data('file-path', this.$fileInput.val());
            }.bind(this));
        },
        setSubmitDataToFormData: function() {
            if (!this.isFormDataSubmit())
                return;

            var fd = new FormData();
            var file = this.$fileInput[0].files[0];
            for (var key in this.submitData)
                fd.append(key, this.submitData[key])
            fd.append(this.$fileInput.attr('name'), file);
            this.submitData = fd;
        },
        isFormDataSubmit: function() { //判断是否是formDate的提交
            //如果是没有文件框，则不做formData处理    
            if (this.$fileInput.length <= 0)
                return false;

            //如果图片没有修改，则不做formData处理
            if (this.$fileInput[0].files.length == 0 && !validator.isEmpty(this.$fileInput.data('file-path')))
                return false;

            return true;
        },
        submit: function() {
            var rootScope = this;
            if (!this.formIsAvalible())
                return;
            //按钮样式变化
            this.$submit.attr('disabled', 'disabled').find('i').addClass('inline')
            var self = this;

            //formdata的处理
            var processData = true;
            var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
            if (this.isFormDataSubmit()) {
                processData = false;
                contentType = false;
            }

            //按下提交动作时的回调
            if (this.onSubmitCb)
                this.onSubmitCb();

            //ajax 提交
            $.ajax({
                type: rootScope.getSubmitType(),
                url: rootScope.getSubmitUrl(),
                data: this.submitData,
                processData: processData,
                contentType: contentType,
                xhr: function() {
                    var xhr = $.ajaxSettings.xhr();
                    xhr.upload.onprogress = function(event) {
                        if (!self.progressCb)
                            return;
                        var perenct = ((event.loaded / event.total) * 100).toFixed(0)
                        self.progressCb(perenct);

                    }
                    return xhr;
                }
            }).done(function(data) {
                if (!data.success)
                    this.changeStyleByData(data.msg);
                if (this.afterSubmitCb)
                    this.afterSubmitCb(data)

                this.$submit.removeAttr('disabled').find('i').removeClass('inline')
            }.bind(this));
        }
    }

}
