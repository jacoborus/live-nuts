'use strict'

import test from 'tape'
import compile from '../src/compiler.js'
import boxes from 'boxes'

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
      click: (e, nut, box) => {
        control++
        box.update({color: 'red'})
        box.set('onoff', !box.get().onoff)
      }
    }
  }

  let box = boxes.createStore('simple', {
    color: 'green',
    another: 'another one',
    onoff: true
  })

  compile(schema, () => {
    let el = schema.render(box.get(), box)
    t.is(el.localName, 'section', 'render localName')
    t.is(el.getAttribute('alt'), 'alternative', 'render regular attribute')
    t.is(el.getAttribute('title'), 'green', 'render scoped attribute')
    t.is(el.getAttribute('other'), 'other another one', 'render complex attribute')
    t.ok(el.hasAttribute('booleatt'), 'boolean attribute')
    el.click()
    t.is(control, 1, 'regular subscribe')
    t.is(el.getAttribute('title'), 'red', 'subscribe attribute')
    t.notOk(el.hasAttribute('booleatt'), 'subscribe boolean attribute')
    // precompile attributes
    t.is(schema.booleans.booleatt, 'onoff')
    boxes.remove('simple')
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

  let box = boxes.createStore({})

  compile(schema, () => {
    let el = schema.render(box.get(), box)
    t.is(el.localName, 'ul', 'parent localname')
    t.ok(el.children.length, 'has children')
    t.is(el.children[0].localName, 'li', 'child localname')
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
      click: (e, nut, box) => {
        box.set('color', 'other')
        box.set('class', 'active')
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

  let box = boxes.createStore('textnodes', {
    color: 'rojo',
    class: ''
  })

  compile(schema, () => {
    let el = schema.render(box.get(), box)
    t.is(el.localName, 'span', 'parent localname')
    t.ok(el.childNodes.length, 'parent has children')
    t.is(el.childNodes[0].nodeType, 3, 'child nodetype')
    t.is(el.childNodes[0].data, 'hola', 'child text content')
    t.is(el.childNodes[1].nodeType, 3, 'child nodetype')
    t.is(el.childNodes[1].data, 'rojo', 'child scoped textcontent')
    t.is(el.childNodes[2].nodeType, 3, 'child nodetype')
    t.is(el.childNodes[2].data, 'otro rojo', 'child complex textcontent')
    el.click()
    t.is(el.childNodes[1].data, 'other', 'subscribe scoped text content')
    t.is(el.childNodes[2].data, 'otro other', 'subscribe complex text content')
    t.is(el.getAttribute('class'), 'active', 'subscribe parent')
    boxes.remove('textnodes')
    t.end()
  })
})

test('compile element loops', function (t) {
  let schema = {
    localName: 'li',
    repeat: 'items',
    type: 1,
    events: {
      click: (e, nut, box) => {
        box.set('color', 'other')
      }
    },
    children: [{
      type: 3,
      data: '{{ color }}'
    }]
  }

  let box = boxes.createStore('loops', {
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
    el.appendChild(schema.render(box.get(), box))
    t.is(el.childNodes[0].localName, 'li', 'localname')
    t.is(el.childNodes.length, 3, 'render correct number of items')
    t.is(el.childNodes[0].nodeType, 1, 'item nodetype')
    t.is(el.childNodes[0].childNodes[0].nodeType, 3, 'children child nodetype')
    t.is(el.childNodes[0].textContent, 'azul', 'item text content')
    t.is(el.childNodes[1].nodeType, 1, 'item nodetype')
    t.is(el.childNodes[1].textContent, 'rojo', 'item child nodetype')
    t.is(el.childNodes[2].nodeType, 1, 'item nodetype')
    t.is(el.childNodes[2].textContent, 'verde', 'item text content')
    el.childNodes[2].click()
    t.is(el.childNodes[2].textContent, 'other', 'subscribe')
    boxes.remove('loops')
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

  let box = boxes.createStore('ifscope', {
    span: {},
    state: true
  })

  compile(schema, () => {
    let el = schema.render(box.get(), box)
    window.el = el
    document.body.appendChild(el)
    t.is(el.localName, 'section')
    t.is(el.childNodes[0].textContent, 'span')
    t.notOk(el.childNodes[1])
    el.click()
    t.is(el.childNodes[0].textContent, 'h1')
    t.notOk(el.childNodes[1])
    boxes.remove('ifscope')
    t.end()
  })
})
