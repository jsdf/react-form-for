# react-form-for

A simple and easy-to-use form builder for React, in the style of Rails' `form_for`

![under construction](http://jamesfriend.com.au/files/under-construction.gif)

### example

```js
var React = require('react')
var DateInput = require('./date-input')

var Form = React.createClass({
  handleChange: function(updatedValue) {
    this.props.onChange(updatedValue)
  },
  render: function() {
    var {value, onChange} = this.props

    return FormFor(value, {onChange}, (f) =>
      <form>
        <f.Field for="name" />
        <f.Field for="birthday" component={DateInput} />
        <f.Field for="language" />
        {f.FieldsFor("address", (fa) =>
          <div>
            <fa.Field for="street" />
            <fa.Field for="town" />
            <fa.Field for="state" />
          </div>
        )}
      </form>
    )
  }
})
```
