/* @flow */
function getElementType(node:?Object):?Function {
  if (node != null) {
    if (node.type != null) return node.type
    else if (node.constructor != null) return node.constructor
    else return null
  } else {
    return null
  }
}

module.exports = getElementType
