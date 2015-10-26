'use strict'

import parser from '../parser.js'

function getElement (template) {
  if (typeof template === 'string') {
    return document.createRange().createContextualFragment(template).childNodes[0]
  }
  return template
}

export default function (templates, next) {
  return function (template) {
    let element = getElement(template),
        parsed = parser(element)
    if (parsed.keyname) {
      templates.set(parsed.keyname, parsed)
    }
    next()
  }
}
