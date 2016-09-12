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
    '@angular2-material': 'node_modules/@angular2-material',
    'angular2-jwt': 'node_modules/angular2-jwt',
    'angular2-toaster': 'node_modules/angular2-toaster',
    'ng2-translate': 'node_modules/ng2-translate',
    'ng2-tag-input': 'node_modules/ng2-tag-input'
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
      format: 'cjs',
      defaultExtension: 'js',
      main: 'ng2-translate.js'
    },
    'ng2-tag-input': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'dist/index.js'
    }
  };

  var materialPkgs = [
    'core',
    'button',
    'card',
    'toolbar',
    'radio',
    'checkbox',
    'icon',
    'list',
    'sidenav',
    'input',
    'progress-circle'
  ];

  materialPkgs.forEach(function(pkg) {
    packages['@angular2-material/' + pkg] = {
      format: 'cjs',
      main: pkg + '.umd.js',
      defaultExtension: 'js' };
  });

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
      main: '/bundles/'+ pkg + '.umd.js',
      defaultExtension: 'js' };
  });

  var packageNames = [
    'app/shared',
    'app/shared/translate',
    'app/shared/taginput'
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
