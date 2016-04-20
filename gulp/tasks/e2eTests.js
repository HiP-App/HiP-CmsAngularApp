module.exports = function (gulp, config, plugins) {

    gulp.task('connectDist', function (done) {
        plugins.connect.server({
            root: 'dist/',
            port: 8888
        });
    });

    gulp.task('testE2e', function (done) {
        gulp.src(["./test/e2e_tests/protractor/tests/*.js"])
            .pipe(plugins.protractor.protractor({
                configFile: "test/protractor.conf.js"
            }))
            .on('error', function (e) {
                throw e;
            })
            .on('end', function () {
                plugins.connect.serverClose();
            });

    });

    gulp.task('e2e', function (done) {
        plugins.runSequence(['connectDist', 'testE2e']);
    });

};