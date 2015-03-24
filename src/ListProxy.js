/* @flow */
var React = require('./util/React')
var classSet = require('classnames')
var FormProxyMixin = require('./FormProxyMixin')
var FieldProxyMixin = require('./FieldProxyMixin')
var FormProxy = require('./FormProxy')
var createElementFrom = require('./util/createElementFrom')
var {omit, extend} = require('./util/util')

var ListProxy = React.createClass({
  mixins: [
    FormProxyMixin,
    FieldProxyMixin,
  ],
  statics: {
    isListProxy: true,
  },
  renderListChildren(form:?Object):any {
    if (form == null) form = this.getForm()
    // note that is effectively creating a fieldset for each item in the array
    // and using that item in the array as the value for the fieldset, with the
    // child FormProxy elements passed into the ListProxy as the fields
    return form.value.map((item, index) => {
      // note: children are passed to new FormProxy
      // this is important as a ListProxy is basically a FormProxy, but repeated
      // TODO: investigate whether child elements should be cloned
      var inherited = omit(this.props, 'for', 'name', 'component')
      return <FormProxy {...inherited} name={index} key={index} parentForm={form} />
    })
  },
  render() {
    var form = this.getForm()
    var formProps = extend(this.getFieldProps(form.parentForm), this.getFormProps(form))
    formProps.className = classSet(this.props.className, 'rff-list')
    formProps.children = this.renderListChildren(null)
    return this.props.component ? createElementFrom(this.props.component, formProps) : React.DOM.div(formProps)
  },
})

module.exports = ListProxy
