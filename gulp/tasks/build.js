module.exports = function (gulp, config, plugins) {
  /*
   * Builds app for development at 'buildPath'
   * Run using 'gulp build'
  */ 
  gulp.task('build', function (callback) {
    plugins.runSequence('clean', ['scripts', 'styles', 'templates', 'images', 'fonts', 'vendors'], 'index', function() {
      config.eventHandler.onTaskComplete('build');
      callback();
    });
  });
};