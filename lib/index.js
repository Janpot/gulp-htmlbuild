'use strict';

var es          = require('event-stream'),
    gutil       = require('gulp-util'),
    PluginError = gutil.PluginError,
    util        = require('util'),
    parser      = require('./parser');

var PLUGIN_NAME = 'gulp-htmlbuild';


function asyncMap(input, fn, callback) {
  
  var mapped = [],
      count  = input.length,
      called = false;
  
  function doCallback(error, result) {
    if (called) {
      return;
    } else {
      called = true;
      callback(error, result);
    }
  }
  
  function finish(error) {
    count -= 1;
      
    if (error) {
      return doCallback(error);
    } else if (count <= 0) {
      return doCallback(null, mapped);
    }
  }
  
  input.forEach(function (item, i) {
    fn(item, function (error, result) {
      if (error) {
        finish(error);
      } else {
        mapped[i] = result;
        finish();
      }
    });
  });
  
}



var adapters = {
  
  js: {
    getSrc: function (line) {
      var matched = /<script.+src=['"]([^"']+)["']/.exec(line);
      if (matched) {
        return matched[1];
      } else {
        return null;
      }
    },
    setSrc: function (src, indent) {
      var template = (indent || '') + '<script src="%s"></script>';
      return util.format(template, src);
    }
  }
  
};


function processBlock(block, builders, callback) {
  if (block.target === null) {
    callback(null, block.lines);
  } else if (Object.keys(adapters).indexOf(block.target) < 0) {
    var msg = util.format('target not recognized: "%s"', block.target);
    return callback(new gutil.PluginError(PLUGIN_NAME, msg));
  } else {
  
    var adapter = adapters[block.target],
        builder = builders[block.target];
    
    var builderInput = null;
    
    if (adapter) {
      builderInput = block.lines
        .map(adapter.getSrc)
        .filter(function (src) {
          return src;
        });
    } else {
      builderInput = block.lines;
    }
    
    builder(builderInput, function (error, result) {
      var lines = null;
      if (adapter) {
        lines = result.map(function (line) {
          return adapter.setSrc(line, block.indent);
        });
      } else {
        lines = result;
      }
      callback(null, lines);
    });
    
  }
}


function process(blocks, builders, callback) {
  asyncMap(blocks, function (block, callback) {
    processBlock(block, builders, callback);
  }, function (error, result) {
    if (error) {
      return callback(new gutil.PluginError(PLUGIN_NAME, error.message));
    }
    
    var lines = result.reduce(function (all, partial) {
      return all.concat(partial);
    }, []);
    
    callback(null, lines);
  });
}


module.exports = function (builders) {

  function htmlbuild(file, callback) {

    if (file.isNull()) {
      return callback(null, file); // pass along
    }
    
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }
    
    parser.parse(file, function (error, parsed) {
      if (error) {
        return callback(error);
      }
      
      process(parsed, builders, function (error, lines) {
        if (error) {
          return callback(error);
        } else {
          file.contents = new Buffer(lines.join('\n'));
          return callback(null, file);
        }
      });
    });
  }

  return es.map(htmlbuild);
};
