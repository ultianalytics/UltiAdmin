var gulp = require('gulp');

var connect = require('gulp-connect');

gulp.task('server', function(){
    connect.server({
        port: 9000,
        livereload: true
    });
});

gulp.task('default', ['server']);