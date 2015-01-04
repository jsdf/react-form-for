!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.ReactFormFor=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* @flow */
var React = require('./react')
var $__0=  React.addons,cloneWithProps=$__0.cloneWithProps
var isElement = React.isValidElement || React.isValidComponent

function createElementFrom(component    , props    )        {
  if (isElement(component)) {
    return cloneWithProps(component, props)
  } else {
    return React.createElement(component, props)
  }
}

module.exports = createElementFrom

},{"./react":11}],2:[function(require,module,exports){
/* @flow */
var React = require('./react')
var $__0=    require('./util'),extend=$__0.extend,omit=$__0.omit,uniqueId=$__0.uniqueId
var labelForName = require('./label-for-name')

var FieldProxyMixin     = {  
  statics: {
    isFieldProxy: true,
  },
  getDefaultProps:function()        {
    return {
      type: 'text',
    }
  },
  getName:function()        {
    return this.props.for || this.props.name
  },
  getPathWithName:function()               {
    return this.props.form.path.concat(this.getName())
  },
  handleChange:function(e    ) {
    var updatedValue
    var $__0=  this.props,form=$__0.form
    var name = this.getName()
    if (e && typeof e == 'object' && e.target) {
      if (e.stopPropagation) e.stopPropagation()
      updatedValue = e.target.value
    } else {
      updatedValue = e
    }

    form.applyUpdate(updatedValue, form.path.concat(name))
  },
  getFieldProps:function()        {
    var $__0=  this.props,form=$__0.form
    var type = this.props.inputType || this.props.type
    var name = this.getName()
    var label = this.props.label || form.getLabelFor(name) || labelForName(name)
    var value = form.getValueFor(name)
    var validation = form.getExternalValidationFor(name)
    var hint = form.getHintsFor(name)
    var id = ("rff-field-input-" + uniqueId(null))
    var className = ("field-" + this.getPathWithName().join('-'))
    var onChange = this.handleChange

    return extend(omit(this.props, 'for'), {value:value, name:name, type:type, onChange:onChange, label:label, validation:validation, id:id, className:className})
  },
  getFieldComponent:function()                           {
    return this.props.component || this.props.form.fieldComponent
  },
}

module.exports = FieldProxyMixin

},{"./label-for-name":10,"./react":11,"./util":12}],3:[function(require,module,exports){
/* @flow */
var React = require('./react')
var createElementFrom = require('./create-element-from')
var FieldProxyMixin = require('./field-proxy-mixin')

var FieldProxy     = React.createClass({displayName: 'FieldProxy',
  mixins: [
    FieldProxyMixin,
  ],
  render:function() {
    if (!this.props.form) throw new Error(("no form for " + this.getName()))
    return createElementFrom(this.getFieldComponent(), this.getFieldProps())
  }
})

module.exports = FieldProxy

},{"./create-element-from":1,"./field-proxy-mixin":2,"./react":11}],4:[function(require,module,exports){
/* @flow */
var React = require('./react')
var $__0=   require('./util'),omit=$__0.omit,extend=$__0.extend
var $__1=  require('./react').addons,classSet=$__1.classSet

// a subset of react-bootstrap/Input, without any bootstrapisms
// most importantly it accepts value and label props and an onChange callback
var Field = React.createClass({displayName: 'Field',
  propTypes: {
    type: React.PropTypes.string,
    label: React.PropTypes.any,
    validation: React.PropTypes.any,
    help: React.PropTypes.any,
    hint: React.PropTypes.any,
    groupClassName: React.PropTypes.string,
    fieldClassName: React.PropTypes.string,
    wrapperClassName: React.PropTypes.string,
    labelClassName: React.PropTypes.string,
    onChange: React.PropTypes.func
  },
  getInputDOMNode:function()     {
    return this.refs.input.getDOMNode()
  },
  getValue:function()        {
    if (typeof this.props.type == 'string') return this.getInputDOMNode().value
    else throw new Error('Cannot use getValue without specifying input type.')
  },
  getChecked:function()         {
    return Boolean(this.getInputDOMNode().checked)
  },
  renderInput:function()     {
    var input = null

    if (!this.props.type) {
      return this.props.children
    }

    var propsForInput = extend(omit(this.props, 'form', 'name'), {ref: "input", key: "input"}) 

    switch (this.props.type) {
      case 'select':
        input = React.DOM.select(extend({children: this.props.children}, propsForInput))
        break
      case 'textarea':
        input = React.DOM.textarea(propsForInput)
        break
      case 'submit':
        input = React.DOM.input(extend({type: "submit"}, propsForInput))
        break
      default:
        input = React.DOM.input(propsForInput)
    }

    return input
  },
  renderHint:function()     {
    var hint = this.props.help || this.props.hint
    return hint ? (
      React.createElement("span", {key: "hint", className: "field-hint"}, 
        hint
      )
    ) : null
  },
  renderErrorMessage:function()     {
    var errorMessage = this.props.validation
    return errorMessage ? (
      React.createElement("span", {key: "errorMessage", className: "field-error-message"}, 
        errorMessage
      )
    ) : null
  },
  renderWrapper:function(children    )     {
    return this.props.wrapperClassName ? (
      React.createElement("div", {className: this.props.wrapperClassName, key: "wrapper"}, 
        children
      )
    ) : children
  },
  renderLabel:function(children    )     {
    return this.props.label ? (
      React.createElement("label", {htmlFor: this.props.id, className: this.props.labelClassName, key: "label"}, 
        children, 
        this.props.label
      )
    ) : children
  },
  renderFieldWrapper:function(children    )     {
    var fieldClassName = this.props.groupClassName || this.props.fieldClassName
    var fieldClassSet = {
      'rff-field': true,
      'rff-field-with-errors': this.props.validation,
    }
    if (fieldClassName) fieldClassSet[fieldClassName] = true
    return React.createElement("div", {className: classSet(fieldClassSet), children: children})
  },
  render:function()     {
    return this.renderFieldWrapper([
      this.renderLabel(null),
      this.renderWrapper([
        this.renderInput(),
        this.renderHint(),
        this.renderErrorMessage(),
      ])
    ])
  }
})

module.exports = Field

},{"./react":11,"./util":12}],5:[function(require,module,exports){
/* @flow */
var React = require('./react')
var $__0=   require('./util'),omit=$__0.omit,extend=$__0.extend
var createElementFrom = require('./create-element-from')
var Form = require('./form') // avoid circular require

var API_PROPS = ['for', 'name', 'value', 'formDelegate']

var FormProxyMixin     = {
  statics: {
    isFormProxy: true,
  },
  isTopLevelForm:function()         {
    return Boolean(Form.getValueFromComponent(this))
  },
  renderFormChildren:function()     {
    return new Form(this, this.props.delegateForm).getChildren()
  },
  getFormProps:function()        {
    var formProps = omit(this.props, API_PROPS)
    formProps['children'] = this.renderFormChildren()
    return formProps
  },
}

module.exports = FormProxyMixin

},{"./create-element-from":1,"./form":7,"./react":11,"./util":12}],6:[function(require,module,exports){
/* @flow */
var React = require('./react')
var $__0=  React.addons,classSet=$__0.classSet
var FormProxyMixin = require('./form-proxy-mixin')
var createElementFrom = require('./create-element-from')

var FormProxy = React.createClass({displayName: 'FormProxy',
  mixins: [
    FormProxyMixin,
  ],
  render:function() {
    var formProps = this.getFormProps()
    if (this.isTopLevelForm()) {
      formProps.className = classSet(this.props.className, 'rff-form')
      return this.props.component ? createElementFrom(this.props.component, formProps) : React.DOM.form(formProps)
    } else {
      formProps.className = classSet(this.props.className, 'rff-fieldset')
      return this.props.component ? createElementFrom(this.props.component, formProps) : React.DOM.div(formProps)
    }
  },
})

module.exports = FormProxy

},{"./create-element-from":1,"./form-proxy-mixin":5,"./react":11}],7:[function(require,module,exports){
/* @flow */
var React = require('./react')
var $__0=  require('./react').addons,cloneWithProps=$__0.cloneWithProps
var $__1=   require('./util'),updateIn=$__1.updateIn,extend=$__1.extend
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


                
                      
                            
                     
                     
                 
                             
                
                                            
  function Form(component               , delegateForm)       {"use strict";
    this.component = component
    if (delegateForm instanceof Form) {
      // a nested form fieldset, delegates to the top level form
      this.acquireOptsFromDelegateForm(component, delegateForm)
    } else {
      // the top level form
      this.acquireOptsFromComponent(component)
    }
  }
  Form.prototype.getChildren=function() {"use strict";
    if (this.component.props.children) {
      // traverse component children and inject form prop
      return getChildrenWithForm(this.component, this)
    } else {
      throw NoChildrenError()
    }
  };
  Form.prototype.applyUpdate=function(value       , path)               {"use strict";
    if (this.delegateForm instanceof Form) {
      this.delegateForm.applyUpdate(value, path)
      return
    }

    if (this.onChange instanceof Function) {
      this.onChange(updateIn(this.value, path, value))
    }
  };
  Form.prototype.acquireOptsFromComponent=function(component)                {"use strict";
    var value = Form.getValueFromComponent(component)
    
    this.value = value || {}
    this.path = []
    this.onChange = component.props.onChange
    this.labels = component.props.labels
    this.externalValidation = component.props.externalValidation
    this.hints = component.props.hints

    this.fieldComponent = component.props.fieldComponent || Field
  };
  Form.prototype.acquireOptsFromDelegateForm=function(component               , delegateForm)      {"use strict";
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
  };
  Form.prototype.getValueFor=function(name)             {"use strict";
    return this.value[name]
  };
  Form.prototype.getLabelFor=function(name)             {"use strict";
    return this.labels instanceof Object ? this.labels[name] : null
  };
  Form.prototype.getExternalValidationFor=function(name)             {"use strict";
    return this.externalValidation instanceof Object ? this.externalValidation[name] : null
  };
  Form.prototype.getHintsFor=function(name)             {"use strict";
    return this.hints instanceof Object ? this.hints[name] : null
  };
  Form.getValueFromComponent=function(component)                        {"use strict";
    if (component.props.value instanceof Object) {
      return component.props.value
    } else if (component.props.for instanceof Object) {
      return component.props.for
    } else {
      return null
    }
  };
  Form.getNameFromComponent=function(component)                        {"use strict";
    if (typeof component.props.name == 'string') {
      return component.props.name  
    } else if (typeof component.props.for == 'string') {
      return component.props.for
    } else {
      return null
    }
  };


module.exports = Form

},{"./field":4,"./react":11,"./util":12}],8:[function(require,module,exports){
/* @flow */
var Form = require('./form-proxy')
var Field = require('./field-proxy')
// aliases
var Fields = require('./form-proxy')
var Fieldset = require('./form-proxy')

module.exports = {Form:Form, Field:Field, Fields:Fields, Fieldset:Fieldset}

},{"./field-proxy":3,"./form-proxy":6}],9:[function(require,module,exports){
/* @flow */
var ID_SUFFIX = new RegExp('(_ids|_id)$', 'g')
var UNDERBAR = new RegExp('_', 'g')

function capitalize(str       )        {
  str = str.toLowerCase()
  return str.substring(0, 1).toUpperCase() + str.substring(1)
}

function humanize(str       )        {
  str = str.toLowerCase()
  str = str.replace(ID_SUFFIX, '')
  str = str.replace(UNDERBAR, ' ')
  str = capitalize(str)
  return str
}

module.exports = {humanize:humanize, capitalize:capitalize}

},{}],10:[function(require,module,exports){
/* @flow */
var memoize = require('lodash.memoize/index')
var $__0=  require('./inflection'),humanize=$__0.humanize

// a memoized inflection of the field name
var labelForName = memoize(humanize)

module.exports = labelForName

},{"./inflection":9,"lodash.memoize/index":13}],11:[function(require,module,exports){
/* @flow */
if (typeof React == 'undefined') {
  module.exports = require('react/addons')
} else {
  if (!React.addons) {
    throw new Error('React addons build is required to use react-form-for')
  }
  module.exports = React
}

},{"react/addons":"react/addons"}],12:[function(require,module,exports){
/* @flow */
var extend = require('xtend/mutable')

var slice = Array.prototype.slice
var concat = Array.prototype.concat

// subset of underscore methods for our purposes
function clone(source       )        {
  return extend({}, source)
}

function merge(              )        {for (var sources=[],$__0=0,$__1=arguments.length;$__0<$__1;$__0++) sources.push(arguments[$__0]);
  return extend.apply(null, [{}].concat(sources))
}

function contains(haystack    , needle    )     {
  return haystack.indexOf(needle) > -1
}

function pick(obj                    )        {for (var rest=[],$__0=1,$__1=arguments.length;$__0<$__1;$__0++) rest.push(arguments[$__0]);
  var iteratee     = rest[0]
  var result = {}, key
  if (obj == null) return result
  if (iteratee instanceof Function) {
    for (key in obj) {
      var value = obj[key]
      if (iteratee(value, key, obj)) result[key] = value
    }
  } else {
    var keys = concat.apply([], rest)
    obj = new Object(obj)
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i]
      if (key in obj) result[key] = obj[key]
    }
  }
  return result
}

