/* @flow */
var React = require('./util/React')
var classSet = require('classnames')
var FormProxyMixin = require('./FormProxyMixin')
var createElementFrom = require('./util/createElementFrom')

var FormProxy = React.createClass({
  mixins: [
    FormProxyMixin,
  ],
  render() {
    var formContext = this.getFormContext()
    var formProps = this.getFormProps(formContext)
    formProps.children = this.renderFormChildren(formContext)

    var defaultComponent
    if (this.isFormRoot()) {
      formProps.className = classSet(this.props.className, 'rff-form')
      defaultComponent = React.DOM.form
    } else {
      formProps.className = classSet(this.props.className, 'rff-fieldset')
      defaultComponent = React.DOM.div
    }
    return this.props.component ? createElementFrom(this.props.component, formProps) : defaultComponent(formProps)
  },
})

module.exports = FormProxy
