var should = require('chai').should(),
    replacer = require('../index'),
    function1 = replacer.function1;


describe('#function1', function () {
  it('works', function () {
    function1().should.equal('great')
  })
})