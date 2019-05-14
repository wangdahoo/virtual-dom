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
  const propPatch = diffProps(oldNode.props, newNode.props)
  if (propPatch !== null) {
    patches[index] = patches[index] || []

    patches[index].push(new Patch(PATCH_TYPE_PROPS, propPatch))
  }

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
  const walked = []

  /**
   * 类似编辑距离实现的 list-diff
   *
   * @description
   * 从 a 数组中取出索引大于等于 i 的节点组成新的数组 a',
   * 从 b 数组中取出索引大于等于 j 的节点组成新的数组 b',
   * 求出从 a' -> b' 的编辑距离
   *
   * @param {Array<VNode>} a
   * @param {int} i start index of a
   * @param {Array<VNode>} b
   * @param {int} j start index of b
   */
  function listDiff (a, i, b, j) {
    if (i === a.length) {
      // a' 为空数组，添加所有 b' 元素
      const addPatches = b.slice(j).map(node => new Patch(PATCH_TYPE_ADD, node))

      if (addPatches.length > 0) {
        patches[index] = (patches[index] || []).concat(addPatches)
      }

      return
    }

    if (j === b.length) {
      // b' 为空数组，删除所有 a' 元素
      const deletePatches = a.slice(i).map(
        node =>
          new Patch(PATCH_TYPE_DELETE, {
            vnode: node.__vnode__
          })
      )

      if (deletePatches.length > 0) {
        patches[index] = (patches[index] || []).concat(deletePatches)
      }

      return
    }

    // 判断 a' 的第一个元素是否被删除
    const aPos = b.findIndex(node => node.__vnode__ === a[i].__vnode__)

    if (aPos > -1) {
      // 计算 a' 的第一个元素的 Patch 索引
      const aIndex = index + 1 + (i > 0 ? a[i - 1].getNodeCount() : 0)
      if (walked.findIndex(w => w === i) === -1) {
        walk(a[i], b[aPos], aIndex, patches)
        walked.push(i)
      }

      const moves = aPos - i - deleted.filter(deletedIndex => deletedIndex < i).length

      if (moves !== 0) {
        patches[index] = patches[index] || []

        patches[index].push(
          new Patch(PATCH_TYPE_REPOSITION, {
            vnode: a[i].__vnode__,
            moves
          })
        )
      }
    } else {
      patches[index] = patches[index] || []

      patches[index].push(
        new Patch(PATCH_TYPE_DELETE, {
          vnode: a[i].__vnode__
        })
      )

      deleted.push(i)
    }

    // 判断 b' 的第一个元素是否为新增元素
    const bPos = a.findIndex(node => node.__vnode__ === b[j].__vnode__)

    if (bPos > -1) {
      // 计算 b' 的第一个元素的 Patch 索引
      const aIndex = index + 1 + (bPos > 0 ? a[bPos].getNodeCount() : 0)

      if (walked.findIndex(w => w === bPos) === -1) {
        walk(a[bPos], b[j], aIndex, patches)
        walked.push(bPos)
      }

      const moves = j - bPos - deleted.filter(deletedIndex => deletedIndex < bPos).length

      if (moves !== 0) {
        patches[index] = patches[index] || []

        patches[index].push(
          new Patch(PATCH_TYPE_REPOSITION, {
            vnode: a[i].__vnode__,
            moves
          })
        )
      }
    } else {
      patches[index] = patches[index] || []

      patches[index].push(
        new Patch(PATCH_TYPE_ADD, {
          node: b[j]
        })
      )
    }

    listDiff(a, i + 1, b, j + 1)
  }

  listDiff(oldChildren, 0, newChildren, 0)
}

export default diff
