'use strict'

import test from 'tape'
import compile from '../src/compiler.js'
import boxes from 'boxes'

test('compile simple tag with attributes', function (t) {
  let control = 0
  let schema = {
    type: 1,
    tagName: 'c-item',
    localName: 'section',
    attribs: {
      title: '{{color}}',
      alt: 'alternative',
      other: 'other {{ another }}',
      'booleatt-': '{{onoff}}'
    },
    children: [{
      type: 3,
      data: 'hola'
    }],
    events: {
      click: (e, nut, box) => {
        control++
        nut.scope.color = 'red'
        nut.scope.onoff = !nut.scope.onoff
        box.save()
      }
    }
  }

  let scope = {
    color: 'green',
    another: 'another one',
    onoff: true
  }
  let box = boxes(scope)

  compile(schema, () => {
    let el = schema.render(scope, box)
    t.is(el.localName, 'section', 'render localName')
    t.is(el.getAttribute('alt'), 'alternative', 'render regular attribute')
    t.is(el.getAttribute('title'), 'green', 'render scoped attribute')
    t.is(el.getAttribute('other'), 'other another one', 'render complex attribute')
    t.ok(el.hasAttribute('booleatt'), 'boolean attribute')
    el.click()
    t.is(control, 1, 'regular subscribe')
    t.is(el.getAttribute('title'), 'red', 'subscribe attribute')
    t.notOk(el.hasAttribute('booleatt'), 'subscribe boolean attribute')
    t.is(schema.booleans.booleatt, 'onoff')
    t.end()
  })
})
