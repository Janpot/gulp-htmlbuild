# gulp-htmlbuild [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> Extract content from html documents and replace by build result

## Usage

First, install `gulp-htmlbuild` as a development dependency:

```shell
npm install --save-dev gulp-htmlbuild
```

Then, add it to your `gulpfile.js`:

```javascript
var htmlbuild = require("gulp-htmlbuild");

gulp.src("./src/*.html")
  .pipe(htmlbuild({
    js: function (files) {
      // concatenate js files
      gulp.src(files, callback)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'));
      callback(null, 'dist/all.js');
    }
  }))
  .pipe(gulp.dest("./dist"));
```

## API

### htmlbuild(options)

#### options.js
Type: `function (files, callback)`

The function used to build the files, callback has the form `function (error, paths)`, where paths is an array containing the built script paths.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-htmlbuild
[npm-image]: https://badge.fury.io/js/gulp-htmlbuild.png

[travis-url]: http://travis-ci.org/Janpot/gulp-htmlbuild
[travis-image]: https://secure.travis-ci.org/Janpot/gulp-htmlbuild.png?branch=master

[depstat-url]: https://david-dm.org/Janpot/gulp-htmlbuild
[depstat-image]: https://david-dm.org/Janpot/gulp-htmlbuild.png?theme=shields.io