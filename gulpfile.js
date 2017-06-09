var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserify = require('browserify');
var debowerify = require('debowerify')
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var glob = require('glob');
var reactify = require('reactify');
var runSequence = require('run-sequence').use(gulp);
var del = require('del');
var bourbon = require('node-bourbon');
var colors = require('colors')



//client-js
gulp.task('client-js', function(cb) {
    glob(
        '{main-station/src/views/**/*.js,main-station/src/utils/**/*.js}',
        function(err, files) {
            browserify(files)
                .transform(reactify)
                .transform(debowerify)
                .bundle()
                .on('error', function(err) {
                    console.log(colors.red(err.message));
                    this.emit('end');
                })
                .pipe(plugins.plumber())
                .pipe(source('client.js'))
                .pipe(buffer())
                .pipe(plugins.jsbeautifier())
                .pipe(gulp.dest('main-station/bin/views'));
            cb();
        })
})

//jade
gulp.task('jade', function() {
    return gulp.src([
            'main-station/src/views/**/*.jade'
        ])
        .pipe(plugins.plumber())
        .pipe(gulp.dest('main-station/bin/views'));
})

//sass
gulp.task('sass', function() {
    return gulp
        .src('main-station/src/views/**/*.sass')
        .pipe(plugins.plumber())
        .pipe(plugins.sass({
            includePaths: bourbon.with('main-station/src/views')
        }).on('error', plugins.sass.logError))
        .pipe(plugins.concat('client.css'))
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest('main-station/bin/views'))
})

//server-js
gulp.task('server-js', function() {
    return gulp.src([
            'main-station/src/**/*.js',
            '!main-station/src/views/**/*.js'
        ])
        .pipe(plugins.plumber())
        .pipe(gulp.dest('main-station/bin'));
})

//ffmpeg
gulp.task('ffmpeg', function() {
    return plugins.nodemon({
        watch: 'ffmpeg/**/*.js',
        script: 'ffmpeg/index.js'
    })
})

//qiniu
gulp.task('qiniu', function() {
    return plugins.nodemon({
        watch: 'qiniu/**/*.js',
        script: 'qiniu/index.js'
    })
})

//server
gulp.task('server', function() {
    return plugins.nodemon({
        watch: ['app.js', 'main-station/bin/**/*.js'],
        ignore: ['main-station/bin/views'],
        script: 'app.js'
    })
})

// clean
gulp.task('clean', function(cb) {
    del([
        'main-station/bin/**',
        '!main-station/bin',
        '!main-station/bin/views',
        '!main-station/bin/views/bower/**'
    ]).then(function() {
        cb()
    });

})


//watch
gulp.task('watch', function() {
    //第一次执行
    runSequence('clean', ['client-js', 'server-js', 'jade', 'sass'], 'server');
    //watch client side
    gulp.watch('main-station/src/views/**', ['client-js', 'jade', 'sass']).on('change', change);
    //watch server side
    gulp.watch(['main-station/src/**', '!main-station/src/views/**'], ['server-js']).on('change', change);
})

function change(event) {
    console.log(colors.green(event.path + ' was ' + event.type));
}
