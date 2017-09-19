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
    expect(submitButton.isPresent()).toEqual(true);
  });

  it('should login a test user', () => {
    const submitButton = getSubmitButton();
    browser.actions().mouseMove(submitButton).click().perform()
      .then(
        () => browser.wait(auth0Visited, 10000, 'auth0 page taking too long to load')
      ).then(
        () => {
          // wait until auth0 lock appears:
          browser.wait(until.visibilityOf(element(by.css('.auth0-lock'))), 10000, 'Auth0 Lock taking too long to appear in the DOM');

          let lastLoginButton = element(by.css('.auth0-lock-social-button'));
          expect(lastLoginButton.isPresent()).toBe(false, 'auth0-lock-social-button present but expected to be not');

          let emailInput = element(by.css('.auth0-lock-input-email input'));
          let passwordInput = element(by.css('.auth0-lock-input-password input'));
          browser.wait(until.visibilityOf(emailInput), 10000, 'Email input taking too long to appear in the DOM');
          browser.wait(until.visibilityOf(passwordInput), 10000, 'Password input taking too long to appear in the DOM');
          emailInput.sendKeys(testDataJson.username);
          passwordInput.sendKeys(testDataJson.password);

          let loginButton = element(by.css('.auth0-lock-submit'));
          browser.wait(until.visibilityOf(loginButton), 10000, 'Login Button taking too long to appear in the DOM');

          expect(emailInput.isPresent()).toBe(true, 'email input not present');
          expect(passwordInput.isPresent()).toBe(true, 'password input not present');
          expect(loginButton.isPresent()).toBe(true, 'login button not present');
          browser.actions().mouseMove(loginButton).click().perform();
        }
      ).then(
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
