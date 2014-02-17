'use strict';

var es = require('event-stream');

module.exports = function (buildFn) {
  return buildFn;
/*
  return function (block) {
    var pre = es.pipeline(
      block,
      extractSrc
    );
    
    var post = es.pipeline(
      templateSrc,
      block
    );
    
    buildFn(es.duplex(pre, post))
  };
  */
};
