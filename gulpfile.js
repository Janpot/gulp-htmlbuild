'use strict';

var gulp  = require('gulp'),
    tasks = require('gulp-load-tasks')(),
    htmlbuild = require('./lib');


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

gulp.task('build', function () {
  gulp.src(['./test/fixtures/multiple-script-blocks.html'])
    .pipe(tasks.debug())
    .pipe(htmlbuild({
      js: function (block) {
        block.end('fuck it');
      }
    }))
    .pipe(tasks.debug({
      verbose: true
    }));
});