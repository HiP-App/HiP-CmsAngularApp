module.exports = function (gulp, config, plugins) {
  /*
   * 1. Run lint on js/coffee files to check for errors and report them.
   * 2. Compile all coffee files and convert them to plain javascript.
   * 3. Copy js and complied coffee script files to 'buildPath'.
   *
   * Note: Checked files are also cached, so, if any file is changed/added,
   * all above steps are run only on that file.
  */
  gulp.task('scripts', function() {
    return gulp.src(config.srcPath + '/scripts/**/*.+(js|coffee)')
      .pipe(plugins.cached('scripts-task-cache'))
      .pipe(plugins.plumber({ errorHandler: config.eventHandler.onError }))
      .pipe(plugins.if('*.js', plugins.jshint()))
      .pipe(plugins.if('*.js', plugins.jshint.reporter('jshint-stylish')))
      .pipe(plugins.if('*.js', plugins.jshint.reporter('fail')))
      .pipe(plugins.if('*.coffee', plugins.coffeelint()))
      .pipe(plugins.if('*.coffee', plugins.coffeelint.reporter()))
      .pipe(plugins.if('*.coffee', plugins.coffeelint.reporter('fail')))
      .pipe(plugins.if('*.coffee', plugins.coffee({ bare: true })))
      .pipe(gulp.dest(config.buildPath + '/scripts'))
      .pipe(plugins.livereload());
  });
};