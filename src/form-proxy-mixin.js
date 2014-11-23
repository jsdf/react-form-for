/** @jsx React.DOM */
var React = require('react')
var {isString, omit, extend} = require('./util')

var API_PROPS = ['for','name','value','formDelegate']

var createElementFrom = require('./create-element-from')

var FormProxyMixin = {
  isTopLevelForm: function() {
    var Form = require('./form') // avoid circular require
    return Boolean(Form.getValue(this))
  },
  renderFormChildren: function() {
    var Form = require('./form') // avoid circular require
    return new Form(this, this.props.delegateForm).getChildren()
  },
  getFormProps: function() {
    var formProps = omit(this.props, API_PROPS)
    formProps.children = this.renderFormChildren()
    return formProps
  },
}

module.exports = FormProxyMixin
