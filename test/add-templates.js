'use strict'

const Nuts = require('../src/live-nuts.js')
const test = require('tape')

test.skip(':nuts#addTemplate:', function (t) {
  t.test('add src to a new template in templates archive', function (t) {
    let nuts = new Nuts(),
        tmpl = '<span nut="one">hello</span>'
    nuts.addTemplates(tmpl, function (err) {
      t.error(err)
      t.is(nuts.templates.one.raw, '<span nut="one">hello</span>')
      t.end()
    })
  })

  t.test('add several templates from a single string', function (t) {
    let nuts = new Nuts(),
        tmpl = '<span nut="three">hello</span><span nut="four">hello</span>'
    nuts.addTemplates(tmpl, function (err) {
      t.error(err)
      t.is(nuts.templates.three.raw, '<span nut="three">hello</span>')
      t.is(nuts.templates.four.raw, '<span nut="four">hello</span>')
      t.end()
    })
  })
})
