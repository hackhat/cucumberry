var Future = require('fibers/future');





/**
 * @class core.plugins.makeFiber
 * Will make your tests sync with fibers. No need to call the callback when you end.
 * @param {*} target The context of the test function which has the `.Given` methods.
 */
var makeFiber = function(target){
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




module.exports = makeFiber;
