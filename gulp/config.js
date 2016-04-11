/*
 * All configurations used by the project are defined here.
*/ 
module.exports = {
  /*
   * Angularjs app name
  */
  ngAppName: 'app',
  
  /*
   * Folder paths.
  */
  srcPath:   'app',        // Path where the source code resides.
  buildPath: 'tmp',        // Path where the development build will be created.
  distPath:  'dist',       // Path where final distributable app will be placed.
  tasksPath: 'gulp/tasks', // Path where all gulp tasks reside.

  /*
   * List all stylesheets from bower_components here.
   * Globs are not allowed here and the order is important.
  */
  vendorCss: [
    'bower_components/bootstrap/dist/css/bootstrap.css'
  ],

  /*
   * List all javascripts from bower_components here.
   * Globs are not allowed here and the order is important.
  */
  vendorJs: [
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js'
  ],

  /*
   * List all fonts from bower_components here.
  */
  vendorFonts: [
    'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
    'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
    'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
    'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
    'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'
  ]
};