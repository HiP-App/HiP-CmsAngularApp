// Read configurations from file 'config.js'
var config = require('./gulp/config.js');


/*
 * Check the task name, if it is equal to 'compile',
 * then set prodBuild to true for identifying 
 * that task being run is for creating a production build.
*/
config.prodBuild = require('yargs').argv._ == 'compile' ? true : false;


// Require gulp
var gulp = require('gulp');


/*
 * Require 'gulp-load-plugins' to load all plugins
 * listed in file 'package.json'
*/
var plugins = require('gulp-load-plugins')({
  pattern: ['*'], // Load all 
  lazy: true // whether the plugins should be lazy loaded on demand 
});


/*
 * Event handler for handling things like errors and callbacks.
*/
config.eventHandler = require('./gulp/event-handler.js')(plugins);


/*
 * Load all tasks listed at 'config.tasksPath'.
*/
config.pattern = config.tasksPath + '/**/*.js';
require('load-gulp-tasks')(gulp, config, plugins);