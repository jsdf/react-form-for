/* @flow */
var React = require('./util/React')
var {omit} = require('./util/util')
var createElementFrom = require('./util/createElementFrom')
var FormContextMixin = require('./FormContextMixin')

// TODO: move somewhere DRY
var API_PROPS = ['for', 'name', 'value', 'formDelegate']

var FormProxyMixin = {
  statics: {
    isFormProxy: true,
  },
  mixins: [
    FormContextMixin,
  ],
  renderFormChildren(formContext:?Object):any {
    if (formContext == null) formContext = this.getFormContext()
    return this.renderChildrenForFormContext(formContext)
  },
  getFormProps(formContext:?Object):Object {
    if (formContext == null) formContext = this.getFormContext()
    var formProps = omit(this.props, API_PROPS)
    return formProps
  },
}

module.exports = FormProxyMixin
