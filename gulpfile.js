// Import gulp and some helper modules.
var gulp      = require('gulp');
var concat    = require('gulp-concat');
var sass      = require('gulp-ruby-sass');
var uglify    = require('gulp-uglify');
var rename    = require('gulp-rename');
var watch     = require('gulp-watch');
var plumber   = require('gulp-plumber');

// Concatenate all of the javascript files into one production.js file.
gulp.task('script-concat', function() {
    return gulp
        .src(['client-javascripts/*.js'])
        .pipe(plumber())
        .pipe(concat('production.js'))
        .pipe(gulp.dest('./public/js/'))
});

// Minify the production.js javascript.
gulp.task('script-minify', function() {
    gulp.src('public/js/production.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename({ suffix : '-min' }))
        .pipe(gulp.dest('public/js/'))
});

// Compile the main sass file and store it as style.css in a public directory.
gulp.task('sass-style', function() {
    gulp.src('client-sass/style.sass')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('public/css/'));
});

// Watch for changes in the following directories to run the above commands.
gulp.task('watch', function() {
  gulp.watch('client-javascripts/*', ['script-concat', 'script-minify']);
  gulp.watch('client-sass/style.sass', ['sass-style']);
  gulp.watch('client-sass/includes/*', ['sass-style']);
});

// Run all functions by default.
gulp.task('default', ['script-concat', 'script-minify', 'sass-style', 'watch']);
