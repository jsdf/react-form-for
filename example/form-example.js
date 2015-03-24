/** @jsx React.DOM */
var React = require('react')
var {Form, Fields, Field, List} = require('../lib/ReactFormFor')
var {ListEditor} = require('../lib/ReactFormFor').Components
var ExampleForm = React.createClass({
  getInitialState: function(){
    return { value: {
        name: "James",
        from_date: "2012-1-1",
        to_date: "2012-21-31",
        related: {
          something: 1,
          something_else: 3,
        },
        members: [
          {
            name: "Jean",
          },
          {
            name: "Billie",
          },
        ],
      }
    }
  },
  handleChange: function(updatedValue) {
    this.setState({value: updatedValue})
  },
  render: function() {
    return (
      <Form for={this.state.value} onChange={this.handleChange}>
        <Field for="name" />
        <Field for="from_date" />
        <Field for="to_date" />
        <div className="wrapper-container">
          <Fields for="related" className="related-stuff">
            <Field for="something" label="SomeThing" />
            <Field for="something_else" />
          </Fields>
        </div>
        <List for="members" component={<ListEditor />}>
          <Field for="name" />
        </List>
      </Form>
    )
  }
})

module.exports = ExampleForm
