export default function render (node, element) {
  element.parentNode.replaceChild(node.render(), element)
}
