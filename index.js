var es = require('event-stream'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    util = require('util');

module.exports = function (config) {
  'use strict';
  
  function wrapScript(path, indent) {
    var template = indent + '<script src="%s"></script>';
    return util.format(template, path);
  }
  
  function extractScript(line) {
    var matched = /<script.+src=['"]([^"']+)["']/.exec(line);
    if (matched) {
      return matched[1];
    }
  }
  
  function build(options, callback) {
    config.js(options.block, function (error, outPaths) {
      var wrapped = outPaths.map(function (path) {
        return wrapScript(path, options.indent);
      });
      callback(null, wrapped);
    });
  }

  function htmlbuild(file, callback) {

    if (file.isNull()) {
      return callback(null, file); // pass along
    }
    
    if (file.isStream()) {
      return callback(new PluginError('gulp-jshint', 'Streaming not supported'));
    }
    
    
    var lines = String(file.contents).split('\n');
    var parsed = [];
    var inBlock = false,
        currentBlock = null,
        currentIndent = '';
    
    while (lines.length > 0) {
      var next = lines.shift();
      
      // tokenize
      var blockStartMatch = /^(\s*)<!-- htmlbuild:([a-zA-Z]*) -->/.exec(next),
          isBlockStart    = blockStartMatch !== null,
          isBlockEnd      = /endbuild/.test(next);
      
      //parse
      if (inBlock) {
        if (isBlockEnd) {
          parsed.push({
            block: currentBlock,
            indent: currentIndent
          });
          currentBlock = null;
          inBlock = false;
        } else {
          var scriptPath = extractScript(next);
          if (scriptPath) {
            currentBlock.push(scriptPath);
          }
        }
      } else if (isBlockStart) {
        currentBlock = [];
        currentIndent = blockStartMatch[1];
        inBlock = true;
      } else {
        parsed.push({
          line: next
        });
      }
    }
    
    // process
    var blocks = parsed.filter(function (parseObj) {
      return parseObj.block;
    });
    var count = blocks.length;
    
    blocks.forEach(function (parseObj) {
      build(parseObj, function (err, result) {
        count -= 1;
        
        if (!err) {
          parseObj.line = result.join('\n');
        }
        
        if (count <= 0) {
          var contents = parsed.map(function (parseObj) {
            return parseObj.line;
          }).join('\n');
          
          file.contents = new Buffer(contents);
          callback(null, file);
        }
      });
    });

  }

  return es.map(htmlbuild);
};
