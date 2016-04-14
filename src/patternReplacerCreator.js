const _ = require('lodash')
const substituteHelper = require('./substituteHelper')

const patternReplacerCreator = function(config) {

  const _shouldIgnore = function(id, surroundingPatterns) {
    const patternsToIgnore = _.reduce(surroundingPatterns, function (acc, surroundingPatternId) {
      const x = config[surroundingPatternId].ignore;
      return _.concat(acc, x)
    }, [])
    return _.includes(patternsToIgnore, id)
  }


  return function patternReplacer(inputText, remnantConfig=config, surroundingPatterns=[]) {

    const patternIds = _.keys(remnantConfig)

    if (patternIds.length === 0) {
      return inputText
    } else {
      const headId = patternIds[0]
      const headValue = remnantConfig[headId]
      const tail = _.omit(remnantConfig, headId)

      const nonMatcherFn = function (text) {
        return patternReplacer(text, tail, surroundingPatterns)
      }

      let rightFlankNonMatcherFn;

      if (headValue.rightFlankNonMatcherTextFn) {
        rightFlankNonMatcherFn = _.flowRight(nonMatcherFn, headValue.rightFlankNonMatcherTextFn)
      } else {
        rightFlankNonMatcherFn = nonMatcherFn
      }

      let matcherFn;
      if (_shouldIgnore(headId, surroundingPatterns)) {
        // another way to handle ignorance might be to remove what should be ignored from the remnant config that gets passed to recursive call
        matcherFn = nonMatcherFn;
      } else {
        matcherFn = function (text) {
          const textFn = (headValue.textFn || _.identity)
          const newText = textFn(text)
          const newSurroundingPatterns = _.concat(surroundingPatterns, [headId])
          const recursiveCall = patternReplacer(newText, tail, newSurroundingPatterns)
          return headValue.matcherFn(newText, recursiveCall)
        }
      }
      return substituteHelper(inputText, headValue.pattern, matcherFn, nonMatcherFn, rightFlankNonMatcherFn)
    }
  }
}

module.exports = patternReplacerCreator;