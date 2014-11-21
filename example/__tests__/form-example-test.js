/** @jsx React.DOM */
jest.autoMockOff()
var $ = require('jquery')

describe('form-example', function() {
  it('renders the form', function() {
    var React = require('react/addons')
    var {TestUtils} = React.addons
    var ExampleForm = require('../form-example.js')

    var formComponent = TestUtils.renderIntoDocument(<ExampleForm />)
    var form = formComponent.getDOMNode()

    assertHasLabelAndInputWithValue(form, 'Name', 'James')
    assertHasLabelAndInputWithValue(form, 'From date', '2012-1-1')
    assertHasLabelAndInputWithValue(form, 'SomeThing', '1')

    var inputToUpdate = inputForLabel(form, 'Something else')

    TestUtils.Simulate.change(inputToUpdate, {target: {value: '2'}})

    expect(formComponent.state.value['related']['something_else']).toEqual('2')

    var updatedInput = inputForLabel(form, 'Something else')
    expect(updatedInput.value).toEqual('2')
  })
})

function assertHasLabelAndInputWithValue(tree, label, value) {
  var input = inputForLabel(tree, label)
  expect(input.value).toEqual(value)
}

function inputForLabel(tree, label) {
  var $label = $(tree).find(`label:contains("${label}")`)
  expect($label.get(0)).not.toBeNull()
  var labelFor = $label.attr('for')
  var $input = $(tree).find('#'+jQuerySelectorEscape(labelFor))
  expect($input.get(0)).not.toBeNull()
  return $input.get(0)
}

// Escapes special characters and returns a valid jQuery selector
function jQuerySelectorEscape(str) {
  return str.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1')
}
