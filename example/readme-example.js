var React = require('react')
var FormFor = require('../')
var {Field} = require('../')
var languages = [
  'English',
  'Spanish',
  'German',
  'Italian',
  'Japanese',
]

var Form = React.createClass({
  getInitialState: function() {
    return {value: {}}
  },
  handleChange: function(updatedValue) {
    this.setState({value: updatedValue})
  },
  renderLanguageSelectOptions: function() {
    return languages.map((name) => <option key={name} value={name}>{name}</option>)
  },
  render: function() {
    var {value} = this.state
    var onChange = this.handleChange

    return FormFor(value, {onChange}, (f) =>
      <form style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
        <Field for="name" />
        <Field for="birthday" type="date" />
        <Field for="language" type="select">
          {this.renderLanguageSelectOptions()}
        </Field>
        {f.fieldsFor("address", () =>
          <div style={{border: 'solid 1px black', 'padding': 10}}>
            <Field for="street" />
            <Field for="town" />
            <Field for="state" />
          </div>
        )}
        <textarea
          readOnly
          value={JSON.stringify(this.state.value, null, 2)}
          style={{width: '100vw', flex: 1}}
        />
      </form>
    )
  }
})

React.render(<Form />, document.body)
