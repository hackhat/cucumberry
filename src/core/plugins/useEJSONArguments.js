var utils = require('../../utils');





/**
 * @class core.plugins.useEJSONArguments
 * Will easily convert the decimals and other values from
 * the EJSON format. Also takes care of undefined.
 * @param {*} target The context of the test function which has the `.Given` methods.
 */
var useEJSONArguments = function(target){
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





module.exports = useEJSONArguments;
