// to run use command livereload in one tab and gulp in another

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload');
    del = require('del');

gulp.task('styles', function() {
  return gulp.src('src/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(livereload({ start: true }))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(livereload({ start: true }))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('clean', async function(cb) {
    del(['dist/assets/css', 'dist/assets/js'], cb)
});

gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
  // Watch .js files
  gulp.watch('src/js/**/*.js', gulp.series('scripts'));
});

gulp.task('default', gulp.series('clean', 'styles', 'scripts', 'watch'));
