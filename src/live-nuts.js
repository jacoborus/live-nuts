'use strict'

const newNut = require('./nut.js'),
      range = new Range(),
      forEach = Array.prototype.forEach

const getNutName = function (elem) {
  if (elem.attributes.nut) {
    return elem.attributes.nut.value
  } else {
    return false
  }
}

/**
 * Nuts constructor
 */
class Nuts {
  constructor () {
    this.templates = {}
    this.allCompiled = false
  }
  /**
   * Add a templates and generate its model
   * @param {String}   source html templates
   * @param {Function} callback    Signature: error
   */
  addTemplates (src, callback) {
    let fragment = range.createContextualFragment(src)
    forEach.call(fragment.childNodes, el => {
      let name = getNutName(el)
      if (name) {
        let nut = this.templates[name] = newNut(el)
        nut.name = name
      }
    })
    callback()
  }
}

module.exports = Nuts
