void function() {
  var promise = require('promise.js');
  
  exports.resolved = promise.resolve;
  exports.rejected = promise.reject;
}();
