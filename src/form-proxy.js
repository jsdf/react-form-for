/** @jsx React.DOM */
var React = require('react')
var {isString, omit, extend} = require('./util')

var API_PROPS = ['for','name','value','formDelegate']

var FormProxy = React.createClass({
  isRoot: function() {
    var Form = require('./form')
    return Boolean(Form.getValue(this))
  },
  renderFormChildren: function() {
    var Form = require('./form')
    return new Form(this, this.props.delegateForm).getChildren()
  },
  render: function() {
    var formProps = extend(omit(this.props, API_PROPS), {
      children: this.renderFormChildren(),
    })
    if (this.isRoot()) {
      return React.createElement('form', formProps)
    } else {
      return React.createElement('div', formProps)
    }
  },
})

module.exports = FormProxy
