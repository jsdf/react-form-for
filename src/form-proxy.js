/* @flow */
var React = require('./react')
var classSet = require('classnames')
var FormProxyMixin = require('./form-proxy-mixin')
var createElementFrom = require('./create-element-from')

var FormProxy = React.createClass({
  mixins: [
    FormProxyMixin,
  ],
  render() {
    var form = this.getForm()
    var formProps = this.getFormProps(form)
    formProps.children = this.renderFormChildren(form)

    if (this.isTopLevelForm()) {
      formProps.className = classSet(this.props.className, 'rff-form')
      return this.props.component ? createElementFrom(this.props.component, formProps) : React.DOM.form(formProps)
    } else {
      formProps.className = classSet(this.props.className, 'rff-fieldset')
      return this.props.component ? createElementFrom(this.props.component, formProps) : React.DOM.div(formProps)
    }
  },
})

module.exports = FormProxy
