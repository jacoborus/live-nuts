'use strict'

import test from 'tape'
import createNut from '../src/nut.js'

test('create nut', t => {
  let scope = {a: 1}
  let nut = createNut(scope, {})
  t.is(typeof nut, 'object')
  t.is(nut.scope.a, 1)
  t.end()
})

test('add regular methods', t => {
  let scope = {a: 1}
  let control = 0
  let nut = createNut(scope, {}, {
    regular: {
      one: (x) => {
        control = x
      },
      two: (x) => {
        control = x + 1
      }
    }
  })
  nut.one(2)
  t.is(control, 2)
  nut.two(99)
  t.is(control, 100)
  t.end()
})

test('add factory methods', t => {
  let scope = {a: 1}
  let control = 0
  let nut = createNut(scope, {}, {
    factory: {
      one: (nut) => {
        return x => control = nut.scope.a + x
      },
      two: (nut) => {
        return x => control = nut.scope.a - x
      }
    }
  })
  nut.one(2)
  t.is(control, 3)
  nut.two(99)
  t.is(control, -98)
  t.end()
})

test('add injected methods', t => {
  let scope = {a: 1}
  let control = 0
  let nut = createNut(scope, {}, {
    injected: {
      one: (x) => {
        control = x
      },
      two: (x) => {
        control = x + 1
      }
    }
  })
  nut.one(2)
  t.is(control, 2)
  nut.two(99)
  t.is(control, 100)
  t.end()
})
