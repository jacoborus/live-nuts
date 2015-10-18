'use strict'

const extend = require('../src/extend.js')
const test = require('tape')

test('has same properties as source when no extension passed', function (t) {
  let sample = {
        scope: 'test'
      },
      result = extend(sample)
  t.is(result.scope, 'test')
  t.end()
})

test('extend nut properties', function (t) {
  let sample = {
        scope: 'test'
      },
      otherSample = {
        scope: 'extension',
        other: 'other'
      },
      result = extend(sample, otherSample)

  t.is(result.scope, 'test')
  t.is(result.other, 'other')
  t.end()
})

test('extend attributes and variable attributes', function (t) {
  let sample = {
        attribs: { other: 'src' },
        nuAtts: {other: 'src' }
      },
      otherSample = {
        attribs: { id: 'ext', other: 'ext' },
        nuAtts: { id: 'ext', other: 'ext' }
      },
      result = extend(sample, otherSample)

  t.is(result.attribs.id, 'ext')
  t.is(result.attribs.other, 'src')
  t.is(result.nuAtts.id, 'ext')
  t.is(result.nuAtts.other, 'src')
  t.end()
})

test('extend nutName', function (t) {
  let sample = {
        nutName: 'test'
      },
      otherSample = {
        nutName: 'other'
      },
      result = extend(sample, otherSample)

  t.is(result.nutName, 'test')
  t.end()
})

test('extend formatters', function (t) {
  let sample = {
        formatters: ['test']
      },
      otherSample = {
        formatters: ['other']
      },
      result = extend(sample, otherSample)

  t.is(result.formatters[0], 'test')
  t.end()
})
