




/**
 * @class core.plugins.useAll
 * Uses all plugins available.
 * @param {*} target The context of the test function which has the `.Given` methods.
 */
var useAll = function(target){
    var plugins = require('./index')
    plugins.useEJSONArguments(target);
    plugins.makeFiber(target);
    plugins.addStepMethod(target);
}




module.exports = useAll;
