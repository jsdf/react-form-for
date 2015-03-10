/* @flow */
var ID_SUFFIX = new RegExp('(_ids|_id)$', 'g')
var UNDERBAR = new RegExp('_', 'g')

var Inflection = {
  capitalize(str:string):string {
    var lowerStr = str.toLowerCase()
    return lowerStr.substring(0, 1).toUpperCase() + lowerStr.substring(1)
  },
  humanize(str:string):string {
    return Inflection.capitalize(
      str
        .toLowerCase()
        .replace(ID_SUFFIX, '')
        .replace(UNDERBAR, ' ')
    )
  },
}

module.exports = Inflection
