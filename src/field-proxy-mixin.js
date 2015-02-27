/* @flow */
var React = require('./react')
var {extend, omit, uniqueId} = require('./util')
var labelForName = require('./label-for-name')

var FieldProxyMixin:any = {  
  statics: {
    isFieldProxy: true,
  },
  getDefaultProps():Object {
    return {
      type: 'text',
    }
  },
  getName():string {
    return this.props.for || this.props.name
  },
  getPathWithName(form:?Form = this.props.form):Array<string> {
    return form.path.concat(this.getName())
  },
  handleChange(e:any, form) {
    var updatedValue
    var name = this.getName()
    if (e && typeof e == 'object' && e.target) {
      if (e.stopPropagation) e.stopPropagation()
      updatedValue = e.target.value
    } else {
      updatedValue = e
    }

    form.applyUpdate(updatedValue, form.path.concat(name))
  },
  getFieldProps(form:?Form = this.props.form):Object {
    var type = this.props.inputType || this.props.type
    var name = this.getName()
    var label = this.props.label || form.getLabelFor(name) || labelForName(name)
    var value = form.getValueFor(name)
    var validation = form.getExternalValidationFor(name)
    var hint = form.getHintsFor(name)
    var id = `rff-field-input-${uniqueId(null)}`
    var className = `field-${this.getPathWithName(form).join('-')}`
    var onChange = (e) => this.handleChange(e, form)

    return extend(omit(this.props, 'for'), {value, name, type, onChange, label, validation, id, className})
  },
  getFieldComponent():ReactClass|ReactComponent {
    return this.props.component || this.props.form.fieldComponent
  },
}

module.exports = FieldProxyMixin
