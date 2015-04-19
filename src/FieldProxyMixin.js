/* @flow */
var React = require('./util/React')
var {omit, uniqueId} = require('./util/util')
var memoize = require('lodash.memoize')
var {humanize} = require('./util/Inflection')
var FormContextMixin = require('./FormContextMixin')

// a memoized inflection of the field name
var getLabelForFieldName = memoize(humanize)

var FieldProxyMixin:any = {
  statics: {
    isFieldProxy: true,
  },
  mixins: [
    FormContextMixin,
  ],
  getDefaultProps():Object {
    return {
      type: 'text',
    }
  },
  // TODO: DRY up to somewhere else
  getName():string {
    return this.props.for || this.props.name
  },
  getPathWithName(parentContext:?Object):Array<string> {
    if (parentContext == null) parentContext = this.getParentFormContext()
    return parentContext.path.concat(this.getName())
  },
  handleChange(e:any, parentContext) {
    var updatedValue
    var name = this.getName()
    if (e && typeof e == 'object' && e.target) {
      if (e.stopPropagation) e.stopPropagation()
      updatedValue = e.target.value
    } else {
      updatedValue = e
    }

    this.applyUpdate(parentContext, updatedValue, parentContext.path.concat(name))
  },
  getParentFormContext() {
    return this.getFormContext()
  },
  getFieldProps(parentContext:?Object):Object {
    if (parentContext == null) parentContext = this.getParentFormContext()
    var name = this.getName()

    // TODO: move blacklisted props somewhere DRY
    return Object.assign(omit(this.props, 'for'), {
      name,
      type: this.props.inputType || this.props.type,
      label: this.props.label || parentContext.getChildContextProp('labels', name) || getLabelForFieldName(name),
      value: parentContext.getChildContextProp('value', name),
      validation: parentContext.getChildContextProp('externalValidation', name),
      hint: parentContext.getChildContextProp('hints', name),
      id: `rff-field-input-${uniqueId(null)}`,
      className: `field-${this.getPathWithName(parentContext).join('-')}`,
      onChange: (e) => this.handleChange(e, parentContext),
    })
  },
  getFieldComponent(parentContext:?Object):ReactClass|ReactComponent {
    if (parentContext == null) parentContext = this.getParentFormContext()
    return this.props.component || parentContext && parentContext.props.fieldComponent
  },
}

module.exports = FieldProxyMixin
