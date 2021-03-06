'use strict'

const parser = require('./parser.js')
const newCounter = require('./counter.js')

let createRange = document.createRange()

function getElements (template) {
  if (typeof template === 'string') {
    return createRange.createContextualFragment(template).childNodes
  }
  if (template[0] && template[0].nodeName === 'TEMPLATE') {
    return template[0].content.children
  }
  return template
}

module.exports = function (schemas, filtersArchive, behaviours, next) {
  function addTemplates (template) {
    let elements = getElements(template)

    Array.from(elements).forEach(element => {
      let schema = parser(element)
      if (schema.tagName) {
        schemas.set(schema.tagName, schema)
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
      let schema = schemas.get(key) || schemas.set(key, {}).get(key)
      let clon = Object.assign({}, behaviour)
      if (clon.events) {
        schema.events = clon.events
        delete clon.events
      }
      if (clon.init) {
        schema.init = clon.init
        delete clon.init
      }
      let keys = Object.keys(clon)
      if (keys.length) {
        schema.methods = clon
      }
      counter()
    })
  }

  return {addTemplates, addFilter, addFilters, addBehaviour, setBehaviours}
}
