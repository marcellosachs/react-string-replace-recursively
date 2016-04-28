'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var reduce = require('lodash.reduce');
// PATTERN MUST BE SUCH THAT MATCHES ARE NOT REMOVED IN SPLIT
var _isEven = function _isEven(n) {
  return n % 2 === 0;
};

module.exports = function (text, pattern, matcherFn, nonMatcherFn) {
  var arr = text.split(pattern);
  return reduce(arr, function (acc, ele, i) {
    var next = void 0;
    if (_isEven(i)) {
      next = nonMatcherFn(ele, i);
      return [].concat(_toConsumableArray(acc), _toConsumableArray(next)); // flatten
    } else {
        return [].concat(_toConsumableArray(acc), [matcherFn(ele, i)]);
      }
  }, []);
};