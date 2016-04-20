module.exports = function (gulp, config, plugins) {

    gulp.task('unit', function (done) {
        new plugins.karma.Server({
            configFile: __dirname + '/../../test/karma.conf.js'
        }, done).start();
    });
};