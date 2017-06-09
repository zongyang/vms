var math = require('../../utils/math');
var store = require('./store');
/**
 * Link渲染到指定的video上
 * @Author zongyang
 * @Date   2016-01-09
 * @param  {string|object} video [选择器或者document]
 * @param  popoverClickEvent  提示的点击事件
 * @return null
 */
exports.render = function(video, popoverClickEvent) {
    var Link = createLinkCom();
    var Container = React.createClass({
        render: function() {
            var Links = this.state.links.map(function(link) {
                return (
                    <Link linkinfo={link} key={link.reactId}/>
                );
            });
            return (
                <div>
                    {Links}
                </div>
            );
        },
        getInitialState: function() {
            return {
                links: []
            }
        },
        componentDidMount: function() {
            store.addChangeEvent('time', function() {
                var links = store.get('links');
                var time = store.get('time');
                this.giveDataReactId(links);
                links = math.getRightTimeArr(time, links);
                this.setState({
                    links: links
                })
            }.bind(this));
        },
        //给数组中的数据添加一个id用于react渲染时的视图id  
        giveDataReactId: function(data) {
            data.forEach(function(el, index) {
                el['reactId'] = index;
            })
        }
    });

    var target = $('<div></div>').addClass('video-link');

    /*添加popover点击事件*/
    target.delegate('.popover', 'click', popoverClickEvent)

    /*渲染*/
    $(video).prepend(target);
    target = $(target)[0];
    ReactDOM.render(
        <Container />,
        target
    );
}

/**
 * 创建单个link
 * @Author zongyang
 * @Date   2016-01-09
 * @return ReactClass
 */


function createLinkCom() {
    return React.createClass({
        render: function() {
            return (
                <div  ref='link' style={this.style()}  className='absolute link swing animated'>
                    <i className="fa fa-plus fa-fw" data-toggle='popover' aria-hidden="true"></i>
                </div>
            );
        },
        style: function() {
            var container = $(this.refs['link']);
            return {
                left: this.props.linkinfo.x + '%',
                top: this.props.linkinfo.y + '%',
                marginLeft: (-container.width() / 2) + 'px',
                marginTop: (-container.height() / 2) + 'px'
            }
        },
        componentDidMount: function() {
            this.pover();
        },
        pover: function() {
            this.i = $(this.refs['link']).find('i');
            this.i.popover({
                html: true,
                title: this.props.linkinfo.title,
                content: this.props.linkinfo.content,
                placement: 'bottom'
            }).popover('show');
            this.uParse();
        },
        uParse: function() {
            // var $dom = $(this.refs['link']).find('.popover-content');
            // var htmlStr = $dom.text();
            // $dom.html(htmlStr);
            uParse('.popover-content');
        }

    });
}
