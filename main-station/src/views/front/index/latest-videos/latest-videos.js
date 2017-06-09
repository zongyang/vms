var store = require('../../../wigets/store');
var modal = require('../../../wigets/modal');
var others = require('../../../../utils/others');
var latest = {};

latest.init = function($dom) {
    this.target = $dom.find('.latest')[0];
    this.$more = $dom.find('.more');
    this.render();
    this.bindMoreEvents();
}

latest.render = function() {
    var rootScope = this;
    var Item = React.createClass({
        render: function() {
            var Items = this.state.videos.map(function(video, index) {
                var Com;
                if (index % 2 == 0)
                    Com = createReactImageLeft();
                else
                    Com = createReactImageRight();
                return (
                    <div className='container item' key={video.reactId}>
                        <Com video={video}/>
                    </div>
                )
            });
            return (
                <div>{Items}</div>
            )
        },
        componentDidMount: function() {
            store.set('indexVideos', { skip: 0, limit: others.videoLimit, videos: [] });
            store.addChangeEvent('indexVideos', function() {
                var videos = store.get('indexVideos').videos;
                this.giveDataReactId(videos);
                this.setState({
                    videos: videos
                })
            }.bind(this));
            rootScope.getServerData();
        },
        getInitialState: function() {
            return {
                videos: []
            }
        },
        giveDataReactId: function(data) {
            data.forEach(function(el, index) {
                el['reactId'] = index;
            })
        }
    });

    ReactDOM.render(
        <Item />,
        rootScope.target
    );
}
latest.getServerData = function() {
    var indexVideos = store.get('indexVideos');
    var skip = indexVideos.skip;
    var limit = indexVideos.limit;
    var videos = indexVideos.videos;
    $.get('/api/search/' + skip + '/' + limit, function(data) {
        if (!data.success) {
            modal.alert(data.msg);
            return
        }

        indexVideos.skip += data.msg.length;
        indexVideos.videos = indexVideos.videos.concat(data.msg);
        store.set('indexVideos', indexVideos);
    })

}
latest.bindMoreEvents = function() {
    this.$more.click(this.getServerData);
}

function createReactImageLeft() {
    var ReactImage = createReactImage();
    var ReactText = createReactText();
    return React.createClass({
        render: function() {
            return (
                <div className='row'>
                    <ReactImage video={this.props.video}/>
                    <ReactText video={this.props.video}/>
                </div>
            )
        }
    })
}

function createReactImageRight() {
    var ReactImage = createReactImage();
    var ReactText = createReactText();
    return React.createClass({
        render: function() {
            return (
                <div className='row'>
                    <ReactText video={this.props.video}/>
                    <ReactImage video={this.props.video}/>
                </div>
            )
        }
    })
}

function createReactImage() {
    return React.createClass({
        render: function() {
            return (
                <div className='col-md-5 image'>
                     <img className='img-responsive' src={this.props.video.thumbnail}/>
                </div>
            )
        }
    });
}

function createReactText() {
    return React.createClass({
        render: function() {
            return (
                <div className='col-md-7 text'>
                    <h2 className='text-primary'>{this.props.video.videoName}</h2>
                    <p>
                        <span className='text-muted'>{this.props.video.localUploadTime}上传</span>
                        <span className='text-muted'>{this.props.video.commentsCount}次点评</span>
                        <span className='text-muted'>{this.props.video.playCount}次播放</span>
                    </p>
                    <p className='lead break-all video-info'>{this.props.video.videoInfo}</p>
                    <a className='btn btn-primary btn-sm' href={'/play/'+this.props.video._id}>点击播放</a>
                </div>
            )
        }
    });
}

module.exports = latest;
