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

import {
  addTemplatesFactory,
  addBehaviourFactory,
  addFiltersFactory,
  addFilterFactory,
  setBehavioursFactory
} from './api-factories.js'

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

let addTemplates = addTemplatesFactory(schemas, next),
    addBehaviour = addBehaviourFactory(behaviours, next),
    addFilter = addFilterFactory(filtersArchive, next),
    addFilters = addFiltersFactory(filtersArchive, next),
    setBehaviours = setBehavioursFactory(behaviours, schemas, next)

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
