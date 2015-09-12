var gulp = require('gulp');

var connect = require('gulp-connect');

gulp.task('server', function(){
    connect.server({
        port: 9000,
        livereload: true,
        middleware: function(connect, o) {
            return [ (function() {
                var url = require('url');
                var proxy = require('proxy-middleware');
                var options = url.parse('http://www.ultianalytics.com/rest');
                options.route = '/rest';
                return proxy(options);
            })() ];
        }
    });
});

gulp.task('default', ['server']);