require('node-jsx').install({harmony: true})

var expected = '<form><div><label>Name</label><input form="[object Object]" type="text" name="name" label="Name"></div><div><label>From date</label><input form="[object Object]" type="text" name="from_date" label="From date"></div><div><label>To date</label><input form="[object Object]" type="text" name="to_date" label="To date"></div><div><div><label>Something</label><input form="[object Object]" type="text" name="something" label="Something"></div></div></form>'

// require("tap").test("make sure it runs", function (t) {
  // t.plan(1)
  var React = require('react')
  var ExampleForm = require('../example/form-example')
  var result = React.renderToStaticMarkup(React.createElement(ExampleForm))
  console.log('result',result)
  // t.equal(expected, result, "output is correct")
// })