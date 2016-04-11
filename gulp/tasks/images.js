module.exports = function (gulp, config, plugins) {
  /*
   * Optimize images and copy them to 'distPath' if its a production
   * build, otherwise copy to 'buildPath'.

   * Optimized images are also cached, so, if a new image is added, all
   * above steps are run only on that image.
  */
  gulp.task('images', function() {
    return gulp.src(config.srcPath + '/images/**/*.+(png|jpg|jpeg|gif|svg)')
      .pipe(plugins.cached('images-task-cache'))
      .pipe(plugins.if(config.prodBuild, plugins.imagemin({ interlaced: true })))
      .pipe(plugins.if(config.prodBuild, 
        gulp.dest(config.distPath + '/images'),
        gulp.dest(config.buildPath + '/images'))
      );
  });
};