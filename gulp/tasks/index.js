module.exports = function (gulp, config, plugins) {
  /*
   * Copy main index.html file to 'buildPath'.
  */
  gulp.task('index', function() {
    var appJsPath       = config.buildPath + '/scripts/app.js',
        routesJsPath    = config.buildPath + '/scripts/routes.js',
        templatesJsPath = config.buildPath + '/scripts/templates.js';

    var files = [];

    // All stylesheets
    files = files.concat(config.vendorCss);
    files.push(config.buildPath + '/styles/**/*.css');

    // All javascript
    files = files.concat(config.vendorJs);
    files = files.concat(appJsPath, routesJsPath, templatesJsPath);
    files.push(config.buildPath + '/scripts/**/*.js');

    sources = gulp.src(files, { read: false });

    return gulp.src(config.srcPath + '/index.html')
      .pipe(plugins.inject(sources, { ignorePath: config.buildPath, addRootSlash: false }))
      .pipe(plugins.injectString.before('</body>', '<script src="http://localhost:35729/livereload.js"></script>\n'))
      .pipe(gulp.dest(config.buildPath))
      .pipe(plugins.livereload());
  });
};
