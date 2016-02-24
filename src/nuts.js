'use strict'

//  Resolve document
// - extract template tags from html document
// - add templates into schemas archive
// - add filters into filters archive
// - add behaviours into behaviours archive
// - set behaviours into templates
// - make partials (with extend.js)
// - register elements, create nuts tree and instantiate nuts

import apiFactories from './api-factories.js'
import makePartials from './partials.js'
import registerTree from './register-tree.js'
import instantiator from './instantiate.js'
import compile from './compiler.js'
import newCounter from './counter.js'
import boxes from 'boxes'

let api = {},
    schemas = new Map(),
    behaviours = new Map(),
    filtersArchive = new Map(),
    queue = []

let store = boxes.createStore('main', {})
let instantiate = instantiator(schemas, store)

function next () {
  if (queue.length) queue.shift()()
}

function compileAll (callback) {
  let count = newCounter(schemas.size, callback)
  schemas.forEach(s => compile(s, count))
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

function resolveDocument (callback) {
  setBehaviours(function () {
    makePartials(schemas, () => {
      compileAll(() => {
        registerTree(document.children[0], schemas)
        .then(tree => {
          instantiate(tree, store.get(), () => callback())
        })
      })
    })
  })
}

api.resolve = function (callback) {
  queue.push(() => addTemplates(document.querySelectorAll('template[nut-templates]')))
  queue.push(() => resolveDocument(callback))
  next()
}

api.schemas = schemas
api.store = store
api.filtersArchive = filtersArchive
api.behaviours = behaviours

export default api
window.nuts = api
