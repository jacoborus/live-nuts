'use strict'

const test = require('tape')
const compileText = require('../../src/compilers/text.js')

test('compile simple text node', function (t) {
  let schema = {
    type: 3,
    data: 'hola'
  }
  compileText(schema, () => {
    t.is(typeof schema.render, 'function', 'set render as a function')
    let { el, unsubscribe } = schema.render({})
    t.is(el.textContent, 'hola')
    t.notOk(unsubscribe)
    t.end()
  })
})

test('compile scoped text node', function (t) {
  let schema = {
    type: 3,
    data: 'hola {{ donde }}'
  }
  let scope = {
    donde: 'mundo!'
  }
  compileText(schema, () => {
    t.is(typeof schema.render, 'function', 'set render as a function')
    let { el, subscription } = schema.render(scope)
    t.is(el.textContent, 'hola mundo!')
    t.is(typeof subscription, 'function')
    scope.donde = 'here!'
    subscription()
    t.is(el.textContent, 'hola here!')
    t.end()
  })
})

