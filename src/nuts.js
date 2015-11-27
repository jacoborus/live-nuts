'use strict'

import {
  addTemplateFactory,
  addBehaviourFactory,
  addFiltersFactory
} from './api-factories.js'

import setBehaviourFactory from './set-behaviour.js'

let api = {},
    schemas = new Map(),
    behaviours = new Map(),
    filtersArchive = new Map(),
    queue = []

function resolveDocument (callback) {
  // 1- get templates from template tags
  // 2- add templates into templates archive
  // 3- add filters into filters archive
  // 4- add behaviours into behaviours archive
  // 5- set behaviours into templates
  setBehaviours(callback)
}

function next () {
  if (queue.length) {
    queue.shift()()
  } else {
    resolveDocument()
  }
}

let addTemplates = addTemplateFactory(schemas, next),
    addBehaviour = addBehaviourFactory(behaviours, next),
    addFilters = addFiltersFactory(filtersArchive, next),
    setBehaviours = setBehaviourFactory(behaviours, schemas, next)

api.addTemplates = function (templates) {
  queue.push(() => addTemplates(templates))
  return api
}

api.addBehaviour = function (templateName, behaviour) {
  queue.push(() => addBehaviour(templateName, behaviour))
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
