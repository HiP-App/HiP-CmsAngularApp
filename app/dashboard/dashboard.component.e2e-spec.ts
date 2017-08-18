import { browser, by, element, ExpectedConditions } from 'protractor';
const until = ExpectedConditions; // just for readability

describe('Dashboard', () => {

  beforeEach(() => {
    browser.get('/dashboard');
  });

  it('should show dashboard text', () => {
    let dashboardCardElement = element(by.css('hip-dashboard md-card'));
    browser.wait(until.presenceOf(dashboardCardElement), 30000, 'Dashboard card element taking too long to appear in the DOM');
    expect(dashboardCardElement.getText()).toEqual('Dashboard');
  });
});
