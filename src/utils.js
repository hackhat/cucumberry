var Future = require('fibers/future');
var EJSON  = require('EJSON');





/**
 * @class utils
 * @type {Object}
 * @private
 */
var utils  = {};





utils.parseValue = function(value){
    if(value === 'undefined' || value === 'void 0'){
        value = void 0;
    }else{
        value = EJSON.parse(value);
    }
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
