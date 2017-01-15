describe('Get Title', function () {

    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get('#/login');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('HiP CMS');
    });

});