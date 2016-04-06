'use strict'

const test = require('tape')
const compileText = require('../../src/compilers/text.js')
const boxes = require('boxes')

test('compile simple text node', function (t) {
  let schema = {
    type: 3,
    data: 'hola'
  }
  compileText(schema, () => {
    t.is(typeof schema.render, 'function', 'set render as a function')
    let rendered = schema.render({})
    t.is(rendered.textContent, 'hola')
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
  let box = boxes(scope)
  compileText(schema, () => {
    t.is(typeof schema.render, 'function', 'set render as a function')
    let rendered = schema.render(scope, box)
    t.is(rendered.textContent, 'hola mundo!')
    scope.donde = 'internet!'
    box.save()
    t.is(rendered.textContent, 'hola internet!')
    t.end()
  })
})

