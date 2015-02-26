/**
 * Adds a `addStep` method to the test context. These
 * tests can later be called by the world with `callStep`.
 */
var addStepMethod = function(target){
    if(target.__steps) throw new Error('Target already has steps.')
    target.__steps = {};
    target.__addStep_origGiven = target.Given;
    var origGiven = target.Given;
    target.addStep = function(uniqueName, regexp, fn){
        target.__steps[uniqueName] = fn;
        this.__addStep_origGiven(regexp, fn);
    }.bind(target)
    target.getStep = function(uniqueName){
        return target.__steps[uniqueName];
    }
}





module.exports = addStepMethod;
