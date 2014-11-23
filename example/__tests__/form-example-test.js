/** @jsx React.DOM */
jest.autoMockOff()
var jQuery = require('jquery')
var beautify = require('js-beautify')

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
    <label for="rff-field-name-input-1">Name</label>
    <input type="text" value="James" label="Name" id="rff-field-name-input-1">
  </div>
  <div class="rff-field">
    <label for="rff-field-from_date-input-2">From date</label>
    <input type="text" value="2012-1-1" label="From date" id="rff-field-from_date-input-2">
  </div>
  <div class="rff-field">
    <label for="rff-field-to_date-input-3">To date</label>
    <input type="text" value="2012-21-31" label="To date" id="rff-field-to_date-input-3">
  </div>
  <div class="wrapper-container">
    <div class="related-stuff rff-fieldset">
      <div class="rff-field">
        <label for="rff-field-related-something-input-4">SomeThing</label>
        <input label="SomeThing" type="text" value="1" id="rff-field-related-something-input-4">
      </div>
      <div class="rff-field">
        <label for="rff-field-related-something_else-input-5">Something else</label>
        <input type="text" value="3" label="Something else" id="rff-field-related-something_else-input-5">
      </div>
    </div>
  </div>
</form>`
    )

    var result = React.renderToStaticMarkup(React.createElement(ExampleForm))
    var resultFormatted = beautify.html(result, {indent_size: 2})
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
  var input = tree.querySelector(`#${labelForId}`)
  expect(input).not.toBeNull()
  return input
}
