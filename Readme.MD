# cucumber-pro

Cucumber-js with sync and callable steps.



## Install

    npm install cucumber-pro --save-dev



## Setup

To make internal callable steps:


### Add a hook

This will make the world instance to know about the test context.

```javascript
var hooks = function(){
    var testContext = this;
    this.Before(function(cb){
        this.setTestContext(testContext);
        cb();
    });
};
```


### Patch the test context

Make automatically to parse correct values. For example an `1.1` argument will be
automatically converted into a decimal number, but `"1.1"` will be a string.

```javascript
this.World.testUtils.useEJSONArguments(this);
```

Make all the `Given` methods sync with fibers. After you do this the steps will
run sync and no need to call the `callback` function when the step ends.

```javascript
this.World.testUtils.makeFiber(this);
```

In order to have the new `addStep` method in the text context you need
to do this. This is required to call the step from another step.

```javascript
this.World.testUtils.addStepMethod(this);
```

Should be in this order so the saved step is already using fiber.


### Inherit your world from our world

This will add a method to your world instance named `callStep` which enables you
to call a step. 


### Define a step

Your step definition should look like this:

```javascript
this.addStep('a', /^a$/, function(){
    console.log('a')
})
```

The API is like this:

```javascript
this.addStep(uniqueStepName, regexMatch, function);
```

Notice that the function will not get any `callback` argument at the end as
with async tests.
Let's add another step

```javascript
this.addStep('b', /^b (\d+)$/, function(n){
    console.log('b', n)
})
```


### Run it

Add the feature `Given a`.
Call another step:

```javascript
this.addStep('a', /^a$/, function(){
    console.log('a')
    this.callStep('b', 1);
})
```

The `callStep` API looks like this:

```javascript
this.callStep(uniqueStepName, arguments)
```

Now the output will be:
    a
    b 1



## API

Check the **[full API here](https://rawgit.com/hackhat/cucumber-pro/v0.0.1/docs/jsduck/index.html)**.
