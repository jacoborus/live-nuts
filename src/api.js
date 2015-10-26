'use strict'

import parser from './parser.js'
import addTemplateFactory from './api/add-templates.js'
import setViewFactory from './api/set-view.js'
import addFiltersFactory from './api/add-filters.js'

let api = {},
    templates = new Map(),
    views = new Map(),
    filtersArchive = new Map(),
    queue = []

function resolveDocument (callback) {
  callback()
}

function next () {
  if (queue.length) {
    queue.shift()()
  } else {
    resolveDocument()
  }
}

let addTemplates = addTemplateFactory(parser, templates, next),
    setView = setViewFactory(views, next),
    addFilters = addFiltersFactory(filtersArchive, next)

api.addTemplates = function (templates) {
  queue.push(() => addTemplates(templates))
  return api
}

api.setView = function (templateName, options) {
  queue.push(() => setView(templateName, options))
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
