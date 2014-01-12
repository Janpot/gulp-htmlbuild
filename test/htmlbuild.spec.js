/*global describe, it*/
'use strict';

var assert    = require('chai').assert,
    tutils    = require('./testUtils'),
    htmlbuild = require('../');

require('mocha');


describe('htmlbuild', function () {

  it('should error on stream', function (done) {

    var srcFile = tutils.getFixture('single-script-block.html', { stream: true }),
        builder = tutils.mockConcatBuilder();
    
    var stream  = htmlbuild({
      js: builder
    });

    stream.on('error', function (err) {
      assert.isDefined(err);
      done();
    });

    stream.on('data', function () {
      assert.fail();
    });

    stream.write(srcFile);
    stream.end();
  });

  it('should process html with no blocks defined', function (done) {
    
    tutils.runTest({
      expectedFile : tutils.getExpected('no-blocks.html'),
      srcFile      : tutils.getFixture('no-blocks.html'),
      options      : { }
    }, done);
    
  });
  
});
