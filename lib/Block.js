'use strict';

function Block(config) {
  config = config || {};
  
  this.lines      = config.lines || [];
  this.target     = config.target || null;
  this.indent     = config.indent || null;
  this.lineNumber = config.lineNumber;
}

module.exports = Block;
