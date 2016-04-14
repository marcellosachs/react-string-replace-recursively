const expect = require('chai').expect;
const _ = require('lodash')
const patternReplacerCreator = require('../lib/patternReplacerCreator')

describe('recursiveTextProcessor', function () {
  const _hashTagFn = function (rawText, processed) {
    return {hashtag: processed}
  }

  const _urlFn = function (rawText, processed) {
    return {url: processed}
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
    }
  }


  it('works in trivial case', function () {
    const inputText = ''
    const result = patternReplacerCreator(config)(inputText)
    const expected = ''
    expect(result).to.deep.equal(expected)
  })

  // it('works in simple case', function () {
  //   const arrOfPairs = [
  //     {pattern: /(#[a-z\d][\w-]*)/ig, matcherFn: _hashFn}
  //   ]
  //   const inputText = "how #great this #is"
  //   const result = patternReplacerCreator(arrOfPairs, inputText)
  //   const expected = ['how ', {hashtag: '#great'}, ' this ', {hashtag: '#is'}, '']
  //   expect(result).to.deep.equal(expected)
  // })
})