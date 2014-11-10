var Form = React.createClass({
  handleChange: function(updatedValue) {
    this.setState({value: updatedValue})
  },
  render: function() {
    return FormFor(this.state.value, {onChange: this.handleChange}, (f) =>
      <form>
        <f.Field for="name" />
        <f.Field for="from_date" />
        <f.Field for="to_date" />
        {f.FieldsFor('related', (fr) =>
          <div>
            <fr.Field for="something" />
          </div>
        )}
      </form>
    )
  }
})
