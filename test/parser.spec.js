/*global describe, it*/
'use strict';

var util   = require('util'),
    assert = require('chai').assert,
    parser = require('../lib/parser');

var fixtures = [
  {
    line: '<!-- htmlbuild:js -->',
    expect: {
      type: parser._tokens.BLOCK_START,
      target: 'js',
      indent: ''
    }
  }, {
    line: '  <!--   htmlbuild:js   -->  ',
    expect: {
      type: parser._tokens.BLOCK_START,
      target: 'js',
      indent: '  '
    }
  }, {
    line: '<!-- htmlbuild:css -->',
    expect: {
      type: parser._tokens.BLOCK_START,
      target: 'css'
    }
  }, {
    line: '<!-- htmlbuild -->',
    expect: {
      type: parser._tokens.LINE
    }
  }, {
    line: '  <!--   endbuild   -->  ',
    expect: {
      type: parser._tokens.BLOCK_END
    }
  }
];



describe('parser', function () {

  describe('tokenizer', function () {
    
    fixtures.forEach(function (fixture) {
      var spec = util.format(
        'should recognize "%s" as a %s', fixture.line, fixture.expect.type
      );
      
      it(spec, function () {
        var token = parser._tokenize(fixture.line);
        assert.strictEqual(fixture.line, token.line);
        for (var property in fixture.expect) {
          var value = fixture.expect[property];
          assert.propertyVal(token, property, value);
        }
      });
    });
    
  });
  
});