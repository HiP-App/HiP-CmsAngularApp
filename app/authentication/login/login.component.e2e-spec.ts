import { browser, by, element } from 'protractor'

describe('Login', () => {

  beforeEach(() => {
    browser.get('/login');
  });

  it('should have an input and submit button', () => {

    let allInputElements = element.all(by.css('md-card md-card-content form input'));
    let inputElement = element(by.css('md-card md-card-content form input'));
    let submitButton = element(by.css('md-card md-card-content form button'));
    let loginCardTitle = element(by.css('md-card md-card-title h3'));

    browser.wait(function () {
      return inputElement.isPresent();
    }, 60000);

    expect(inputElement.isPresent()).toEqual(true);
    expect(submitButton.isPresent()).toEqual(true);
    expect(element(by.css('md-card md-card-title h3')).getText()).toEqual('Geben Sie Ihre Daten ein, um sich einzuloggen');

    //send inputs
    allInputElements.first().sendKeys('admin@hipapp.de');
    allInputElements.last().sendKeys('Hipcms@123');

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