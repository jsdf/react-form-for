!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.ReactFormFor=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* @flow */
var React = require("./react");
var cloneWithProps = React.addons.cloneWithProps;

var isElement = React.isValidElement || React.isValidComponent;

function createElementFrom(component, props) {
  if (isElement(component)) {
    return cloneWithProps(component, props);
  } else {
    return React.createElement(component, props);
  }
}

module.exports = createElementFrom;
},{"./react":13}],2:[function(require,module,exports){
"use strict";

/* @flow */
var React = require("./react");

var _require = require("./util");

var extend = _require.extend;
var omit = _require.omit;
var uniqueId = _require.uniqueId;

var labelForName = require("./label-for-name");

var FieldProxyMixin = {
  statics: {
    isFieldProxy: true },
  getDefaultProps: function getDefaultProps() {
    return {
      type: "text" };
  },
  getName: function getName() {
    return this.props["for"] || this.props.name;
  },
  getPathWithName: function getPathWithName() {
    var form = arguments[0] === undefined ? this.props.form : arguments[0];

    return form.path.concat(this.getName());
  },
  handleChange: function handleChange(e, form) {
    var updatedValue;
    var name = this.getName();
    if (e && typeof e == "object" && e.target) {
      if (e.stopPropagation) e.stopPropagation();
      updatedValue = e.target.value;
    } else {
      updatedValue = e;
    }

    form.applyUpdate(updatedValue, form.path.concat(name));
  },
  getFieldProps: function getFieldProps() {
    var _this = this;

    var form = arguments[0] === undefined ? this.props.form : arguments[0];

    var type = this.props.inputType || this.props.type;
    var name = this.getName();
    var label = this.props.label || form.getLabelFor(name) || labelForName(name);
    var value = form.getValueFor(name);
    var validation = form.getExternalValidationFor(name);
    var hint = form.getHintsFor(name);
    var id = "rff-field-input-" + uniqueId(null);
    var className = "field-" + this.getPathWithName(form).join("-");
    var onChange = function (e) {
      return _this.handleChange(e, form);
    };

    return extend(omit(this.props, "for"), { value: value, name: name, type: type, onChange: onChange, label: label, validation: validation, id: id, className: className });
  },
  getFieldComponent: function getFieldComponent() {
    return this.props.component || this.props.form.fieldComponent;
  } };

module.exports = FieldProxyMixin;
},{"./label-for-name":10,"./react":13,"./util":14}],3:[function(require,module,exports){
"use strict";

/* @flow */
var React = require("./react");
var createElementFrom = require("./create-element-from");
var FieldProxyMixin = require("./field-proxy-mixin");

var FieldProxy = React.createClass({
  displayName: "FieldProxy",

  mixins: [FieldProxyMixin],
  render: function render() {
    if (!this.props.form) throw new Error("no form for " + this.getName());
    return createElementFrom(this.getFieldComponent(), this.getFieldProps());
  }
});

module.exports = FieldProxy;
},{"./create-element-from":1,"./field-proxy-mixin":2,"./react":13}],4:[function(require,module,exports){
"use strict";

/* @flow */
var React = require("./react");

var _require = require("./util");

var omit = _require.omit;
var extend = _require.extend;

var classSet = require("classnames");

// a subset of react-bootstrap/Input, without any bootstrapisms
// most importantly it accepts value and label props and an onChange callback
var Field = React.createClass({
  displayName: "Field",

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
  getInputDOMNode: function getInputDOMNode() {
    return this.refs.input.getDOMNode();
  },
  getValue: function getValue() {
    if (typeof this.props.type == "string") {
      return this.getInputDOMNode().value;
    } else throw new Error("Cannot use getValue without specifying input type.");
  },
  getChecked: function getChecked() {
    return Boolean(this.getInputDOMNode().checked);
  },
  renderInput: function renderInput() {
    var input = null;

    if (!this.props.type) {
      return this.props.children;
    }

    var propsForInput = extend(omit(this.props, "form", "name"), { ref: "input", key: "input" });

    switch (this.props.type) {
      case "select":
        input = React.DOM.select(extend({ children: this.props.children }, propsForInput));
        break;
      case "textarea":
        input = React.DOM.textarea(propsForInput);
        break;
      case "submit":
        input = React.DOM.input(extend({ type: "submit" }, propsForInput));
        break;
      default:
        input = React.DOM.input(propsForInput);
    }

    return input;
  },
  renderHint: function renderHint() {
    var hint = this.props.help || this.props.hint;
    return hint ? React.createElement(
      "span",
      { key: "hint", className: "field-hint" },
      hint
    ) : null;
  },
  renderErrorMessage: function renderErrorMessage() {
    var errorMessage = this.props.validation;
    return errorMessage ? React.createElement(
      "span",
      { key: "errorMessage", className: "field-error-message" },
      errorMessage
    ) : null;
  },
  renderWrapper: function renderWrapper(children) {
    return this.props.wrapperClassName ? React.createElement(
      "div",
      { className: this.props.wrapperClassName, key: "wrapper" },
      children
    ) : children;
  },
  renderLabel: function renderLabel(children) {
    return this.props.label ? React.createElement(
      "label",
      { htmlFor: this.props.id, className: this.props.labelClassName, key: "label" },
      children,
      this.props.label
    ) : children;
  },
  renderFieldWrapper: function renderFieldWrapper(children) {
    var fieldClassName = this.props.groupClassName || this.props.fieldClassName;
    var fieldClassSet = {
      "rff-field": true,
      "rff-field-with-errors": this.props.validation };
    if (fieldClassName) fieldClassSet[fieldClassName] = true;
    return React.createElement("div", { className: classSet(fieldClassSet), children: children });
  },
  render: function render() {
    return this.renderFieldWrapper([this.renderLabel(null), this.renderWrapper([this.renderInput(), this.renderHint(), this.renderErrorMessage()])]);
  }
});

module.exports = Field;
},{"./react":13,"./util":14,"classnames":15}],5:[function(require,module,exports){
"use strict";

/* @flow */
var React = require("./react");

var _require = require("./util");

var omit = _require.omit;
var extend = _require.extend;

var createElementFrom = require("./create-element-from");
var Form = require("./form"); // avoid circular require

var API_PROPS = ["for", "name", "value", "formDelegate"];

var FormProxyMixin = {
  statics: {
    isFormProxy: true },
  isTopLevelForm: function isTopLevelForm() {
    // if this form proxy has been provided with a 'value' prop, it could become
    // the root of a new form structure. not yet supported.
    return Boolean(Form.getValueFromComponent(this));
  },
  renderFormChildren: function renderFormChildren() {
    var form = arguments[0] === undefined ? this.getForm() : arguments[0];

    return form.getChildren();
  },
  getForm: function getForm() {
    return new Form(this, this.props.parentForm);
  },
  getFormProps: function getFormProps() {
    var form = arguments[0] === undefined ? this.getForm() : arguments[0];

    var formProps = omit(this.props, API_PROPS);
    return formProps;
  } };

module.exports = FormProxyMixin;
},{"./create-element-from":1,"./form":7,"./react":13,"./util":14}],6:[function(require,module,exports){
"use strict";

/* @flow */
var React = require("./react");
var classSet = require("classnames");
var FormProxyMixin = require("./form-proxy-mixin");
var createElementFrom = require("./create-element-from");

var FormProxy = React.createClass({
  displayName: "FormProxy",

  mixins: [FormProxyMixin],
  render: function render() {
    var form = this.getForm();
    var formProps = this.getFormProps(form);
    formProps.children = this.renderFormChildren(form);

    if (this.isTopLevelForm()) {
      formProps.className = classSet(this.props.className, "rff-form");
      return this.props.component ? createElementFrom(this.props.component, formProps) : React.DOM.form(formProps);
    } else {
      formProps.className = classSet(this.props.className, "rff-fieldset");
      return this.props.component ? createElementFrom(this.props.component, formProps) : React.DOM.div(formProps);
    }
  } });

module.exports = FormProxy;
},{"./create-element-from":1,"./form-proxy-mixin":5,"./react":13,"classnames":15}],7:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/* @flow */
var React = require("./react");

