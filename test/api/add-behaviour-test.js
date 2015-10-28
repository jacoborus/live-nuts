'use strict'

import test from 'tape'
import addBehaviourFactory from '../../src/api/add-behaviour.js'

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
