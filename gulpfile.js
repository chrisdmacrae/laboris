var path = require('path');
var child = require('child_process');
var gulp = require('gulp');
const browserSync = require('browser-sync').create();
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var cache = require('gulp-cache');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-csso');
var imageMin = require('gulp-imagemin')
var uglify = require('gulp-uglify');

var siteRoot = path.resolve('./_site');
var dest = path.resolve('./assets/');

gulp.task('clean', function() {
  return gulp.src([dest + '/css', dest + '/js'], { read: false })
    .pipe(clean({force: true}))
});

gulp.task('vendor', function() {
  return gulp.src('node_modules/tachyons/css/tachyons.min.css')
    .pipe(gulp.dest('src/sass/vendor'))
});

gulp.task('css', ['clean', 'vendor'],  function() {
    return gulp.src('src/sass/*.scss')
      .pipe(sass())
      .pipe(minifyCSS())
      .pipe(gulp.dest(dest + '/css'))
});

gulp.task('images', ['clean'], function() {
  return gulp.src('src/img/**/**.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imageMin()))
    .pipe(gulp.dest(dest + '/img'));
});

gulp.task('js', ['clean'], function() {
  gulp.src('src/js/vendor/**/*.js')
    .pipe(gulp.dest(dest + '/js'))
  return gulp.src(['!src/js/vendor/**/*.js', 'src/js/**/*.js'])
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest(dest + '/js'))
});

gulp.task('jekyll', () => {
    const jekyll = child.spawn('jekyll', ['serve',
          '--watch',
          '--incremental',
          '--drafts'
        ]);

    const jekyllLogger = (buffer) => {
          buffer.toString()
            .split(/\n/)
            .forEach((message) => gutil.log('Jekyll: ' + message));
        };

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
    browserSync.init({
          files: [siteRoot + '/**'],
          port: 4000,
          server: {
            baseDir: siteRoot
          }
        });

    gulp.watch('./src/**/*.scss', ['css']);
    gulp.watch('/src/**/*.js', ['js']);
    gulp.watch('/src/img/*', ['images']);
});

gulp.task('default', [ 'build', 'jekyll', 'serve' ]);
gulp.task('build', [ 'clean', 'css', 'images', 'js' ]);
