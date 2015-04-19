{Form, Fields, Field} = require 'react-form-for'
ExampleForm = React.createClass
  handleChange: (updatedValue) -> @setState value: updatedValue
  render: ->
    <Form for={@state.value} onChange={@handleChange}>
      <Field for="name" />
      <Field for="from_date" />
      <Field for="to_date" />
      <Fields for="related">
        <Field for="something" />
      </Fields>
    </Form>

module.exports = ExampleForm
