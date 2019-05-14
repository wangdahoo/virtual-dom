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
        return typeof c === 'string' ? new VNode('text', { text: c }) : c
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
    getNodeCount () {
      return getCount(this)
    }

    render () {
      const { tag, props, children } = this

      if (tag === 'text') return document.createTextNode(props.text)

      const element = document.createElement(tag)

      for (let propName in props) {
        // TODO: 检查是否为事件绑定
        if (propName === 'onclick') {
          const onClick = props[propName]
          element.onclick = onClick
        } else {
          const propValue = props[propName]
          switch (propName) {
          case 'className':
            element.className = propValue
            break
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
          case 'textContent':
            element.textContent = propValue
            break
          default:
            element.setAttribute(propName, propValue)
          }
        }
      }

      children.forEach(child => {
        element.appendChild(child.render())
      })

      // element.setAttribute(`data-v-${this.__vnode__}`, '')

      return element
    }
  }

  return VNode
})()

/**
 * 计算 VNode 树总节点数
 * @param {VNode} node
 * @returns {Integer} count
 */
function getCount (node) {
  let count = 1 // 自己也是一个节点
  const children = node.children

  for (let i = 0; i < children.length; i++) {
    count += getCount(children[i])
  }

  return count
}

export default VNode
