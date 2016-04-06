'use strict'

const props = new Set(['model', 'repeat', 'if', 'unless', 'as', 'hide', 'show'])

module.exports = function parser (el, rawChildren) {
  let atts = {}// attributes
  let src = {
    type: el.nodeType,
    data: el.data,
    localName: el.localName,
    attribs: atts
  }
  let events = {}

  if (el.attributes && el.hasAttributes()) {
    // fill `atts` object with element attributes
    Array.prototype.forEach.call(el.attributes, i => {atts[i.name] = i.value})
    // extract nut name
    if (atts.nut) {
      src.tagName = atts.nut
      delete atts.nut
    }

    // extract custom nut properties
    props.forEach(prop => {
      if (prop in atts) {
        src[prop] = atts[prop]
        delete atts[prop]
      }
    })

    // extract events
    Object.keys(atts).forEach(k => {
      if (k.startsWith('(') && k.endsWith(')')) {
        events[k.slice(1, k.length - 1)] = atts[k]
        delete atts[k]
      }
    })
    if (Object.keys(events).length) src.events = events
  }

  if (rawChildren) {
    src.children = el.childNodes
  } else {
    // parse children dom elements
    if (el.childNodes && el.childNodes.length) {
      src.children = Array.prototype.map.call(el.childNodes, child => parser(child))
    }
  }

  return src
}
