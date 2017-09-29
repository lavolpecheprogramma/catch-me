var gulp = require('gulp');
var gulpIf = require('gulp-if');
var path = require('path');
var del = require('del');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var runSequence = require('run-sequence');

var injectPartials = require('gulp-inject-partials');

var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var sourcemaps  = require('gulp-sourcemaps');

var cacheBuster = require('gulp-cache-bust');
//concat
var useref = require('gulp-useref');
//css
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
// js
var uglify = require('gulp-uglify');

var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();

var app  = './app';
var tmp = './tmp';
var dist = './public';

var env = process.env.NODE_ENV || 'development';
var isDev = env !== 'production';

gulp.task('less', function() {
    return gulp.src(app+'/less/main.less')  // only compile the entry file
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(gulpIf(isDev, sourcemaps.init()))
      .pipe(less())
      .pipe(gulpIf(!isDev, cssnano()))
      .pipe(gulpIf(isDev, sourcemaps.write()))
      .pipe(gulp.dest(tmp+'/css'))
      .pipe(browserSync.reload({
        stream: true
      }))
      .pipe(notify("LESS - Build successful!"));
});

gulp.task('babel', function () {
  return browserify({entries: app+'/js/app.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .on('error', notify.onError("Error: <%= error.message %>"))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(gulpIf(!isDev, uglify()))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(tmp+'/js'))
        .pipe(notify("JS - Build successful!"));
});

gulp.task('useref', function(){
  return gulp.src(app+'/index.html')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(injectPartials({
        removeTags: true,
        start: '<## {{path}}>',
        end: '</##>'
    }))
    .pipe(gulp.dest(tmp))
    .pipe(useref())
    .pipe(gulp.dest(dist))
});

gulp.task('static-vendor', function(){
  gulp.src(app+'/js/audioWorker.js')
    .pipe(gulp.dest(gulpIf(!isDev, dist, tmp)+'/js'));
  gulp.src(app+'/js/vendor/physijs_worker.js')
    .pipe(gulp.dest(gulpIf(!isDev, dist, tmp)+'/js/vendor'));
   gulp.src(app+'/js/vendor/ammo.js')
    .pipe(gulp.dest(gulpIf(!isDev, dist, tmp)+'/js/vendor'));
    
  return gulp.src(app+'/js/vendor/**/*')
    .pipe(gulp.dest(tmp+'/js/vendor'))
});

gulp.task('copy-static', function(){
  return gulp.src(app+'/static/**/*')
    .pipe(gulp.dest(gulpIf(!isDev, dist, tmp)+'/static'))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: tmp
    },
  })
});

gulp.task('cacheBuster', function () {
    return gulp.src(dist+'/*.html')
        .pipe(cacheBuster({
            type: 'timestamp'
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('clean:dist', function() {
  del.sync(tmp);
  return del.sync(dist);
})

gulp.task('watch', function() {
    gulp.watch(app+'/less/**/*.less', ['less']);
    gulp.watch(app+'/js/**/*.js', ['babel']);

    // Reloads the browser whenever HTML or JS files change
    gulp.watch(app+'/static/**/*.*', ['copy-static', browserSync.reload]);
    gulp.watch(app+'/template/**/*.*', ['useref', browserSync.reload]); 
    gulp.watch(app+'/index.html', ['useref', browserSync.reload]);
});

gulp.task('default', function(callback){
  runSequence('clean:dist',
              ['static-vendor', 'copy-static'],
              ['less', 'babel'],
              'useref',
              'watch',
              'browserSync',
              callback);
});

gulp.task('build', function(callback){
  runSequence('clean:dist',
              ['static-vendor', 'copy-static'],
              ['less', 'babel'],
              'useref',
              'cacheBuster',
              callback);
});