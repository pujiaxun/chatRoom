var gulp = require('gulp')
var less = require('gulp-less')
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify')
var livereload = require('gulp-livereload')

gulp.task('less',function(){
  return gulp.src('assets/css/*.less')
          .pipe(less())
          .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
          .pipe(gulp.dest('public'))
})

gulp.task('js',function(){
  return gulp.src('assets/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public'))
})

gulp.task('watch', function() {
  // Watch .less files
  gulp.watch('assets/css/*.less', ['less']);
  // Watch .js files
  gulp.watch('assets/js/*.js', ['js']);
  // Create LiveReload server
  livereload.listen();
  // Watch any files in public/, reload on change
  gulp.watch(['public/**']).on('change', livereload.changed);
});
