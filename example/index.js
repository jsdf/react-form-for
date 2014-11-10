var React = require('react')
var FormFor = require('../')

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
  handleChange: function (value) {
    console.log('change', value)
    this.setState({thing: value})
  },
  render: function() {
    var thing = this.state.thing
    return FormFor(thing, {onChange: this.handleChange}, function(f) {
      return React.DOM.form(null,
        f.Field({for: 'some_field'}),
        f.Field({for: 'also_a_field'}),
        f.FieldsFor('a_subform', function(fc) {
          return React.DOM.div(null,
            fc.Field({for: 'subField1'}),
            fc.Field({for: 'subField2'})
          )
        })
      )
    })
  }
})

React.renderComponent(React.createElement(Form), document.body)
