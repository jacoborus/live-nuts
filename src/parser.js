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
  Array.from(atts).forEach(att => obj[att.name] = att.value)
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

export default function parser (el, rawChildren) {
  let src = {},
      atts = getAttributes(el.attributes || [])

  src.type = nodeType[el.nodeType]
  src.data = el.data
  src.localName = el.localName
  src.voidElement = voidElementsSet.has(src.localName)

  // assign attributes
  if (atts.nut) {
    src.tagName = atts.nut
    delete atts.nut
  }
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
  // separate boolean attributes from the regular ones
  // and remove them from regular ones
  src.booleans = {}
  for (let i in src.nuAtts) {
    if (i.endsWith('-')) {
      src.booleans[i.slice(0, -1)] = src.nuAtts[i]
      delete src.nuAtts[i]
    }
  }

  delete atts.nut
  src.attribs = atts

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

  if (rawChildren) {
    src.children = el.childNodes
  } else {
    // assign children dom elements
    if (el.childNodes && el.childNodes.length) {
      src.children = Array.prototype.map.call(el.childNodes, child => parser(child))
    }
  }

  return src
}
