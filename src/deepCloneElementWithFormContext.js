var React = require('./util/React')
var cloneElement = require('./util/cloneElement')
var isElement = require('./util/isElement')
var isProxyOfType = require('./isProxyOfType')

function hasChildren(element):boolean {
  if (element != null && element.props != null) {
    return element.props.children != null
  }
}

// recursive map over children and inject form prop
// TODO: replace this with parent-child context if/when it becomes a public API
function deepCloneElementWithFormContext(element, parentContext) {
  return React.Children.map(element.props.children, function(child) {
    if (
      !isElement(child)
      || typeof child == 'string'
      || typeof child.props == 'string'
      || (child.props && typeof child.props.children == 'string')
    ) {
      return child
    }

    var updatedProps = {}

    if (isProxyOfType('FormProxy', child)) {
      if (!hasChildren(child)) throw new Error('No children')
      // stop recursion, just inject form parentContext
      updatedProps.parentFormContext = parentContext
    } else {
      if (isProxyOfType('FieldProxy', child)) {
        updatedProps.parentFormContext = parentContext
      }
      // recurse to update grandchildren
      updatedProps.children = deepCloneElementWithFormContext(child, parentContext)
    }

    return cloneElement(child, updatedProps)
  })
}

module.exports = deepCloneElementWithFormContext
