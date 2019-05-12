import VNode from './vnode'
import diff from './diff'
import apply from './apply'
import render from './render'

export default {
  VNode,
  diff,
  apply,
  render,
  h: function () {
    return new VNode(...arguments)
  }
}
