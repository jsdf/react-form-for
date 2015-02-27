/* @flow */
var React = require('./react')
var {omit} = require('./util')
var {cloneWithProps} = React.addons
var classSet = require('classnames')

var ListEditor = React.createClass({
  handleChange(update) {
    this.props.onChange(update)
  },
  handleAddItem() {
    var {value} = this.props
    this.handleChange(value.concat(null))
  },
  handleRemoveItem(index) {
    var {value} = this.props
    if (index === 0 && value.length === 1) {
      // replace with single null item
      this.handleChange([null])
    } else {
      // remove item by index
      this.handleChange(value.filter((v, i) => index !== i))
    }
  },
  renderItemWrapper(item) {
    return (
      <div key={item.props.name} className="rff-array-editor-item">
        {item}
        <button
          onClick={() => this.handleRemoveItem(item.props.name)}
          tabIndex="-1"
          type="button"
          className="rff-array-editor-item-remove">
          &times; {this.props.removeItemLabel}
        </button>
      </div>
    )
  },
  render() {
    var items = React.Children.map(this.props.children, (item) => this.renderItemWrapper(item))
    var inherited = omit(this.props, 'for', 'name', 'label', 'value', 'type', 'id')
    return (
      <div {...inherited} className={classSet(this.props.className, "rff-array-editor")}>
        <div className="rff-array-editor-items">
          {items}
        </div>
         <button
           onClick={() => this.handleAddItem()}
           type="button"
           className="rff-array-editor-item-add"
         >
          <span className="plus big">+</span> {this.props.addItemLabel}
        </button>
      </div>
    )
  }
})

module.exports = ListEditor
