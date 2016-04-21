const _ = require('lodash')
const substituteHelper = require('./substituteHelper')

const patternReplacerCreator = function(config) {

  return function patternReplacer(inputText, remnantConfig=config) {

    const patternIds = _.keys(remnantConfig)

    if (patternIds.length === 0) {
      return inputText
    } else {
      const headId = patternIds[0]
      const headValue = remnantConfig[headId]

      const toIgnore = headValue.ignore || [];
      const tail = _.omit(remnantConfig, [headId, ...toIgnore])

      const nonMatcherFn = function (text) {
        return patternReplacer(text, tail, surroundingPatterns)
      }

      const rightFlankNonMatcherTextFn = headValue.rightFlankNonMatcherTextFn || _.identity;
      const rightFlankNonMatcherFn = _.flowRight(nonMatcherFn, rightFlankNonMatcherTextFn)

      const matcherFn = function (text) {
        const textFn = (headValue.textFn || _.identity)
        const newText = textFn(text)
        const newSurroundingPatterns = [...surroundingPatterns, headId]
        const recursiveCall = patternReplacer(newText, tail, newSurroundingPatterns)
        return headValue.matcherFn(newText, recursiveCall)
      }
      return substituteHelper(inputText, headValue.pattern, matcherFn, nonMatcherFn, rightFlankNonMatcherFn)
    }
  }
}

module.exports = patternReplacerCreator;