var cloneWithProps = require("./react").addons.cloneWithProps;

var StandardError = require("standard-error");

var _require = require("./util");

var updateIn = _require.updateIn;
var extend = _require.extend;

var Field = require("./field");
var isElement = React.isValidElement || React.isValidComponent;

function hasChildren(node) {
  return node && node.props && node.props.children;
}

function getType(node) {
  return node && node.type || node.constructor;
}

function isFieldProxy(node) {
  var type = getType(node);
  return type && type.isFieldProxy;
}

function isFormProxy(node) {
  var type = getType(node);
  return type && type.isFormProxy;
}

var NoChildrenError = (function (StandardError) {
  function NoChildrenError() {
    _classCallCheck(this, NoChildrenError);

    _get(Object.getPrototypeOf(NoChildrenError.prototype), "constructor", this).call(this, "form/fieldset without children not valid");
  }

  _inherits(NoChildrenError, StandardError);

  return NoChildrenError;
})(StandardError);

// recursive map over children and inject form prop
function getChildrenWithForm(node, form) {
  return React.Children.map(node.props.children, function (child) {
    if (!isElement(child) || typeof child == "string" || typeof child.props == "string" || child.props && typeof child.props.children == "string") {
      return child;
    }

    var updatedProps = {};

    if (isFormProxy(child)) {
      if (!hasChildren(child)) throw new NoChildrenError();
      // stop recursion, just inject form parentForm
      updatedProps.parentForm = form;
    } else {
      if (isFieldProxy(child)) {
        updatedProps.form = form;
      }
      // recurse to update grandchildren
      updatedProps.children = getChildrenWithForm(child, form);
    }

    return cloneWithProps(child, updatedProps);
  });
}

