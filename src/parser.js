'use strict'

export default function parser (el, rawChildren) {
  let atts = {}// attributes
  let src = {
    type: el.nodeType,
    data: el.data,
    localName: el.localName,
    attribs: atts
  }

  if (el.attributes && el.hasAttributes()) {
    Array.prototype.forEach.call(el.attributes, i => atts[i.name] = i.value)
    if (atts.nut) {
      src.tagName = atts.nut
      delete atts.nut
    }

    ['scope', 'repeat', 'if', 'unless', 'as'].forEach(prop => {
      if (prop in atts) {
        src[prop] = atts[prop]
        delete atts[prop]
      }
    })
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
