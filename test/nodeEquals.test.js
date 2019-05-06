const assert = require('assert')
const { JSDOM } = require('jsdom')

// A node A equals a node B if all of the following conditions are true:
// https://dom.spec.whatwg.org/#concept-node-equals

describe('Node Equals', function () {
  let document

  before(function () {
    document = new JSDOM(require('./index.html')).window.document
  })

  describe('#equalsToAClone()', function () {
    it('should equals to a clone.', function () {
      const A = document.createElement('div')
      A.className = 'foo'
      A.textContent = 'hello'

      const B = A.cloneNode(true)

      assert.strictEqual(A.isEqualNode(B), true)
    })
  })
})
