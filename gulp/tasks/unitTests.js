module.exports = function (gulp, config, plugins) {

    /** runs all unit test */
    gulp.task('unit', function (done) {
        new plugins.karma.Server({
            configFile: __dirname + '/../../test/karma.conf.js'
        }, done).start();
    });

    /** runs all unit test without a GUI */
    gulp.task('unit-headless', plugins.shell.task([
        "xvfb-run gulp unit"
    ]));
};