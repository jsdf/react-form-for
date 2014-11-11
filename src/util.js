var {each, clone} = require('underscore')

function bind(fn, me) {
  return () => fn.apply(me, arguments)
}

function bindAll(obj, ...methods) {
  each(methods, (methodName) => obj[methodName] = bind(obj[methodName], obj))
}

function updateIn(object, path, value) {
  if (!path || !path.length) throw new Error('invalid path')

  var updated = clone(object)
  var [name] = path
  if (path.length === 1) {
    updated[name] = value
  } else {
    updated[name] = updateIn((updated[name] || {}), path.slice(1), value)
  }
  return updated
}

module.exports = {bind, bindAll, updateIn}
