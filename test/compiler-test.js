'use strict'

import test from 'tape'
import compiler from '../src/compiler.js'
import getProxyFactory from '../src/get-proxy.js'

test('compile simple tag with attributes', function (t) {
  let schema = {
    type: 1,
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
    t.end()
  })
})

test('compile simple tag with children', function (t) {
  let schema = {
    type: 1,
    tagName: 's-ul',
    localName: 'ul',
    isNut: true,
    children: [{
      localName: 'li',
      type: 1
    }]
  }

  let links = new Map()
  let compile = compiler(links)
  let getProxy = getProxyFactory(links)

  let scope = getProxy({})

  compile(schema, () => {
    let el = schema.render(scope)
    t.is(el.localName, 'ul')
    t.ok(el.children.length)
    t.is(el.children[0].localName, 'li')
    t.end()
  })
})

test('compile text nodes', function (t) {
  let schema = {
    tagName: 's-span',
    localName: 'span',
    isNut: true,
    type: 1,
    children: [{
      type: 3,
      data: 'hola'
    }, {
      type: 3,
      data: '{{ color }}'
    }, {
      type: 3,
      data: 'otro {{ color }}'
    }]
  }

  let links = new Map()
  let compile = compiler(links)
  let getProxy = getProxyFactory(links)

  let scope = getProxy({
    color: 'rojo'
  })

  compile(schema, () => {
    let el = schema.render(scope)
    t.is(el.localName, 'span')
    t.ok(el.childNodes.length)
    t.is(el.childNodes[0].nodeType, 3)
    t.is(el.childNodes[0].data, 'hola')
    t.is(el.childNodes[1].nodeType, 3)
    t.is(el.childNodes[1].data, 'rojo')
    t.is(el.childNodes[2].nodeType, 3)
    t.is(el.childNodes[2].data, 'otro rojo')
    window.el = el
    t.end()
  })
})
