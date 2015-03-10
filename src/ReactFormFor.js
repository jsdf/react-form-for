/* @flow */

var ReactFormFor = {
  Form: require('./FormProxy'),
  Fields: require('./FormProxy'), // alias
  Fieldset: require('./FormProxy'), // alias
  Field: require('./FieldProxy'),
  List: require('./ListProxy'),
  Components: {
    ListEditor: require('./components/ListEditor'),
  }
}

module.exports = ReactFormFor
