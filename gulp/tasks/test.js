module.exports = function (gulp, config, plugins) {

  /** shortcut to run unit and end-to-end tests simultaneously */
  gulp.task('test', function () {
    plugins.runSequence(['unit', 'e2e']);
  });

  /** hortcut to run unit and end-to-end tests simultaneously without a GUI */
  gulp.task('test-headless', plugins.shell.task([
    "xvfb-run gulp test"
  ]))
};