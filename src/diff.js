import VNode from './vnode'
import Patch from './patch'

import {
  PATCH_TYPE_ADD,
  PATCH_TYPE_DELETE,
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

  const patches = {}
  walk(oldNode, newNode, 0, patches)
  return patches
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

  patches[index].push(new Patch(PATCH_TYPE_PROPS, diffProps(oldNode.props, newNode.props)))

  diffChildren(oldNode.children, newNode.children, index, patches)
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

function diffChildren (oldChildren, newChildren, index, patches) {
  const deleted = []

  /**
   * 类似最新编辑距离实现的 list-diff
   *
   * @description
   * 从 a 数组中取出索引大于等于 i 的节点组成新的数组 A,
   * 从 b 数组中取出索引大于等于 j 的节点组成新的数组 B,
   * 求出从 A -> B 的编辑距离
   *
   * @param {Array<VNode>} a
   * @param {int} i start index of a
   * @param {Array<VNode>} b
   * @param {int} j start index of b
   */
  function listDiff (a, i, b, j) {
    if (i === a.length - 1) {
      // a' 为空数组
      b.forEach(node => {
        patches[index].push(new Patch(PATCH_TYPE_ADD, node))
      })
    }

    if (j === b.length - 1) {
      // b' 为空数组
      a.forEach(node => {
        patches[index].push(
          new Patch(PATCH_TYPE_DELETE, {
            vnode: node.__vnode__
          })
        )
      })
    }

    // 计算 a' 的第一个元素的索引
    const aIndex = index + 1 + (i > 0 ? a[i - 1].getNodeCount() : 0)

    // 判断 a' 的第一个元素是是否被删除
    const aIndexNew = b.indexOf(node => node.__vnode__ === a[i].__vnode__)

    if (aIndexNew > -1) {
      walk(a[i], b[aIndexNew], aIndex, patches)

      patches[index].push(
        new Patch(PATCH_TYPE_REPOSITION, {
          vnode: a[i].__vnode__,
          moves: aIndexNew - aIndex + deleted.filter(i => i < aIndex).length
        })
      )
    } else {
      patches[index].push(
        new Patch(PATCH_TYPE_DELETE, {
          vnode: a[i].__vnode__
        })
      )

      deleted.push(i)
    }

    listDiff(a, i + 1, b, j + 1)
  }

  return listDiff(oldChildren, 0, newChildren, 0)
}

export default diff
