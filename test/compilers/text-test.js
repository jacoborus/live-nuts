'use strict'

const test = require('tape')
const compileText = require('../../src/compilers/text.js')
const emitter = require('arbitrary-emitter')()

test('compile simple text node', function (t) {
  let schema = {
    type: 3,
    data: 'hola'
  }
  compileText(schema)
  t.is(typeof schema.render, 'function', 'set render as a function')
  let el = schema.render({}, emitter)
  t.is(el.textContent, 'hola')
  t.end()
})

test('compile scoped text node', function (t) {
  let schema = {
    type: 3,
    data: 'hola {{ donde }}'
  }
  let scope = {
    donde: 'mundo!'
  }
  compileText(schema)
  t.is(typeof schema.render, 'function', 'set render as a function')
  let el = schema.render(scope, emitter)
  t.is(el.textContent, 'hola mundo!')
  scope.donde = 'here!'
  emitter.emit(scope)
  t.is(el.textContent, 'hola here!')
  t.end()
})

