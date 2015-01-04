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
        <h2>A Team Called <Value for="name" /></h2>

        <List for="members">
          <Field for="name" />
          <Field for="age" type="number" hint="Age ain't nothin but a number" />
          <List for="interests" />
        </List>
      </Form>
    )
  }
})

React.render(<TeamForm />, document.body)
