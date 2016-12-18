import { browser, by, element } from 'protractor';
var testDataJson = require('../../../hip-config.json');

describe('Login', () => {

  beforeEach(() => {
    browser.get('/login');
  });

  it('should have an input and button', () => {
    //console.log(ConfigService);
    let allInputElements = element.all(by.css('md-card md-card-content form input'));
    let inputElement = element(by.css('md-card md-card-content form input'));
    let submitButton = element(by.css('md-card md-card-content form button'));
    let loginCardTitle = element(by.css('md-card md-card-title'));

    browser.wait(function () {
      return inputElement.isPresent();
    }, 60000);

    expect(inputElement.isPresent()).toEqual(true);
    expect(submitButton.isPresent()).toEqual(true);
    expect(loginCardTitle.getText()).toEqual('Geben Sie Ihre Daten ein, um sich einzuloggen');

    //send inputs
    allInputElements.first().sendKeys(testDataJson.userName);
    allInputElements.last().sendKeys(testDataJson.passWord);

    //click function & redirect
    submitButton.click().then(() => {
      browser.driver.wait(function () {
        return browser.driver.getCurrentUrl().then(function (url) {
          return (/dashboard/).test(url);
        });
      }, 50000);
    });

  });
});