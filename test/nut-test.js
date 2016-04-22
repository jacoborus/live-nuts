'use strict'

const test = require('tape')
const createNut = require('../src/nut.js')
const emitter = require('arbitrary-emitter')()

test('create nut', t => {
  const scope = {a: 1}
  const schema = {
    tagName: 'tagTest'
  }
  const nut = createNut(scope, schema, emitter, {})
  t.is(typeof nut, 'object')
  t.is(typeof nut.emit, 'function')
  t.is(nut.scope.a, 1)
  t.end()
})

test('add regular methods', t => {
  const scope = {a: 1}
  let control = 0
  const nut = createNut(scope, {
    tagName: 'test',
    methods: {
      one: (x) => {
        control = x
      },
      two: (x) => {
        control = x + 1
      }
    }
  }, emitter)
  nut.one(2)
  t.is(control, 2)
  nut.two(99)
  t.is(control, 100)
  t.end()
})

test('add factory methods', t => {
  const scope = {a: 1}
  let control = 0
  const nut = createNut(scope, {
    tagName: 'test',
    methods: {
      _one: (nut) => {
        return x => {control = nut.scope.a + x}
      },
      _two: (nut) => {
        return x => {control = nut.scope.a - x}
      }
    }
  }, emitter)
  nut.one(2)
  t.is(control, 3)
  nut.two(99)
  t.is(control, -98)
  t.end()
})

test('add injected methods', t => {
  const scope = {a: 1}
  let control = 0
  const nut = createNut(
    scope,
    {
      injected: ['one', 'two']
    },
    emitter,
    {
      one: (x) => {
        control = x
      },
      two: (x) => {
        control = x + 1
      }
    }
  )
  nut.one(2)
  t.is(control, 2)
  nut.two(99)
  t.is(control, 100)
  t.end()
})
