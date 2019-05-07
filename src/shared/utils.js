import {
  PATCH_TYPE_ADD,
  PATCH_TYPE_DELETE,
  PATCH_TYPE_PROPS,
  PATCH_TYPE_REPLACE,
  PATCH_TYPE_REPOSITION,
  PROP_PATCH_TYPE_SET,
  PROP_PATCH_TYPE_DELETE
} from './constants'

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

function min (arr) {
  let min = arr[0]

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i]
  }

  return min
}

function vnode () {
  return Math.random()
    .toString(36)
    .slice(2)
}

// 检查 patch 类型是否合法
const verifyPatchType = patchType => {
  return (
    [
      PATCH_TYPE_ADD,
      PATCH_TYPE_DELETE,
      PATCH_TYPE_PROPS,
      PATCH_TYPE_REPLACE,
      PATCH_TYPE_REPOSITION,
      PROP_PATCH_TYPE_SET,
      PROP_PATCH_TYPE_DELETE
    ].indexOf(patchType) > -1
  )
}

export default {
  isArray: Array.isArray,
  defineProperty: Object.defineProperty,
  assign: Object.assign,
  find,
  min,
  vnode,
  verifyPatchType
}
