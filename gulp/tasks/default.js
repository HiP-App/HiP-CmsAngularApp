module.exports = function (gulp, config, plugins) {
  /*
   * Builds app for development at 'buildPath'
   * Also watches all files for changes and run tasks
   * to update development build.
   *
   * Run using 'gulp'
  */  
  gulp.task('default', ['build'], function () {
    plugins.livereload.listen();
    
    gulp.watch(config.srcPath + '/scripts/**/*.tpl.html', ['templates']);
    gulp.watch(config.srcPath + '/images/**/*', ['images']);
    gulp.watch(config.srcPath + '/fonts/**/*', ['fonts']);
    gulp.watch(config.srcPath + '/index.html', ['index']);

    gulp.watch(config.srcPath + '/scripts/**/*.+(js|coffee)', function (event) {
      if(event.type == 'changed')
        plugins.runSequence('scripts');
      else {
        if(event.type == 'deleted' || event.type == 'renamed') {
          var filePath = event.type == 'renamed' ? event.old : event.path;
          filePath = filePath.replace(config.srcPath, config.buildPath);
          filePath = filePath.replace('coffee', 'js');
          plugins.del.sync(filePath);
        }
        
        plugins.runSequence('scripts', 'index');
      }
    });

    gulp.watch(config.srcPath + '/styles/**/*.+(css|scss|less)', function (event) {
      if(event.type == 'changed')
        plugins.runSequence('styles');
      else {
        if(event.type == 'deleted' || event.type == 'renamed') {
          var filePath = event.type == 'renamed' ? event.old : event.path;
          filePath = filePath.replace(config.srcPath, config.buildPath);
          filePath = filePath.replace('scss', 'css');
          filePath = filePath.replace('less', 'css');
          plugins.del.sync(filePath);
        }

        plugins.runSequence('styles', 'index');
      }
    });
  });
};