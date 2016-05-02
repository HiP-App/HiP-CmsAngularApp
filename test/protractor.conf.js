/**
 * This is the main conf file for protractor. Change the base URL to the URL of the application to test.
 * Also change the browsers where the application needs to be tested. Use 'multiCapabilities' to test on different browsers.
 */

exports.config = {

  //The address of a running Selenium server
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['e2e_tests/protractor/tests/HomePageTest.js'],

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'firefox'
  },

  //If the ng-app is not declared on body, then specify where it is declared.
  rootElement: 'html',

  //this can be replaced by localhost address to run tests locally, the following address is the old staging server address
  baseUrl: 'http://localhost:8888/',

  framework: 'jasmine'
};