var isProxyOfType = require('./isProxyOfType')

function inferTypeFromFieldProxy(proxyComponent:ReactComponent) {
  if (typeof proxyComponent.props.type == 'undefined') {
    return 'string'
  }

  switch (proxyComponent.props.type) {
    case 'number':
      return 'number'
    case 'checkbox':
      return 'boolean'
  }
  return 'string'
}

function inferSchemaFromProxy(proxyComponent:ReactComponent) {
  var type

  if (isProxyOfType('FormProxy', proxyComponent)) {
    type = 'object'
  } else if (isProxyOfType('FieldProxy', proxyComponent)) {
    type = inferTypeFromFieldProxy(proxyComponent)
  } else if (isProxyOfType('ListProxy', proxyComponent)) {
    type = 'array'
  } else {
    type = 'object'
  }

  switch (type) {
    case 'object':
      return {
        type: 'object',
        properties: {},
      }
    case 'array':
      return {
        type: 'array',
        items: {
          type: 'object',
          properties: {},
        },
      }
  }
  return {
    type: type,
  }
}

module.exports = inferSchemaFromProxy
