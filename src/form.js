var React = require('react')
var {cloneWithProps} = require('react/addons').addons

var {updateIn, extend, isFunction, isString} = require('./util')

var Field = require('./field')
var FieldProxy = require('./field-proxy')
var FormProxy = require('./form-proxy')

var isElement = React.isValidElement || React.isValidComponent

function hasChildren(node) {
  return node && node.props && node.props.children
}

function getType(node) {
  return node && node.type || node.constructor
}

function isFieldProxy(node) {
  return getType(node) === FieldProxy.type
}

function isFormProxy(node) {
  return getType(node) === FormProxy.type
}

function NoChildrenError() {
  var err = new Error('form/fieldset without children not valid')
  err.name = 'NoChildrenError'
  return err
}

// recursive map over children and inject form prop
function getChildrenWithForm(node, form) {
  return React.Children.map(node.props.children, function(child) {
    if (
      !isElement(child)
      || typeof child == 'string'
      || typeof child.props == 'string'
      || (child.props && typeof child.props.children == 'string')
    ) {
      return child
    }

    var updatedProps = {}

    if (isFormProxy(child)) {
      if (!hasChildren(child)) noChildrenError()
      // stop recursion, just inject form delegateForm
      updatedProps.delegateForm = form
    } else {
      if (isFieldProxy(child)) {
        updatedProps.form = form
      }
      // recurse to update grandchildren
      updatedProps.children = getChildrenWithForm(child, form)
    }

    return cloneWithProps(child, updatedProps)
  })
}

class Form {
  constructor(component, delegateForm) {
    if (!(this instanceof Form)) return new Form(component, delegateForm)

    this.component = component
    var props = this.component.props
    var value = Form.getValue(component)
    var name = Form.getName(component)

    if (name && !delegateForm) throw new Error('delegateForm required when name provided')
    if (delegateForm && !name) throw new Error('name required when delegateForm provided')
    if (delegateForm) {
      // a nested form fieldset, delegates to the top level form
      if (!(delegateForm instanceof Form)) throw new Error('invalid delegateForm')
      this.delegateForm = delegateForm
      this.value = this.delegateForm.getValueFor(name) || {}
      this.path = this.delegateForm.path.concat(name)
      this.labels = this.delegateForm.getLabelFor(name)
      this.externalValidation = this.delegateForm.getMetadataFor('externalValidation', name)
      this.hints = this.delegateForm.getMetadataFor('hints', name)
    } else {
      // the top level form
      this.value = value || {}
      this.path = []
      this.onChange = props.onChange
      this.labels = props.labels
      this.externalValidation = props.externalValidation
      this.hints = props.hints
    }
    this.fieldComponent = (
      props.fieldComponent
      || this.delegateForm && this.delegateForm.fieldComponent
      || Field
    )
  }
  getChildren() {
    if (this.component.props.children) {
      // traverse component children and inject form prop
      return getChildrenWithForm(this.component, this)
    } else {
      throw NoChildrenError()
    }
  }
  applyUpdate(value, path) {
    if (this.delegateForm) return this.delegateForm.applyUpdate(value, path)

    if (isFunction(this.onChange)) {
      this.onChange(updateIn(this.value, path, value))
    }
  }
  getValueFor(name) {
    return this.value[name]
  }
  getLabelFor(name) {
    return this.labels && this.labels[name]
  }
  getMetadataFor(type, name) {
    return this[type] && this[type][name]
  }
}

var FormClassMethods = {
  getValue: function(component) {
    return component.props.value || !isString(component.props.for) && component.props.for
  },
  getName: function(component) {
    return component.props.name || isString(component.props.for) && component.props.for
  },
}

extend(Form, FormClassMethods)

module.exports = Form
