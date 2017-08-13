import { browser, by, element, ElementFinder, protractor } from 'protractor';
import * as webdriver from 'selenium-webdriver';
import WebElement = webdriver.WebElement;
let testDataJson = require('../../../hip-test-data.json');

const auth0Visited = function() {
  return browser.getCurrentUrl().then(function(url) {
    return url.startsWith('https://hip.eu.auth0.com/');
  });
};

describe('Login', () => {
  beforeAll(function() {
    browser.get('/login');
    browser.waitForAngular();
  });

  beforeEach(function() {
    browser.wait(function() {
      let deferred = protractor.promise.defer();
      element(by.tagName('h1')).isPresent()
        .then(function (isPresent) {
          deferred.fulfill(!isPresent);
        });
      return deferred.promise;
    }, 10000);
  });

  it('should have a submit button', () => {
    const submitButton = element(by.id('login-button'));
    expect(submitButton.isDisplayed()).toEqual(true);
  });

  it('should login a test user', () => {
    const submitButton = element(by.id('login-button'));
    submitButton.click()
      .then(
        () => browser.wait(auth0Visited, 60000)
      ).then(
        () => {
          let lastLoginButton = element(by.css('.auth0-lock-last-login-pane button'));
          lastLoginButton.isPresent().then(function (loginViaLastLogin) {
            if (loginViaLastLogin) {
              console.error('login via last login');
              lastLoginButton.click();
            } else {
              console.error('login via username/password');
              let emailInput = element(by.css('input[type="email"]'));
              let passwordInput = element(by.css('input[type="password"]'));
              emailInput.sendKeys(testDataJson.username);
              passwordInput.sendKeys(testDataJson.password);
              let loginButton = element(by.css('.auth0-lock-submit'));
              loginButton.click();
            }
          });
        }
      ).then(
        () => {
          browser.wait(() => {
            return browser.getCurrentUrl().then(function (url) {
              return (/dashboard/).test(url);
            });
          }, 50000);
        }
      );
  });
});
