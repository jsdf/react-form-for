// any component which takes a `value` prop (and ideally a `label` prop)
// and an `onChange` callback prop, can be used as a react-form-for field
Input = require('react-bootstrap/Input')

var Form = React.createClass({
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
    return FormFor(this.state.value, formOpts, (f) =>
      // all of these fields will be rendered as a react-bootstrap/Input
      <form className="form-horizontal">
        <Field for="name" />
        <Field for="active" component={getCheckboxComponent()} />
        {f.FieldsFor('financial', () =>
          <div>
            <Field for="account_balance" addonBefore="$" />
          </div>
        )}
      </form>
    )
  }
})
