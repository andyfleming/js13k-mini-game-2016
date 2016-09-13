'use strict'

const gulp   = require('gulp')
const del    = require('del')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename');
const cleanCss    = require('gulp-clean-css')
const zip = require('gulp-zip')
const size = require('gulp-size')


gulp.task('clean-build', function () {
  return del(['build/**/*', 'dist/**/*'])
})

gulp.task('copy-index', ['clean-build'], function() {
  return gulp.src('./src/index.html')
    .pipe( gulp.dest('build') )
})

gulp.task('build-css', ['clean-build'], function() {
  return gulp.src( './src/main.css' )
    .pipe( cleanCss() )
    .pipe( rename('main.min.css') )
    .pipe( gulp.dest('./build') )
})

gulp.task('build-js', ['clean-build'], function() {
  return gulp.src('./src/main.js')
    .pipe( uglify() )
    .pipe( rename('main.min.js') )
    .pipe( gulp.dest('./build') );
})

gulp.task('zip', ['clean-build', 'copy-index', 'build-css', 'build-js'], function() {
  return gulp.src(['./build/index.html', './build/main.min.js', './build/main.min.css'])
    .pipe( zip('game.zip') )
    .pipe( size() )
    .pipe( gulp.dest('./dist') );
})


gulp.task('watch', ['all'], function() {
  return gulp.watch(['src/**/*'],['all'])
})

gulp.task('all', ['copy-index', 'build-css', 'build-js', 'zip'])

gulp.task('default', ['watch'])