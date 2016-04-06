'use strict'

module.exports = function (tagName, atts = {}) {
  const el = document.createElement(tagName)
  Object.keys(atts).forEach(k => el.setAttribute(k, atts[k]))
  return () => el.cloneNode(true)
}
