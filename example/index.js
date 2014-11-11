var React = require('react')
var FormFor = require('../')
var Field = FormFor.Field

Form = React.createClass({
  getInitialState: function() {
    return {
      thing: {
        some_field: 'something',
        also_a_field: 33,
        a_subform: {
          subField1: 'datum',
          subField2: 128,
        }
      }
    }
  },
  handleChange: function (updatedThing) {
    console.log('change', updatedThing)
    this.setState({thing: updatedThing})
  },
  render: function() {
    var thing = this.state.thing
    return FormFor(thing, {onChange: this.handleChange}, function(form) {
      return React.DOM.form(null,
        React.createElement(Field, {for: 'some_field'}),
        React.createElement(Field, {for: 'also_a_field'}),
        form.fieldsFor('a_subform', function(subform) {
          return React.DOM.div(null,
            React.createElement(Field, {for: 'subField1'}),
            React.createElement(Field, {for: 'subField2'})
          )
        })
      )
    })
  }
})

React.render(React.createElement(Form), document.body)
