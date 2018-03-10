import { browser, by, element, ElementFinder, ExpectedConditions, protractor } from 'protractor';
import * as webdriver from 'selenium-webdriver';
import WebElement = webdriver.WebElement;
const until = ExpectedConditions; // just for readability
const testDataJson = require('../../../hip-test-data.json');


const getSubmitButton = function () {
  const submitButton = element(by.id('login-button'));
  browser.wait(until.presenceOf(submitButton), 10000, 'submit button taking too long to appear in the DOM');
  return submitButton;
};

const dashboardVisited = function () {
  return browser.getCurrentUrl().then(function (url) {
    return (/dashboard/).test(url);
  });
};

describe('Login', () => {
  beforeAll(function() {
    browser.get('/login');
    browser.waitForAngular();
  });

  it('should have a submit button', () => {
    const submitButton = getSubmitButton();
    expect(submitButton.isPresent()).toBe(true);
  });

  it('should login a test user', () => {
    const submitButton = getSubmitButton();
    browser.wait(until.presenceOf(submitButton), 10000, 'submit button taking too long to appear in the DOM');

    let emailInput = element(by.id('username'));
    let passwordInput = element(by.id('password'));
    browser.wait(until.visibilityOf(emailInput), 10000, 'Email input taking too long to appear in the DOM');
    browser.wait(until.visibilityOf(passwordInput), 10000, 'Password input taking too long to appear in the DOM');
    emailInput.sendKeys(testDataJson.username);
    passwordInput.sendKeys(testDataJson.password);

    expect(emailInput.isPresent()).toBe(true, 'email input not present');
    expect(passwordInput.isPresent()).toBe(true, 'password input not present');
    expect(submitButton.isPresent()).toBe(true, 'login button not present');
    browser.actions().mouseMove(submitButton).click().perform()
      .then(
        () => {
          browser.waitForAngular();
          browser.driver.sleep(5000); // This is important, otherwise the following fails!
          browser.wait(dashboardVisited, 10000, 'Dashboard page taking too long to load');
          browser.executeScript('return window.localStorage.getItem("access_token")')
            .then(
              (token: string) => {
                expect(token !== null && token.length > 3).toBe(true, 'no access token set: ' + token);
              }
            ).catch(
              () => {
                fail('Login failed: no access token');
              }
            );
        }
      );
  });
});
