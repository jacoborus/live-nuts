'use strict'

import parser from './parser.js'
import newCounter from './counter.js'

let createRange = document.createRange()

function getElements (template) {
  if (typeof template === 'string') {
    return createRange.createContextualFragment(template).childNodes
  }
  return template
}

export default function (schemas, filtersArchive, behaviours, next) {
  function addTemplates (template) {
    let elements = getElements(template)

    Array.prototype.forEach.call(elements, element => {
      let schema = parser(element)
      if (schema.keyname) {
        schemas.set(schema.keyname, schema)
      }
    })

    next()
  }

  function addFilter (filterName, filter) {
    filtersArchive.set(filterName, filter)
    next()
  }

  function addFilters (filters) {
    Object.keys(filters).forEach(name => filtersArchive.set(name, filters[name]))
    next()
  }

  function addBehaviour (templateName, behaviour) {
    if (behaviour) {
      behaviours.set(templateName, behaviour)
    }
    next()
  }

  function setBehaviours (callback = function () {}) {
    let counter = newCounter(behaviours.size, callback)
    behaviours.forEach((behaviour, key) => {
      if (schema) schema.behaviour = behaviour
      let schema = schemas.get(key)
      counter()
    })
  }

  return {addTemplates, addFilter, addFilters, addBehaviour, setBehaviours}
}
