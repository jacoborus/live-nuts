'use strict'

const getSource = require('./source.js')

const map = Array.prototype.map

const getNut = function (el) {
  let nut = {
    raw: el.outerHTML,
    source: getSource(el)
  }
  // assign children dom elements
  if (el.childNodes && el.childNodes.length) {
    nut.children = map.call(el.childNodes, child => getNut(child))
  }
  return nut
}

module.exports = getNut
