var React = require('react')
var {Input} = require('react-bootstrap')
var {each, clone, extend, omit, defaults, memoize, isFunction} = require('underscore')

function bind(fn, me) {
  console.assert(fn)
  console.assert(me)
  return () => fn.apply(me, arguments)
}

function bindAll(obj, ...methods) {
  each(methods, (methodName) => obj[methodName] = bind(obj[methodName], obj))
}

var ID_SUFFIX = new RegExp('(_ids|_id)$', 'g')
var UNDERBAR = new RegExp('_', 'g')

function capitalize(str) {
  str = str.toLowerCase()
  return str.substring(0, 1).toUpperCase() + str.substring(1)
}

function humanize(str) {
  str = str.toLowerCase()
  str = str.replace(ID_SUFFIX, '')
  str = str.replace(UNDERBAR, ' ')
  str = capitalize(str)
  return str
}

var labelForName = memoize(humanize)

function updateIn(object, path, value) {
  if (!path || !path.length) throw new Error('invalid path')

  var updated = clone(object)
  var [name] = path
  if (path.length === 1) {
    updated[name] = value
  } else {
    updated[name] = updateIn(updated[name], path.slice(1), value)
  }
  return updated
}

DEFAULT_COMPONENTS = {
  Input: Input,
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
    this.subject = subject
    this.opts = opts
    this.path = opts.path || []
    this.delegate = opts.delegate
    this.onChange = opts.onChange
    this.components = defaults(opts.components || {}, DEFAULT_COMPONENTS)
    
    if (block) return block(this)
    else return this
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
    if (this.subject[name] == null) {
      throw new Error(`property ${name} not found on subject`)
    }
    return this.subject[name]
  }
  FieldsFor(name, opts, block) {
    if (isFunction(opts)) {
      block = opts
      opts = null
    }
    opts = opts || {}

    var fieldValue = this.getFieldValue(name)

    var fieldOpts = extend(clone(opts), {
      path: this.path.concat(name),
      delegate: this.delegate || this,
    })
    return new FormFor(fieldValue, fieldOpts, block)
  }
  Field(props = {}) {
    var self = this
    var name = props.for || props.name
    var {label} = props
    var value = this.getFieldValue(name)
    var Component = props.component || this.components.Input

    var componentProps = extend(omit(props, 'for'), {name})

    function handleChange(e) {
      e.stopPropagation()
      self.applyUpdate(e.target.value, self.path.concat(name))
    }

    return (
      <Component
        type="text"
        {...componentProps}
        value={value}
        label={label || labelForName(name)}
        onChange={handleChange}
      />
    )
  }
}

module.exports = FormFor
