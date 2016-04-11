# HiP-CmsAngularApp
> Simple, easy and efficient build management system for angularjs apps. Built on Gulp.

The purpose of this project is to provide a boilerplate to quickly start building Angularjs applications. Inspired from [ngbp](https://github.com/ngbp/ngbp) but with the goodness, power and speed of Gulp. It's packed with all the tasks needed for development and production builds and provides best practices for structuring your angularjs apps.

***

## Quick Start

Install Node.js and then:

```sh
$ git clone git@github.com:uxman-sherwani/ng-boilerplate.git
$ cd ng-boilerplate
$ sudo npm -g install gulp jshint bower
$ npm install
$ bower install
$ gulp
```

Then, open `file:ng-boilerplate/tmp/index.html` in your browser. That's all you need to start adding code for your angularjs application (no need to run any node server).

## Directory Structure
The driectory structure is based on angularjs best pratices and it makes maintaining and scaling the app super easy.

```
ng-boilerplate
  > app
    > fonts
    > images
    > styles
      <-- All stylesheets here -->
    > scripts
      - app.js
      - routes.js
      > components
        > home
          - home.js
          - home.tpl.html
        <-- All other components here -->
      > services
        <-- All services here -->
      > directives
        <-- All directives here -->
  > gulp
    > tasks
      <-- All gulp tasks here -->
    - config.js
    - event-handler.js
  - bower.json
  - gulpfile.js
  - package.json
```
## Configurations
File `gulp/config.js` contains all the configurations needed by gulp to run all the tasks.

```
ngAppName: 'app',        // Angularjs app name
  
srcPath:   'app',        // Path where the source code resides.
buildPath: 'tmp',        // Path where the development build will be created.
distPath:  'dist',       // Path where final distributable app will be placed.
tasksPath: 'gulp/tasks', // Path where all gulp tasks reside.

/*
 * List all stylesheets from bower_components here.
 * Globs are not allowed here and the order is important.
*/
vendorCss: [],

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
vendorFonts: []
```

## Tasks

##### 1. Default
Run by typing `gulp`. This task creates a development build of the angularjs app under the path specified in config above. All the source files are also being watched, so, when you change/add/delete/rename a file, the build is also updated and browser is refreshed automatically to display changes. Sweet :)

#### 2. Compile
Run by typing `gulp compile`. This task create a production build of the angularjs app under the path specified in config above. All `js` and `css` files are concatinated and minified. The resulting `js` and `css` files are also versioned. All partials are minified and added to angular's template cache and the index file is also minified. Also, images are optimzed.

## Features

* Scripts
  * Supported formats `js` and `coffee`.
  * Lint
  * ng-Annotate
  * Concat and uglify
* Stylesheets
  * Supported formats `css`, `scss` and `less`.
  * Autoprefixer
  * Concat and minify
* Image optimization
* Template caching for partials
* Livereload
* Bower for managing front-end dependencies.

## Bower Info
When adding front-end dependencies using bower, first run

`bower install [PACKAGE_NAME] --save-dev`

Then mention paths to all the css, js and font files offered by the package in `gulp/config.js`. That's all.
