/* @flow */
var React = require('./util/React')
var createElementFrom = require('./util/createElementFrom')
var FieldProxyMixin = require('./FieldProxyMixin')

var FieldProxy:any = React.createClass({
  mixins: [
    FieldProxyMixin,
  ],
  render() {
    if (!this.props.form) throw new Error(`no form for ${this.getName()}`)
    return createElementFrom(this.getFieldComponent(), this.getFieldProps())
  }
})

module.exports = FieldProxy
