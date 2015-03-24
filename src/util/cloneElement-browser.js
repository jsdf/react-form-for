var React = require('./React')

var cloneElement = React.cloneElement || React.addons && React.addons.cloneWithProps

if (!cloneElement) {
  if (!React.addons) {
    throw new Error('React.addons build required for cloneWithProps')
  } else {
    throw new Error('unsupported')
  }
}

module.exports = cloneElement
