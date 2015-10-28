'use strict'

import parser from '../parser.js'

function getElements (template) {
  if (typeof template === 'string') {
    let childNodes = document.createRange().createContextualFragment(template).childNodes
    return childNodes
  }
  return [template]
}

export default function (templates, next) {
  return function (template) {
    let elements = getElements(template)

    Array.prototype.forEach.call(elements, element => {
      let schema = parser(element)
      if (schema.keyname) {
        templates.set(schema.keyname, schema)
      }
    })

    next()
  }
}

