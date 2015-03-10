/* @flow */
var React = require('./util/React')
var {omit, extend} = require('./util/util')
var createElementFrom = require('./util/createElementFrom')
var Form = require('./Form') // avoid circular require

var API_PROPS = ['for', 'name', 'value', 'formDelegate']

var FormProxyMixin:any = {
  statics: {
    isFormProxy: true,
  },
  isTopLevelForm():boolean {
    // if this form proxy has been provided with a 'value' prop, it could become
    // the root of a new form structure. not yet supported.
    return Boolean(Form.getValueFromComponent(this))
  },
  renderFormChildren(form:Form = this.getForm()):any {
    return form.getChildren()
  },
  getForm():Form {
    return new Form(this, this.props.parentForm)
  },
  getFormProps(form:Form = this.getForm()):Object {
    var formProps = omit(this.props, API_PROPS)
    return formProps
  },
}

module.exports = FormProxyMixin
