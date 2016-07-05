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
    'angular2-jwt': 'node_modules/angular2-jwt'
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
    '@angular2-material/core': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'core.js'
    },
    '@angular2-material/toolbar': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'toolbar.js'
    },
    '@angular2-material/button': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'button.js'
    },
    '@angular2-material/sidenav': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'sidenav.js'
    },
    '@angular2-material/card': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'card.js'
    },
    '@angular2-material/list': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'list.js'
    },
    '@angular2-material/icon': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'icon.js'
    },
    '@angular2-material/input': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'input.js'
    },
    '@angular2-material/checkbox': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'checkbox.js'
    },
    '@angular2-material/radio': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'radio.js'
    }
  };

  var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router-deprecated',
    '@angular/router',
    '@angular/testing',
    '@angular/upgrade'
  ];

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  var config = {
    map: map,
    packages: packages
  };

  System.config(config);

})(this);
