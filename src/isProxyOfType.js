/* @flow */
var getElementType = require('./util/getElementType')

function isProxyOfType(matchTypeName:string, element:?Object):boolean {
  var type = getElementType(element)
  if (type != null) {
    switch (matchTypeName) {
      case 'FieldProxy':
        return Boolean(type.isFieldProxy)
      case 'FormProxy':
        return Boolean(type.isFormProxy)
      case 'ListProxy':
        return Boolean(type.isListProxy)
    }
    return false
  } else {
    return false
  }
}

module.exports = isProxyOfType
