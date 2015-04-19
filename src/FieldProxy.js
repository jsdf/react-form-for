/* @flow */
var React = require('./util/React')
var createElementFrom = require('./util/createElementFrom')
var FieldProxyMixin = require('./FieldProxyMixin')

var FieldProxy:any = React.createClass({
  mixins: [
    FieldProxyMixin,
  ],
  render() {
    var parentContext = this.getParentFormContext()
    if (!parentContext) throw new Error(`no parent FormContext for ${this.getName()}`)
    return createElementFrom(this.getFieldComponent(parentContext), this.getFieldProps(parentContext))
  }
})

module.exports = FieldProxy
