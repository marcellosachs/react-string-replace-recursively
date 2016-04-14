'use strict';

var _ = require('lodash');
// PATTERN MUST BE SUCH THAT MATCHES ARE NOT REMOVED IN SPLIT
var _isEven = function _isEven(n) {
  return n % 2 === 0;
};

module.exports = function (text, pattern, matcherFn, nonMatcherFn) {
  var rightFlankNonMatcherFn = arguments.length <= 4 || arguments[4] === undefined ? _.identity : arguments[4];

  var arr = text.split(pattern);
  return _.reduce(arr, function (acc, ele, i) {
    var next = void 0;
    if (_isEven(i)) {
      if (i > 0) {
        next = rightFlankNonMatcherFn(ele);
      } else {
        next = nonMatcherFn(ele);
      }
    } else {
      next = matcherFn(ele);
    }
    return _.chain(acc).push(next).value();
  }, []);
};