// Levenshtein distance
import _ from './shared/utils'

function lev (a, i, b, j) {
  if (i === 0) return j
  if (j === 0) return i

  const cost = a[i - 1] === b[j - 1] ? 0 : 1

  return _.min([lev(a, i - 1, b, j) + 1, lev(a, i, b, j - 1) + 1, lev(a, i - 1, b, j - 1) + cost])
}

export default lev
