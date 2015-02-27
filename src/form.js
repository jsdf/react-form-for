/* @flow */
var React = require('./react')
var {cloneWithProps} = require('./react').addons
var StandardError = require('standard-error')
var {updateIn, extend} = require('./util')
var Field = require('./field')
var isElement = React.isValidElement || React.isValidComponent

function hasChildren(node) {
  return node && node.props && node.props.children
}

function getType(node) {
  return node && node.type || node.constructor
}

function isFieldProxy(node) {
  var type = getType(node)
  return type && type.isFieldProxy
}

function isFormProxy(node) {
  var type = getType(node)
  return type && type.isFormProxy
}

class NoChildrenError extends StandardError {
  name: 'NoChildrenError'
  constructor() {
    super('form/fieldset without children not valid')
  }
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
      if (!hasChildren(child)) throw new NoChildrenError()
      // stop recursion, just inject form parentForm
      updatedProps.parentForm = form
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
  value: Object;
  path: Array<string>;
  component: ReactComponent;
  onChange: Function;
  parentForm: Form;
  labels: Object;
  externalValidation: Object;
  hints: Object;
  fieldComponent: ReactClass|ReactComponent;
  constructor(component:ReactComponent, parentForm:?Form) {
    this.component = component
    if (parentForm instanceof Form) {
      // a nested form fieldset, delegates to the top level form
      this.acquireOptsFromParentForm(component, parentForm)
    } else {
      // the top level form
      this.acquireOptsFromComponent(component)
    }
  }
  getChildren() {
    if (this.component.props.children) {
      // traverse component children and inject form prop
      return getChildrenWithForm(this.component, this)
    } else {
      throw new NoChildrenError()
    }
  }
  applyUpdate(value:Object, path:Array<string>) {
    if (this.parentForm instanceof Form) {
      this.parentForm.applyUpdate(value, path)
      return
    }

    if (this.onChange instanceof Function) {
      this.onChange(updateIn(this.value, path, value))
    }
  }
  acquireOptsFromComponent(component:ReactComponent) {
    var value = Form.getValueFromComponent(component)
    
    this.value = value || {}
    this.path = []
    this.onChange = component.props.onChange
    this.labels = component.props.labels
    this.externalValidation = component.props.externalValidation
    this.hints = component.props.hints

    this.fieldComponent = component.props.fieldComponent || Field
  }
  acquireOptsFromParentForm(component:ReactComponent, parentForm:Form) {
    var name = Form.getNameFromComponent(component)
    if (parentForm instanceof Form && name == null) throw new Error('name required when parentForm provided')
    if (!(parentForm instanceof Form)) throw new Error('invalid parentForm')
    this.parentForm = parentForm
    this.path = parentForm.path.concat(name)

    this.value = parentForm.getValueFor(name) || {}
    this.labels = parentForm.getLabelFor(name)
    this.externalValidation = parentForm.getExternalValidationFor(name)
    this.hints = parentForm.getHintsFor(name)

    this.fieldComponent = component.props.fieldComponent || parentForm.fieldComponent || Field
  }
  getValueFor(name:?string):any {
    return this.value[name]
  }
  getLabelFor(name:?string):any {
    return this.labels instanceof Object ? this.labels[name] : null
  }
  getExternalValidationFor(name:?string):any {
    return this.externalValidation instanceof Object ? this.externalValidation[name] : null
  }
  getHintsFor(name:?string):any {
    return this.hints instanceof Object ? this.hints[name] : null
  }
  static getValueFromComponent(component:ReactComponent):?Object {
    if (component.props.value instanceof Object) {
      return component.props.value
    } else if (component.props.for instanceof Object) {
      return component.props.for
    } else {
      return null
    }
  }
  static getNameFromComponent(component:ReactComponent):?string {
    if (typeof component.props.name == 'string' || typeof component.props.name == 'number') {
      return component.props.name  
    } else if (typeof component.props.for == 'string') {
      return component.props.for
    } else {
      return null
    }
  }
}

module.exports = Form
