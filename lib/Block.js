'use strict';

function Block(config) {
  config = config || {};
  
  this.lines      = config.lines || [];
  this.target     = config.target || null;
  this.lineNumber = config.lineNumber;
}

module.exports = Block;
