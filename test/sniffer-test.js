'use strict'

import test from 'tape'
import sniffer from '../src/sniffer.js'

test('sniff basic data from element to model', function (t) {
  let dl = document.createElement('dl'),
      dd = document.createElement('dd')

  dd.setAttribute('nu-model', 'test')
  dd.innerHTML = 'uno'
  dl.appendChild(dd)

  let model = sniffer(dl)
  t.is(model.test, 'uno')
  t.end()
})

test('sniff basic data from childrens to model', function (t) {
  let dl = document.createElement('dl'),
      dd = document.createElement('dd'),
      span = document.createElement('span')

  span.setAttribute('nu-model', 'test')
  span.innerHTML = 'uno'
  dd.appendChild(span)
  dl.appendChild(dd)

  let model = sniffer(dl)
  t.is(model.test, 'uno')
  t.end()
})

