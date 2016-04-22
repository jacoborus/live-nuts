'use strict'

const test = require('tape')
const compileEvents = require('../../src/compilers/event.js')

test('event compiler', function (t) {
  function clicked (e, nut) {
    t.is(e.type, 'click')
    t.is(nut.scope.a, 99)
    t.end()
  }

  let events = {
    click: 'clicked'
  }
  let compiled = compileEvents(events)
  t.is(typeof compiled, 'function')

  let el = document.createElement('span')
  let fakeNut = {
    clicked,
    scope: {
      a: 99
    }
  }
  compiled(el, fakeNut)
  el.click()
})

