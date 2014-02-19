/*global describe, it*/
'use strict';

var tutils = require('./testUtils'),
    es = require('event-stream');

describe('htmlbuild', function () {

  it('should error on stream', function (done) {

    var srcFile = tutils.getFixture('single-script-block.html', { stream: true });
    
    tutils.runTest({
      expectedErr : {
        fileName: srcFile.path
      },
      srcFile     : srcFile,
      options     : { }
    }, done);
    
  });

  it('should process html with no blocks defined', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('no-blocks.html'),
      srcFile      : tutils.getFixture('no-blocks.html'),
      options      : { }
    }, done);
    
  });

  it('should process html with blocks passed through', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('single-script-block-no-replace.html'),
      srcFile      : tutils.getFixture('single-script-block.html'),
      options      : {
        js: function (block) {
          block.pipe(block);
        }
      }
    }, done);
    
  });

  it('should process html with replace sync', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('single-script-block-with-replace.html'),
      srcFile      : tutils.getFixture('single-script-block.html'),
      options      : {
        js: function (block) {
          block.end('replace');
        }
      }
    }, done);
    
  });

  it('should process html with replace async', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('single-script-block-with-replace.html'),
      srcFile      : tutils.getFixture('single-script-block.html'),
      options      : {
        js: function (block) {
          setImmediate(function () {
            block.end('replace');
          });
        }
      }
    }, done);
    
  });

  it('should process html with replace after read', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('single-script-block-with-replace.html'),
      srcFile      : tutils.getFixture('single-script-block.html'),
      options      : {
        js: function (block) {
          block.pipe(es.wait(function () {
            block.end('replace');
          }));
        }
      }
    }, done);
    
  });

  it('should process html with replace before read', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('single-script-block-with-replace.html'),
      srcFile      : tutils.getFixture('single-script-block.html'),
      options      : {
        js: function (block) {
          block.pipe(es.wait(function () { }));
          block.end('replace');
        }
      }
    }, done);
    
  });
  
});
