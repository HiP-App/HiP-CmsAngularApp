module.exports = function (gulp, config, plugins) {
  /*
   * Concatenate all css/js files included in 
   * index.html in the order they are mentioned and 
   * then minify them and add revision to the file name.
   *
   * Also Minify main index.html page.
  */
  gulp.task('useref', function() {
    return gulp.src(config.buildPath + '/index.html')
      .pipe(plugins.injectString.replace('<script src="http://localhost:35729/livereload.js"></script>\n', ''))
      .pipe(plugins.useref())
      .pipe(plugins.if('*.js', plugins.ngAnnotate()))
      .pipe(plugins.if('*.js', plugins.uglify()))
      .pipe(plugins.if('*.js', plugins.rev()))
      .pipe(plugins.if('*.css', plugins.cssnano()))
      .pipe(plugins.if('*.css', plugins.rev()))
      .pipe(plugins.revReplace())
      .pipe(plugins.if('*.html', plugins.htmlmin({ collapseWhitespace: true })))
      .pipe(gulp.dest(config.distPath));
  });


  /*
   * Builds app for production at 'distPath'
   * Run using 'gulp compile'
  */ 
  gulp.task('compile', ['build'], function (callback) {
    plugins.runSequence('useref', function() {
      config.eventHandler.onTaskComplete('complile');
      callback();
    });
  });
};