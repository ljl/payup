var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var assetsPath = './src/main/resources/site/assets/';

gulp.task('sass', function () {
  return gulp.src(assetsPath + 'sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(assetsPath + 'css'));
});

gulp.task('scripts', function () {
  console.error('scripts task not implemented yet');
});

gulp.task('styles', function () {
  console.error('styles task not implemented yet');
});

gulp.task('build', ['scripts', 'sass']);
