'use strict'

import compileTag from '../../src/compilers/tag.js'
import compile from '../../src/compiler.js'
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
        nut.scope.other = 'changed!'
        nut.save()
      },
      changeControl (x) {
        control = x
      }
    }
  }
  compileTag(schema, null, () => {
    let el = schema.print(scope, null, box)
    t.is(el.getAttribute('alt'), 'alternative', 'render regular attributes')
    t.is(el.getAttribute('other'), 'another', 'render scoped attributes')
    el.click()
    t.is(el.test, 'test', 'bind events')
    t.is(control, 99, 'events can call other methods')
    t.is(el.getAttribute('other'), 'changed!', 'update element attributes on scope save')
    t.end()
  })
})

test('compile simple tag with no scoped children', function (t) {
  let scope = {}
  let box = boxes(scope)
  let schema = {
    type: 1,
    tagName: 'span',
    children: [{
      type: 3,
      data: 'hola'
    }]
  }
  compileTag(schema, compile, () => {
    let el = schema.print(scope, null, box)
    t.is(el.textContent, 'hola', 'render simple text child')
    t.end()
  })
})
