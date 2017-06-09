var store = require('../store');
var classnames = require('classnames');
var moment = require('../../../utils/moment');
var others = require('../../../utils/others');
var Modal = require('../modal');
var link = {};

link.init = function($dom, linkClickEvent) {
    this.storeInit();
    this.$timelineContainer = $dom.find('.timeline-container');
    this.renderToTimeline(linkClickEvent);
    this.getServerData();
}
link.addEditEvent = function(editCb) {
    this.editCb = editCb;
}
link.add = function() {
    var link = store.get('editingLink');
    var links = store.get('links');
    links.push(link);
    store.set('links', links);
}
link.renderToTimeline = function(linkClickEvent) {
    var rootScope = this;
    var Timeline = React.createClass({
        render: function() {
            var Links = this.state.links.map(function(link) {
                var cls = classnames({
                    'list-group-item': true,
                    'active': link.active
                });
                return (
                    <li className={cls} key={link.reactId}>
                            <strong className='list-group-item-heading text-info'>{link.formatedTime}</strong> 
                            <p className='list-group-item-text link-title'>{link.title}</p>
                            <div className='link-id hidden-1' data-id={link._id}></div> 
                    </li>
                )
            })
            return (
                <div className='mCustomScrollbar' ref='mCustomScrollbar'>
                    <div className='list-group'>{Links}</div>
                </div>
            )
        },
        getInitialState: function() {
            return {
                links: []
            }
        },
        componentDidMount: function() {
            var react = this;
            this.$mCustomScrollbar = $(this.refs['mCustomScrollbar']);
            store.addChangeEvent('links', function() {
                var links = store.get('links');
                links.sort(function(a, b) {
                    return a.time - b.time
                })
                store.set('links', links, false);


                react.giveDataReactId(links);
                react.setState({
                    links: links
                });
                react.scrollUpdate();
                react.contextMenuInit();
            });
            react.scrollInit();
        },
        //给数组中的数据添加一个id用于react渲染时的视图id  
        giveDataReactId: function(data) {
            data.forEach(function(el, index) {
                el['reactId'] = index;
            })
        },
        scrollInit: function() {
            this.$mCustomScrollbar
                .mCustomScrollbar({
                    theme: "dark",
                    scrollInertia: 0,
                    scrollButtons: {
                        enable: true
                    }
                })
                .delegate('.list-group-item', 'click', function() {
                    var id = $(this).find('.link-id').attr('data-id');
                    var time = findLinkById(id).link.time;
                    if (linkClickEvent)
                        linkClickEvent(time);
                })

        },
        scrollUpdate: function() {
            this.$mCustomScrollbar
                .mCustomScrollbar('update')
                .mCustomScrollbar('scrollTo', this.$mCustomScrollbar.find('.active'))
        },
        contextMenuInit: function() {
            if (!rootScope.editCb) //如果没有editCb，则说明是普通播放界面，无需右键菜单
                return

            if ($('.context-menu-root').length > 0) // 防止contextMenu dom节点增多
                return

            $.contextMenu({
                selector: '.list-group-item',
                items: {
                    edit: {
                        name: "编辑",
                        icon: 'edit',
                        callback: function() {
                            editEvent(this, rootScope.editCb)
                        }
                    },
                    delete: {
                        name: "删除",
                        icon: 'delete',
                        callback: function() {
                            delEvent(this)
                        }
                    }
                }
            })
        }
    });

    var target = this.$timelineContainer[0];
    ReactDOM.render(
        <Timeline/>,
        target
    );
}

link.storeInit = function() {
    //store init
    store.set('links', []);
    store.set('editingLink', {}); //编辑状态时的link
    store.addChangeEvent('editingLink', function() {
        var editingLink = store.get('editingLink');
        editingLink.formatedTime = moment.formatStr2Hmsms(editingLink.time);
        store.set('editingLink', editingLink, false);
    });

}
link.getServerData = function(cb) {
    var id = others.getIdByHref();
    $.get('/api/links/' + id, function(data) {
        if (!data.success) {
            Modal.alert(data.msg);
            return
        }
        store.set('links', formateLinksTime(data.msg));

        if (cb)
            cb()
    })
}

link.submit = function() {
    var videoId = others.getIdByHref();
    var editingLink = store.get('editingLink');
    //type
    var type = (editingLink.action == 'edit') ? 'put' : 'post';

    //url
    var url = '/api/video-link/' + videoId;
    if (editingLink.action == 'edit')
        url += '/' + editingLink._id;

    $.ajax({
        type: type,
        url: url,
        data: editingLink
    }).done(function(data) {
        if (data.success)
            link.getServerData(function() {
                Modal.alert(data.msg);
            });
        else
            Modal.alert(data.msg);
    })

}


function editEvent(dom, cb) {
    var links = store.get('links');
    var id = $(dom).find('.link-id').attr('data-id');

    //根据id查找对应的link
    var result = findLinkById(id)

    result.link.action = 'edit'; // editingLink的action=edit
    store.set('editingLink', result.link);

    if (cb)
        cb();
}


function delEvent(dom, cb) {
    var title = $(dom).find('.link-title').text();

    Modal.confirm('是否要删除 "' + title + ' "这条信息？', function() {
        var links = store.get('links');
        var id = $(dom).find('.link-id').attr('data-id');

        //根据id查找对应的link
        var result = findLinkById(id);

        //提交服务器
        var videoId = others.getIdByHref();

        $.ajax({
            type: 'delete',
            url: '/api/video-link/' + videoId + '/' + result.link._id,
            success: function(data) {
                Modal.alert(data.msg);
                if (!data.success)
                    return

                // 删除store links中对应的link
                var links = store.get('links');
                links.splice(result.i, 1);
                store.set('links', links);
            }
        });
    })
}

function formateLinksTime(links) {
    for (var i = 0; i < links.length; i++) {
        links[i].formatedTime = moment.formatStr2Hmsms(links[i].time);
    }
    return links;
}

function findLinkById(id) {
    var links = store.get('links');
    var result = { index: 0, link: {} };
    for (var i = 0; i < links.length; i++) {
        if (links[i]._id == id) {
            result.link = links[i];
            result.index = i;
            break;
        }
    }
    return result;
}

module.exports = link;
