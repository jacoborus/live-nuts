'use strict'

import test from 'tape'
import createNutFactory from '../src/create-nut.js'

test('test for createNut', function (t) {
  let links = new Map()
  let createNut = createNutFactory(links)
  let control = 0
  let el = createNut({color: 'green'}, {
    tagName: 'c-item',
    extends: 'li',
    model: 'color',
    isNut: true,
    events: {
      click: () => control++
    }
  })
  t.is(el.tagName, 'C-ITEM')
  t.is(el.innerHTML, 'green')
  el.click()
  t.is(control, 1)
  t.end()
})
