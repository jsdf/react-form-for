/* @flow */

// subset of underscore methods for our purposes

var slice = Array.prototype.slice
var concat = Array.prototype.concat
var toString = Object.prototype.toString

function contains(haystack:any, needle:any):any {
  return haystack.indexOf(needle) > -1
}

function pick(obj:?Object, ...rest:Array<any>):Object {
  var iteratee:any = rest[0]
  var result = {}, key
  if (obj == null) return result
  if (iteratee instanceof Function) {
    for (key in obj) {
      var value = obj[key]
      if (iteratee(value, key, obj)) result[key] = value
    }
  } else {
    var keys = concat.apply([], rest)
    obj = new Object(obj)
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i]
      if (key in obj) result[key] = obj[key]
    }
  }
  return result
}

function omit(obj:Object):any {
  var keys = concat.apply([], slice.call(arguments, 1)).map(String)
  return pick(obj, (value, key) => !contains(keys, key))
}

var idCounter = 0
function uniqueId(prefix:?string):string {
  var id = ++idCounter + ''
  return typeof prefix == 'string' ? prefix + id : id
}

function isArray(arr:any):boolean {
  return toString.call(arr) == '[object Array]'
}

function arrayCopy(arr:Array<any>):Array<any> {
  return slice.call(arr)
}

// update nested object structure via copying
function updateIn(object:any, path:any, value:any):any {
  if (!path || !path.length) throw new Error('invalid path')

  var updated 
  if (isArray(object)) {
    updated = arrayCopy(object)
  } else {
    updated = Object.assign({}, object)
  }
  var [name] = path
  if (path.length === 1) {
    updated[name] = value
  } else {
    updated[name] = updateIn((updated[name] || {}), path.slice(1), value)
  }
  return updated
}

module.exports = {updateIn, omit, pick, contains, uniqueId, isArray, arrayCopy}
