const expect = require('chai').expect;
const _ = require('lodash')
const patternReplacerCreator = require('../lib/patternReplacerCreator')

describe('patternReplacerCreator', function () {

  const _hashTagFn = function (rawText, processed) {
    return {hashtag: processed}
  }

  const _urlFn = function (rawText, processed) {
    return {url: processed}
  }

  const _searchTermFn = function (rawText, processed) {
    return {searchTerm: processed}
  }

  const config = {
    'url': {
      pattern: /(https?:\/\/[^\s]+)/ig,
      ignore: ['hashTag'],
      matcherFn: _urlFn,
    },
    'hashTag': {
      pattern: /(#[a-z\d][\w-]*)/ig,
      ignore: [],
      matcherFn: _hashTagFn
    },
    'searchTerm': {
      pattern: /(chair)/ig,
      matcherFn: _searchTermFn
    }
  }

  it('works with trivial inputText', function () {
    const inputText = ''
    const result = patternReplacerCreator(config)(inputText)
    const expected = ['']
    expect(result).to.deep.equal(expected)
  })

  it('works with one pattern', function () {
    const inputText = "how #great this #is"
    const result = patternReplacerCreator(config)(inputText)
    const expected = ['how ', {hashtag: ['#great']}, ' this ', {hashtag: ['#is']}, '']
    expect(result).to.deep.equal(expected)
  })

  it('recursively replaces a pattern that occurs within another', function () {
    const inputText = "I appreciate a good #chairback I must say"
    const result = patternReplacerCreator(config)(inputText)
    const expected = ["I appreciate a good ",
                      {hashtag: ["#", {searchTerm: ["chair"]}, "back"]},
                      " I must say"]
    expect(result).to.deep.equal(expected)
  })

  it('ignores a pattern that occurs within another when config indicates this should be done', function () {

  })
})