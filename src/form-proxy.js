var React = require('react')
var Form = require('./form')

var FormProxy = React.createClass({
  childrenWithForm: function() {

    return Form(this.props)
  },
  render: function() {
    if (this.props.form) {
      return <div>{this.childrenWithForm()}</div>
    } else {
      return <form>{this.childrenWithForm()}</form>
    }
  },
})

module.exports = FormProxy
