# cucumber-pro

Cucumber-js with sync and callable steps.



## Install

    npm install cucumber-pro --save-dev



## API

Check the **[full API here](https://rawgit.com/hackhat/cucumber-pro/v0.0.1/docs/jsduck/index.html)**.



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

Using fibers your steps now can be sync and also non-blocking. Is suggested to use
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


### Add a hook

This will make the world instance to know about the test context. This is required to
make the core.plugins.addStepMethod plugin to work. This enables you to call a step from
within another step.

```javascript
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
    var cucumberProPlugins = require('cucumber-pro').plugins;
}
```


#### Use all plugins effortlessly

If you want to use all plugins here is the code:

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberProPlugins = require('cucumber-pro').plugins;
    cucumberProPlugins.useAll(this);
}
```

Or you can use individually in this **exact order only**:

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberProPlugins = require('cucumber-pro').plugins;
    cucumberProPlugins.parseArguments(this);
    cucumberProPlugins.makeFiber(this);
    cucumberProPlugins.addStepMethod(this);
}
```


#### Parse values

Make automatically to parse correct values. For example an `1.1` argument will be
automatically converted into a decimal number, but `"1.1"` will be a string.

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberProPlugins = require('cucumber-pro').plugins;
    cucumberProPlugins.parseArguments(this);
}
```


#### Make methods sync with fibers

Make all the `Given` methods sync with fibers. After you do this the steps will
run sync and no need to call the `callback` function when the step ends.

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberProPlugins = require('cucumber-pro').plugins;
    cucumberProPlugins.makeFiber(this);
}
```


#### Call steps from within other steps

In order to have the new `addStep` method in the text context you need
to do this. This is required to call the step from another step.

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberProPlugins = require('cucumber-pro').plugins;
    cucumberProPlugins.addStepMethod(this);
}
```


### Inherit your world from our world

This will add a method to your world instance named `callStep` which enables you
to call a step. 


### Define some steps

Your step definition should look like this:

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberProPlugins = require('cucumber-pro').plugins;
    cucumberProPlugins.useAll(this);

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


### Call another step from within

Let's add another step `b` and change step `a` to call step `b`:

```javascript
// in your `all.steps.js`
module.exports = function(){
    var cucumberProPlugins = require('cucumber-pro').plugins;
    cucumberProPlugins.useAll(this);

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

Run it with your cucumber-js command and the output will be:

    a    // From a called from the test.feature directly
    b 1  // From b but called by step a
    b 2  // From b called from the test.feature directly
