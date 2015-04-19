/* @flow */
var React = require('../util/React')
var {omit} = require('../util/util')
var classSet = require('classnames')

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
  getInputDOMNode():any {
    return this.refs.input.getDOMNode()
  },
  getValue():string {
    if (typeof this.props.type == 'string') return this.getInputDOMNode().value
    else throw new Error('Cannot use getValue without specifying input type.')
  },
  getChecked():boolean {
    return Boolean(this.getInputDOMNode().checked)
  },
  renderInput():any {
    var input = null

    if (!this.props.type) {
      return this.props.children
    }

    var propsForInput = Object.assign(omit(this.props, 'form', 'name'), {ref: "input", key: "input"}) 

    switch (this.props.type) {
      case 'select':
        input = React.DOM.select(Object.assign({children: this.props.children}, propsForInput))
        break
      case 'textarea':
        input = React.DOM.textarea(propsForInput)
        break
      case 'submit':
        input = React.DOM.input(Object.assign({type: "submit"}, propsForInput))
        break
      default:
        input = React.DOM.input(propsForInput)
    }

    return input
  },
  renderHint():any {
    var hint = this.props.help || this.props.hint
    return hint ? (
      <span key="hint" className="field-hint">
        {hint}
      </span>
    ) : null
  },
  renderErrorMessage():any {
    var errorMessage = this.props.validation
    return errorMessage ? (
      <span key="errorMessage" className="field-error-message">
        {errorMessage}
      </span>
    ) : null
  },
  renderWrapper(children:any):any {
    return this.props.wrapperClassName ? (
      <div className={this.props.wrapperClassName} key="wrapper">
        {children}
      </div>
    ) : children
  },
  renderLabel(children:any):any {
    return this.props.label ? (
      <label htmlFor={this.props.id} className={this.props.labelClassName} key="label">
        {children}
        {this.props.label}
      </label>
    ) : children
  },
  renderFieldWrapper(children:any):any {
    var fieldClassName = this.props.groupClassName || this.props.fieldClassName
    var fieldClassSet:{[key:string]:string|boolean} = {
      'rff-field': true,
      'rff-field-with-errors': this.props.validation,
    }
    if (fieldClassName) fieldClassSet[fieldClassName] = true
    return <div className={classSet(fieldClassSet)} children={children} />
  },
  render():any {
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
