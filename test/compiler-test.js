'use strict'

import test from 'tape'
import compiler from '../src/compiler.js'
import storeFactory from '../src/store-factory.js'

function addCss () {
  let css = document.createElement('style')
  css.innerHTML = '.active {color: #ff0000;}'
  document.head.appendChild(css)
}
addCss()

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
      click: (e, nut) => {
        control++
        nut.scope.color = 'red'
        nut.scope.onoff = !nut.scope.onoff
      }
    }
  }

  let links = new Map()
  let createStore = storeFactory(links)
  let compile = compiler(links)

  let store = createStore({
    color: 'green',
    another: 'another one',
    onoff: true
  })

  compile(schema, () => {
    let el = schema.render(store)
    t.is(el.localName, 'section')
    t.is(el.getAttribute('title'), 'green')
    t.is(el.getAttribute('alt'), 'alternative')
    t.is(el.getAttribute('other'), 'other another one')
    t.ok(el.hasAttribute('booleatt'))
    t.is(control, 0)
    el.click()
    t.is(el.getAttribute('title'), 'red')
    t.notOk(el.hasAttribute('booleatt'))
    t.is(control, 1)
    t.end()
  })
})

test('compile simple tag with children', function (t) {
  let schema = {
    type: 1,
    localName: 'ul',
    children: [{
      localName: 'li',
      type: 1
    }]
  }

  let links = new Map()
  let compile = compiler(links)
  let createStore = storeFactory(links)

  let store = createStore({})

  compile(schema, () => {
    let el = schema.render(store)
    t.is(el.localName, 'ul')
    t.ok(el.children.length)
    t.is(el.children[0].localName, 'li')
    t.end()
  })
})

test('compile text nodes', function (t) {
  let schema = {
    localName: 'span',
    attribs: {
      class: '{{ class }}'
    },
    type: 1,
    events: {
      click: (e, nut) => {
        nut.scope.color = 'other'
        nut.scope.class = 'active'
      }
    },
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
  let createStore = storeFactory(links)

  let store = createStore({
    color: 'rojo',
    class: ''
  })

  compile(schema, () => {
    let el = schema.render(store)
    t.is(el.localName, 'span')
    t.ok(el.childNodes.length)
    t.is(el.childNodes[0].nodeType, 3)
    t.is(el.childNodes[0].data, 'hola')
    t.is(el.childNodes[1].nodeType, 3)
    t.is(el.childNodes[1].data, 'rojo')
    t.is(el.childNodes[2].nodeType, 3)
    t.is(el.childNodes[2].data, 'otro rojo')
    el.click()
    t.is(el.childNodes[1].data, 'other')
    t.is(el.childNodes[2].data, 'otro other')
    t.is(el.getAttribute('class'), 'active')
    t.end()
  })
})

test('compile element loops', function (t) {
  let schema = {
    localName: 'li',
    repeat: 'items',
    type: 1,
    events: {
      click: (e, nut) => {
        nut.scope.color = 'other'
      }
    },
    children: [{
      type: 3,
      data: '{{ color }}'
    }]
  }

  let rosters = new Map()
  let compile = compiler(rosters)
  let createStore = storeFactory(rosters)

  let store = createStore({
    items: [{
      color: 'azul'
    }, {
      color: 'rojo'
    }, {
      color: 'verde'
    }]
  })

  compile(schema, () => {
    let el = document.createElement('div')
    el.appendChild(schema.render(store))
    t.is(el.childNodes[0].localName, 'li')
    t.ok(el.childNodes[0].childNodes.length)
    t.is(el.childNodes[0].nodeType, 1)
    t.is(el.childNodes[0].childNodes[0].nodeType, 3)
    t.is(el.childNodes[0].textContent, 'azul')
    t.is(el.childNodes[1].nodeType, 1)
    t.is(el.childNodes[1].textContent, 'rojo')
    t.is(el.childNodes[2].nodeType, 1)
    t.is(el.childNodes[2].textContent, 'verde')
    el.childNodes[2].click()
    t.is(el.childNodes[2].textContent, 'other')
    t.end()
  })
})

test.skip('render elements just when its scopes exist', function (t) {
  let schema = {
    type: 1,
    localName: 'section',
    children: [{
      type: 1,
      localName: 'span',
      scope: 'span',
      children: [{
        type: 3,
        data: 'span'
      }]
    }, {
      type: 1,
      localName: 'h1',
      scope: 'h1',
      children: [{
        type: 3,
        data: 'h1'
      }]
    }],
    events: {
      click: (e, nut) => {
        if (nut.scope.state) {
          delete nut.scope.span
          nut.scope.h1 = {}
        } else {
          delete nut.scope.h1
          nut.scope.span = {}
        }
        nut.scope.state = !nut.scope.state
      }
    }
  }

  let links = new Map()
  let createStore = storeFactory(links)
  let compile = compiler(links)

  let store = createStore({
    span: {},
    state: true
  })

  compile(schema, () => {
    let el = schema.render(store)
    window.el = el
    document.body.appendChild(el)
    t.is(el.localName, 'section')
    t.is(el.childNodes[0].textContent, 'span')
    t.notOk(el.childNodes[1])
    el.click()
    t.is(el.childNodes[0].textContent, 'h1')
    t.notOk(el.childNodes[1])
    t.end()
  })
})
