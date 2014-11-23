/* @flow */
var memoize = require('lodash.memoize/index')
var {humanize} = require('./inflection')

// a memoized inflection of the field name
var labelForName = memoize(humanize)

module.exports = labelForName
