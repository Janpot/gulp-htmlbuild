# gulp-htmlbuild [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> Extract content from html documents and replace by build result, analog to grunt-usemin, supports css and js out of the box.

## Warning

I'm still prototyping on this package so expect changes to it's API! Also, I'm open to suggestions.

## Usage

First install it

```shell
npm install --save-dev gulp-htmlbuild
```

then add it to your gulpfile:


```js
gulp.task('build', function () {
  gulp.src(['./index.html'])
    .pipe(htmlbuild({
      // build js with preprocessor
      js: htmlbuild.preprocess.js(function (block) {
        
        // read paths from the [block] stream and build them
        // ...
        
        // then write the build result path to it
        block.write('buildresult.js');
        block.end();
        
      })
    }))
    .pipe(gulp.dest('./build'));
});
```

`gulp build` will take `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
  </head>
  <body>
    
    <!-- htmlbuild:js -->
    <script src="js/script1.js"></script>
    <script src="js/script2.js"></script>
    <!-- endbuild -->
    
  </body>
</html>

```

And turn it into:


```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
  </head>
  <body>
    
    <script src="buildresult.js"></script>
    
  </body>
</html>

```

You can find more examples in the `example` folder.

## API

### htmlbuild(options)

#### options
`options` is an object which maps targets to build functions. the buildfunctions take 1 argument, a stream which represents the block. Read from this stream to get the content of the block and write to it to replace it. the stream also has an `indent` property which is a string containing the indentation of the block directive.

### htmlbuild.preprocess.js(buildFn)

a preprocessor you can use to wrap your buildfunction in. It extracts script paths from the block. In this case you also write paths to the block. They will get templated into link elements.

#### buildFn

a function that has the same form as a normal buildfunction, only the argument here is a stream that contains script paths. You are expected to write script paths to this stream as well.

### htmlbuild.preprocess.ssc(buildFn)

a preprocessor you can use to wrap your buildfunction in. It extracts stylesheet paths from the block. In this case you also write paths to the block. They will get templated into link elements.

#### buildFn

a function that has the same form as a normal buildfunction, only the argument here is a stream that contains stylesheet paths. You are expected to write paths to this stream as well.



## Extended example

example gulp file:

```javascript
var gulp  = require('gulp'),
    tasks = require('gulp-load-tasks')(),
    htmlbuild = require('../lib'),
    es = require('event-stream');


// pipe a glob stream into this and receive a gulp file stream
var gulpSrc = function (opts) {
  var paths = es.through();
  var files = es.through();
  
  paths.pipe(es.writeArray(function (err, srcs) {
    gulp.src(srcs, opts).pipe(files);
  }));
  
  return es.duplex(paths, files);
};


var jsBuild = es.pipeline(
  tasks.concat('concat.js'),
  gulp.dest('./build/js')
);

var cssBuild = es.pipeline(
  tasks.concat('concat.css'),
  gulp.dest('./build/css')
);


gulp.task('build', function () {
  
  gulp.src(['./index.html'])
    .pipe(htmlbuild({
      // build js with preprocessor
      js: htmlbuild.preprocess.js(function (block) {
        
        block.pipe(gulpSrc())
          .pipe(jsBuild);
        
        block.end('js/concat.js');
        
      }),
      
      // build css with preprocessor
      css: htmlbuild.preprocess.css(function (block) {
        
        block.pipe(gulpSrc())
          .pipe(cssBuild);
        
        block.end('css/concat.css');
        
      }),
      
      // remove blocks with this target
      remove: function (block) {
        block.end();
      },
      
      // add a header with this target
      header: function (block) {
        es.readArray([
          '<!--',
          '  processed by htmlbuild',
          '-->'
        ].map(function (str) {
          return block.indent + str;
        })).pipe(block);
      }
    }))
    .pipe(gulp.dest('./build'));
  
});
```

it will take following html file

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    
    <!-- htmlbuild:css -->
    <link href="css/stylesheet1.css"/>
    <link href="css/stylesheet2.css"/>
    <!-- endbuild -->
    
  </head>
  <body>
  
    <!-- htmlbuild:header -->
    <!-- endbuild -->
  
    <!-- htmlbuild:js -->
    <script src="js/src1.js"></script>
    <script src="js/src2.js"></script>
    <!-- endbuild -->
    
    <!-- htmlbuild:remove -->
    This will be removed in the build output
    <!-- endbuild -->

  </body>
</html>
```

and turn it into:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    
    <link rel="stylesheet" href="css/concat.css"/>
    
  </head>
  <body>
  
    <!--
      processed by htmlbuild
    -->
  
    <script src="js/concat.js"></script>
    

  </body>
</html>
```

While concatenating stylesheets and scripts on the fly.



## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-htmlbuild
[npm-image]: https://badge.fury.io/js/gulp-htmlbuild.png

[travis-url]: http://travis-ci.org/Janpot/gulp-htmlbuild
[travis-image]: https://secure.travis-ci.org/Janpot/gulp-htmlbuild.png?branch=master

[depstat-url]: https://david-dm.org/Janpot/gulp-htmlbuild
[depstat-image]: https://david-dm.org/Janpot/gulp-htmlbuild.png?theme=shields.io
