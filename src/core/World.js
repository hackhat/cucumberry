var testUtils = require('../utils');
var _         = require('lodash');
var Future    = require('fibers/future');





/**
 * @class core.World
 * @param {Function} cb Callback used by cucumber framework.
 */
var World = function(cb){
    this.__browsers = {};
    /**
     * @property __context
     * Context is useful if you need to keep track of stuff. For example
     * you have the default user to open a new browser. Now every action
     * you do, you don't want to specify on which browser to take action
     * because is automatically detected by the __context variables.
     * Now if you want another browser you just add it and name it browser
     * "crazy". Then switch the context and set the current browser to "crazy".
     * Now every future action will be called on the "crazy" browser.
     * Then go back and set the current browser to "default" to go to the first
     * browser and run actions against it.
     * @type {Object}
     * @private
     */
    this.__context = {
        currentBrowser : 'default',
        currentUser    : 'default',
    }
    /**
     * @property __users
     * Contains the user's data.
     * @type {Object}
     * @private
     */
    this.__users = {
        byName  : {},
        byEmail : {},
        all     : [],
    }
    cb && cb();
}





_.extend(World.prototype, {



    /**
     * Adds a new user. A user has a name and email by default.
     * More can be added as you want.
     * @param {Object} userData
     * @param {String} userData.name
     * @param {String} userData.email
     */
    addUserData: function(userData){
        this.__users.byName[userData.name]   = userData;
        this.__users.byEmail[userData.email] = userData;
        this.__users.all.push(userData);
    },



    /**
     * This will shift the context of the actions to this user.
     * @param {String} name
     */
    setCurrentUserName: function(name){
        this.__context.currentUser = name;
        if(!this.__users.byName){
            throw new Error('No user found with name "' + name + '".')
        }
    },



    /**
     * Returns the current user.
     * @return {Object} The user data.
     */
    getCurrentUser: function(){
        return this.__users.byName[this.__context.currentUser];
    },



    /**
     * Returns the user with the name specified.
     * @return {Object} The user data.
     */
    getUserDataByName: function(name){
        return this.__users.byName[name];
    },



    /**
     * Utility function to be called from the `*.steps.js`'s function
     * context with it's context to make the core.World#callStep method
     * to work.
     * @param {*} testContext
     */
    setTestContext: function(testContext){
        this.__testContext = testContext;
    },



    /**
     * Calls a step defined previously. You need to activate
     * the core.plugins.addStepMethod plugin first.
     *
     * Call like this:
     *
     *     this.callStep('stepId', 'arg1', 'arg2', 'arg3');
     *
     * By using this step:
     *
     *     this.addStep('stepId', /^Step id (.*) (.*) (.*)$/, function(arg1, arg2, arg3){
     *         console.log('stepId:', arg1, arg2, arg3)
     *     })
     *
     * Will output:
     *
     *     stepId: arg1 arg2 arg3
     *
     * @param  {String} uniqueName The unique name of the step.
     * @param  {*} args A list of arguments
     */
    callStep: function(uniqueName, args){
        args = Array.prototype.slice.call(arguments);
        // Remove the uniqueName
        args.shift();
        var stepFn = this.__testContext.getStep(uniqueName);
        if(!stepFn) throw new Error('No step with name "' + uniqueName + '" found.');
        stepFn.apply(this, args);
    },



    /**
     * Sleeps for the number of milliseconds specified.
     * @param  {Number} ms
     */
    sleep: function(ms){
        return testUtils.sleep(ms).wait();
    },



    /**
     * Adds a browser.
     * You can use with the [selenium-sync](https://github.com/hackhat/selenium-sync) library.
     * @param {selenium-sync.core.Browser} browser
     * @param {String} [name] The name to assign to the browser. If no name is defined
     *                        it will set the browser with the current context browser name.
     */
    addBrowser: function(browser, name){
        name = name || this.__context.currentBrowser;
        if(this.__browsers[name]) throw new Error('Another browser exists.');
        this.__browsers[name] = browser;
    },



    /**
     * Returns the browser with the specified name. Throws error if not found.
     * You can use with the [selenium-sync](https://github.com/hackhat/selenium-sync) library.
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    getBrowser: function(name){
        name = name || this.__context.currentBrowser;
        if(!this.__browsers[name]) throw new Error('No browser found with name "' + name + '".' + ' Only has these browsers: ' + _.keys(this.__browsers).join(', ') + '.');
        return this.__browsers[name];
    },



    /**
     * Closes all browser so your cucumber process can exit properly.
     * You can use with the [selenium-sync](https://github.com/hackhat/selenium-sync) library.
     */
    quitAllBrowsers: function(){
        _.forEach(this.__browsers, function(browser){
            browser.quit();
        })
    },



})





module.exports = World;
