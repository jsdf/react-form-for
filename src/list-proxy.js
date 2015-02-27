/* @flow */
var React = require('./react')
var {cloneWithProps} = React.addons
var classSet = require('classnames')
var FormProxyMixin = require('./form-proxy-mixin')
var FieldProxyMixin = require('./field-proxy-mixin')
var FormProxy = require('./form-proxy')
var createElementFrom = require('./create-element-from')
var {omit, extend} = require('./util')

var ListProxy = React.createClass({
  mixins: [
    FormProxyMixin,
    FieldProxyMixin,
  ],
  statics: {
    isListProxy: true,
  },
  renderListChildren(form:Form = this.getForm()):any {
    var form = this.getForm()
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
    formProps.children = this.renderListChildren()
    return this.props.component ? createElementFrom(this.props.component, formProps) : React.DOM.div(formProps)
  },
})

module.exports = ListProxy
