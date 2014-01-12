'use strict';

function Block(config) {
  config = config || {};
  this.lines = [];
  this.target = config.target || null;
  this.indent = config.indent || null;
}

module.exports = Block;
