var gulp = require('gulp'),
    fs = require('fs'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babelify = require('babelify'),
    rimraf = require('rimraf'),
    source = require('vinyl-source-stream'),
    _ = require('lodash'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    batch = require('gulp-batch'),
    uglifycss = require('gulp-uglifycss'), // css
    uglify = require('gulp-uglify'), // js
    buffer = require('vinyl-buffer');

// CONFIG
var config = {
    entryFile: './client-dev/js/main.js',
    outputDir: './build/assets/js',
    outputFile: 'app.js'
};

// CLEAN THE OUTPUT DIRECTORY
gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});

var bundler;

function getBundler() {
    if (!bundler) {
        bundler = watchify(browserify(config.entryFile, _.extend({ debug: false }, watchify.args)));
    }
    return bundler;
};

function bundle() {
    return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config.outputFile))
    .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
    .pipe(uglify()) // now gulp-uglify works 
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
}

// CLEAN BUILD
gulp.task('build-persistent', ['clean'], function() {
    return bundle();
});

// CONCAT AND UGLIFY JS
gulp.task('browserify', function() {
  return browserify(config.entryFile)
    .transform(babelify)
    .bundle()
    .pipe(source('app.min.js')) // gives streaming vinyl file object
    .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
    .pipe(uglify()) // now gulp-uglify works 
    .pipe(gulp.dest(config.outputDir));
});

// CONCAT AND UGLIFY CSS
gulp.task('css', function(){
    return gulp.src([
        './client-dev/css/normalize.css', 
        './client-dev/css/main.css'])
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('./build/assets/css/'))
        .pipe(rename('main.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('./build/assets/css/'));
});

// BUILD ONLY
gulp.task('build', ['build-persistent'], function() {
    process.exit(0);
});

// WATCH FILES
gulp.task('watch', ['build-persistent'], function() {

    browserSync({
        server: {
            baseDir: './build'
        }  
    });

    getBundler().on('update', function() {
        gulp.start(['build-persistent', 'css'])
    });

});

// WEB SERVER
gulp.task('serve', function () {
    browserSync({
        server: {
            baseDir: './build'
        }
    });
});
