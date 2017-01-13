import { browser, by, element, ElementFinder } from 'protractor';
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

  it('should have input fields and a submit button', () => {
    emailInput = element(by.css('input[name="email"]'));
    passwordInput = element(by.css('input[name="password"]'));
    submitButton = element(by.buttonText('Anmelden'));

    expect(submitButton.isPresent()).toEqual(true);
    expect(emailInput.isPresent()).toEqual(true);
    expect(passwordInput.isPresent()).toEqual(true);
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
