var modal = {};
modal.getTarget = function() {
    var $newDom = $('<div></div>').addClass('.reactjs-render-modal')
    $('body').append($newDom);
    return $newDom[0];
}

modal.loading = function(event) {
    var target = this.getTarget();
    var Modal = React.createClass({
        render: function() {
            return (
                <div className='modal fade loading' ref='modal' role='dialog' data-keyboard='false'>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-body text-center'>
                                <i className='fa fa-spinner fa-pulse fa-3x'></i>
                                <p className='text-info loding-text'>已完成{this.state.progress}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        getInitialState: function() {
            return {
                progress: 0
            }
        },
        componentDidMount: function() {
            this.$modal = $(this.refs['modal']).modal('show');
            event.on('progress', function(progress) {
                this.setState({
                    progress: progress
                })
                if (this.state.progress == 100)
                    this.close();
            }.bind(this));
        },
        close: function() {
            this.$modal.modal('hide');
        }

    });

    ReactDOM.render(
        <Modal />,
        target
    );
}

modal.progressbar = function(event) {
    var target = this.getTarget();
    var Modal = React.createClass({
        render: function() {
            return (
                <div className='modal fade progressbar' ref='modal' role='dialog' data-keyboard='false'>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-body text-center'>
                                <div className='progress progress-striped active'>
                                    <div className='progress-bar progress-bar-info' role='progressbar' style={this.getStyle()}>
                                        <strong>已经完成{this.state.progress}%</strong>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
            )
        },
        getInitialState: function() {
            return {
                progress: 0
            }
        },
        componentDidMount: function() {
            this.$modal = $(this.refs['modal']).modal('show');
            event.on('progress', function(progress) {
                this.setState({
                    progress: progress
                })
                if (this.state.progress == 100)
                    this.close();
            }.bind(this));
        },
        close: function() {
            this.$modal.modal('hide');
        },
        getStyle: function() {
            return {
                width: this.state.progress + '%'
            }
        }

    });

    ReactDOM.render(
        <Modal />,
        target
    );
}

modal.alert = function(content, onHidden) {
    var target = this.getTarget();
    var Modal = React.createClass({
        render: function() {
            return (
                <div className='modal fade alert' ref='modal' role='dialog' data-keyboard='false'>
                    <div className='modal-dialog'>
                        <div className='alert alert-info alert-dismissable'>
                            <button className='close'>
                                <i className='fa fa-times'></i> 
                            </button>
                            <p className='text-center alert-text'>{content}</p>
                        </div>
                    </div>
                </div>
            )
        },
        componentDidMount: function() {
            var rootScope = this;
            this.$modal = $(this.refs['modal']).modal('show');
            this.$modal.find('.close').click(function() {
                rootScope.close();
            });
            this.$modal
                .on('shown.bs.modal', function() {
                    setTimeout(function() {
                        rootScope.close();
                    }, 2000)
                })
                .on('hidden.bs.modal', function() {
                    if (onHidden)
                        onHidden()
                })

        },
        close: function() {
            this.$modal.modal('hide');
        }

    });

    ReactDOM.render(
        <Modal />,
        target
    );
}


modal.confirm = function(content, cb) {
    var target = this.getTarget();
    var Modal = React.createClass({
        render: function() {
            return (
                <div className='modal fade confirm' ref='modal' role='dialog' data-keyboard='false'>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <button className='close'>
                                    <i className='fa fa-times'></i> 
                                </button>
                                <h4 className='modal-title'>提示</h4>
                            </div>
                            <div className='modal-body'>{content}</div>
                            <div className='modal-footer'>
                                <button className='btn btn-primary ok'>确定</button>
                                <button className='btn btn-default cancle'>取消</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        componentDidMount: function() {
            this.$modal = $(this.refs['modal']).modal('show');
            this.$modal.find('.close,.cancle').click(function() {
                this.close();
            }.bind(this));
            this.$modal.find('.ok').click(function() {
                this.close();

                if (cb)
                    cb()
            }.bind(this));
        },
        close: function() {
            this.$modal.modal('hide');
        }

    });

    ReactDOM.render(
        <Modal />,
        target
    );
}

module.exports = modal;
