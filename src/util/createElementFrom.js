/* @flow */
var React = require('./React')
var cloneElement = require('./cloneElement')
var isElement = require('./isElement')

function createElementFrom(component:any, props:any):Object {
  if (isElement(component)) {
    return cloneElement(component, props)
  } else {
    return React.createElement(component, props)
  }
}

module.exports = createElementFrom
