var gulp = require('gulp');
var del = require('del');
var amdOptimize = require('amd-optimize');
var concat = require('gulp-concat');

gulp.task('clean', function() {
    del(['dist/*']).then(function (paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
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

gulp.task('require-js', function() {
    gulp.src(["js/require.js", "js/text.js"])
        .pipe(gulp.dest('dist/admin-app/js'));
});

gulp.task('app-js', function () {
    return gulp.src("js/**/*.js")
        .pipe(amdOptimize("main",
            {
                baseUrl: "js",
                name: "main",
                paths: {
                    "jquery": "empty:",
                    "underscore": "empty:",
                    "backbone": "empty:",
                    "bootstrap": "empty:",
                    "bootbox": "empty:",
                    "require-text" : "empty:",
                    "q" : "empty:"
                }
            }
        ))
        .pipe(concat("main.js"))
        .pipe(gulp.dest("dist/admin-app/js"));
});

// NOTE: The build task does not include clean because in this version of glup there is no (easy) way to make the other tasks wait until clean is complete
// SO...from the command line run
// gulp clean
// gulp build
gulp.task('build', ['require-js', 'app-js', 'styles', 'fonts', 'images', 'html']);