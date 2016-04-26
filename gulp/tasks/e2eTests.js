module.exports = function (gulp, config, plugins) {

    /** connects a server to the distPath */
    gulp.task('connectDist', function () {
        plugins.connect.server({
            root: config.distPath,
            port: 8888
        });
    });

    /** connects a server to the buildPath */
    gulp.task('connectBuild', function () {
        plugins.connect.server({
            root: config.buildPath,
            port: 8888
        });
    });

    /** runs all end-to-end test in the /protractor/test folder */
    gulp.task('testE2e', function () {
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

    /** first connects a server and then runs the test */
    gulp.task('e2e', function (done) {
        if (plugins.yargs.argv.build === undefined) {
            plugins.util.log('DEBUG', 'testing dist location: ', config.distPath);
            plugins.runSequence(['connectDist', 'testE2e'], done);
        } else {
            plugins.util.log('DEBUG', 'testing dist location: ', config.buildPath);
            plugins.runSequence(['connectBuild', 'testE2e'], done);
        }
    });

    /** connects a server and runs all end-to-end test without a GUI needed */
    gulp.task('e2e-headless', plugins.shell.task([
        "xvfb-run gulp e2e"
    ]));

};