"use strict";
var protractor_1 = require("protractor");
describe('Login', function () {
    beforeEach(function () {
        protractor_1.browser.get('/login');
    });
    it('should have an input and submit button', function () {
        var allInputElements = protractor_1.element.all(protractor_1.by.css('md-card md-card-content form input'));
        var inputElement = protractor_1.element(protractor_1.by.css('md-card md-card-content form input'));
        var submitButton = protractor_1.element(protractor_1.by.css('md-card md-card-content form button'));
        var loginCardTitle = protractor_1.element(protractor_1.by.css('md-card md-card-title h3'));
        protractor_1.browser.wait(function () {
            return inputElement.isPresent();
        }, 60000);
        expect(inputElement.isPresent()).toEqual(true);
        expect(submitButton.isPresent()).toEqual(true);
        expect(protractor_1.element(protractor_1.by.css('md-card md-card-title h3')).getText()).toEqual('Geben Sie Ihre Daten ein, um sich einzuloggen');
        //send inputs
        allInputElements.first().sendKeys('admin@hipapp.de');
        allInputElements.last().sendKeys('Hipcms@123');
        //click function & redirect
        submitButton.click().then(function () {
            protractor_1.browser.driver.wait(function () {
                return protractor_1.browser.driver.getCurrentUrl().then(function (url) {
                    return (/dashboard/).test(url);
                });
            }, 50000);
        });
    });
});
//# sourceMappingURL=login.component.e2e-spec.js.map