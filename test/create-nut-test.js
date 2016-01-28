'use strict'

import test from 'tape'
import createNutFactory from '../src/create-nut.js'
import getProxyFactory from '../src/get-proxy.js'

test('test for createNut', function (t) {
  let links = new Map()
  let getProxy = getProxyFactory(links)
  let createNut = createNutFactory(links)
  let control = 0
  let scope = getProxy({color: 'green'})
  let el = createNut(scope, {
    tagName: 'c-item',
    extends: 'li',
    model: 'color',
    isNut: true,
    events: {
      click: (e, nut) => {
        nut.scope['color'] = 'red'
        control++
      }
    }
  })
  t.is(el.tagName, 'C-ITEM')
  t.is(el.innerHTML, 'green')
  el.click()
  t.is(el.innerHTML, 'red')
  t.is(control, 1)
  console.log(scope)
  t.end()
})
