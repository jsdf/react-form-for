/* @flow */
var React = require('./react')
var createElementFrom = require('./create-element-from')
var FieldProxyMixin = require('./field-proxy-mixin')

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