var Form = (function () {
  function Form(component, parentForm) {
    _classCallCheck(this, Form);

    this.component = component;
    if (parentForm instanceof Form) {
      // a nested form fieldset, delegates to the top level form
      this.acquireOptsFromParentForm(component, parentForm);
    } else {
      // the top level form
      this.acquireOptsFromComponent(component);
    }
  }

  _prototypeProperties(Form, {
    getValueFromComponent: {
      value: function getValueFromComponent(component) {
        if (component.props.value instanceof Object) {
          return component.props.value;
        } else if (component.props["for"] instanceof Object) {
          return component.props["for"];
        } else {
          return null;
        }
      },
      writable: true,
      configurable: true
    },
    getNameFromComponent: {
      value: function getNameFromComponent(component) {
        if (typeof component.props.name == "string" || typeof component.props.name == "number") {
          return component.props.name;
        } else if (typeof component.props["for"] == "string") {
          return component.props["for"];
        } else {
          return null;
        }
      },
      writable: true,
      configurable: true
    }
  }, {
    getChildren: {
      value: function getChildren() {
        if (this.component.props.children) {
          // traverse component children and inject form prop
          return getChildrenWithForm(this.component, this);
        } else {
          throw new NoChildrenError();
        }
      },
      writable: true,
      configurable: true
    },
    applyUpdate: {
      value: function applyUpdate(value, path) {
        if (this.parentForm instanceof Form) {
          this.parentForm.applyUpdate(value, path);
          return;
        }

        if (this.onChange instanceof Function) {
          this.onChange(updateIn(this.value, path, value));
        }
      },
      writable: true,
      configurable: true
    },
    acquireOptsFromComponent: {
      value: function acquireOptsFromComponent(component) {
        var value = Form.getValueFromComponent(component);

        this.value = value || {};
        this.path = [];
        this.onChange = component.props.onChange;
        this.labels = component.props.labels;
        this.externalValidation = component.props.externalValidation;
        this.hints = component.props.hints;

        this.fieldComponent = component.props.fieldComponent || Field;
      },
      writable: true,
      configurable: true
    },
    acquireOptsFromParentForm: {
      value: function acquireOptsFromParentForm(component, parentForm) {
        var name = Form.getNameFromComponent(component);
        if (parentForm instanceof Form && name == null) throw new Error("name required when parentForm provided");
        if (!(parentForm instanceof Form)) throw new Error("invalid parentForm");
        this.parentForm = parentForm;
        this.path = parentForm.path.concat(name);

        this.value = parentForm.getValueFor(name) || {};
        this.labels = parentForm.getLabelFor(name);
        this.externalValidation = parentForm.getExternalValidationFor(name);
        this.hints = parentForm.getHintsFor(name);

        this.fieldComponent = component.props.fieldComponent || parentForm.fieldComponent || Field;
      },
      writable: true,
      configurable: true
    },
    getValueFor: {
      value: function getValueFor(name) {
        return this.value[name];
      },
      writable: true,
      configurable: true
    },
    getLabelFor: {
      value: function getLabelFor(name) {
        return this.labels instanceof Object ? this.labels[name] : null;
      },
      writable: true,
      configurable: true
    },
    getExternalValidationFor: {
      value: function getExternalValidationFor(name) {
        return this.externalValidation instanceof Object ? this.externalValidation[name] : null;
      },
      writable: true,
      configurable: true
    },
    getHintsFor: {
      value: function getHintsFor(name) {
        return this.hints instanceof Object ? this.hints[name] : null;
      },
      writable: true,
      configurable: true
    }
  });

  return Form;
})();

