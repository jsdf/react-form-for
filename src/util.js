var extend = require('xtend/mutable')

var slice = Array.prototype.slice
var concat = Array.prototype.concat

// subset of underscore methods for our purposes
function clone(source) {
  return extend({}, source)
}

function isFunction(subject) {
  return typeof subject === 'function'
}

function isString(subject) {
  return typeof subject === 'string'
}

function bind(fn, me) {
  return () => fn.apply(me, arguments)
}

function bindAll(obj, ...methods) {
  methods.forEach((methodName) => obj[methodName] = bind(obj[methodName], obj))
}

function contains(haystack, needle) {
  return haystack.indexOf(needle) > -1
}

function pick(obj, iteratee) {
  var result = {}, key
  if (obj == null) return result
  if (isFunction(iteratee)) {
    for (key in obj) {
      var value = obj[key]
      if (iteratee(value, key, obj)) result[key] = value
    }
  } else {
    var keys = concat.apply([], slice.call(arguments, 1))
    obj = new Object(obj)
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i]
      if (key in obj) result[key] = obj[key]
    }
  }
  return result
}

function omit(obj) {
    var keys = concat.apply([], slice.call(arguments, 1)).map(String)
    return pick(obj, (value, key) => !contains(keys, key))
  }

// update nested object structure via copying
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

module.exports = {bind, bindAll, updateIn, clone, extend, omit, pick, contains, isFunction, isString}
