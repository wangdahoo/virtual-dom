import VNode from './vnode'
import Patch from './patch'

import {
  // PATCH_TYPE_ADD,
  // PATCH_TYPE_DELETE,
  // PATCH_TYPE_REPLACE,
  PATCH_TYPE_PROPS,
  PATCH_TYPE_REPOSITION,
  PROP_PATCH_TYPE_SET,
  PROP_PATCH_TYPE_DELETE
} from './shared/constants'

import _ from './shared/utils'

/**
 * Diff 算法
 * @param {VNode} oldNode
 * @param {VNode} newNode
 *
 * @return {Array<Patch>}
 */
function diff (oldNode, newNode) {
  if (!(oldNode instanceof VNode) || !(newNode instanceof VNode)) {
    throw new TypeError(`Invalid Arguments: both 'oldNode' and 'newNode' should be <VNode>`)
  }

  return walk(oldNode, newNode, 0, {})
}

/**
 * 深度优先遍历 vdom tree 并计算 patches
 * @param {VNode} oldNode
 * @param {VNode} newNode
 * @param {int} index
 * @param {Array<Patch>} patches
 */
function walk (oldNode, newNode, index, patches) {
  patches[index] = patches[index] || []

  if (oldNode.tag === newNode.tag) {
    patches[index].push(
      new Patch(PATCH_TYPE_PROPS, diffProps(oldNode.props, newNode.props)),

      new Patch(PATCH_TYPE_REPOSITION, diffChildren(oldNode.children, newNode.children))
    )
  }
}

/**
 * diffProps
 * @param {Object} oldProps
 * @param {Object} newProps
 *
 * @returns {Object}
 */
function diffProps (oldProps, newProps) {
  let propPatch = null

  for (let propName in newProps) {
    if (oldProps[propName] !== newProps[propName]) {
      propPatch = _.assign({}, propPatch, {
        [propName]: {
          type: PROP_PATCH_TYPE_SET,
          value: newProps[propName]
        }
      })
    }
  }

  for (let propName in oldProps) {
    if (newProps[propName] === undefined) {
      propPatch = _.assign({}, propPatch, {
        propName: {
          type: PROP_PATCH_TYPE_DELETE
        }
      })
    }
  }

  return propPatch
}

function diffChildren (oldNode, newNode) {
  return []
}

export default diff
