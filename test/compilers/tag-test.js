'use strict'

import compileTag from '../../src/compilers/tag.js'
import test from 'tape'
import boxes from 'boxes'

test('compile simple tag with attributes', function (t) {
  let scope = {
    other: 'another'
  }
  let control = 1
  let box = boxes(scope)
  let schema = {
    type: 1,
    tagName: 'span',
    attribs: {
      alt: 'alternative',
      other: '{{ other }}'
    },
    events: {
      click: 'makeclick'
    },
    methods: {
      makeclick (e, nut) {
        e.target.test = 'test'
        nut.changeControl(99)
      },
      changeControl (x) {
        control = x
      }
    }
  }
  compileTag(schema, null, () => {
    let el = schema.render(scope, box, null)
    t.is(el.getAttribute('alt'), 'alternative', 'render regular attributes')
    t.is(el.getAttribute('other'), 'another', 'render scoped attributes')
    el.click()
    t.is(el.test, 'test', 'bind events')
    t.is(control, 99, 'events can call other methods')
    t.end()
  })
})
