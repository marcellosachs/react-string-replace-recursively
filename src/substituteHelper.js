const _  = require('lodash');
// PATTERN MUST BE SUCH THAT MATCHES ARE NOT REMOVED IN SPLIT
const _isEven = n => n % 2 === 0


module.exports = function(text, pattern, matcherFn, nonMatcherFn, rightFlankNonMatcherFn=_.identity) {
  const arr = text.split(pattern)
  return _.reduce(arr, function (acc, ele, i) {
    let next;
    if (_isEven(i)) {
      if (i > 0) {
        next = rightFlankNonMatcherFn(ele)
      } else {
        next = nonMatcherFn(ele)
      }
    } else {
      next = matcherFn(ele)
    }
    return _.chain(acc).push(next).value()
  }, [])
}