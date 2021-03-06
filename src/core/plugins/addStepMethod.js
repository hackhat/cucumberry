/**
 * @class core.plugins.addStepMethod
 * You can now call a step from another step.
 * Adds a `addStep` method to the test context. These
 * tests can later be called by the world with `callStep`.
 *
 * The `addStep` method now accept another extra argument. The first
 * one is the unique step name.
 *
 *     this.addStep(uniqueStepName, regexp, function);
 *
 * ## Example of steps definition
 *
 * Create a file in `tests/steps/all.steps.js` with contents:
 *
 *     this.addStep('a', /^a$/, function(){
 *         console.log('a');
 *         this.callStep('b', 1);
 *     })
 *     this.addStep('b', /^b (\d+)$/, function(n){
 *         console.log('b', n);
 *     })
 *
 * Create a file in `tests/test.feature` with contents:
 *
 *     Feature: Test
 *
 *     Scenario: Test
 *         Given a
 *         Given b 2
 *
 * Run it with cucumber and it will log:
 *
 *     a    // From a called from the test.feature directly
 *     b 1  // From b but called by step a
 *     b 2  // From b called from the test.feature directly
 *
 * @param {*} target The context of the test function which has the `.Given` methods.
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
