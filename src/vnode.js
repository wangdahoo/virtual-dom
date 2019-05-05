const _ = require('./shared/utils')

const VNode = (() => {
  const _tag = Symbol('tag')
  const _props = Symbol('props')
  const _children = Symbol('children')
  const _vnode = Symbol('vnode')

  class VNode {
    constructor (tagName, props = {}, children = []) {
      if (typeof tagName !== 'string') throw new TypeError('参数错误: tagName must be a string.')

      if (_.isArray(props)) {
        children = props
        props = {}
      }

      this[_tag] = tagName.toLowerCase()
      this[_props] = props
      // TODO: 这里要考虑 children 数组中每个元素的类型
      this[_children] = (_.isArray(children) ? children : [children]).map(function (c) {
        return typeof c === 'string' ? new VNode('p', { textContent: c }) : c
      })
      this[_vnode] = _.vnode()
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

module.exports = VNode
