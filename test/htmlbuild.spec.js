/*global describe, it*/
'use strict';

var tutils    = require('./testUtils');

describe('htmlbuild', function () {

  it('should error on stream', function (done) {

    var srcFile = tutils.getFixture('single-script-block.html', { stream: true });
    
    tutils.runTest({
      expectedErr : {
        fileName: srcFile.path
      },
      srcFile     : srcFile,
      options     : {
        js: tutils.mockConcatBuilder()
      }
    }, done);
    
  });

  it('should process html with no blocks defined', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('no-blocks.html'),
      srcFile      : tutils.getFixture('no-blocks.html'),
      options      : { }
    }, done);
    
  });
  
});
