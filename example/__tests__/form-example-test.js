/** @jsx React.DOM */
jest.autoMockOff()
var jQuery = require('jquery')
var beautify = require('js-beautify')

var FIELD_ID = /\s+?(for|id)="[^"]*"/g

// integration test for the whole thing
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

  it('produces expected output', function() {
    var React = require('react/addons')
    var ExampleForm = require('../form-example.js')

    // expected output formatted for readability with variable ids stripped
    var expectedFormatted = (
`<form class=" rff-form">
  <div class="rff-field">
    <label>Name</label>
    <input type="text" value="James" label="Name">
  </div>
  <div class="rff-field">
    <label>From date</label>
    <input type="text" value="2012-1-1" label="From date">
  </div>
  <div class="rff-field">
    <label>To date</label>
    <input type="text" value="2012-21-31" label="To date">
  </div>
  <div class="wrapper-container">
    <div class="related-stuff rff-fieldset">
      <div class="rff-field">
        <label>SomeThing</label>
        <input label="SomeThing" type="text" value="1">
      </div>
      <div class="rff-field">
        <label>Something else</label>
        <input type="text" value="3" label="Something else">
      </div>
    </div>
  </div>
</form>`
    )

    var result = React.renderToStaticMarkup(React.createElement(ExampleForm))

    var resultFormatted = beautify.html(result.replace(FIELD_ID, ''), {indent_size: 2})

    expect(resultFormatted).toEqual(expectedFormatted)
  })
})

function assertHasLabelAndInputWithValue(tree, label, value) {
  var input = inputForLabel(tree, label)
  expect(input.value).toEqual(value)
}

function inputForLabel(tree, labelText) {
  var label = jQuery(tree).find(`label:contains("${labelText}")`).get(0)
  expect(label).not.toBeNull()
  var labelForId = label.htmlFor
  var input = tree.querySelector('#'+selectorEscape(labelForId))
  expect(input).not.toBeNull()
  return input
}

// escapes special characters and returns a valid selector
function selectorEscape(str) {
  return str.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1')
}
