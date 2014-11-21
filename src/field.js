/** @jsx React.DOM */
var React = require('react')
var {omit, extend} = require('./util')

// a subset of react-bootstrap/Input, without any bootstrapisms
// most importantly it accepts value and label props and an onChange callback
var Field = React.createClass({
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

  getInputDOMNode: function() {
    return this.refs.input.getDOMNode()
  },

  getValue: function() {
    if (this.props.type) return this.getInputDOMNode().value
    else throw Error('Cannot use getValue without specifying input type.')
  },

  getChecked: function() {
    return this.getInputDOMNode().checked
  },

  renderInput: function() {
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

  renderHint: function() {
    var hint = this.props.help || this.props.hint
    return hint ? (
      <span key="hint" className="field-hint">
        {hint}
      </span>
    ) : null
  },

  renderErrorMessage: function() {
    var errorMessage = this.props.validation
    return errorMessage ? (
      <span key="errorMessage" className="field-error-message">
        {errorMessage}
      </span>
    ) : null
  },

  renderWrapper: function(children) {
    return this.props.wrapperClassName ? (
      <div className={this.props.wrapperClassName} key="wrapper">
        {children}
      </div>
    ) : children
  },

  renderLabel: function(children) {
    return this.props.label ? (
      <label htmlFor={this.props.id} className={this.props.labelClassName} key="label">
        {children}
        {this.props.label}
      </label>
    ) : children
  },

  renderFieldWrapper: function(children) {
    var fieldClasses = [this.props.groupClassName || this.props.fieldClassName]
    if (this.props.validation) fieldClasses.push('field-with-errors')
    return <div className={fieldClasses.join(' ')} children={children} />
  },

  render: function() {
    return this.renderFieldWrapper([
      this.renderLabel(),
      this.renderWrapper([
        this.renderInput(),
        this.renderHint(),
        this.renderErrorMessage(),
      ])
    ])
  }
})

module.exports = Field
