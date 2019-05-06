function find (arr, cb) {
  let found = null
  for (let i = 0; i < arr.length; i++) {
    let a = arr[i]
    if (cb(a, i)) {
      found = a
      break
    }
  }
  return found
}

function vnode () {
  return Math.random()
    .toString(36)
    .slice(2)
}

export default {
  isArray: Array.isArray,
  defineProperty: Object.defineProperty,
  assign: Object.assign,
  find,
  vnode
}
