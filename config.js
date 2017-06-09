//配置项都不能为空
var config = {
    // cookieSecert: 'club', //session会话的数据库名，一般不用修改
    dbName: 'vms', //数据库名
    dbHost: '127.0.0.1', //数据库地址
    // dest: 'public/简历', //简历上传位置的配置
    // size: 10 * 1024 * 1024, //单位为byte 10MB
    // port: 3002, //网站的端口(小于1024的端口需要特殊权限，系统问题)
    // admin: 'admin', //初始化的管理员名（建议登录后马上修改）
    // password: 'sysu' //初始化的管理员密码（同上）
    port: 3000,
    ACCESS_KEY: 'U2pemHNY8u61zftMAE8_QHGGo4SYN85DBknMXMbh',
    SECRET_KEY: 'O8GQ-kxtSabciOGDgA6VEJPYC00y5i7fuKfF43YK',
    // access_key: 'U2pemHNY8u61zftMAE8_QHGGo4SYN85DBknMXMbh',
    // secret_key: 'O8GQ-kxtSabciOGDgA6VEJPYC00y5i7fuKfF43YK',
    bucket: 'video-management-system'

}
module.exports = config;
