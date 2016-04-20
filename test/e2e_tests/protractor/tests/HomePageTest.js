/**
 * This Page contains actual Tests which uses the Page Objects from the poms folder.
 *
 */
describe('angularjs homepage', function () {
    var homePage = require("../poms/HomePage.js");

    /**
     * This runs before the 'it' block regardless of the success or failure of block.
     */
    beforeEach(function () {
        homePage.open()
    });

    /**
     * The 'it' block consists of main scenario to be tested. Here it calls the page object to verify the output.
     */
    it('Verify the output should be same as input', function () {
        homePage.verifyInputOutput();
    });
});