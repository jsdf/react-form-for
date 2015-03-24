if (typeof React == 'undefined') {
  module.exports = require('react/addons')
} else {
  if (!React.addons) {
    throw new Error('React addons build is required to use react-form-for')
  }
  module.exports = React
}
