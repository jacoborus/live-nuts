'use strict'

import test from 'tape'
import extract from '../src/extract.js'

test('sniff basic data from element to model', function (t) {
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

test('sniff basic data from children to model', function (t) {
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

test('sniff basic data from scoped children to model', function (t) {
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
    // t.ok(model.tunnel)
    t.comment(JSON.stringify(model))
    t.is(model.tunnel.test, 'uno')
    t.end()
  })
})

