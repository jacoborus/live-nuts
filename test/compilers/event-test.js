'use strict'

import test from 'tape'
import compileEvents from '../../src/compilers/event.js'

test('event compiler', function (t) {
  function clicked (e, nut) {
    t.is(e.type, 'click')
    t.is(nut.a, 99)
    t.end()
  }

  let events = {
    click: 'clicked'
  }
  let compiled = compileEvents(events)
  // t.is(typeof compiled, 'function')

  let el = document.createElement('span')
  let fakeNut = {
    clicked,
    a: 99
  }
  compiled(el, fakeNut)
  el.click()
})

