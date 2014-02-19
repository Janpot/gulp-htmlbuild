'use strict';

var gulp  = require('gulp'),
    tasks = require('gulp-load-tasks')();


gulp.task('mocha', function () {
  
  gulp.src('./test/**/*.spec.js', {read: false})
    .pipe(tasks.mocha({
      reporter: 'spec'
    }))
    .on('error', function (error) {
      console.log(error.name, error.message);
    });
  
});


gulp.task('mocha-watch', ['mocha'], function () {
  
  gulp.watch([
    './lib/**/*.js',
    './test/**/*.spec.js'
  ], ['mocha']);
  
});
