import {
  PATCH_TYPE_ADD,
  PATCH_TYPE_DELETE,
  PATCH_TYPE_PROPS,
  PATCH_TYPE_REPOSITION,
  PROP_PATCH_TYPE_SET,
  PROP_PATCH_TYPE_DELETE
} from './shared/constants'

function walk (element, index, patches) {
  applyNode(element, patches[index])
  const children = element.children

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const childIndex = index + 1 + (i > 0 ? getNodeCount(children[i]) : 0)

    walk(child, childIndex, patches)
  }
}

/**
 * Get Total Node Count of Element
 * @param {Element} element
 */
function getNodeCount (element) {
  let count = 1
  // 这里用 children 而不是 childNodes 是为了过滤掉文本节点
  const children = element.children
  for (let i = 0; i < children.length; i++) {
    count += getNodeCount(children[i])
  }
  return count
}

/**
 * Apply patch on node
 * @param {HTMLElement} element
 * @param {Patch} patch
 */
function applyNode (element, patch) {
  const { payload } = patch

  switch (patch.type) {
  case PATCH_TYPE_ADD:
    element.appendChild(payload.render())
    break
  case PATCH_TYPE_DELETE:
    const target = element.querySelector(`[data-v-${payload.vnode}]`)
    target.parentElement.removeChild(target)
    break
  case PATCH_TYPE_PROPS:
    updateProps(element, payload)
    break
  case PATCH_TYPE_REPOSITION:
    reposition(element, payload.moves)
    break
  default:
    console.warn('Unknow patch type')
  }
}

function updateProps (element, propPatch) {
  for (let propName in propPatch) {
    const propPatchType = propPatch[propName].type
    const propValue = propPatch[propName].value

    switch (propName) {
    case 'style':
      element.style.cssText = propPatchType === PROP_PATCH_TYPE_SET ? '' : propValue
      break
    case 'value':
      if (element.tag === 'input' && element.tag === 'textarea') {
        element.value = propPatchType === PROP_PATCH_TYPE_DELETE ? '' : propValue
      } else {
        if (propPatchType === PROP_PATCH_TYPE_DELETE) return element.removeAttribute(propName)
        element.setAttribute(propName, propValue)
      }
      break
    default:
      if (propPatchType === PROP_PATCH_TYPE_DELETE) return element.removeAttribute(propName)
      element.setAttribute(propName, propValue)
    }
  }
}

function reposition (element, moves) {
  const parent = element.parentElement
  const insertBefore = moves < 0
  let sibling = element

  while (moves-- > 0) {
    sibling = sibling.nextSibling
  }

  while (moves++ < 0) {
    sibling = sibling.previousSibling
  }

  parent.removeChild(element)

  if (insertBefore) {
    parent.insertBefore(element, sibling)
  } else {
    if (sibling && sibling.nextSibling) {
      parent.insertBefore(element, sibling.nextSibling)
    } else {
      parent.appendChild(element)
    }
  }
}

export default function (element, patches) {
  walk(element, 0, patches)
}
