# react-form-for

A simple and easy-to-use form builder for React, in the style of Rails' `form_for`

### example

```js
var React = require('react')
var FormFor = require('react-form-for')
var {Field} = FormFor

var DateField = require('./date-field')
var languages = require('./languages')

var Form = React.createClass({
  getInitialState: function() {
    return {value: {}}
  },
  handleChange: function(updatedValue) {
    this.setState({value: updatedValue})
  },
  renderLanguageSelectOptions: function() {
    return languages.map((name) =>
      <option key={name} value={name}>{name}</option>
    )
  },
  render: function() {
    var {value} = this.state
    var onChange = this.handleChange

    return FormFor(value, {onChange}, (f) =>
      <form>
        <Field for="name" />
        <Field for="birthday" component={DateField} help="Choose a date" />
        <Field for="language" type="select">
          {this.renderLanguageSelectOptions()}
        </Field>
        {f.fieldsFor("address", () =>
          <div>
            <Field for="street" />
            <Field for="town" />
            <Field for="state" />
          </div>
        )}
      </form>
    )
  }
})

React.render(<Form />, document.body)
```

#### Custom field components
A possible implementation of the `DateField` from the example above:
```js
var React = require('react')

var DateField = React.createClass({
  render: function() {
    return (
      <div>
        <label>
          {this.props.label}
          <input
            type="date"
            value={this.props.value}
            onChange={this.props.onChange}
          />
        </label>
        <span>{this.props.help}</span>
      </div>
    )
  }
})

module.exports = DateField
```
Note the use of the important props `value`, `onChange` and `label` which are
provided by the form builder. Other props such as `help` are passed through from
the `<Field />` proxy components used above.

#### Overriding the default field component
```js
// as long as a component takes a `value` prop (and ideally a `label` prop)
// and an `onChange` callback prop, it can be used as a react-form-for field
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
```

##### Warning
:warning: This module is pretty new and might have some bugs, please [file an issue](https://github.com/jsdf/react-form-for/issues)
if you encounter any problems.
