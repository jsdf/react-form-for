var Form = React.createClass({
  handleChange: function(updatedValue) {
    this.setState({value: updatedValue})
  },
  render: function() {
    return FormFor(this.state.value, {onChange: this.handleChange}, (f) =>
      <form>
        <Field for="name" />
        <Field for="from_date" />
        <Field for="to_date" />
        {f.FieldsFor('related', (f2) =>
          <div>
            <Field for="something" />
          </div>
        )}
      </form>
    )
  }
})
