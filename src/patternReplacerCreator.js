const omit = require('lodash.omit')
const identity = require('lodash.identity')
const keys = require('lodash.keys')
const substituteHelper = require('./substituteHelper')


const patternReplacerCreator = function(config) {

  return function patternReplacer(inputText, remnantConfig=config, rowKey='0') {

    const patternIds = keys(remnantConfig)

    const createNewRowKey = function (i) {
      return [rowKey, '-', i].join('')
    }


    if (patternIds.length === 0) {
      return [inputText]
    } else {
      const headId = patternIds[0]
      const headValue = remnantConfig[headId]

      const tail = omit(remnantConfig, headId)

      const nonMatcherFn = function (text, i) {
        const newRowKey = createNewRowKey(i)
        return patternReplacer(text, tail, newRowKey)
      }

      const rightFlankNonMatcherTextFn = headValue.rightFlankNonMatcherTextFn || identity;
      const rightFlankNonMatcherFn = function (text, i) {
        const x = rightFlankNonMatcherTextFn(text)
        return nonMatcherFn(x, i)
      }

      const matcherFn = function (text, i) {
        const textFn = (headValue.textFn || identity)
        const newText = textFn(text)
        const toIgnore = headValue.ignore || [];
        const matcherTail = omit(tail, toIgnore)

        const newRowKey = createNewRowKey(i)
        const recursiveCall = patternReplacer(newText, matcherTail, newRowKey)
        return headValue.matcherFn(newText, recursiveCall, newRowKey)
      }
      return substituteHelper(inputText, headValue.pattern, matcherFn, nonMatcherFn, rightFlankNonMatcherFn)
    }
  }
}

module.exports = patternReplacerCreator;