var Future = require('fibers/future');
var EJSON  = require('EJSON');





var utils  = {};



utils.parseValue = function(value){
    if(value === 'undefined' || value === 'void 0'){
        value = void 0;
    }else{
        value = EJSON.parse(value);
    }
    return value;
}



/**
 * Will easily convert the decimals and other values from
 * the EJSON format. Also takes care of undefined.
 */
utils.useEJSONArguments = function(target){
    target.__useEJSONArguments__origGiven = target.Given;
    target.Given = function(regexp, fn){
        var wrapperFn = function(){
            var args = Array.prototype.slice.call(arguments);
            args.forEach(function(value, index){
                // The last one is the callback and we don't want to parse it.
                var isCb = index === args.length - 1;
                if(isCb) return;
                args[index] = utils.parseValue(value);
            })
            fn.apply(this, args);
        }
        this.__useEJSONArguments__origGiven(regexp, wrapperFn);
    }.bind(target)
}



/**
 * Call it with the context of the test you want to augument.
 */
utils.makeFiber = function(target){
    target.__makeFiber_origGiven = target.Given;
    target.Given = function(regexp, fn){
        var fiberFn = function(){
            var args = Array.prototype.slice.call(arguments);
            // Extract and remove the cb from the arguments.
            var cb   = args.pop();
            Future.task(function(){
                fn.apply(this, args);
                // Because is running with fibers is sync. Therefore
                // we can call cb() after the fn ends in sync.
                cb();
            }.bind(this)).detach();
        }
        this.__makeFiber_origGiven(regexp, fiberFn);
    }.bind(target)
}



/**
 * Adds a `addStep` method to the test context. These
 * tests can later be called by the world with `callStep`.
 */
utils.addStepMethod = function(testContext){
    if(testContext.__steps) throw new Error('Target already has steps.')
    testContext.__steps = {};
    testContext.__addStep_origGiven = testContext.Given;
    var origGiven = testContext.Given;
    testContext.addStep = function(uniqueName, regexp, fn){
        testContext.__steps[uniqueName] = fn;
        this.__addStep_origGiven(regexp, fn);
    }.bind(testContext)
}



utils.sleep = function(ms){
    var future = new Future;
    setTimeout(function() {
        future.return();
    }, ms);
    return future;
}




module.exports = utils;