function omit(obj       )     {
  var keys = concat.apply([], slice.call(arguments, 1)).map(String)
  return pick(obj, function(value, key)  {return !contains(keys, key);})
}

var idCounter = 0
function uniqueId(prefix        )        {
  var id = ++idCounter + ''
  return typeof prefix == 'string' ? prefix + id : id
}

// update nested object structure via copying
function updateIn(object       , path              , value    )        {
  if (!path || !path.length) throw new Error('invalid path')

  var updated = extend({}, object)
  var $__0=  path,name=$__0[0]
  if (path.length === 1) {
    updated[name] = value
  } else {
    updated[name] = updateIn((updated[name] || {}), path.slice(1), value)
  }
  return updated
}

module.exports = {updateIn:updateIn, clone:clone, extend:extend, merge:merge, omit:omit, pick:pick, contains:contains, uniqueId:uniqueId}

},{"xtend/mutable":16}],13:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = require('lodash.isfunction'),
    keyPrefix = require('lodash._keyprefix');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided it will be used to determine the cache key for storing the result
 * based on the arguments provided to the memoized function. By default, the
 * first argument provided to the memoized function is used as the cache key.
 * The `func` is executed with the `this` binding of the memoized function.
 * The result cache is exposed as the `cache` property on the memoized function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] A function used to resolve the cache key.
 * @returns {Function} Returns the new memoizing function.
 * @example
 *
 * var fibonacci = _.memoize(function(n) {
 *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
 * });
 *
 * fibonacci(9)
 * // => 34
 *
 * var data = {
 *   'fred': { 'name': 'fred', 'age': 40 },
 *   'pebbles': { 'name': 'pebbles', 'age': 1 }
 * };
 *
 * // modifying the result cache
 * var get = _.memoize(function(name) { return data[name]; }, _.identity);
 * get('pebbles');
 * // => { 'name': 'pebbles', 'age': 1 }
 *
 * get.cache.pebbles.name = 'penelope';
 * get('pebbles');
 * // => { 'name': 'penelope', 'age': 1 }
 */
function memoize(func, resolver) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  var memoized = function() {
    var cache = memoized.cache,
        key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

    return hasOwnProperty.call(cache, key)
      ? cache[key]
      : (cache[key] = func.apply(this, arguments));
  }
  memoized.cache = {};
  return memoized;
}

module.exports = memoize;

},{"lodash._keyprefix":14,"lodash.isfunction":15}],14:[function(require,module,exports){
/**
 * Lo-Dash 2.4.2 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2014 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
var keyPrefix = '__1335248838000__';

module.exports = keyPrefix;

},{}],15:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a function.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 */
function isFunction(value) {
  return typeof value == 'function';
}

module.exports = isFunction;

},{}],16:[function(require,module,exports){
module.exports = extend

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[8])(8)
});