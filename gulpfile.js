var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');

gulp.task('compress', function() {
  gulp.src('promise.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(uglify())
    .pipe(gulp.dest('build'));
});

gulp.task('dev', function () {
  gulp.watch('promise.js', ['compress']);
})
