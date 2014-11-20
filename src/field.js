var React = require('react')
var {omit} = require('./util')

// a subset of react-bootstrap/Input, without any bootstrapisms
// most importantly it accepts value and label props and an onChange callback
var Field = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    label: React.PropTypes.any,
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

    var propsForInput = omit(this.props, 'form', 'name')

    switch (this.props.type) {
      case 'select':
        input = <select ref="input" key="input" children={this.props.children} {...propsForInput} />
        break
      case 'textarea':
        input = <textarea ref="input" key="input" {...propsForInput} />
        break
      case 'submit':
        input = <input type="submit" ref="input" key="input" {...propsForInput} />
        break
      default:
        input = <input ref="input" key="input" {...propsForInput} />
    }

    return input
  },

  renderHelp: function() {
    var help = this.props.help || this.props.hint
    return help ? (
      <span key="help">
        {help}
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
    var fieldClassName = this.props.groupClassName || this.props.fieldClassName
    return <div className={fieldClassName} children={children} />
  },

  render: function() {
    return this.renderFieldWrapper([
      this.renderLabel(),
      this.renderWrapper([
        this.renderInput(),
        this.renderHelp(),
      ])
    ])
  }
})

module.exports = Field
