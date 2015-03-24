/* @flow */
var React = require('./util/React')
var cloneElement = require('./util/cloneElement')
var getElementType = require('./util/getElementType')
var StandardError = require('standard-error')
var {updateIn, extend, pick} = require('./util/util')
var Field = require('./components/Field')
var isElement = React.isValidElement || React.isValidComponent

function hasChildren(node):boolean {
  if (node != null && node.props != null) {
    return node.props.children != null
  }
}

function isFieldProxy(node) {
  var type = getElementType(node)
  if (type != null) {
    return Boolean(type.isFieldProxy)
  } else {
    return false
  }
}

function isFormProxy(node) {
  var type = getElementType(node)
  if (type != null) {
    return Boolean(type.isFormProxy)
  } else {
    return false
  }
}

function isListProxy(node) {
  var type = getElementType(node)
  if (type != null) {
    return Boolean(type.isListProxy)
  } else {
    return false
  }
}

class NoChildrenError extends StandardError {
  constructor() {
    this.name = 'NoChildrenError'
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

    return cloneElement(child, updatedProps)
  })
}

function contextChildValueFor(formContext:Object, propName:?string, name:?string):any {
  var contextProp = formContext[propName]
  return contextProp instanceof Object ? contextProp[name] : null
}

function childContextOf(parentFormContext:Object, childName:?string, propNames:Array<string>) {
  return propNames.reduce((childContext, propName) => {
    childContext[propName] = contextChildValueFor(parentFormContext, propName, childName)
    return childContext
  }, {})
}

// TODO: move this elsewhere
function inferTypeFromFieldComponent(component:ReactComponent) {
  if (typeof component.props.type == 'undefined') {
    return 'string'
  }

  switch (component.props.type) {
    case 'number':
      return 'number'
    case 'checkbox':
      return 'boolean'
  }
  return 'string'
}

function inferSchemaFromComponent(component:ReactComponent) {
  var type

  if (isFormProxy(component)) {
    type = 'object'
  } else if (isFieldProxy(component)) {
    type = inferTypeFromFieldComponent(component)
  } else if (isListProxy(component)) {
    type = 'array'
  } else {
    type = 'object'
  }

  switch (type) {
    case 'object':
      return {
        type: 'object',
        properties: {},
      }
    case 'array':
      return {
        type: 'array',
        items: {
          type: 'object',
          properties: {},
        },
      }
  }
  return {
    type: type,
  }
}

var INHERITED_CONTEXT_PROPNAMES = [
  'value',
  'labels',
  'externalValidation',
  'hints',
]

var INHERITED_COMPONENT_PROPNAMES = [
  'onChange',
  'labels',
  'externalValidation',
  'hints',
  'fieldComponent',
]

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
      this.acquireOptsForChildForm(component, parentForm)
    } else {
      // the top level form
      this.acquireOptsForTopLevelForm(component)
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
    var formContext:Object = this

    if (formContext.parentForm instanceof Form) {
      formContext.parentForm.applyUpdate(value, path)
      return
    }

    if (formContext.onChange instanceof Function) {
      formContext.onChange(updateIn(formContext.value, path, value))
    }
  }
  acquireOptsForTopLevelForm(component:ReactComponent) {
    extend(this, Form.getFormContextFromComponent(component))
  }
  acquireOptsForChildForm(component:ReactComponent, parentForm:Form) {
    var name = Form.getNameFromComponent(component)
    if (!(parentForm instanceof Form)) throw new Error('invalid parentForm')
    if (!(typeof name == 'string' || typeof name == 'number')) {
      throw new Error('name required when parentForm provided')
    }

    var formContext:Object = Form.getChildFormContextFromParent(parentForm, name)

    // extra stuff from component
    var componentContext = Form.getFormContextFromComponent(component)

    formContext.inferredSchema = inferSchemaFromComponent(component)

    formContext.value = formContext.value // || makeDefaultValueForSchema(formContext.inferredSchema)
    formContext.fieldComponent = componentContext.fieldComponent || formContext.fieldComponent || Field


    extend(this, formContext)
  }
  // deprecated getter methods
  getValueFor(name:?string):any {
    return contextChildValueFor(this, 'value', name)
  }
  getLabelFor(name:?string):any {
    return contextChildValueFor(this, 'labels', name)
  }
  getExternalValidationFor(name:?string):any {
    return contextChildValueFor(this, 'externalValidation', name)
  }
  getHintsFor(name:?string):any {
    return contextChildValueFor(this, 'hints', name)
  }
  static getChildFormContextFromParent(parentFormContext:Object, childName:string|number):Object {
    var childFormContext = childContextOf(parentFormContext, String(childName), INHERITED_CONTEXT_PROPNAMES)

    childFormContext.parentForm = parentFormContext
    childFormContext.path = parentFormContext.path.concat(childName)

    // defaults
    childFormContext.fieldComponent = parentFormContext.fieldComponent

    return childFormContext
  }
  static getFormContextFromComponent(component:ReactComponent):Object {
    var value = Form.getValueFromComponent(component)
    
    var formContext:Object = {
      value: value || (isListProxy(component) ? [] : {}),
      path: [],
      fieldComponent: null
    }

    extend(formContext, pick(component.props, INHERITED_COMPONENT_PROPNAMES))

    formContext.fieldComponent = formContext.fieldComponent || Field

    return formContext
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
  static getNameFromComponent(component:ReactComponent):?string|number {
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
