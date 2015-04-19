var FormContext = require('./FormContext')
var deepCloneElementWithFormContext = require('./deepCloneElementWithFormContext')
var {updateIn} = require('./util/util')

var FormContextMixin = {
  isFormRoot():boolean {
    var parentContext = FormContext.getParentFromProxy(this)
    if (!parentContext instanceof FormContext) return false

    // if this form proxy has been provided with a 'value' prop, it could become
    // the root of a new form structure. not yet supported.
    return Boolean(FormContext.getValueFromProxy(this))
  },
  getFormContext():FormContext {
    var formContext = new FormContext()

    if (this.isFormRoot()) {
      formContext.initFromRootProxy(this)
    } else {
      formContext.initFromChildProxy(this)
    }
    return formContext
  },
  renderChildrenForFormContext(formContext:FormContext) {
    if (formContext.proxyComponent == null) throw new Error('formContext missing proxyComponent')
    if (formContext.proxyComponent.props == null || formContext.proxyComponent.props.children == null) {
      throw new Error('No children')
    } else {
      // traverse proxyComponent children and inject form prop
      return deepCloneElementWithFormContext(formContext.proxyComponent, formContext)
    }
  },
  // TODO: maybe move the guts of this elsewhere
  applyUpdate(formContext:FormContext, value:Object, path:Array<string>) {
    if (formContext.state.onChange instanceof Function) {
      formContext.state.onChange(updateIn(formContext.state.value, path, value))
    } else {
      console && (console.warn || console.log)('value update occured but onChange handler not set')
    }
  },
}

module.exports = FormContextMixin
