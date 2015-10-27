'use strict'

import test from 'tape'
import addTemplatesFactory from '../../src/api/add-templates.js'

test('add a template from an element', function (t) {
  let templatesArchive = new Map()
  let element = document.createElement('span')
  element.setAttribute('nut', 'testkey')
  let addTemplates = addTemplatesFactory(templatesArchive, function () {
    t.ok(templatesArchive.has('testkey'))
    t.end()
  })

  addTemplates(element)
})

test('add a template from a string', function (t) {
  let templatesArchive = new Map()
  let element = '<span nut="stringkey"></span>'
  let addTemplates = addTemplatesFactory(templatesArchive, function () {
    t.ok(templatesArchive.has('stringkey'))
    t.end()
  })

  addTemplates(element)
})

test('add multiple templates from a string', function (t) {
  let templatesArchive = new Map()
  let element = '<span nut="otherKey"></span><span nut="anotherKey"></span>'
  let addTemplates = addTemplatesFactory(templatesArchive, function () {
    t.ok(templatesArchive.has('otherKey'))
    t.ok(templatesArchive.has('anotherKey'))
    t.end()
  })

  addTemplates(element)
})
