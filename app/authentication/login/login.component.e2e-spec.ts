import { browser, by, element, ElementFinder, ExpectedConditions, protractor } from 'protractor';
import * as webdriver from 'selenium-webdriver';
import WebElement = webdriver.WebElement;
const until = ExpectedConditions; // just for readability
const testDataJson = require('../../../hip-test-data.json');

const auth0Visited = function() {
  return browser.getCurrentUrl().then(function(url) {
    return url.startsWith('https://hip.eu.auth0.com/');
  });
};

describe('Login', () => {
  beforeAll(function() {
    browser.get('/login');
    browser.waitForAngular();
    browser.driver.manage().window().maximize();
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
          // wait until auth0 lock appears:
          browser.wait(until.presenceOf(element(by.css('.auth0-lock'))), 10000, 'Auth0 Lock taking too long to appear in the DOM');

          let lastLoginButton = element(by.css('.auth0-lock-social-button'));
          browser.wait(until.presenceOf(lastLoginButton), 10000,
            'Last Login Button taking too long to appear in the DOM - using Email-Authentication');
          lastLoginButton.isPresent().then(function (loginViaLastLogin) {
            if (loginViaLastLogin) {
              expect(lastLoginButton.isPresent()).toBe(true, 'auth0-lock-social-button not present');
              lastLoginButton.click();
            } else {

              let emailInput = element(by.css('.auth0-lock-input-email input'));
              let passwordInput = element(by.css('.auth0-lock-input-password input'));
              browser.wait(until.presenceOf(emailInput), 1000, 'Email input taking too long to appear in the DOM');
              browser.wait(until.presenceOf(passwordInput), 1000, 'Password input taking too long to appear in the DOM');
              emailInput.sendKeys(testDataJson.username);
              passwordInput.sendKeys(testDataJson.password);

              let loginButton = element(by.css('.auth0-lock-submit'));
              browser.wait(until.presenceOf(loginButton), 1000, 'Login Button taking too long to appear in the DOM');

              expect(lastLoginButton.isPresent()).toBe(false, 'auth0-lock-social-button present but expected to be not');
              expect(emailInput.isPresent()).toBe(true, 'email input not present');
              expect(passwordInput.isPresent()).toBe(true, 'password input not present');
              expect(loginButton.isPresent()).toBe(true, 'login button not present');
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
