'use strict'

import test from 'tape'
import extract from '../src/extract.js'

test('extract basic data from element to model', function (t) {
  let dl = document.createElement('dl')

  dl.setAttribute('nu-model', 'test')
  dl.innerHTML = 'uno'

  let scope = {}
  extract(dl, scope, () => {
    t.is(scope.test, 'uno')
    t.end()
  })
})

test('extract basic data from children to model', function (t) {
  let dl = document.createElement('dl'),
      dd = document.createElement('dd')

  dd.setAttribute('nu-model', 'test')
  dd.innerHTML = 'uno'
  dl.appendChild(dd)

  let model = {}
  extract(dl, model, () => {
    t.is(model.test, 'uno')
    t.end()
  })
})

test('extract basic data from nested children to model', function (t) {
  let dl = document.createElement('dl'),
      dd = document.createElement('dd'),
      span = document.createElement('span')

  span.setAttribute('nu-model', 'test')
  span.innerHTML = 'uno'
  dd.appendChild(span)
  dl.appendChild(dd)

  let model = {}
  extract(dl, model, () => {
    t.is(model.test, 'uno')
    t.end()
  })
})

test('extract basic data from scoped children to model', function (t) {
  let dl = document.createElement('dl'),
      dd = document.createElement('dd'),
      span = document.createElement('span')

  span.setAttribute('nu-model', 'test')
  span.innerHTML = 'uno'
  dd.setAttribute('nu-scope', 'tunnel')
  dd.appendChild(span)
  dl.appendChild(dd)

  let model = {}
  extract(dl, model, () => {
    t.is(model.tunnel.test, 'uno')
    t.end()
  })
})

test('add an instance for every scope', function (t) {
  let dl = document.createElement('dl')

  dl.setAttribute('nu-model', 'test')
  dl.innerHTML = 'uno'

  let scope = {}
  extract(dl, scope, () => {
    t.is(scope.test, 'uno')
    t.end()
  })
})
