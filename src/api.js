'use strict'

import addTemplateFactory from './api/add-templates.js'
import addBehaviourFactory from './api/add-behaviour.js'
import addFiltersFactory from './api/add-filters.js'

let api = {},
    templates = new Map(),
    behaviours = new Map(),
    filtersArchive = new Map(),
    queue = []

function addViewsToSchemas (callback) {
}

function resolveDocument (callback) {
  addViewsToSchemas(callback)
}

function next () {
  if (queue.length) {
    queue.shift()()
  } else {
    resolveDocument()
  }
}

let addTemplates = addTemplateFactory(templates, next),
    addBehaviour = addBehaviourFactory(behaviours, next),
    addFilters = addFiltersFactory(filtersArchive, next)

api.addTemplates = function (templates) {
  queue.push(() => addTemplates(templates))
  return api
}

api.addBehaviour = function (templateName, options) {
  queue.push(() => addBehaviour(templateName, options))
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
