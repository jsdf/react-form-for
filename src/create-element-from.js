/* @flow */
var React = require('react/addons')
var {cloneWithProps} = React.addons
var isElement = React.isValidElement || React.isValidComponent

function createElementFrom(component:any, props:any):Object {
  if (isElement(component)) {
    return cloneWithProps(component, props)
  } else {
    return React.createElement(component, props)
  }
}

module.exports = createElementFrom
