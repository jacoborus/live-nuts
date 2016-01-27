'use strict'

import test from 'tape'

import registerNut from '../src/register-nut.js'

test('register nuts as custom elements', function (t) {
  let x = 0
  let schema = {
    localName: 'li',
    tagName: 'register-tag'
  }

  registerNut(schema, () => {
    ++x
  })

  let el = document.createElement('li', 'register-tag')
  document.body.appendChild(el)
  t.ok(el.isNut)
  t.is(x, 1)
  document.body.removeChild(el)
  t.end()
})
