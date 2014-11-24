/* @flow */
var React = require('react')
var createElementFrom = require('./create-element-from')
var {merge} = require('./util')
var FieldProxyMixin = require('./field-proxy-mixin')

var EachFieldProxy:any = React.createClass({
  mixins: [
    FieldProxyMixin,
  ],
  render() {
    if (!this.props.form) throw new Error(`no form for ${this.getName()}`)
    var fieldProps = this.getFieldProps()

    var fieldComponent = this.props.form.fieldComponent

    var fieldElements = fieldProps.value.map((value) =>
      merge
    )

    var selfProps = {
      children: fieldElements,
    }

    if (this.props.component) {
      return createElementFrom(this.props.component, {children: fieldElements})
    } else {
      return React.DOM.div(this.props.component, {children: fieldElements})
    }

  }
})

module.exports = EachFieldProxy
