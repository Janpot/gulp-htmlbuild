'use strict';

var Block = require('./Block');

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
  var lines  = String(file.contents).split('\n'),
      tokens = lines.map(tokenize),
      blocks = [],
      currentBlock = new Block();
  
  tokens.forEach(function (token) {
    var switchBlocks = (
      token.type === tokenTypes.BLOCK_START ||
      token.type === tokenTypes.BLOCK_END
    );
    
    if (switchBlocks) {
      blocks.push(currentBlock);
      currentBlock = new Block(token);
    } else {
      currentBlock.lines.push(token.line);
    }
  });
  
  blocks.push(currentBlock);
  
  callback(null, blocks);
}


module.exports = {
  _tokens: tokenTypes,
  _tokenize: tokenize,
  parse: parse
};
