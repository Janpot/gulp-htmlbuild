'use strict';

var gutil = require('gulp-util'),
    Block = require('./Block');

var PLUGIN_NAME = require('../package').name;

var tokenTypes = {
  BLOCK_START: 'block-start',
  BLOCK_END  : 'block-end',
  LINE       : 'line'
};


function tokenize(line) {
  var token = {
    line  : line,
    type  : null,
    target: null,
    indent: null
  };
  
  var blockStartMatch = /^(\s*)<!--\s*htmlbuild:([a-zA-Z]*)\s*-->/.exec(line);
  
  if (blockStartMatch !== null) {
    token.type   = tokenTypes.BLOCK_START;
    token.indent = blockStartMatch[1];
    token.target = blockStartMatch[2];
  } else if (/<!--\s*endbuild\s*-->/.test(line)) {
    token.type = tokenTypes.BLOCK_END;
  } else {
    token.type = tokenTypes.LINE;
  }
  
  return token;
}


function parse(file, callback) {
  
  function makeError(lineNumber, msg) {
    return new gutil.PluginError(PLUGIN_NAME, msg, {
      showStack: false,
      lineNumber: lineNumber,
      fileName: file.path
    });
  }
  
  var lines   = String(file.contents).split('\n'),
      tokens  = lines.map(tokenize),
      blocks  = [],
      inBlock = false,
      error   = null;
  
  var currentBlock = new Block({
    lineNumber: 1
  });
  
  for (var i = 0; i < tokens.length; i++) {
    var lineNumber = i + 1,
        token      = tokens[i];
    
    if (token.type === tokenTypes.BLOCK_START) {
      if (inBlock) {
        error = makeError(lineNumber, 'Blocks can\'t be nested');
        return callback(error);
      } else {
        inBlock = true;
      }
    }
    
    if (token.type === tokenTypes.BLOCK_END) {
      if (inBlock) {
        inBlock = false;
      } else {
        error = makeError(lineNumber, 'Block has no start');
        return callback(error);
      }
    }
    
    var switchBlocks = (
      token.type === tokenTypes.BLOCK_START ||
      token.type === tokenTypes.BLOCK_END
    );
    
    if (switchBlocks) {
      blocks.push(currentBlock);
      currentBlock = new Block({
        line      : token.line,
        target    : token.target,
        indent    : token.indent,
        lineNumber: lineNumber
      });
    } else {
      currentBlock.lines.push(token.line);
    }
  }
  
  if (inBlock) {
    error = makeError(currentBlock.lineNumber, 'Unclosed block');
    return callback(error);
  }
  
  blocks.push(currentBlock);
  
  callback(null, blocks);
}


module.exports = {
  _tokens: tokenTypes,
  _tokenize: tokenize,
  parse: parse
};
