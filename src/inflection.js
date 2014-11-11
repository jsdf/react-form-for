var ID_SUFFIX = new RegExp('(_ids|_id)$', 'g')
var UNDERBAR = new RegExp('_', 'g')

function capitalize(str) {
  str = str.toLowerCase()
  return str.substring(0, 1).toUpperCase() + str.substring(1)
}

function humanize(str) {
  str = str.toLowerCase()
  str = str.replace(ID_SUFFIX, '')
  str = str.replace(UNDERBAR, ' ')
  str = capitalize(str)
  return str
}

module.exports = {humanize, capitalize}
