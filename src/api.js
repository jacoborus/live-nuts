'use strict'

import addTemplateFactory from './api/add-templates.js'
import addBehaviourFactory from './api/add-behaviour.js'
import addFiltersFactory from './api/add-filters.js'
import setBehaviourFactory from './set-behaviour.js'
import newCounter from './counter.js'

let api = {},
    templates = new Map(),
    behaviours = new Map(),
    filtersArchive = new Map(),
    queue = []

function addBehaviourToSchemas (callback) {
  let keys = Object.keys(behaviours),
      counter = newCounter(keys.length, callback)
  keys.forEach(key => setBehaviour(key, behaviours.get(key), counter))
}

function resolveDocument (callback) {
  // 1- get templates from template tags
  // 2- add templates into templates archive
  // 3- add filters into filters archive
  // 4- add behaviours into behaviours archive
  // 5- set behaviours into templates
  addBehaviourToSchemas(callback)
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
    addFilters = addFiltersFactory(filtersArchive, next),
    setBehaviour = setBehaviourFactory(behaviours, next)

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
