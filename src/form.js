/* @flow */
var React = require('react')
var {cloneWithProps} = require('react/addons').addons
var {updateIn, extend, isString} = require('./util')
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
      if (!hasChildren(child)) NoChildrenError()
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
  value: Object;
  path: Array<string>;
  component: ReactComponent;
  onChange: Function;
  delegateForm: Form;
  labels: Object;
  externalValidation: Object;
  hints: Object;
  fieldComponent: ReactClass|ReactComponent;
  constructor(component:ReactComponent, delegateForm:?Form) {
    this.component = component
    if (delegateForm instanceof Form) {
      // a nested form fieldset, delegates to the top level form
      this.acquireOptsFromDelegateForm(component, delegateForm)
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
      throw NoChildrenError()
    }
  }
  applyUpdate(value:Object, path:Array<string>) {
    if (this.delegateForm instanceof Form) {
      this.delegateForm.applyUpdate(value, path)
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
  acquireOptsFromDelegateForm(component:ReactComponent, delegateForm:Form) {
    var name = Form.getNameFromComponent(component)
    if (delegateForm instanceof Form && name == null) throw new Error('name required when delegateForm provided')
    if (!(delegateForm instanceof Form)) throw new Error('invalid delegateForm')
    this.delegateForm = delegateForm
    this.path = delegateForm.path.concat(name)

    this.value = delegateForm.getValueFor(name) || {}
    this.labels = delegateForm.getLabelFor(name)
    this.externalValidation = delegateForm.getExternalValidationFor(name)
    this.hints = delegateForm.getHintsFor(name)

    this.fieldComponent = component.props.fieldComponent || delegateForm.fieldComponent || Field
  }
  getValueFor(name:string):any {
    return this.value[name]
  }
  getLabelFor(name:string):any {
    return this.labels && this.labels[name]
  }
  getExternalValidationFor(name:string):any {
    return this.externalValidation && this.externalValidation[name]
  }
  getHintsFor(name:string):any {
    return this.hints && this.hints[name]
  }
}

// class methods
extend(Form, {
  getValueFromComponent(component) {
    return component.props.value || !isString(component.props.for) && component.props.for
  },
  getNameFromComponent(component) {
    return component.props.name || isString(component.props.for) && component.props.for
  },
})

module.exports = Form
