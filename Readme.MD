![cucumberry](./docs/repo-header.jpg)

[Cucumber-js](https://github.com/cucumber/cucumber-js) with sync, callable steps and parsed arguments. 

**Quick features:**

 - Sync step definitions, no more callbacks;
 - Call other step from step definitions;
 - Parse values such as arrays, objects and decimals;

You **should first understand** [official cucumber](https://github.com/cucumber/cucumber-js) before using this library, because it might be confusing at first.



## Install

    npm install cucumberry --save-dev



## API

Check the **[full API here](https://cdn.rawgit.com/hackhat/cucumberry/v0.0.3/docs/jsduck/index.html)**.



## Features


### Call steps from other steps

```javascript
// Feature:
Feature: Test
Scenario: Test
    Given a
    Given b 2

// Step defintions:
this.addStep('a', /^a$/, function(){
    console.log('a');
    this.callStep('b', 1);
})

this.addStep('b', /^b (\d+)$/, function(n){
    console.log('b', n);
})

// Output:
// a
// b 1
// b 2
```


### No more async steps, all your steps are sync and non blocking

Using [fibers](https://github.com/laverdet/node-fibers) your steps now can be sync and also non-blocking. Is suggested to use
together with the [selenium-sync](https://github.com/hackhat/selenium-sync) library.

```javascript
// Step defintions:
this.addStep('a', /^a$/, function(){
    // Using the selenium-sync library
    var browser = this.getBrowser();
    var facebookW = this.getBrowser().getWindowByTitle('Facebook');
    facebookW.focus();
    facebookW.waitToLoad();
    facebookW.waitForElement('#email');
    var test = this.getUserDataByName('test');
    facebookW.findEl('#email').sendKeys(test.email);
    facebookW.findEl('#pass').sendKeys(test.password);
    facebookW.findEl('#loginbutton').click();
    browser.waitWindowToBeClosed(facebookW);
    // No need to call any callback because when reaches this line
    // the above code has already been done. Is sync, remember?
})
```

### Parse values automatically

Everything is considered to be a pure JavaScript value.

```javascript
// Feature:
Feature: Test
Scenario: Test
    Given A simple number 2
    Given A complex object {a: 'abc', b: 3}
    Given An array [1, 2, 3]

// Step defintions:
this.addStep('simpleNumber', /^A simple number (\d+)$/, function(n){
    console.log('simpleNumber', n * 2); // logs: simpleNumber 4
})
this.addStep('complexObject', /^A complex object (.*)$/, function(obj){
    console.log('complexObject', obj.a);     // logs: complexObject abc
    console.log('complexObject', obj.b * 2); // logs: complexObject 6
})
this.addStep('anArray', /^An array (.*)$/, function(array){
    console.log('anArray', array); // logs: anArray [ 1, 2, 3 ]
})
```



## Setup

To use this library you have to make several steps.


### Install dependencies

Will install the dependencies for your example:

    npm install cucumber cucumberry lodash --save-dev



### Add a before hook

This will make the world instance to know about the test context. This is required to
make the core.plugins.addStepMethod plugin to work. This enables you to **call other steps from step definitions**.

```javascript
// In your "support/hooks.js" file:
var hooks = function(){
    // You have to save the context here.
    var testContext = this;
    this.Before(function(cb){
        // And then send it to the world instance
        // with the `setTestContext` method.
        this.setTestContext(testContext);
        cb();
    });
};
```


### Patch the test context

All patches have place in the `*.steps.js` (step definition) files. An example can be shown here:

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberryPlugins = require('cucumberry').plugins;
}
```


#### Use all plugins effortlessly

If you want to use all plugins here is the code:

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberryPlugins = require('cucumberry').plugins;
    cucumberryPlugins.useAll(this);
}
```

Or you can use individually in this **exact order only**:

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberryPlugins = require('cucumberry').plugins;
    cucumberryPlugins.parseArguments(this);
    cucumberryPlugins.makeFiber(this);
    cucumberryPlugins.addStepMethod(this);
}
```


#### Parse values

Your tests feature will send JavaScript objects to the steps definition. For example an `1.1` argument will be automatically converted into a decimal number, but `"1.1"` will be a string.

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberryPlugins = require('cucumberry').plugins;
    cucumberryPlugins.parseArguments(this);
}
```


#### Make methods sync with fibers

Make all the `Given` methods sync with [fibers](https://github.com/laverdet/node-fibers). After you do this the steps will
run sync and no need to call the `callback` function when the step ends.

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberryPlugins = require('cucumberry').plugins;
    cucumberryPlugins.makeFiber(this);
}
```


#### Call other step from step definitions

In order to have the new `addStep` method in the step test context you need
to do this. This is required to call the step from another step.

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberryPlugins = require('cucumberry').plugins;
    cucumberryPlugins.addStepMethod(this);
}
```


### Inherit your world from cucumberry's world

This will add a method to your world instance named `callStep` which enables you
to call a step. 

```javascript
// In your `support/World.js` file:
// Load cucumber and lodash.
var cucumberry      = require('cucumberry');
var cucumberryWorld = cucumberry.World;
var _                = require('lodash');

// Create your own constructor.
var World = function(cb){
    // Call the cucumberryWorld constructor. Is required!
    cucumberryWorld.apply(this, arguments);
}

// Inherit the static methods.
_.extend(World, cucumberryWorld);
// Add here your own static World methods.
World.myStaticMethod = function(){
    // Do something!
}

// Inherit the instance methods.
_.extend(World.prototype, cucumberryWorld.prototype, {
    // Add here your own static World methods.
    myInstanceMethod: function(){
        // Do something!
    }
})

module.exports = {
    World : World,
}
```


### Define some steps

Your step definition should look like this:

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberryPlugins = require('cucumberry').plugins;
    cucumberryPlugins.useAll(this);

    this.addStep('a', /^a$/, function(){
        console.log('a');
    })
}
```

The API is like this:

```javascript
this.addStep(uniqueStepName, regexMatch, function);
```

Notice that the function will not get any `callback` argument at the end as it's an sync
function.


### Call other step from step definitions

Let's add another step `b` and change step `a` to call step `b` (notice the `this.callStep('b', 1);` part):

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberryPlugins = require('cucumberry').plugins;
    cucumberryPlugins.useAll(this);

    this.addStep('a', /^a$/, function(){
        console.log('a');
        this.callStep('b', 1);
    })

    this.addStep('b', /^b (\d+)$/, function(n){
        console.log('b', n);
    })
}
```

The `callStep` API looks like this:

```javascript
this.callStep(uniqueStepName, arguments);
```


### Create a feature

Create a file named `test.feature`

```feature
Feature: Test
Scenario: Test
    Given a
    Given b 2
```


### Run it

Run it with your `cucumber-js` command and the output will be:

    a    // From a called from the test.feature directly
    b 1  // From b but called by step a
    b 2  // From b called from the test.feature directly



## More info

 - Read the [official cucumber docs](https://github.com/cucumber/cucumber-js).
