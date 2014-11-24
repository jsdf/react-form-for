/** @jsx React.DOM */
var React = require('react')
var FormFor = require('../')
var {Form, Fields, Field} = require('../')

var TeamForm = React.createClass({
  getInitialState: function() {
    return {
      value: {
        name: "Awesome Team",
        members: [
          {
            name: "Jean",
            age: 21,
            interests: ['yachting', 'hunting', 'exploring'],
          },
          {
            name: "Billie",
            age: 21,
            interests: ['riding', 'calligraphy', 'sculpture'],
          },
          {
            name: "Alex",
            age: 22,
            interests: ['writing', 'viticulture', 'typeography'],
          },
          {
            name: "Jo",
            age: 24,
            interests: ['combinators', 'set theory', 'monads'],
          },
        ]
      },
    }
  },
  handleChange: function(updatedValue) {
    this.setState({value: updatedValue})
  },
  render: function() {
    var {value} = this.state
    var onChange = this.handleChange

    return (
      <Form for={value} onChange={this.handleChange}>
        <h2>A Team Called <Value for="name" fn={(v) => <span>{v}</span>} /></h2>

        <Each for="members">
          <Field for="name" />
          <NumberField for="age" />
          <div>
            <Label for="interests">
            <Value for="interests" fn={(v, context) => <span>{context.hint}</span>}>
            <ul>
              <EachValue for="interests" fn={(v) => <li>{v}</li>} />
              <Each for="interests">
                <li><Value /></li>
              </Each>
            </ul>
          </div>
        </Each>
      </Form>
    )
  }
})

React.render(<PersonForm />, document.body)
