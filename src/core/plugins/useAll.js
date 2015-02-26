




/**
 * Uses all plugins available.
 */
var useAll = function(target){
    var plugins = require('./index')
    plugins.useEJSONArguments(target);
    plugins.makeFiber(target);
    plugins.addStepMethod(target);
}




module.exports = useAll;
