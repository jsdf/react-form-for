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

// recursive map over children
function mapElementTree(parent, fn) {
  return cloneWithProps(parent, {
    children: React.Children.map(parent.props.children, function(child) {
      if (!child || !child.props) return child
      var updatedChild = fn(child)
      return mapElementTree(fn(child), fn)
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
    console.debug(this)
    
    if (block) return this.executeBlock(block)
    else return this
  }
  executeBlock(block) {
    var form = this
    var tree = block(form)

    // traverse returned component tree and inject form prop
    return mapElementTree(tree, (node) =>
      isFieldProxy(node) && !hasForm(node) ? cloneWithProps(node, {form}) : node
    )
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

    var fieldOpts = extend(clone(opts), {
      path: this.path.concat(name),
      delegate: this.delegate || this,
    })
    return new FormFor(fieldValue, fieldOpts, block)
  }
}

FormFor.Field = FieldProxy

module.exports = FormFor
