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
  getPathWithName():Array<string> {
    return this.props.form.path.concat(this.getName())
  },
  handleChange(e:any) {
    var updatedValue
    var {form} = this.props
    var name = this.getName()
    if (e && typeof e == 'object' && e.target) {
      if (e.stopPropagation) e.stopPropagation()
      updatedValue = e.target.value
    } else {
      updatedValue = e
    }

    form.applyUpdate(updatedValue, form.path.concat(name))
  },
  getFieldProps():Object {
    var {form} = this.props
    var type = this.props.inputType || this.props.type
    var name = this.getName()
    var label = this.props.label || form.getLabelFor(name) || labelForName(name)
    var value = form.getValueFor(name)
    var validation = form.getExternalValidationFor(name)
    var hint = form.getHintsFor(name)
    var id = `rff-field-input-${uniqueId(null)}`
    var className = `field-${this.getPathWithName().join('-')}`
    var onChange = this.handleChange

    return extend(omit(this.props, 'for'), {value, name, type, onChange, label, validation, id, className})
  },
  getFieldComponent():ReactClass|ReactComponent {
    return this.props.component || this.props.form.fieldComponent
  },
}

module.exports = FieldProxyMixin
