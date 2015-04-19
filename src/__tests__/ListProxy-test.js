jest.dontMock('../ListProxy')

jest.dontMock('../FormContext')
jest.dontMock('../FormContextMixin')
jest.dontMock('../FormProxyMixin')
jest.dontMock('../FieldProxyMixin')
jest.dontMock('../makeDefaultValueFor')
jest.dontMock('../components/Field')

describe('ListProxy', function() {
  it('changes the text after click', function() {
    var React = require('react/addons')
    var ListProxy = require('../ListProxy')
    var FieldProxy = require('../FieldProxy')
    var FormContext = require('../FormContext')
    var TestUtils = React.addons.TestUtils

    // TODO: decouple FormContext initialisation from components
    var rootContext = new FormContext()
    return
    rootContext.props = {
      value: {members: [{name: "Jean"}, {name: "Billie"}]},
      parentFormContext: rootContext,
    }
    var membersContext = new FormContext()
    membersContext.props = {
      value: rootContext.props.value.members,
      parentFormContext: rootContext,
    }

    var listProxy = TestUtils.renderIntoDocument(
      <ListProxy for="members">
        <FieldProxy for="name" />
      </ListProxy>
    )

    console.log(React.findDOMNode(listProxy))

    // // Verify that it's Off by default
    // var label = TestUtils.findRenderedDOMComponentWithTag(
    //   listProxy, 'label')
    // expect(label.getDOMNode().textContent).toEqual('Off')

    // // Simulate a click and verify that it is now On
    // var input = TestUtils.findRenderedDOMComponentWithTag(
    //   listProxy, 'input')
    // TestUtils.Simulate.change(input)
    // expect(label.getDOMNode().textContent).toEqual('On')
  })
})
