const expect = require('chai').expect;
const patternReplacerCreator = require('../lib/patternReplacerCreator')

describe('patternReplacerCreator', function () {

  const _hashTagFn = function (rawText, processed, key) {
    return {hashtag: processed, key}
  }

  const _urlFn = function (rawText, processed, key) {
    return {url: processed, key}
  }

  const _searchTermFn = function (rawText, processed, key) {
    return {searchTerm: processed, key}
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
    'searchTerm1': {
      pattern: /(chair)/ig,
      matcherFn: _searchTermFn
    },
    'searchTerm2': {
      pattern: /(how)/ig,
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
    const inputText = "its #great this #is"
    const result = patternReplacerCreator(config)(inputText)
    const expected = ['its ', {hashtag: ['#great'], key: '0-0-1'}, ' this ', {hashtag: ['#is'], key: '0-0-3'}, '']
    expect(result).to.deep.equal(expected)
  })

  it('works with two patterns', function () {
    const inputText = "how #nice"
    const result = patternReplacerCreator(config)(inputText)
    const expected = ['', {searchTerm: ['how'], key: '0-0-0-0-1'}, ' ', {hashtag: ['#nice'], key: '0-0-1'}, '']
    expect(result).to.deep.equal(expected)
  })


  it('recursively replaces a pattern that occurs within another', function () {
    const inputText = "I appreciate a good #chairback I must say"
    const result = patternReplacerCreator(config)(inputText)
    const expected = ["I appreciate a good ",
                      {hashtag: ["#", {searchTerm: ["chair"], key: '0-0-1-1'}, "back"], key: '0-0-1'},
                      " I must say"]
    expect(result).to.deep.equal(expected)
  })

  it('ignores a pattern that occurs within another when config indicates this should be done', function () {

  })
})