'use strict'

import test from 'tape'
import addTemplatesFactory from '../../src/api/add-templates.js'

test('add a template from an element', function (t) {
  let templatesArchive = new Map()
  templatesArchive.set('a', 1)
  let element = document.createElement('span')
  element.setAttribute('nut', 'testkey')
  let addTemplates = addTemplatesFactory(templatesArchive, function () {
    t.ok(templatesArchive.has('testkey'))
    t.end()
  })

  addTemplates(element)
})
