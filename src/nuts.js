'use strict'

//  Resolve document
// - extract template tags from html document
// - add templates into schemas archive
// - add filters into filters archive
// - add behaviours into behaviours archive
// - set behaviours into templates
// - make partials (with extend.js)
// - retrieve data from regular html and generate and assign instances
// - enjoy

import apiFactories from '../src/api-factories.js'

let api = {},
    schemas = new Map(),
    behaviours = new Map(),
    filtersArchive = new Map(),
    queue = []

function resolveDocument () {
  setBehaviours()
}

function next () {
  if (queue.length) {
    queue.shift()()
  } else {
    resolveDocument()
  }
}

let {
    addTemplates,
    addBehaviour,
    addFilter,
    addFilters,
    setBehaviours
  } = apiFactories(schemas, filtersArchive, behaviours, next)

api.addTemplates = function (templates) {
  queue.push(() => addTemplates(templates))
  return api
}

api.addBehaviour = function (templateName, behaviour) {
  queue.push(() => addBehaviour(templateName, behaviour))
  return api
}

api.addFilter = function (filterName, filter) {
  queue.push(() => addFilter(filterName, filter))
  return api
}

api.addFilters = function (filters) {
  queue.push(() => addFilters(filters))
  return api
}

api.resolve = function (callback) {
  queue.push(() => resolveDocument(callback))
}

export default api
