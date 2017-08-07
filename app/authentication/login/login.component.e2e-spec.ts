import { browser, by, element, ElementFinder, protractor } from 'protractor';
import * as webdriver from 'selenium-webdriver';
import WebElement = webdriver.WebElement;
let testDataJson = require('../../../hip-test-data.json');

describe('Login', () => {
  let submitButton: ElementFinder;

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
    submitButton = element(by.id('login-button'));
    expect(submitButton.isDisplayed()).toEqual(true);
  });

  it('login test user', () => {
    submitButton.click()
      .then(
        () => browser.sleep(20000)
      ).then(
        () => {
          let emailInput = element(by.css('input[type="email"]'));
          let passwordInput = element(by.css('input[type="password"]'));

          expect(emailInput.isDisplayed()).toEqual(true);
          expect(passwordInput.isDisplayed()).toEqual(true);

          emailInput.sendKeys(testDataJson.username);
          passwordInput.sendKeys(testDataJson.password);

          let loginButton = element(by.css('.auth0-label-submit'));
          loginButton.click();
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
