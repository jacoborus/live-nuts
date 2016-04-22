'use strict'

// create a HTML node with given `localName` and attributes (`atts`)
// then return a funcion that returns a clone of this element
module.exports = function (localName, atts = {}) {
  const el = document.createElement(localName)
  Object.keys(atts).forEach(k => el.setAttribute(k, atts[k]))
  return () => el.cloneNode(true)
}
