'use strict'

const makeSchemas = require('../src/schema.js')
const test = require('tape')

test.skip('Schema:', function (t) {
  t.test('has same properties as source when no extension passed', function (t) {
    let templates = {
      sample: {
        source: {
          scope: 'test'
        }
      }
    }
    makeSchemas(templates, function (err) {
      t.error(err)
      t.is(templates.sample.schema.scope, 'test')
      t.end()
    })
  })

  t.test('extend nut properties', function (t) {
    let templates = {
      sample: {
        source: {
          scope: 'test'
        }
      },
      otherSample: {
        source: {
          scope: 'extension',
          other: 'other'
        }
      }
    }
    makeSchemas(templates, function (err) {
      t.error(err)
      t.is(templates.sample.scope, 'test')
      t.is(templates.sample.other, 'other')
      t.end()
    })
  })

  t.test('extend attributes and variable attributes', function (t) {
    let templates = {
      sample: {
        source: {
          attribs: { other: 'src' },
          nuAtts: {other: 'src' }
        }
      },
      otherSample: {
        source: {
          attribs: { id: 'ext', other: 'ext' },
          nuAtts: { id: 'ext', other: 'ext' }
        }
      }
    }
    makeSchemas(templates, function (err) {
      t.error(err)
      t.is(templates.sample.schema.attribs.id, 'ext')
      t.is(templates.sample.schema.attribs.other, 'src')
      t.is(templates.sample.schema.nuAtts.id, 'ext')
      t.is(templates.sample.schema.nuAtts.other, 'src')
      t.end()
    })
  })

  t.test('extend nutName', function (t) {
    let templates = {
      sample: {
        source: {
          nutName: 'test'
        }
      },
      otherSample: {
        source: {
          nutName: 'other'
        }
      }
    }
    makeSchemas(templates, function (err) {
      t.error(err)
      t.is(templates.sample.schema.nutName, 'test')
      t.end()
    })
  })

  t.test('extend formatters', function (t) {
    let templates = {
      sample: {
        source: {
          formatters: ['test']
        }
      },
      otherSample: {
        source: {
          formatters: ['other']
        }
      }
    }
    makeSchemas(templates, function (err) {
      t.error(err)
      t.is(templates.sample.schema.formatters[0], 'test')
      t.end()
    })
  })
})
