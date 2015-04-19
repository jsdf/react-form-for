/* @flow */
var isProxyOfType = require('./isProxyOfType')
var FormContext = require('./FormContext')

function makeDefaultValueFor(formContext:FormContext):Object|Array<Object> {
  // TODO: make default value from schema node
  return isProxyOfType('ListProxy', formContext.proxyComponent) ? [] : {}
}

module.exports = makeDefaultValueFor
