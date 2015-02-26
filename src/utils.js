var Future = require('fibers/future');





/**
 * @class utils
 * @type {Object}
 * @private
 */
var utils  = {};





utils.parseValue = function(value){
    eval('var __parsedValue = ' + value);
    value = __parsedValue;
    __parsedValue = undefined;
    return value;
}





utils.sleep = function(ms){
    var future = new Future;
    setTimeout(function() {
        future.return();
    }, ms);
    return future;
}





module.exports = utils;
