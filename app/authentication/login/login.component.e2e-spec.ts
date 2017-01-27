import { browser, by, element, ElementFinder, protractor } from 'protractor';
import * as webdriver from 'selenium-webdriver';
import WebElement = webdriver.WebElement;
let testDataJson = require('../../../hip-test-data.json');

describe('Login', () => {
  let emailInput: ElementFinder;
  let passwordInput: ElementFinder;
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
    });
  });

  it('should have input fields and a submit button', () => {
    emailInput = element(by.css('input[type="email"]'));
    passwordInput = element(by.css('input[type="password"]'));
    submitButton = element(by.buttonText('Anmelden'));

    expect(emailInput.isDisplayed()).toEqual(true);
    expect(passwordInput.isDisplayed()).toEqual(true);
    expect(submitButton.isDisplayed()).toEqual(true);
  });

  it('login test user', () => {
    emailInput.sendKeys(testDataJson.username);
    passwordInput.sendKeys(testDataJson.password);

    submitButton.click().then(() => {
      browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          return (/dashboard/).test(url);
        });
      }, 50000);
    });
  });
});
