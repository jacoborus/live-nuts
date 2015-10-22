'use strict'

import extend from '../src/extend.js'
import test from 'tape'

test('has same properties as source when no extension passed', function (t) {
  let sample = {scope: 'test'}
  extend(sample, null, function () {
    t.is(sample.scope, 'test')
    t.end()
  })
})

test('extend nut properties', function (t) {
  let sample = {
        scope: 'test'
      },
      otherSample = {
        scope: 'extension',
        model: 'other'
      }

  extend(sample, otherSample, function () {
    t.is(sample.scope, 'test')
    t.is(sample.model, 'other')
    t.end()
  })
})

test('extend attributes and variable attributes', function (t) {
  let sample = {
        attribs: { other: 'src' },
        nuAtts: {other: 'src' }
      },
      otherSample = {
        attribs: { id: 'ext', other: 'ext' },
        nuAtts: { id: 'ext', other: 'ext' }
      }

  extend(sample, otherSample, function () {
    t.is(sample.attribs.id, 'ext')
    t.is(sample.attribs.other, 'src')
    t.is(sample.nuAtts.id, 'ext')
    t.is(sample.nuAtts.other, 'src')
    t.end()
  })
})

test('extend formatters', function (t) {
  let sample = {
        formatters: ['test']
      },
      otherSample = {
        formatters: ['other']
      }

  extend(sample, otherSample, function () {
    t.is(sample.formatters[0], 'test')
    t.end()
  })
})
