'use strict'

/* This factory returns a function that add templates,
 * from both string and DOM node, to templates archive */

import parser from '../parser.js'

let createRange = document.createRange()

function getElements (template) {
  if (typeof template === 'string') {
    return createRange.createContextualFragment(template).childNodes
  }
  return [template]
}

/**
 * Factory function for adding templates into the archive
 *
 * @param {object} templates templates archive
 * @param {function} next callback
 * @return {function} this function add templates in the templates archive
 */
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