module.exports = Form;
},{"./field":4,"./react":13,"./util":14,"standard-error":19}],8:[function(require,module,exports){
"use strict";

/* @flow */
var Form = require("./form-proxy");
var Field = require("./field-proxy");
var List = require("./list-proxy");
var ListEditor = require("./list-editor");
// aliases
var Fields = require("./form-proxy");
var Fieldset = require("./form-proxy");

module.exports = { Form: Form, Field: Field, Fields: Fields, Fieldset: Fieldset, List: List, Components: { ListEditor: ListEditor } };
},{"./field-proxy":3,"./form-proxy":6,"./list-editor":11,"./list-proxy":12}],9:[function(require,module,exports){
"use strict";

/* @flow */
var ID_SUFFIX = new RegExp("(_ids|_id)$", "g");
var UNDERBAR = new RegExp("_", "g");

function capitalize(str) {
  str = str.toLowerCase();
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function humanize(str) {
  str = str.toLowerCase();
  str = str.replace(ID_SUFFIX, "");
  str = str.replace(UNDERBAR, " ");
  str = capitalize(str);
  return str;
}

module.exports = { humanize: humanize, capitalize: capitalize };
},{}],10:[function(require,module,exports){
"use strict";

/* @flow */
var memoize = require("lodash.memoize/index");

var _require = require("./inflection");

var humanize = _require.humanize;

// a memoized inflection of the field name
var labelForName = memoize(humanize);

module.exports = labelForName;
},{"./inflection":9,"lodash.memoize/index":16}],11:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* @flow */
var React = require("./react");

var _require = require("./util");

var omit = _require.omit;
var cloneWithProps = React.addons.cloneWithProps;

var classSet = require("classnames");

var ListEditor = React.createClass({
  displayName: "ListEditor",

  handleChange: function handleChange(update) {
    this.props.onChange(update);
  },
  handleAddItem: function handleAddItem() {
    var value = this.props.value;

    this.handleChange(value.concat(null));
  },
  handleRemoveItem: function handleRemoveItem(index) {
    var value = this.props.value;

    if (index === 0 && value.length === 1) {
      // replace with single null item
      this.handleChange([null]);
    } else {
      // remove item by index
      this.handleChange(value.filter(function (v, i) {
        return index !== i;
      }));
    }
  },
  renderItemWrapper: function renderItemWrapper(item) {
    var _this = this;

    return React.createElement(
      "div",
      { key: item.props.name, className: "rff-array-editor-item" },
      item,
      React.createElement(
        "button",
        {
          onClick: function () {
            return _this.handleRemoveItem(item.props.name);
          },
          tabIndex: "-1",
          type: "button",
          className: "rff-array-editor-item-remove" },
        "× ",
        this.props.removeItemLabel
      )
    );
  },
  render: function render() {
    var _this = this;

    var items = React.Children.map(this.props.children, function (item) {
      return _this.renderItemWrapper(item);
    });
    var inherited = omit(this.props, "for", "name", "label", "value", "type", "id");
    return React.createElement(
      "div",
      _extends({}, inherited, { className: classSet(this.props.className, "rff-array-editor") }),
      React.createElement(
        "div",
        { className: "rff-array-editor-items" },
        items
      ),
      React.createElement(
        "button",
        {
          onClick: function () {
            return _this.handleAddItem();
          },
          type: "button",
          className: "rff-array-editor-item-add"
        },
        "+ ",
        this.props.addItemLabel
      )
    );
  }
});

module.exports = ListEditor;
},{"./react":13,"./util":14,"classnames":15}],12:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* @flow */
var React = require("./react");
var cloneWithProps = React.addons.cloneWithProps;

var classSet = require("classnames");
var FormProxyMixin = require("./form-proxy-mixin");
var FieldProxyMixin = require("./field-proxy-mixin");
var FormProxy = require("./form-proxy");
var createElementFrom = require("./create-element-from");

var _require = require("./util");

var omit = _require.omit;
var extend = _require.extend;

var ListProxy = React.createClass({
  displayName: "ListProxy",

  mixins: [FormProxyMixin, FieldProxyMixin],
  statics: {
    isListProxy: true },
  renderListChildren: function renderListChildren() {
    var _this = this;

    var form = arguments[0] === undefined ? this.getForm() : arguments[0];

    var form = this.getForm();
    // note that is effectively creating a fieldset for each item in the array
    // and using that item in the array as the value for the fieldset, with the
    // child FormProxy elements passed into the ListProxy as the fields
    return form.value.map(function (item, index) {
      // note: children are passed to new FormProxy
      // this is important as a ListProxy is basically a FormProxy, but repeated
      // TODO: investigate whether child elements should be cloned
      var inherited = omit(_this.props, "for", "name", "component");
      return React.createElement(FormProxy, _extends({}, inherited, { name: index, key: index, parentForm: form }));
    });
  },
  render: function render() {
    var form = this.getForm();
    var formProps = extend(this.getFieldProps(form.parentForm), this.getFormProps(form));
    formProps.className = classSet(this.props.className, "rff-list");
    formProps.children = this.renderListChildren();
    return this.props.component ? createElementFrom(this.props.component, formProps) : React.DOM.div(formProps);
  } });

