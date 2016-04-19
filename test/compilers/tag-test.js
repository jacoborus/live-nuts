'use strict'

const compileTag = require('../../src/compilers/tag.js')
const test = require('tape')
const emitter = require('arbitrary-emitter')()
const compile = require('../../src/compiler.js')

test('compile simple tag with attributes', function (t) {
  let scope = {
    other: 'another'
  }
  let control = 1
  let schema = {
    type: 1,
    localName: 'span',
    tagName: 'superspan',
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
        nut.emit(nut.scope)
      },
      changeControl (x) {
        control = x
      }
    }
  }
  compileTag(schema, compile)
  let el = schema.render(scope, emitter, null)
  t.is(el.getAttribute('alt'), 'alternative', 'render regular attributes')
  t.is(el.getAttribute('other'), 'another', 'render scoped attributes')
  el.click()
  t.is(el.test, 'test', 'bind events')
  t.is(control, 99, 'events can call other methods')
  t.is(el.getAttribute('other'), 'changed!', 'update element attributes on save')
  t.end()
})

test('compile simple tag with no scoped children', function (t) {
  let scope = {}
  let schema = {
    type: 1,
    tagName: 'test',
    localName: 'span',
    children: [{
      type: 3,
      data: 'hola'
    }, {
      type: 1,
      localname: 'span'
    }]
  }
  compileTag(schema, compile)
  let el = schema.render(scope, emitter)
  t.is(el.textContent, 'hola', 'render simple text child')
  console.log(el)
  t.end()
})
