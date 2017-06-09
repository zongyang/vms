var mongoose = require('mongoose');
var config = require('../../../config');
var colors = require('colors')


exports.connect = function() {
    var url = 'mongodb://' + config.dbHost + '/' + config.dbName;
    mongoose.connect(url);

    var db = mongoose.connection;
    db.on('err', console.error.bind(console, 'connection error :'))
    db.once('open', function() {
        console.log(colors.green('mongodb connected.'));
    })
}
