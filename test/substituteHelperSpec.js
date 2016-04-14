// import { expect } from '../test_helper';
// import substituteHelper from '../../app/bundles/HelloWorld/modules/substituteHelper';
// import _ from 'lodash';

const expect = require('chai').expect
const substituteHelper = require('../lib/substituteHelper')
const _ = require('lodash')

describe('substituteHelper', function () {
  it('works in trivial case', function () {
      const input = 'great';
      const pattern = '#';
      const matcherFn = _.identity
      const nonMatcherFn = _.identity
      const result = substituteHelper(input, pattern, matcherFn, nonMatcherFn)
      expect(result).to.deep.equal([input]);
  })

  it('works in non-trivial case', function () {
    const input = 'how #great yes \nits #nice'
    const pattern = /(#[a-z\d][\w-]*)/ig // pattern for hashtag
    const matcherFn = _.toUpper;
    const nonMatcherFn = _.identity;
    const result = substituteHelper(input, pattern, matcherFn, nonMatcherFn)
    const expected = ['how ', '#GREAT', ' yes \nits ', '#NICE', '']
    expect(result).to.deep.equal(expected)
  })
})