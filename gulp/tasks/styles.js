module.exports = function (gulp, config, plugins) {
  /*
   * 1. Compile all Sass files into plain css files
   * 2. Compile all Less files into plain css files
   * 3. Copy css and compiled sass/less files to 'buildPath'.
   * 
   * Note: Checked files are also cached, so, if any file is changed/added,
   * all above steps are run only on that file.
  */
  gulp.task('styles', function() {
    return gulp.src(config.srcPath + '/styles/**/*.+(css|scss|less)')
      .pipe(plugins.cached('styles-task-cache'))
      .pipe(plugins.plumber({ errorHandler: config.eventHandler.onError }))
      .pipe(plugins.if('*.scss', plugins.sass()))
      .pipe(plugins.if('*.less', plugins.less()))
      .pipe(plugins.autoprefixer())
      .pipe(gulp.dest(config.buildPath + '/styles'))
      .pipe(plugins.livereload());
  });
};