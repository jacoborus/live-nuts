'use strict'

const extract = require('../src/partials.js').extract,
      test = require('tape')

test('create slots for partials', function (t) {
  let parsed = {
    keyname: 'list',
    children: [{
      as: 'item'
    }, {
      children: [{
        as: 'extra'
      }]
    }]
  }
  let partials = extract(parsed)

  t.is(partials[0].source.as, 'item')
  t.is(partials[1].source.as, 'extra')
  t.end()
})

