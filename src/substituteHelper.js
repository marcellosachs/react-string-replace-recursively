const reduce = require('lodash.reduce');
// PATTERN MUST BE SUCH THAT MATCHES ARE NOT REMOVED IN SPLIT
const _isEven = n => n % 2 === 0

module.exports = function(text, pattern, matcherFn, nonMatcherFn, rightFlankNonMatcherFn) {
  const arr = text.split(pattern)
  return reduce(arr, function (acc, ele, i) {
    let next;
    if (_isEven(i)) {
      if (i > 0) {
        next = rightFlankNonMatcherFn(ele, i)
      } else {
        next = nonMatcherFn(ele, i)
      }
      return [...acc, ...next] // essentially a flatten
    } else {
      return [...acc, matcherFn(ele, i)]
    }
  }, [])
}