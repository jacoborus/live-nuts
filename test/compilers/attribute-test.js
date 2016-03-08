'use strict'

import test from 'tape'
import compileAttributes from '../../src/compilers/attribute.js'

test('compile regular attributes', function (t) {
  let schema = {
    attribs: {
      style: 'color: black',
      alt: 'alternative'
    }
  }
  let compiled = compileAttributes(schema)
  t.is(typeof compiled, 'object', 'returns a object')
  t.is(typeof compiled.fixed, 'object', 'compiled has array `fixed`')
  t.is(typeof compiled.renders, 'object', 'compiled has array `renders`')
  t.is(compiled.fixed.style, 'color: black')
  t.is(compiled.fixed.alt, 'alternative')
  t.notOk(compiled.renders.length)
  t.end()
})

test('compile scoped attributes', function (t) {
  let schema = {
    attribs: {
      alt: 'alternative',
      other: '{{ otherVal }}',
      another: 'another {{ anotherVal }}'
    }
  }
  let scope = {
    otherVal: 'test1',
    anotherVal: 'test2'
  }
  let compiled = compileAttributes(schema)
  t.is(typeof compiled, 'object', 'returns a object')
  t.is(typeof compiled.fixed, 'object', 'compiled has array `fixed`')
  t.is(typeof compiled.renders, 'object', 'compiled has array `renders`')
  t.is(compiled.fixed.alt, 'alternative')
  let el = document.createElement('span')
  let subscriptions = compiled.renders.map(fn => fn(el, scope))
  t.is(el.getAttribute('other'), 'test1')
  t.is(el.getAttribute('another'), 'another test2')
  t.ok(Array.isArray(subscriptions))
  scope.otherVal = 1
  delete scope.anotherVal
  subscriptions.forEach(f => f())
  t.is(el.getAttribute('other'), '1')
  t.is(el.getAttribute('another'), 'another ')
  t.end()
})

test('compile boolean attributes', function (t) {
  let schema = {
    attribs: {
      alt: 'alternative',
      'other-': '{{ otherVal }}'
    }
  }
  let scope = {
    otherVal: 'test1'
  }
  let compiled = compileAttributes(schema)
  t.is(typeof compiled, 'object', 'returns a object')
  t.is(typeof compiled.fixed, 'object', 'compiled has array `fixed`')
  t.is(typeof compiled.renders, 'object', 'compiled has array `renders`')
  t.is(compiled.fixed.alt, 'alternative')
  let el = document.createElement('span')
  let subscriptions = compiled.renders.map(fn => fn(el, scope))
  t.ok(el.hasAttribute('other'))
  scope.otherVal = 0
  subscriptions.forEach(f => f())
  t.notOk(el.hasAttribute('other'))
  t.end()
})
