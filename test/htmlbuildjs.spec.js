/*global describe, it*/
'use strict';

var fs = require('fs'),
    path = require('path'),
	es = require('event-stream'),
	should = require('should'),
    assert = require('chai').assert;

require('mocha');

var gutil = require('gulp-util'),
	htmlbuild = require('../');



  
var CWD             = 'test',
    EXPECTED_FOLDER = 'expected',
    FIXTURES_FOLDER = 'fixtures';

function getExpected(file) {
  var base     = path.join(CWD, EXPECTED_FOLDER),
      filePath = path.join(base, file);
  
  return new gutil.File({
    path    : filePath,
    cwd     : CWD,
    base    : base,
    contents: fs.readFileSync(filePath)
  });
}

function getFixture(file, options) {
  var base     = path.join(CWD, FIXTURES_FOLDER),
      filePath = path.join(base, file),
      contents = null;
  
  options = options || {};
  
  if (options.stream) {
    contents = fs.createReadStream(filePath);
  } else {
    contents = fs.readFileSync(filePath);
  }
  
  return new gutil.File({
    path    : filePath,
    cwd     : CWD,
    base    : base,
    contents: contents
  });
}

function mockConcatBuilder() {
  return function (files, callback) {
    assert.isDefined(files);
    assert.isArray(files);
    
    setImmediate(function () {
      callback(null, [files.join('-')]);
    });
  };
}



describe('gulp-htmlbuild', function () {

  it('should error on stream', function (done) {

    var srcFile = getFixture('single-script-block.html', { stream: true }),
        builder = mockConcatBuilder();
    
    var stream  = htmlbuild({
      js: builder
    });

    stream.on('error', function (err) {
      should.exist(err);
      done();
    });

    stream.on('data', function () {
      assert.fail();
    });

    stream.write(srcFile);
    stream.end();
  });
  

  it('should find and replace a script block', function (done) {
    
    var expectedFile = getExpected('single-script-block.html'),
        srcFile      = getFixture('single-script-block.html'),
        builder      = mockConcatBuilder();
    
    var stream  = htmlbuild({
      js: builder
    });

    stream.on('error', done);

    stream.on('data', function (newFile) {
      assert.isDefined(newFile);
      assert.isDefined(newFile.contents);
      assert.strictEqual(
        String(newFile.contents),
        String(expectedFile.contents)
      );
      done();
    });

    stream.write(srcFile);
    stream.end();
  });
  

  it('should ignore extra content in a script block', function (done) {
    
    var expectedFile = getExpected('single-script-block.html'),
        srcFile      = getFixture('single-script-block-extras.html'),
        builder      = mockConcatBuilder();
    
    var stream  = htmlbuild({
      js: builder
    });

    stream.on('error', done);

    stream.on('data', function (newFile) {
      assert.isDefined(newFile);
      assert.isDefined(newFile.contents);
      assert.strictEqual(
        String(newFile.contents),
        String(expectedFile.contents)
      );
      done();
    });

    stream.write(srcFile);
    stream.end();
  });
  

  it('should process multiple script blocks', function (done) {
    
    var expectedFile = getExpected('multiple-script-blocks.html'),
        srcFile      = getFixture('multiple-script-blocks.html'),
        builder      = mockConcatBuilder();
    
    var stream  = htmlbuild({
      js: builder
    });

    stream.on('error', done);

    stream.on('data', function (newFile) {
      assert.isDefined(newFile);
      assert.isDefined(newFile.contents);
      assert.strictEqual(
        String(newFile.contents),
        String(expectedFile.contents)
      );
      done();
    });

    stream.write(srcFile);
    stream.end();
  });

  it('should respect indentation of script blocks', function (done) {
    
    var expectedFile = getExpected('indent-script-blocks.html'),
        srcFile      = getFixture('indent-script-blocks.html'),
        builder      = mockConcatBuilder();
    
    var stream  = htmlbuild({
      js: builder
    });

    stream.on('error', done);

    stream.on('data', function (newFile) {
      assert.isDefined(newFile);
      assert.isDefined(newFile.contents);
      assert.strictEqual(
        String(newFile.contents),
        String(expectedFile.contents)
      );
      done();
    });

    stream.write(srcFile);
    stream.end();
  });
  
});
