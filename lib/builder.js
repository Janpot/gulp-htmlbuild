'use strict';

var es = require('event-stream'),
    Transform = require('stream').Transform,
    buffer = require('pause-stream'),
    flatten = require('./flatten');





function build(config) {
  config = config || {};
  
  var buildStream = es.through(function write(block) {
    var buildFn = block.target && config[block.target];
    var lineStream = buffer().pause();
    block.lines.forEach(function (line) {
      lineStream.write(line);
    });
    lineStream.end();
    
    
    if (buildFn) {
      var buildResult = buffer().pause();
      var blockStream = es.duplex(buildResult, lineStream);
      this.queue(buildResult);
      buildFn(blockStream);
      lineStream.resume();
    } else {
      this.queue(lineStream);
    }
  });
  
  return es.pipeline(
    buildStream,
    flatten(),
    es.join('\n')
  );
}


module.exports = {
  build: build
};
