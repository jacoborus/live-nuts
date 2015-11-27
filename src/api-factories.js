'use strict'

import parser from './parser.js'

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
export function addTemplatesFactory (templates, next) {
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

/**
 * Factory function add filters
 *
 * @param {object} archive filters archive
 * @param {function} next callback
 * @return {function} function that adds filters into filters archive
 */
export function addFiltersFactory (archive, next) {
  return function (filters) {
    Object.keys(filters).forEach(name => archive.set(name, filters[name]))
    next()
  }
}

/**
 * function
 *
 * @param {object} behaviours behaviours archive
 * @param {function} next callback
 * @return {function} function that adds behaviours to behaviours archive
 */
export function addBehaviourFactory (behaviours, next) {
  return function (templateName, behaviour) {
    if (behaviour) {
      behaviours.set(templateName, behaviour)
    }
    next()
  }
}
