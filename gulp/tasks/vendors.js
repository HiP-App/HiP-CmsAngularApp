module.exports = function (gulp, config, plugins) {
  /*
   * Copy all vendors/bower_components to 'buildPath'.
  */
  gulp.task('vendors', function() {
    return gulp.src('bower_components/**/*')
      .pipe(gulp.dest(config.buildPath + '/bower_components'));
  });
};