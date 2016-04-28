const reduce = require('lodash.reduce');
// PATTERN MUST BE SUCH THAT MATCHES ARE NOT REMOVED IN SPLIT
const _isEven = n => n % 2 === 0

module.exports = function(text, pattern, matcherFn, nonMatcherFn) {
  const arr = text.split(pattern)
  return reduce(arr, function (acc, ele, i) {
    let next;
    if (_isEven(i)) {
      next = nonMatcherFn(ele, i)
      return [...acc, ...next] // flatten
    } else {
      return [...acc, matcherFn(ele, i)]
    }
  }, [])
}