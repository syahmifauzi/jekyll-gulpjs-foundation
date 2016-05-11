var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    jade          = require('gulp-jade'),
    shell         = require('gulp-shell'),
    sitemap       = require('gulp-sitemap'),
    browserSync   = require('browser-sync').create();

var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];


gulp.task('default', ['browserSync', 'watch']);


gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});


// Task for building blog when something changed:
gulp.task('jekyll-build', shell.task(['jekyll build']));


// Task for serving blog with BrowserSync..
gulp.task('browserSync', ['sitemap'], function() {
  browserSync.init({
    server: {
      baseDir: '_site/'
    }
  });
});


// Creating Sitemap -> must build jekyll first
gulp.task('sitemap', ['jekyll-build'], function() {
  gulp.src('_site/**/*.html')
    .pipe(sitemap({siteUrl: 'http://www.syahmifauzi.com'}))
    .pipe(gulp.dest('./'));
});


// Jade.. SASS.. Images.. Fonts.. bowercomp..
// ------------------------------------------------------
gulp.task('jade', function() {
  return gulp.src('_jadefiles/**/*.jade')
    .pipe(jade({ pretty: true }))
      // Run errorHandler if have error
      .on('error', errorHandler)
    .pipe(gulp.dest('_includes'));
});

gulp.task('sass', function() {
  return gulp.src('assets/css/app.scss')
    .pipe($.sass({
      includePaths: sassPaths
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('images', function() {
  return gulp.src('assets/images/**/*')
    .pipe(gulp.dest('_site/assets/images'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts', function() {
  return gulp.src('assets/fonts/**/*')
    .pipe(gulp.dest('_site/assets/fonts'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('bowercomp', function() {
  return gulp.src(['assets/js/app.js', 'bower_components/jquery/dist/jquery.js', 'bower_components/what-input/what-input.js', 'bower_components/foundation-sites/dist/foundation.js'])
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/js'));
});
// ------------------------------------------------------


gulp.task('watch', ['sass', 'bowercomp'], function() {
  gulp.watch(['*.html', '_includes/**/*.html', '_layouts/*.html', '_posts/*.*', 'blog/*.html'], ['jekyll-rebuild']);
  gulp.watch(['assets/css/**/*.scss'], ['sass']);
  gulp.watch(['_jadefiles/**/*.jade'], ['jade']);
  gulp.watch(['assets/images/**/*'], ['images']);
  gulp.watch(['assets/fonts/**/*'], ['fonts']);
  gulp.watch(['assets/js/app.js', 'bower_components/**/*.js'], ['bowercomp']);
});


// Prevent gulp watch from break..
// ------------------------------------------------------
function errorHandler(error) {
    // Logs out error in the command line
  console.log(error.toString());
    // Ends the current pipe, so Gulp watch doesn't break
  this.emit('end');
}
// ------------------------------------------------------
