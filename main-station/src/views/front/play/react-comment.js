var store = require('../../wigets/store');
exports.init = function($dom) {
    var target = $dom.find('.panel-body-comment')[0];
    var Comment = this.createReactComment();

    ReactDOM.render(
        <Comment/>,
        target
    );
}

exports.createReactComment = function() {
    var Comment = React.createClass({
        render: function() {
            var Comments = this.state.comments.map(function(comment) {
                return (
                    <li className='comment-item left clearfix' key={comment.reactId}>
    					<span className='pull-left'>
    						<img className='avator img-circle' src={comment.userId.avator} />
    					</span>
		    			<div className='comment-body clearfix'>
		    				<div className='row'>
		    					<div className='header'>
		    						<strong className='text-primary username'>{comment.userId.username}</strong>
		    						<small className='text-muted'>
		    							<i className='fa fa-clock-o fa-fw'></i>
		    							<span className='time'>{comment.time}</span>
		    						</small>
		    					</div>
		    					<span className='content'>{comment.content}</span>
		    				</div>
		    			</div>
		    		</li>
                )
            });
            return (
                <ul className='comment' ref='comment'>{Comments}</ul>
            );
        },
        getInitialState: function() {
            return {
                comments: []
            }
        },
        componentDidMount: function() {
            var rootScope = this;
            store.addChangeEvent('comments', function() {
                var comments = store.get('comments');
                rootScope.giveDataReactId(comments);
                rootScope.setState({
                    comments: comments
                });
            })
        },
        //给数组中的数据添加一个id用于react渲染时的视图id  
        giveDataReactId: function(data) {
            data.forEach(function(el, index) {
                el['reactId'] = index;
            })
        }
    });
    return Comment;
}
