/*global describe, it*/
'use strict';

var tutils    = require('./testUtils');

require('mocha');


describe('htmlbuild:js', function () {


  it('should find and replace a script block', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('single-script-block.html'),
      srcFile      : tutils.getFixture('single-script-block.html'),
      options      : {
        js: tutils.mockConcatBuilder()
      }
    }, done);
    
  });
  

  it('should ignore extra content in a script block', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('single-script-block.html'),
      srcFile      : tutils.getFixture('single-script-block-extras.html'),
      options      : {
        js: tutils.mockConcatBuilder()
      }
    }, done);
    
  });
  

  it('should process multiple script blocks', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('multiple-script-blocks.html'),
      srcFile      : tutils.getFixture('multiple-script-blocks.html'),
      options      : {
        js: tutils.mockConcatBuilder()
      }
    }, done);
    
  });

  it('should respect indentation of script blocks', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('indent-script-blocks.html'),
      srcFile      : tutils.getFixture('indent-script-blocks.html'),
      options      : {
        js: tutils.mockConcatBuilder()
      }
    }, done);
    
  });

  it('should error when no builder defined for detected block', function (done) {
    
    tutils.runTest({
      expectedErr : true,
      srcFile     : tutils.getFixture('single-script-block.html'),
      options     : { }
    }, done);
    
  });
  
});
