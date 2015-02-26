var Future = require('fibers/future');





/**
 * Call it with the context of the test you want to augument.
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
