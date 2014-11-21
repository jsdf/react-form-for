/** @jsx React.DOM */
var {Form, Fields, Field} = require('react-form-for')
// any component which takes a `value` prop (and ideally a `label` prop)
// and an `onChange` callback prop, can be used as a react-form-for field
var Input = require('react-bootstrap/Input')

var ExampleForm = React.createClass({
  handleChange: function(updatedValue) {
    this.setState({value: updatedValue})
  },
  // the checkbox Field gets an Input component with different layout classes
  getCheckboxComponent: function() {
    return (
      <Input type="checkbox" wrapperClassName="col-xs-offset-2 col-xs-10"/>
    )
  },
  render: function() {
    var formOpts = {
      onChange: this.handleChange,
      fieldComponent: (
        <Input labelClassName="col-xs-2" wrapperClassName="col-xs-10" />
      )
    }
    // all of these fields will be rendered as a react-bootstrap/Input
    return (
      <Form for={this.state.value} {...formOpts} className="form-horizontal">
        <Field for="name" />
        <Field for="active" component={this.getCheckboxComponent()} />
        <Fields for="financial_stuff">
          <Field for="account_balance" addonBefore="$" />
        </Fields>
      </Form>
    )
  }
})

module.exports = ExampleForm
