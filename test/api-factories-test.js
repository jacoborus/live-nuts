'use strict'

import test from 'tape'
import { addTemplatesFactory } from '../src/api-factories.js'

test('add a template from an element into templates archive', function (t) {
  let templatesArchive = new Map(),
      element = document.createElement('span')

  element.setAttribute('nut', 'testkey')

  let addTemplates = addTemplatesFactory(templatesArchive, function () {
    t.ok(templatesArchive.has('testkey'))
    t.end()
  })

  addTemplates(element)
})

test('add a template from a string into template archive', function (t) {
  let templatesArchive = new Map(),
      element = '<span nut="stringkey"></span>'

  let addTemplates = addTemplatesFactory(templatesArchive, function () {
    t.ok(templatesArchive.has('stringkey'))
    t.end()
  })

  addTemplates(element)
})

test('add multiple templates from a string', function (t) {
  let templatesArchive = new Map(),
      element = '<span nut="otherKey"></span><span nut="anotherKey"></span>'

  let addTemplates = addTemplatesFactory(templatesArchive, function () {
    t.ok(templatesArchive.has('otherKey'))
    t.ok(templatesArchive.has('anotherKey'))
    t.end()
  })

  addTemplates(element)
})

import { addFilterFactory } from '../src/api-factories.js'

test('add a filter into filtersArchive', function (t) {
  let filtersArchive = new Map()
  let addFilter = addFilterFactory(filtersArchive, function () {
    t.ok(filtersArchive.has('filterOne'))
    let fn = filtersArchive.get('filterOne')
    t.is(fn('-'), '-one')
    t.end()
  })

  addFilter('filterOne', value => value + 'one')
})

import { addFiltersFactory } from '../src/api-factories.js'

test('add everyFilter into filtersArchive', function (t) {
  let filtersArchive = new Map()
  let addFilters = addFiltersFactory(filtersArchive, function () {
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

import { addBehaviourFactory } from '../src/api-factories.js'

test('add behaviour to archive', function (t) {
  let behavioursArchive = new Map()
  let addBehaviour = addBehaviourFactory(behavioursArchive, function () {
    t.ok(behavioursArchive.has('templateName'))
    t.end()
  })

  addBehaviour('templateName', {
    events: {}
  })
})

import { setBehavioursFactory } from '../src/api-factories.js'

test('set behaviours in schemas', (t) => {
  let behavioursArchive = new Map(),
      schemas = new Map()

  schemas.set('uno', {})
  behavioursArchive.set('uno', {})

  let setBehaviours = setBehavioursFactory(behavioursArchive, schemas, () => {
    t.ok(typeof schemas.get('uno').behaviour, 'object')
    t.end()
  })

  setBehaviours()
})
