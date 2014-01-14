'use strict';

var gulp  = require('gulp'),
    tasks = require('gulp-load-tasks')();


gulp.task('mocha', function () {
  
  gulp.src('./test/**/*.spec.js')
    .pipe(tasks.mocha({
      reporter: 'spec'
    }));
  
});