module.exports = ListProxy;
},{"./create-element-from":1,"./field-proxy-mixin":2,"./form-proxy":6,"./form-proxy-mixin":5,"./react":13,"./util":14,"classnames":15}],13:[function(require,module,exports){
"use strict";

/* @flow */
if (typeof React == "undefined") {
  module.exports = require("react/addons");
} else {
  if (!React.addons) {
    throw new Error("React addons build is required to use react-form-for");
  }
  module.exports = React;
}
},{"react/addons":"react/addons"}],14:[function(require,module,exports){
"use strict";

/* @flow */
var extend = require("xtend/mutable");

var slice = Array.prototype.slice;
var concat = Array.prototype.concat;
var toString = Object.prototype.toString;

// subset of underscore methods for our purposes
function clone(source) {
  return extend({}, source);
}

function merge() {
  for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  return extend.apply(null, [{}].concat(sources));
}

function contains(haystack, needle) {
  return haystack.indexOf(needle) > -1;
}

function pick(obj) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  var iteratee = rest[0];
  var result = {},
      key;
  if (obj == null) {
    return result;
  }if (iteratee instanceof Function) {
    for (key in obj) {
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
  } else {
    var keys = concat.apply([], rest);
    obj = new Object(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (key in obj) result[key] = obj[key];
    }
  }
  return result;
}

function omit(obj) {
  var keys = concat.apply([], slice.call(arguments, 1)).map(String);
  return pick(obj, function (value, key) {
    return !contains(keys, key);
  });
}

var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter + "";
  return typeof prefix == "string" ? prefix + id : id;
}

function isArray(arr) {
  return toString.call(arr) == "[object Array]";
}

function arrayCopy(arr) {
  return slice.call(arr);
}

// update nested object structure via copying
function updateIn(object, path, value) {
  if (!path || !path.length) throw new Error("invalid path");

  var updated;
  if (isArray(object)) {
    updated = arrayCopy(object);
  } else {
    updated = extend({}, object);
  }
  var name = path[0];

  if (path.length === 1) {
    updated[name] = value;
  } else {
    updated[name] = updateIn(updated[name] || {}, path.slice(1), value);
  }
  return updated;
}

module.exports = { updateIn: updateIn, clone: clone, extend: extend, merge: merge, omit: omit, pick: pick, contains: contains, uniqueId: uniqueId, isArray: isArray, arrayCopy: arrayCopy };
},{"xtend/mutable":20}],15:[function(require,module,exports){
function classNames() {
	var args = arguments;
	var classes = [];

	for (var i = 0; i < args.length; i++) {
		var arg = args[i];
		if (!arg) {
			continue;
		}

		if ('string' === typeof arg || 'number' === typeof arg) {
			classes.push(arg);
		} else if ('object' === typeof arg) {
			for (var key in arg) {
				if (!arg.hasOwnProperty(key) || !arg[key]) {
					continue;
				}
				classes.push(key);
			}
		}
	}
	return classes.join(' ');
}

// safely export classNames in case the script is included directly on a page
if (typeof module !== 'undefined' && module.exports) {
	module.exports = classNames;
}

},{}],16:[function(require,module,exports){
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

},{"lodash._keyprefix":17,"lodash.isfunction":18}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
var has = Object.hasOwnProperty
var proto = Object.getPrototypeOf
var trace = Error.captureStackTrace
module.exports = StandardError

function StandardError(msg, props) {
  // Let all properties be enumerable for easier serialization.
  if (msg && typeof msg == "object") props = msg, msg = undefined
  else this.message = msg

  // Name has to be an own property (or on the prototype a single step up) for
  // the stack to be printed with the correct name.
  if (props) for (var key in props) this[key] = props[key]
  if (!has.call(this, "name"))
    this.name = has.call(proto(this), "name")? this.name : this.constructor.name

  if (trace && !("stack" in this)) trace(this, this.constructor)
}

StandardError.prototype = Object.create(Error.prototype, {
  constructor: {value: StandardError, configurable: true, writable: true}
})

// Set name explicitly for when the code gets minified.
StandardError.prototype.name = "StandardError"

},{}],20:[function(require,module,exports){
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