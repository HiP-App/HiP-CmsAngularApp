import { browser, by, element } from 'protractor'

describe('Dashboard', () => {

  beforeEach(() => {
    browser.get('/dashboard');
  });


  it('should show dashboard', () => {

    let dashboardCardElement = element(by.css('hip-dashboard md-card h2'));
    browser.wait(function () {
      return dashboardCardElement.isPresent();
    }, 60000);

    expect(dashboardCardElement.getText()).toEqual('Dashboard');

  });


});