# gulp-htmlbuild [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> Extract content from html documents and replace by build result, analog to grunt-usemin

## Warning

I'm still prototyping on this package so expect changes to it's API! Also, I'm open to suggestions.

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
    js: function (files, callback) {
      // concatenate js files
      gulp.src(files, { cwd: 'app' })
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'));
      callback(null, [ 'all.js' ]);
    }
  }))
  .pipe(gulp.dest("./dist"));
```

it will take following html file

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  
  <!-- htmlbuild:js -->
  <script src="src1.js"></script>
  <script src="src2.js"></script>
  <script src="src3.js"></script>
  <!-- endbuild  -->
  
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
</head>
<body>
  
  <script src="all.js"></script>
  
</body>
</html>
```

While concatenating the scripts in the meantime.

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
