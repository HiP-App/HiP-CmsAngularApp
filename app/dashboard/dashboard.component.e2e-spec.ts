import { browser, by, element } from 'protractor'

describe('Dashboard', () => {

  beforeEach(() => {
    browser.get('/dashboard');
  });


  it('should show dashboard', () => {
    browser.wait(function () {
      return element(by.css('hip-dashboard md-card h2')).isPresent();
     },60000);

    expect(element(by.css('hip-dashboard md-card h2')).isPresent()).toEqual(true);
    expect(element.all(by.css('hip-dashboard md-card h2')).get(0).getText()).toEqual('Dashboard' );

  });


});