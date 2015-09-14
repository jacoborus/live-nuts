(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Nuts = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

const range = new Range(),
      forEach = Array.prototype.forEach

const getNut = require('./nut.js')

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
        let nut = this.templates[name] = getNut(el)
        nut.name = name
      }
    })
    callback()
  }
}

module.exports = Nuts

},{"./nut.js":2}],2:[function(require,module,exports){
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

},{"./source.js":3}],3:[function(require,module,exports){
'use strict'

// create a Set with all self-closing html tags
const voidElementsSet = new Set(),
      voidElements = [
        'area',
        'base',
        'br',
        'col',
        'embed',
        'hr',
        'img',
        'input',
        'keygen',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr',
        'path',
        'circle',
        'ellipse',
        'line',
        'rect',
        'use',
        'stop',
        'polyline',
        'polygone'
      ]
voidElements.forEach(e => voidElementsSet.add(e))

const getAttributes = function (atts) {
  let obj = {}
  Array.prototype.forEach.call(atts, att => {
    obj[att.name] = att.value
  })
  return obj
}

const nodeType = {
  1: 'tag',
  3: 'text',
  8: 'comment',
  10: 'directive'
}

// move attributes with nu- prefix to nuAtts property
const separateNuAtts = function (atts) {
  let nuAtts = {}

  for (let att in atts) {
    // detect if an attribute name is prefixed with nu-
    if (att.indexOf('nu-') === 0) {
      // remove nu- prefix from attribute
      nuAtts[ att.substr(3, att.length)] = atts[att]
      delete atts[att]
    }
  }
  return nuAtts
}

const getSource = function (el) {
  let src = {},
      atts = getAttributes(el.attributes || [])

  src.type = nodeType[el.nodeType]
  src.data = el.data
  src.name = el.localName
  src.voidElement = voidElementsSet.has(src.name)

  // assign attributes
  if (atts.class) {
    src.class = atts.class
    delete atts.class
  }
  if (atts['nu-class']) {
    src.nuClass = atts['nu-class']
    delete atts['nu-class']
  }
  if (atts['nu-scope']) {
    src.scope = atts['nu-scope']
    delete atts['nu-scope']
  }
  if (atts['nu-model'] || atts['nu-model'] === '') {
    src.model = atts['nu-model']
    delete atts['nu-model']
  }
  if (atts['nu-inherit'] || atts['nu-inherit'] === '') {
    src.inherit = atts['nu-inherit']
    delete atts['nu-inherit']
  }
  if (atts['nu-if'] || atts['nu-if'] === '') {
    if (atts['nu-if']) {
      src.nuif = atts['nu-if']
    }
    delete atts['nu-if']
  }
  if (atts['nu-unless'] || atts['nu-unless'] === '') {
    if (atts['nu-unless']) {
      src.unless = atts['nu-unless']
    }
    delete atts['nu-unless']
  }
  if (atts['nu-repeat'] || atts['nu-repeat'] === '') {
    src.repeat = atts['nu-repeat']
    delete atts['nu-repeat']
  }
  if (atts['nu-each'] || atts['nu-each'] === '') {
    src.each = atts['nu-each']
    delete atts['nu-each']
  }
  if (atts['nu-as'] || atts['nu-as'] === '') {
    if (atts['nu-as']) {
      src.as = atts['nu-as']
    }
    delete atts['nu-as']
  }

  src.nuAtts = separateNuAtts(atts)
  src.attribs = atts

  // // assign attributes
  // delete atts.nut
  // this.attribs = atts || {}

  // separate boolean attributes from the regular ones
  // and remove them from regular ones
  src.booleans = {}
  for (let i in src.nuAtts) {
    if (i.endsWith('-')) {
      src.booleans[i.slice(0, -1)] = src.nuAtts[i]
      delete src.nuAtts[i]
    }
  }

  {
    // add formatters from piped model
    let formatters = []
    // skip operation if tag has no model
    if (typeof src.model !== 'undefined') {
      formatters = src.model.split('|')
      // skip if tag has not formatters
      if (formatters.length !== 1) {
        // extract model from formatters
        src.model = formatters.shift().trim()
        // remove extra spaces form formatter names
        formatters.forEach((format, i) => formatters[i] = format.trim())
        // add formatters to source
        if (formatters) {
          src.formatters = formatters
        }
      }
    }
  }
  return src
}

module.exports = getSource

},{}]},{},[1])(1)
});