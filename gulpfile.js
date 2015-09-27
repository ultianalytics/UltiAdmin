var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function() {
    del(['dist/*']).then(function (paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

gulp.task('scripts', function() {
    gulp.src(['js/*'])
        .pipe(gulp.dest('dist/admin-app/js'));
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