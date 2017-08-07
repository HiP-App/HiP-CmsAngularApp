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

  it('should have input fields and a submit button', () => {
    browser.wait(() => {
      submitButton = element(by.id('login-button'));
      expect(submitButton.isDisplayed()).toEqual(true);
    }, 10000);
  });

  it('login test user', () => {
    submitButton.click().then(() => {
      browser.wait(() => {
        let emailInput = element(by.css('input[type="email"]'));
        let passwordInput = element(by.css('input[type="password"]'));

        expect(emailInput.isDisplayed()).toEqual(true);
        expect(passwordInput.isDisplayed()).toEqual(true);

        emailInput.sendKeys(testDataJson.username);
        passwordInput.sendKeys(testDataJson.password);

        let loginButton = element(by.css('.auth0-label-submit'));

        return loginButton.click();
      }, 20000);
    }).then(() => {
      browser.wait(() => {
        return browser.getCurrentUrl().then(function (url) {
          return (/dashboard/).test(url);
        });
      }, 20000);
    });
  });
});
