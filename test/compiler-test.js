'use strict'

import test from 'tape'
import compiler from '../src/compiler.js'
import getProxyFactory from '../src/get-proxy.js'

test('test for createNut', function (t) {
  let schema = {
    tagName: 'c-item',
    localName: 'section',
    attribs: {
      title: '{{color}}',
      alt: 'alternative',
      other: 'other {{ another }}'
    },
    isNut: true,
    events: {
      click: (e, nut) => {
        nut.scope['color'] = 'red'
      }
    }
  }

  let links = new Map()
  let compile = compiler(links)
  let getProxy = getProxyFactory(links)

  let scope = getProxy({
    color: 'green',
    another: 'another one'
  })
  compile(schema, () => {
    let el = schema.render(scope)
    t.is(el.localName, 'section')
    t.is(el.getAttribute('title'), 'green')
    t.is(el.getAttribute('alt'), 'alternative')
    t.is(el.getAttribute('other'), 'other another one')
    el.click()
    document.body.appendChild(el)
    window.el = el
    t.end()
  })
})
