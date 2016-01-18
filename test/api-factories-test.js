'use strict'

import test from 'tape'

import apiFactories from '../src/api-factories.js'

test('add a template from an element into templates archive', function (t) {
  let schemas = new Map(),
      container = document.createElement('div')

  container.innerHTML = `<template nut-templates>
    <div nut="test-key"></div>
  </template>`

  let { addTemplates } = apiFactories(schemas, null, null, function () {
    t.ok(schemas.has('test-key'))
    t.end()
  })

  addTemplates([container.children[0]])
})

test('add a template from a string into template archive', function (t) {
  let schemas = new Map(),
      element = '<span nut="stringkey"></span>'

  let { addTemplates } = apiFactories(schemas, null, null, function () {
    t.ok(schemas.has('stringkey'))
    t.end()
  })

  addTemplates(element)
})

test('add multiple templates from a string', function (t) {
  let schemas = new Map(),
      element = '<span nut="otherKey"></span><span nut="anotherKey"></span>'

  let { addTemplates } = apiFactories(schemas, null, null, function () {
    t.ok(schemas.has('otherKey'))
    t.ok(schemas.has('anotherKey'))
    t.end()
  })

  addTemplates(element)
})

test('add a filter into filtersArchive', function (t) {
  let filtersArchive = new Map()
  let { addFilter } = apiFactories(null, filtersArchive, null, function () {
    t.ok(filtersArchive.has('filterOne'))
    let fn = filtersArchive.get('filterOne')
    t.is(fn('-'), '-one')
    t.end()
  })

  addFilter('filterOne', value => value + 'one')
})

test('add everyFilter into filtersArchive', function (t) {
  let filtersArchive = new Map()
  let { addFilters } = apiFactories(null, filtersArchive, null, function () {
    t.ok(filtersArchive.has('filterOne'))
    t.ok(filtersArchive.has('filterTwo'))
    let fn = filtersArchive.get('filterOne')
    t.is(fn('-'), '-one')
    t.end()
  })

  addFilters({
    filterOne: value => value + 'one',
    filterTwo: value => value + 'two'
  })
})

test('add behaviour to archive', function (t) {
  let behavioursArchive = new Map()
  let { addBehaviour } = apiFactories(null, null, behavioursArchive, () => {
    t.ok(behavioursArchive.has('templateName'))
    t.end()
  })

  addBehaviour('templateName', {
    events: {}
  })
})

test('set behaviours in schemas', (t) => {
  let behavioursArchive = new Map(),
      schemas = new Map()

  schemas.set('uno', {})
  behavioursArchive.set('uno', {
    events: {
      click: function () {}
    }
  })

  let { setBehaviours } = apiFactories(schemas, null, behavioursArchive)

  setBehaviours(() => {
    t.ok(typeof schemas.get('uno').behaviour, 'object')
    t.end()
  })
})
