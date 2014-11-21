require('node-jsx').install({harmony: true})

var expected = '<form><div><label>Name</label><input type="text" value="James" label="Name"></div><div><label>From date</label><input type="text" value="2012-1-1" label="From date"></div><div><label>To date</label><input type="text" value="2012-21-31" label="To date"></div><div class="wrapper-container"><div class="related-stuff"><div><label>SomeThing</label><input label="SomeThing" type="text" value="1"></div><div><label>Something else</label><input type="text" value="3" label="Something else"></div></div></div></form>'

var STRIP = / (for|id)="[^"]*"/g

if (process.env.DISABLE_TAP) {
  console.log('running without tap')
  run()
} else {
  require("tap").test("make sure it runs", run)
}

function run(t) {
  t && t.plan(1)
  var React = require('react')
  var ExampleForm = require('../example/form-example')
  var result = React.renderToStaticMarkup(React.createElement(ExampleForm))
  t && t.equal(result.replace(STRIP, ''), expected, "output is correct")
}


