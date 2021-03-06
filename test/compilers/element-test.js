'use strict'

const test = require('tape')
const compileElement = require('../../src/compilers/element.js')

test('compile simple tag with attributes', function (t) {
  let render = compileElement('tag', {
    alt: 'alternative',
    title: 'lorem'
  })
  let el = render()
  t.is(el.getAttribute('alt'), 'alternative')
  t.is(el.getAttribute('title'), 'lorem')
  t.end()
})
