module.exports = function (gulp, config, plugins) {
  /* 
   * Delete/Clean the 'distPath' and 'buildPath'.
  */
  gulp.task('clean', function() {
    return plugins.del.sync([
      config.distPath,
      config.buildPath
    ]);
  });
};