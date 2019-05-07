import assert from 'assert'
import lev from '../src/lev'
import _ from '../src/shared/utils'

describe('Levenshtein distance', function () {
  it('distance from "ab" to "ba" should be 2', function () {
    assert.strictEqual(lev('ab', 2, 'ba', 2), 2)
  })

  it('min of [3,1,2,3,5,2] is 1', function () {
    assert.strictEqual(_.min([3, 1, 2, 3, 5, 2]), 1)
  })
})
