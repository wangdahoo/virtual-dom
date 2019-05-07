import _ from './shared/utils'

const VNode = (() => {
  const _tag = Symbol('tag')
  const _props = Symbol('props')
  const _children = Symbol('children')
  const _vnode = Symbol('vnode')

  class VNode {
    constructor (tagName, props = {}, children = [], key = '') {
      if (typeof tagName !== 'string') throw new TypeError('Invalid Arguments: tagName must be a string.')

      if (_.isArray(props)) {
        children = props
        props = {}
      }

      this[_tag] = tagName.toLowerCase()
      this[_props] = props
      this[_children] = (_.isArray(children) ? children : [children]).map(function (c) {
        return typeof c === 'string' ? new VNode('p', { textContent: c }) : c
      })
      this[_vnode] = _.vnode()
      this.key = key
    }

    get tag () {
      return this[_tag]
    }

    get children () {
      return this[_children]
    }

    get props () {
      return this[_props]
    }

    get __vnode__ () {
      return this[_vnode]
    }

    // 获取当前节点下的子节点数
    get getChildrenCount () {
      return getCount(this)
    }

    render () {
      const { tag, props, children, __vnode__ } = this

      const element = document.createElement(tag)

      for (let propName in props) {
        const propValue = props[propName]
        switch (propName) {
        case 'style':
          element.style.cssText = propValue
          break
        case 'value':
          if (tag === 'input' && tag === 'textarea') {
            element.value = propValue
          } else {
            element.setAttribute(propName, propValue)
          }
          break
        default:
          element.setAttribute(propName, propValue)
        }
      }

      children.forEach(child => {
        element.appendChild(child.render())
      })

      element.setAttribute(`data-v-${__vnode__}`, '')

      return element
    }
  }

  return VNode
})()

/**
 * 计算子节点数
 * @param {VNode} node
 * @returns {Integer} count
 */
function getCount (node) {
  const children = node.children

  let count = 0
  for (let i = 0; i < children.length; i++) {
    count += getCount(children[i])
  }

  return count
}

export default VNode
