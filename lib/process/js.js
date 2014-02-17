'use strict';

module.exports = function (buildFn) {

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
  
};
