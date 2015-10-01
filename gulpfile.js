var gulp = require('gulp');
var del = require('del');

var concat = require('gulp-concat');

gulp.task('clean', function() {
    del(['dist/*']).then(function (paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

//gulp.task('scripts', function() {
//    gulp.src(['js/**/*.*'], { base: './' })
//        .pipe(gulp.dest('dist/admin-app'));
//});

var amdOptimize = require('amd-optimize');

gulp.task('scripts', function () {
    return gulp.src("js/**/*.js")
        .pipe(amdOptimize("main",
            {
                name: "main",
                paths: {
                    "jquery": "empty:",
                    "underscore": "empty:",
                    "backbone": "empty:",
                    "bootstrap": "empty:",
                    "bootbox": "empty:"
                }
            }
        ))
        .pipe(concat("main.js"))
        .pipe(gulp.dest("dist/admin-app/js"));
});

gulp.task('styles', function() {
    gulp.src(['css/*'])
        .pipe(gulp.dest('dist/admin-app/css'));
});

gulp.task('fonts', function() {
    gulp.src(['fonts/*'])
        .pipe(gulp.dest('dist/admin-app/fonts'));
});

gulp.task('images', function() {
    gulp.src(['images/*'])
        .pipe(gulp.dest('dist/admin-app/images'));
});

gulp.task('html', function() {
    gulp.src("*.html")
        .pipe(gulp.dest('dist/admin-app'));
});

gulp.task('build', ['clean', 'scripts', 'styles', 'fonts', 'images', 'html']);