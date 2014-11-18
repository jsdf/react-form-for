var React = require('react')
var {cloneWithProps} = require('react/addons').addons

var {bindAll, updateIn, clone, extend, isFunction, isString} = require('./util')

var Field = require('./field')
var FieldProxy = require('./field-proxy')
var FormProxy = require('./form-proxy')

function needsForm(node) {
  return (
    node.type === FieldProxy.type ||
    node.type === FormProxy.type
  ) && !hasForm(node)
}

function isFieldProxy(node) {
  node.type === FieldProxy.type
}

function isFormProxy(node) {
  node.type === FormProxy.type
}

function hasForm(node) {
  return node && node.props && node.props.form
}

// recursive map over children
function applyFormToChildren(parent, form) {
  return cloneWithProps(parent, {
    children: React.Children.map(parent.props.children, function(child) {
      if (!child || !child.props) return child
      console.log(child.type.displayName, child.props)
      var updatedChild = needsForm(child) ? cloneWithProps(child, {form}) : child
      // stop when reaching a form proxy
      return isFormProxy(updatedChild) ? updatedChild : applyFormToChildren(updatedChild, form)
    }),
  })
}

class Form {
  constructor(opts) {
    if (!(this instanceof Form)) return new Form(opts)
    opts = opts || {}

    bindAll(this, 'applyUpdate')
    var formValueOpt = opts.value || opts.for
    var formNameOpt = opts.name || opts.for
    var name, value
    if (isString(formNameOpt)) name = formNameOpt
    else if (formValueOpt) value = formValueOpt

    console.log('value', value)

    this.delegate = opts.form
    this.subject = (this.delegate && name ? this.delegate.getFieldValue(name) : value) || {}
    this.path = (this.delegate && name ? this.delegate.path.concat(name) : opts.path) || []
    this.fieldComponent = (this.delegate ? this.delegate.fieldComponent : opts.fieldComponent) || Field
    this.onChange = opts.onChange
    console.log('children for ', this.subject, React.Children.map(opts.children, (ch)=>[ch.type.displayName, ch.props]))
    return opts.children ? this.applySelfToChildren(opts.children) : null
  }
  applySelfToChildren(children) {
    var form = this
    // traverse component children and inject form prop
    return React.Children.map(children, (child) => applyFormToChildren(child, form))
  }
  applyUpdate(value, path) {
    if (this.delegate) return this.delegate.applyUpdate(value, path)

    if (isFunction(this.onChange)) {
      this.onChange(updateIn(this.subject, path, value))
    }
  }
  getDelegate() {
    return this.delegate || this
  }
  getFieldValue(name) {
    return this.subject[name]
  }
}

module.exports = Form
