var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ueditor = require('./controllers/ueditor');
var config = require('../../config');
var routes = require('./controllers/router');
var errorHanders = require('./controllers/error-handers');
var db = require('./models/connect-db');
var socket = require('./controllers/socket');
// var ueditor = require("ueditor");
var app = express();

//create server 
var server = http.createServer(app);

//init socket
socket.init(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, 'views')));

// session
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false,
    resave: false
}));



app.use('/ueditor/ue', ueditor)

app.use('/', routes);

// catch 404 and forward to error handler
app.use(errorHanders.notfound);

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(errorHanders.env);
}

// production error handler
// no stacktraces leaked to user
app.use(errorHanders.production);

//bind port and connect db
app.start = function() {
    server.listen(config.port);
    db.connect();
}
module.exports = app;
