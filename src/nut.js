'use strict'

const parser = require('./parser.js')

const newNut = function (el) {
  let nut = {
    raw: el.outerHTML,
    source: parser(el)
  }
  return nut
}

module.exports = newNut
