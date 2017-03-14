import { browser, by, element } from 'protractor';

describe('Dashboard', () => {

  beforeEach(() => {
    browser.get('/dashboard');
  });

  it('should show dashboard text', () => {

    let dashboardCardElement = element(by.css('hip-dashboard md-card'));

    browser.wait(function () {
      return dashboardCardElement.isPresent();
    }, 60000);

    expect(dashboardCardElement.getText()).toEqual('Dashboard');

  });
});
