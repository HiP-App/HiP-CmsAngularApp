module.exports = function (gulp, config, plugins) {
  /*
   * 1. Convert all angular html partials to javascript templates.
   * 2. Add all converted templates to angular $templateCache.
   * 3. Copy the final script to 'buildPath'.
  */
  gulp.task('templates', function () {
    return gulp.src(config.srcPath + '/scripts/**/*.tpl.html')
      .pipe(plugins.html2js('templates.js', {
        adapter: 'angular',
        name: config.ngAppName
      }))
      .pipe(gulp.dest(config.buildPath + '/scripts'))
      .pipe(plugins.livereload());
  });
};