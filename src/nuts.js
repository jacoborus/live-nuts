'use strict'

import apiFactories from './api-factories.js'
import makePartials from './partials.js'
import compile from './compiler.js'
import newCounter from './counter.js'
import boxes from 'boxes'

let api = {},
    schemas = new Map(),
    behaviours = new Map(),
    filtersArchive = new Map(),
    queue = []

let store = boxes.createStore('main', {})

function instantiate (element, box, callback) {
  let tagNuts = element.querySelectorAll('[data-nut]')
  let instances = Array.from(tagNuts).filter(i => schemas.has(i.getAttribute('data-nut')))
  console.log(schemas)
  instances.forEach(i => {
    i.parentNode.replaceChild(
      schemas.get(i.getAttribute('data-nut')).render(store.get(), box),
      i
    )
  })
  callback()
}

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
        instantiate(document.children[0], store, () => callback())
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
