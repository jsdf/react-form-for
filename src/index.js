var React = require('react')
var {cloneWithProps} = require('react/addons').addons

var {clone, extend, isFunction} = require('underscore')
var {bindAll, updateIn} = require('./util')

var Field = require('./field')
var FieldProxy = require('./field-proxy')

function isFieldProxy(node) {
  return node.type === FieldProxy.type
}

function hasForm(node) {
  return node && node.props && node.props.form
}

var isElement = React.isValidElement || React.isValidComponent

// recursive map over children
function mapElementTree(parent, fn) {
  if (
    !isElement(parent) 
    || typeof parent.props == 'string'
    || (parent.props && typeof parent.props.children  == 'string')
  ) return parent

  return cloneWithProps(parent, {
    children: React.Children.map(parent.props.children, function(child) {
      if (!isElement(child)) return child
      var updatedChild = fn(child)
      return mapElementTree(updatedChild, fn)
    }),
  })
}

class FormFor {
  constructor(subject, opts, block) {
    if (!(this instanceof FormFor)) return new FormFor(subject, opts, block)
    if (isFunction(opts)) {
      block = opts
      opts = null
    }
    opts = opts || {}

    bindAll(this, 'applyUpdate')
    this.subject = subject || {}
    this.path = opts.path || []
    this.delegate = opts.delegate
    this.onChange = opts.onChange
    this.fieldComponent = opts.fieldComponent || Field
    
    if (block) return this.executeBlock(block)
    else return this
  }
  executeBlock(block) {
    var form = this
    var tree = block(form)

    function injectForm(node) {
      if(isFieldProxy(node) && !hasForm(node)) {
        return cloneWithProps(node, {form})
      } else {
        return node
      }
    }

    // traverse returned component tree and inject form prop
    return injectForm(mapElementTree(tree, injectForm))
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
  fieldsFor(name, opts, block) {
    if (isFunction(opts)) {
      block = opts
      opts = null
    }
    opts = opts || {}

    var fieldValue = this.getFieldValue(name) || {}

    var fieldOpts = extend({
      path: this.path.concat(name),
      delegate: this.delegate || this,
      fieldComponent: this.fieldComponent,
    }, clone(opts))
    return new FormFor(fieldValue, fieldOpts, block)
  }
}

FormFor.Field = FieldProxy
FormFor.FormFor = FormFor

module.exports = FormFor
