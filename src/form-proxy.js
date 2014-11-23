/** @jsx React.DOM */
var React = require('react/addons')
var {classSet} = React.addons

var FormProxyMixin = require('./form-proxy-mixin')

var FormProxy = React.createClass({
  mixins: [FormProxyMixin],
  render: function() {
    var formProps = this.getFormProps()
    if (this.isTopLevelForm()) {
      formProps.className = classSet(this.props.className, 'rff-form')
      return this.props.component ? createElementFrom(component, formProps) : React.DOM.form(formProps)
    } else {
      formProps.className = classSet(this.props.className, 'rff-fieldset')
      return this.props.component ? createElementFrom(component, formProps) : React.DOM.div(formProps)
    }
  },
})

module.exports = FormProxy
