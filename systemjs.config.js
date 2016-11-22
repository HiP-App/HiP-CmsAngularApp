/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 * Override at the last minute with global.filterSystemConfig (as plunkers do)
 */
(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'app': 'app',
    'rxjs':                       'node_modules/rxjs',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    '@angular': 'node_modules/@angular',
    'angular2-jwt': 'node_modules/angular2-jwt',
    'angular2-toaster': 'node_modules/angular2-toaster',
    'ng2-material-dropdown': 'node_modules/ng2-material-dropdown',
    'ng2-translate': 'node_modules/ng2-translate/bundles',
    'ng2-tag-input': 'node_modules/ng2-tag-input',
    'js-base64': 'node_modules/js-base64/base64.js',
    'buffer': 'node_modules/buffer-shims/index.js',
    'docsApi': 'assets/only-office'
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { defaultExtension: 'js' },
    'angular2-jwt': {
      defaultExtension: 'js',
      main: 'angular2-jwt.js'
    },
    'angular2-toaster': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'angular2-toaster.js'
    },
    'ng2-translate': {
      defaultExtension: 'js',
      main: 'index.js'
    },
    'ng2-material-dropdown': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'index.js'
    },
    'ng2-tag-input': {
      defaultExtension: 'js',
      main: 'dist/ng2-tag-input.bundle.js'
    },
    'docsApi': {
      defaultExtension: 'js',
      main: 'api.js'
    }
  };

  var angularPkgs = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router-deprecated',
    'router',
    'testing',
    'upgrade'
  ];

  angularPkgs.forEach(function(pkg) {
    packages['@angular/' + pkg] = {
      format: 'cjs',
      main: 'bundles/'+ pkg + '.umd.js',
      defaultExtension: 'js' };
  });

  packages['@angular/material'] = {
    format: 'cjs',
    main: 'material.umd.js',
    defaultExtension: 'js'
  };

  var packageNames = [
    'app/shared',
    'app/shared/translate'
  ];

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages[pkgName] = {
      main: 'index.js',
      defaultExtension: 'js' };
  });

  var config = {
    map: map,
    packages: packages

  };

  System.config(config);

})(this);
