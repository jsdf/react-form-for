/* @flow */
var React = require('./util/React')
var classSet = require('classnames')
var FormProxyMixin = require('./FormProxyMixin')
var FieldProxyMixin = require('./FieldProxyMixin')
var FormProxy = require('./FormProxy')
var createElementFrom = require('./util/createElementFrom')
var {omit} = require('./util/util')

var ListProxy = React.createClass({
  mixins: [
    FormProxyMixin,
    // avoid mixin-mixins conflict
    omit(FieldProxyMixin, 'mixins')
  ],
  statics: {
    isListProxy: true,
  },
  renderListChildren(parentContext:?Object):any {
    if (parentContext == null) parentContext = this.getParentFormContext()
    // note that is effectively creating a fieldset for each item in the array
    // and using that item in the array as the value for the fieldset, with the
    // child FormProxy elements passed into the ListProxy as the fields
    return (parentContext.props.value||[]).map((item, index) => {
      // note: children are passed to new FormProxy
      // this is important as a ListProxy is basically a FormProxy, but repeated
      // TODO: investigate whether child elements should be cloned
      var inherited = omit(this.props, 'for', 'name', 'component')
      return <FormProxy {...inherited} name={index} key={index} parentFormContext={parentContext} />
    })
  },
  render() {
    var parentContext = this.getParentFormContext()
    var formProps = this.getFieldProps(parentContext.parentContext)
    Object.assign(formProps, this.getFormProps(parentContext))
    formProps.className = classSet(this.props.className, 'rff-list')
    formProps.children = this.renderListChildren(null)
    return this.props.component ? createElementFrom(this.props.component, formProps) : React.DOM.div(formProps)
  },
})

module.exports = ListProxy
