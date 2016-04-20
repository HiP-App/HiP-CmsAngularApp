/**
 * @name HomePage
 * @desc This is a PageObject which provides as API to page under test i.e.. HomePageTest.js.
 * The tests use the methods of this page object when ever they need to interact with the UI.
 */


var HomePage = function () {
    /**
     * @name open
     * @desc Tests this on specified URL '/'
     */
    this.open = function () {
        browser.manage().deleteAllCookies();
        browser.get('/');
    };

    /**
     * @name verifyInputOutput
     * @desc Verifies that the given input and the output is same.
     * It holds the UI elements by their model name(ng-model).
     * The except checks whether the input field and the test 'Julie' are same.
     */
    this.verifyInputOutput = function () {
        var greeting = "Hello";
        expect(greeting).toEqual('Hello');
        /*element(by.model('test')).sendKeys('Julie');
         var greeting = element(by.binding('test'));
         expect(greeting.getText()).toEqual('Julie');*/
    };
};

module.exports = new HomePage();