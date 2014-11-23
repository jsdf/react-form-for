/* @flow */
var React = require('react')
var {isString, omit, extend} = require('./util')
var createElementFrom = require('./create-element-from')
var Form = require('./form') // avoid circular require

var API_PROPS = ['for', 'name', 'value', 'formDelegate']

var FormProxyMixin:any = {
  statics: {
    isFormProxy: true,
  },
  isTopLevelForm():boolean {
    return Boolean(Form.getValueFromComponent(this))
  },
  renderFormChildren():any {
    return new Form(this, this.props.delegateForm).getChildren()
  },
  getFormProps():Object {
    var formProps = omit(this.props, API_PROPS)
    formProps['children'] = this.renderFormChildren()
    return formProps
  },
}

module.exports = FormProxyMixin
