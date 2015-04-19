var React = require('react')
var FormFor = require('../')
var {Form, Fields, Field} = require('../')
var languages = [
  'English',
  'Spanish',
  'German',
  'Italian',
  'Japanese',
]

var PersonForm = React.createClass({
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

    return (
      <Form for={value} onChange={this.handleChange}>
        <h2>A Beautiful Form</h2>
        <Field for="name" autofocus />
        <Field for="birthday" component={DateField} help="Choose a date" />
        <Field for="language" type="select">
          {this.renderLanguageSelectOptions()}
        </Field>
        <div className="panel collapsible">
          <Fields for="address">
            <Field for="street" />
            <Field for="town" />
            <Field for="state" />
          </Fields>
        </div>
      </Form>
    )
  }
})

React.render(<PersonForm />, document.body)
