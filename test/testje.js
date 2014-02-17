'use strict';

var es = require('event-stream');


es.readArray([
  es.readArray([1, 2, 3]),
  es.readArray([4, 5, 6]),
  es.readArray([7, 8])
]).on('data', function (stream) {
  stream.pipe(process.stdout);
});


/*
var PassThrough = require('stream').PassThrough;

var s = new PassThrough({objectMode: true});

s.on('data', function (stream) {
  stream.pipe(process.stdout);
});

var sub = new PassThrough();
var sub2 = new PassThrough();

s.write(sub);
s.write(sub2);
sub.write('hello');
sub2.write('kak');
sub.write('world');
sub.end();
s.end();
sub2.write('pis');
sub2.end();*/
