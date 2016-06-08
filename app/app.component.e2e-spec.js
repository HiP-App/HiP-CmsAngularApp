describe('Shows Dashboard', function () {

  var expectedMsg = 'Dashboard';

  beforeEach(function () {
    browser.get('');
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.css('.md-card h2')).getText()).toEqual(expectedMsg);
  });
});