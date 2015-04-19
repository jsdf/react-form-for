/* @flow */
var React = require('./util/React')
var {pick} = require('./util/util')
var makeDefaultValueFor = require('./makeDefaultValueFor')
var Field = require('./components/Field')

function contextChildPropFor(formContext:Object, propName:?string, childName:?string):any {
  var contextProp = formContext[propName]
  return contextProp instanceof Object ? contextProp[childName] : null
}

function contextChildProps(parentContext:Object, childName:?string, propNames:Array<string>) {
  return propNames.reduce((childProps, propName) => {
    childProps[propName] = contextChildPropFor(parentContext, propName, childName)
    return childProps
  }, {})
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

type FormState = {
  value: Object|Array<Object>;
  onChange: Function;
}

type FormContextProps = {
  // value: Object;
  // labels: Object;
  // externalValidation: Object;
  // hints: Object;
  // fieldComponent: ReactClass|ReactComponent;
  [key: string]: any;
}

class FormContext {
  state: FormState;
  props: FormContextProps = {};
  parentContext: ?FormContext;
  path: Array<string|number>;
  proxyComponent: ReactComponent;

  initFromRootProxy(proxyComponent:ReactComponent) {
    this.proxyComponent = proxyComponent

    this.initAsRoot()
  }
  initFromChildProxy(proxyComponent:ReactComponent) {
    this.proxyComponent = proxyComponent

    var parentContext = FormContext.getParentFromProxy(proxyComponent)
    // a nested form fieldset, delegates to the top level form
    if (parentContext != null) {
      this.initAsChild(parentContext)
    } else {
      throw new Error('missing parentContext')
    }
  }
  initAsRoot() {
    this.path = []
    this.initStateFromRootProxy(this.proxyComponent)
    this.initPropsFromProxy(this.proxyComponent)
  }
  initAsChild(parentContext:FormContext) {
    var name = FormContext.getNameFromProxy(this.proxyComponent)
    if (!(parentContext instanceof FormContext)) throw new Error('invalid parentContext')
    if (!(typeof name == 'string' || typeof name == 'number')) {
      throw new Error('name required when parentContext provided')
    }

    this.initFromParent(parentContext, name)

    // extra stuff from proxyComponent
    this.initPropsFromProxy(this.proxyComponent)

  }
  getChildContextProp(propName:string, childName:?string):any {
    return contextChildPropFor(this, propName, childName)
  }
  initFromParent(parentContext:Object, childName:string|number) {
    this.parentContext = parentContext
    this.state = parentContext.state
    this.path = parentContext.path.concat(childName)

    var propsInheritedFromParent = contextChildProps(parentContext, String(childName), INHERITED_CONTEXT_PROPNAMES)
    Object.assign(this.props, propsInheritedFromParent)

    if (this.props.value == null) {
      if (parentContext.state.value instanceof Object) {
        this.props.value = parentContext.state.value[childName]   
      } else {
        this.props.value = makeDefaultValueFor(this)
      }
    }

    // defaults
    this.props.fieldComponent = parentContext.fieldComponent
  }
  initStateFromRootProxy(proxyComponent:ReactComponent) {
    var value = FormContext.getValueFromProxy(proxyComponent)

    // root FormContext owns FormState, child contexts only hold a reference to it
    this.state = {
      value: value != null ? value : makeDefaultValueFor(this),
      onChange: proxyComponent.props.onChange,
    }
  }
  initPropsFromProxy(proxyComponent:ReactComponent) {
    Object.assign(this.props, pick(proxyComponent.props, INHERITED_COMPONENT_PROPNAMES))

    this.props.fieldComponent = this.props.fieldComponent || Field
  }
  static getValueFromProxy(proxyComponent:ReactComponent):?Object {
    var {props} = proxyComponent
    if (props.value instanceof Object) {
      return props.value
    } else if (props.for instanceof Object) {
      return props.for
    } else {
      return null
    }
  }
  static getNameFromProxy(proxyComponent:ReactComponent):?string|number {
    var {props} = proxyComponent
    if (typeof props.name == 'string' || typeof props.name == 'number') {
      return props.name  
    } else if (typeof props.for == 'string') {
      return props.for
    } else {
      return null
    }
  }
  static getParentFromProxy(proxyComponent:ReactComponent):?FormContext {
    var {props} = proxyComponent
    if (props.parentFormContext instanceof FormContext) {
      return props.parentFormContext
    } else {
      return null
    }
  }
}

module.exports = FormContext
