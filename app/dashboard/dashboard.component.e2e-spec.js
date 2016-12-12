"use strict";
var protractor_1 = require("protractor");
describe('Dashboard', function () {
    beforeEach(function () {
        protractor_1.browser.get('/dashboard');
    });
    it('should show dashboard', function () {
        protractor_1.browser.wait(function () {
            return protractor_1.element(protractor_1.by.css('hip-dashboard md-card h2')).isPresent();
        }, 60000);
        expect(protractor_1.element(protractor_1.by.css('hip-dashboard md-card h2')).isPresent()).toEqual(true);
        expect(protractor_1.element.all(protractor_1.by.css('hip-dashboard md-card h2')).get(0).getText()).toEqual('Dashboard');
    });
});
//# sourceMappingURL=dashboard.component.e2e-spec.js.map