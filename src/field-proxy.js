/** @jsx React.DOM */
var React = require('react')
var {cloneWithProps} = require('react/addons').addons

var {extend, omit} = require('./util')
var memoize = require('lodash.memoize')

var {humanize} = require('./inflection')

var labelForName = memoize(humanize)

var isElement = React.isValidElement || React.isValidComponent

function createComponent(component, props) {
  if (isElement(component)) {
    return cloneWithProps(component, props)
  } else {
    return React.createElement(component, props)
  }
}

var FieldProxy = React.createClass({
  getDefaultProps: function() {
    return {
      type: 'text',
    }
  },
  getName: function() {
    return this.props.for || this.props.name
  },
  handleChange: function (e) {
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
  getComponentProps: function() {
    var {form, type} = this.props
    var name = this.getName()
    var label = this.props.label || labelForName(name)
    var value = form.getFieldValue(name)
    var onChange = this.handleChange

    return extend(omit(this.props, 'for'), {value, name, type, onChange, label})
  },
  render: function() {
    if (!this.props.form) throw new Error(`no form for ${this.getName()}`)
    var component = this.props.component || this.props.form.fieldComponent

    return createComponent(component, this.getComponentProps())
  }
})

module.exports = FieldProxy
