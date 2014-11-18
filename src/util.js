var extend = require('xtend/mutable')

function clone(source) {
  return extend({}, source)
}

function isFunction(subject) {
  return typeof subject === 'function'
}

function isString(subject) {
  return typeof subject === 'function'
}

function bind(fn, me) {
  return () => fn.apply(me, arguments)
}

function bindAll(obj, ...methods) {
  methods.forEach((methodName) => obj[methodName] = bind(obj[methodName], obj))
}

function updateIn(object, path, value) {
  if (!path || !path.length) throw new Error('invalid path')

  var updated = extend({}, object)
  var [name] = path
  if (path.length === 1) {
    updated[name] = value
  } else {
    updated[name] = updateIn((updated[name] || {}), path.slice(1), value)
  }
  return updated
}

module.exports = {bind, bindAll, updateIn, clone, extend, isFunction, isString}
