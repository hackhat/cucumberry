var testUtils = require('../utils');
var _         = require('lodash');
var Future    = require('fibers/future');





/**
 * To make internal callable steps:
 *
 * 1. Add a hook.
 * This will make the world instance to know about the test context.
 *
 *     var hooks = function(){
 *         var testContext = this;
 *         this.Before(function(cb){
 *             this.setTestContext(testContext);
 *             cb();
 *         });
 *     };
 *
 *
 * 2. Patch the test context.
 * Make automatically to parse correct values. For example an `1.1` argument will be
 * automatically converted into a decimal number, but `"1.1"` will be a string.
 *
 *     this.World.testUtils.useEJSONArguments(this);
 *
 * Make all the `Given` methods sync with fibers. After you do this the steps will
 * run sync and no need to call the `callback` function when the step ends.
 *
 *     this.World.testUtils.makeFiber(this);
 *
 * In order to have the new `addStep` method in the text context you need
 * to do this. This is required to call the step from another step.
 *
 *     this.World.testUtils.addStepMethod(this);
 * Should be in this order so the saved step is already using fiber.
 *
 *
 * 3. Inherit your world from our world.
 * This will add a method to your world instance named `callStep` which enables you
 * to call a step.
 *
 * 4. Define a step.
 * Your step definition should look like this:
 *
 *     this.addStep('a', /^a$/, function(){
 *         console.log('a')
 *     })
 *
 * The API is like this:
 *
 *     this.addStep(uniqueStepName, regexMatch, function);
 *
 * Notice that the function will not get any `callback` argument at the end as
 * with async tests.
 *
 * Let's add another step
 *
 *     this.addStep('b', /^b (\d+)$/, function(n){
 *         console.log('b', n)
 *     })
 *
 * 5. Run it.
 * Add the feature `Given a`.
 * Call another step:
 *
 *     this.addStep('a', /^a$/, function(){
 *         console.log('a')
 *         this.callStep('b', 1);
 *     })
 *
 * The `callStep` API looks like this:
 *
 *     this.callStep(uniqueStepName, arguments)
 *
 * Now the output will be:
 *
 *     a
 *     b 1
 *
 *
 */
var World = function(cb){
    this.__browsers = {};
    /**
     * Context is useful if you need to keep track of stuff. For example
     * you have the default user to open a new browser. Now every action
     * you do, you don't want to specify on which browser to take action
     * because is automatically detected by the __context variables.
     * Now if you want another browser you just add it and name it browser
     * "crazy". Then switch the context and set the current browser to "crazy".
     * Now every future action will be called on the "crazy" browser.
     * Then go back and set the current browser to "default" to go to the first
     * browser and run actions against it.
     */
    this.__context = {
        currentBrowser : 'default',
        currentUser    : 'default',
    }
    this.__users = {
        byName  : {},
        byEmail : {},
        all     : [],
    }
    cb && cb();
}





World.testUtils = testUtils;





_.extend(World.prototype, {



    setDefaultContext: function(defaults){
        _.extend(this.__context, defaults);
    },



    addUserData: function(userData){
        this.__users.byName[userData.name]   = userData;
        this.__users.byEmail[userData.email]   = userData;
        this.__users.all.push(userData);
    },



    setCurrentUserName: function(name){
        this.__context.currentUser = name;
        if(!this.__users.byName){
            throw new Error('No user found with name "' + name + '".')
        }
    },



    getCurrentUser: function(){
        return this.__users.byName[this.__context.currentUser];
    },



    getUserDataByName: function(name){
        return this.__users.byName[name];
    },



    setTestContext: function(testContext){
        this.__testContext = testContext;
    },



    callStep: function(uniqueName, args){
        args = Array.prototype.slice.call(arguments);
        // Remove the uniqueName
        args.shift();
        this.__testContext.getStep(uniqueName).apply(this, args);
    },



    addBrowser: function(browser, name){
        name = name || this.__context.currentBrowser;
        if(this.__browsers[name]) throw new Error('Another browser exists.');
        this.__browsers[name] = browser;
    },



    getBrowser: function(name){
        name = name || this.__context.currentBrowser;
        if(!this.__browsers[name]) throw new Error('No browser found with name "' + name + '".' + ' Only has these browsers: ' + _.keys(this.__browsers).join(', ') + '.');
        return this.__browsers[name];
    },



    quitAllBrowsers: function(){
        _.forEach(this.__browsers, function(browser){
            browser.quit();
        })
    },



    sleep: function(ms){
        return testUtils.sleep(ms).wait();
    }



}, {
    testUtils  : testUtils,
})





module.exports = World;
